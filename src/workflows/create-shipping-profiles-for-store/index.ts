import { FulfillmentWorkflow, ShippingProfileDTO } from "@medusajs/framework/types"
import { WorkflowData, WorkflowResponse, createWorkflow, transform, when } from "@medusajs/framework/workflows-sdk"
import { createShippingProfilesWorkflow } from "@medusajs/medusa/core-flows";
import { getStoreStep } from "../link-product-to-store/steps/get-store";
import { linkShippingProfilesToStoreStep } from "./steps/link-shipping-profile-to-store";

export const createShippingProfilesForStoreWorkflowId = "create-shipping-profiles-for-store-workflow"

export interface CreateShippingProfilesWorkflowInput extends
    FulfillmentWorkflow.CreateShippingProfilesWorkflowInput {
    userId: string;
}

export const createShippingProfilesForStoreWorkflow = createWorkflow(
    createShippingProfilesForStoreWorkflowId,
    (input: WorkflowData<CreateShippingProfilesWorkflowInput>) => {
        const { data, userId } = input

        const shippingProfiles: ShippingProfileDTO[] = createShippingProfilesWorkflow.runAsStep({ input: { data } })

        const shipping_profile_ids = transform(
            { shippingProfiles },
            (data) => data.shippingProfiles.map(({ id }) => id)
        )

        const shippingProfileStoreLinks = when(
            "check-is-need-to-link-store-to-shipping-profile",
            input,
            (input) => {
                return !!input.userId
            }
        ).then(() => {
            const store = getStoreStep({ userId })
            return linkShippingProfilesToStoreStep({
                shipping_profile_ids,
                store_id: store.id,
            });
        })

        return new WorkflowResponse({ shippingProfiles, shippingProfileStoreLinks })
    }
)