import { Link } from "@medusajs/framework/modules-sdk";
import { LinkDefinition } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk";

export type LinkStockLocationToStoreInput = {
    /**
    * The ids of the stock locations.
    */
    stock_location_ids: string[]
    /**
    * The id of the linked store.
    */
    store_id: string
}

export const linkStockLocationToStoreStepId = "link-stock-locations-to-store"

export const linkStockLocationsToStoreStep = createStep(
    linkStockLocationToStoreStepId,
    async ({ stock_location_ids, store_id }: LinkStockLocationToStoreInput, { container }) => {
        const link: Link = container.resolve(ContainerRegistrationKeys.LINK)

        const links: LinkDefinition[] = stock_location_ids.map((stock_location_id) => ({
            [Modules.STOCK_LOCATION]: {
                stock_location_id,
            },
            [Modules.STORE]: {
                store_id,
            },
        }))

        const linkArray = await link.create(links)

        return new StepResponse(linkArray, {
            stock_location_ids,
            store_id
        })
    },
    async ({ stock_location_ids, store_id }: LinkStockLocationToStoreInput, { container }) => {
        const link: Link = container.resolve(ContainerRegistrationKeys.LINK)

        const links: LinkDefinition[] = stock_location_ids.map((stock_location_id) => ({
            [Modules.STOCK_LOCATION]: {
                stock_location_id,
            },
            [Modules.STORE]: {
                store_id,
            },
        }))

        await link.dismiss(links)
    }
)