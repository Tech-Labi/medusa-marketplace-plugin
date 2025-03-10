import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { HttpTypes, UserDTO } from "@medusajs/framework/types"
import { refetchShippingProfile } from "@medusajs/medusa/api/admin/shipping-profiles/helpers"
import { createShippingProfilesForStoreWorkflow } from "../../../workflows/create-shipping-profiles-for-store"

export const POST = async (
    req: AuthenticatedMedusaRequest<HttpTypes.AdminCreateShippingProfile>,
    res: MedusaResponse<HttpTypes.AdminShippingProfileResponse>
) => {
    const loggedInUser = req.scope.resolve("loggedInUser") as UserDTO;
    const shippingProfilePayload = req.validatedBody

    const { result } = await createShippingProfilesForStoreWorkflow(req.scope).run({
        input: { data: [shippingProfilePayload], userId: loggedInUser.id },
    })

    const shippingProfile = await refetchShippingProfile(
        result.shippingProfiles[0].id,
        req.scope,
        req.queryConfig.fields
    )

    res.status(200).json({ shipping_profile: shippingProfile })
}