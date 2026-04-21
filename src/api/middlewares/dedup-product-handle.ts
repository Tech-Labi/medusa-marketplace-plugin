import type {
  AuthenticatedMedusaRequest,
  MedusaNextFunction,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules, toHandle } from "@medusajs/framework/utils"
import { StoreDTO, UserDTO } from "@medusajs/framework/types"

/**
 * Middleware that prevents product handle collisions in a multi-vendor
 * marketplace by prepending the vendor's store name to the product handle.
 *
 * Without this, two vendors creating a product with the same title
 * (e.g. "Sample Product") would generate the same handle ("sample-product")
 * and the second insert would fail on the unique constraint.
 *
 * Strategy:
 *   1. Resolve the vendor's store via the user→store link. Falls back
 *      to the container's `currentStore` for API-key auth where there
 *      is no `loggedInUser`.
 *   2. Build a candidate handle: `{store-slug}-{product-slug}`.
 *   3. If that candidate already exists (same vendor, duplicate title),
 *      append an incrementing numeric suffix (`-2`, `-3`, …).
 *   4. Inject the final handle into `req.body` so the downstream
 *      createProductsWorkflow receives a guaranteed-unique value.
 *
 * Fixes: https://github.com/Tech-Labi/medusa2-marketplace-demo/issues/15
 */
export async function dedupProductHandle(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction,
) {
  try {
    // Only act on product creation requests
    if (!req.path.endsWith("/admin/products")) {
      return next()
    }

    const body = req.body as Record<string, unknown> | undefined
    if (!body?.title) {
      return next()
    }

    // Use currentStore if already resolved by registerCurrentStore middleware
    // (avoids a redundant DB query for dashboard/session auth)
    let store = req.scope.resolve("currentStore", {
      allowUnregistered: true,
    }) as StoreDTO | undefined

    // Fallback: query user→store link (needed for Bearer token auth
    // where registerCurrentStore skips store resolution)
    if (!store?.name) {
      store = await resolveStoreFromUser(req)
    }

    if (!store?.name) {
      return next()
    }

    // Build candidate handle: {store-slug}-{product-slug}
    const storeSlug = toHandle(store.name)
    const productSlug = body.handle
      ? toHandle(body.handle as string)
      : toHandle(body.title as string)

    let candidate = `${storeSlug}-${productSlug}`

    // Ensure uniqueness — append suffix if the handle already exists
    const productModule = req.scope.resolve(Modules.PRODUCT) as any

    const MAX_ATTEMPTS = 100
    let suffix = 1
    while (await handleExists(productModule, candidate)) {
      suffix++
      if (suffix > MAX_ATTEMPTS) {
        // Observability: learn how often we hit the cap in production.
        console.warn(
          `[dedup-product-handle] Reached ${MAX_ATTEMPTS}-attempt cap for "${storeSlug}-${productSlug}"; falling back to Medusa default handling.`,
        )
        return next()
      }
      candidate = `${storeSlug}-${productSlug}-${suffix}`
    }

    body.handle = candidate
  } catch (error) {
    // If anything goes wrong (e.g. super-admin without a store),
    // fall through and let Medusa use its default handle logic.
    console.warn("[dedup-product-handle] Skipping:", (error as Error).message)
  }

  return next()
}

/**
 * Check whether a product with the given handle already exists
 * (excluding soft-deleted rows, which Medusa filters out by default).
 */
async function handleExists(
  productModule: any,
  handle: string,
): Promise<boolean> {
  const [products] = await productModule.listAndCountProducts(
    { handle },
    { take: 1, select: ["id"] },
  )
  return products.length > 0
}

/**
 * Resolve the vendor's store by querying the user→store link.
 * Covers the case where registerCurrentStore doesn't register a store
 * (e.g. Bearer token auth with actor_type "user").
 */
async function resolveStoreFromUser(
  req: AuthenticatedMedusaRequest,
): Promise<StoreDTO | undefined> {
  const loggedInUser = req.scope.resolve("loggedInUser", {
    allowUnregistered: true,
  }) as UserDTO | undefined

  if (!loggedInUser?.id) return undefined

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY) as any

  const { data: userStoreLinks } = await query.graph({
    entity: "user_store",
    fields: ["store.*"],
    filters: { user_id: loggedInUser.id },
  })

  return userStoreLinks?.[0]?.store as StoreDTO | undefined
}
