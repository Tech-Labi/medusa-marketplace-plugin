import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules } from "@medusajs/framework/utils";
import { IStoreModuleService } from "@medusajs/framework/types";

export const searchStoreStep = createStep("search-stores", async (storeId: string, { container }) => {
  const storeService: IStoreModuleService = container.resolve(Modules.STORE);
  const stores = await storeService.listStores({ id: storeId });
  return new StepResponse(stores[0]);
});
