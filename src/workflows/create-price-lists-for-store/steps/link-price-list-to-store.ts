import { Link } from "@medusajs/framework/modules-sdk";
import { LinkDefinition } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk";

export type LinkPriceListToStoreInput = {
  /**
   * The id of the price lists.
   */
  price_list_ids: string[];
  /**
   * The id of the linked store.
   */
  store_id: string;
};

export const linkPriceListToStoreStepId = "link-price-lists-to-store";

export const linkPriceListsToStoreStep = createStep(
  linkPriceListToStoreStepId,
  async (
    { price_list_ids, store_id }: LinkPriceListToStoreInput,
    { container }
  ) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    const links: LinkDefinition[] = price_list_ids.map((price_list_id) => ({
      [Modules.PRICING]: {
        price_list_id,
      },
      [Modules.STORE]: {
        store_id,
      },
    }));

    const linkArray = await link.create(links);

    return new StepResponse(linkArray, {
      price_list_ids,
      store_id,
    });
  },
  async (
    { price_list_ids, store_id }: LinkPriceListToStoreInput,
    { container }
  ) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    const links: LinkDefinition[] = price_list_ids.map((price_list_id) => ({
      [Modules.PRICING]: {
        price_list_id,
      },
      [Modules.STORE]: {
        store_id,
      },
    }));

    await link.dismiss(links);
  }
);
