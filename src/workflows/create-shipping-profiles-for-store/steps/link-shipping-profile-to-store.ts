import { Link } from "@medusajs/framework/modules-sdk"
import { LinkDefinition } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export type LinkShippingProfileToStoreInput = {
    /**
    * The id of the shipping profile.
    */
    shipping_profile_ids: string[]
    /**
    * The id of the linked store.
    */
    store_id: string
}

export const linkShippingProfilesToStoreStepId = "link-shipping-profiles-to-store"

export const linkShippingProfilesToStoreStep = createStep(
    linkShippingProfilesToStoreStepId,
    async ({ shipping_profile_ids, store_id }: LinkShippingProfileToStoreInput, { container }) => {
        const link: Link = container.resolve(ContainerRegistrationKeys.LINK)

        const links: LinkDefinition[] = shipping_profile_ids.map((shipping_profile_id) => ({
            [Modules.FULFILLMENT]: {
                shipping_profile_id,
            },
            [Modules.STORE]: {
                store_id,
            },
        }))

        const linkArray = await link.create(links)

        return new StepResponse(linkArray, {
            shipping_profile_ids,
            store_id
        })
    },
    async ({ shipping_profile_ids, store_id }: LinkShippingProfileToStoreInput, { container }) => {
        const link: Link = container.resolve(ContainerRegistrationKeys.LINK)

        const links: LinkDefinition[] = shipping_profile_ids.map((shipping_profile_id) => ({
            [Modules.FULFILLMENT]: {
                shipping_profile_id,
            },
            [Modules.STORE]: {
                store_id,
            },
        }))

        await link.dismiss(links)
    }
)