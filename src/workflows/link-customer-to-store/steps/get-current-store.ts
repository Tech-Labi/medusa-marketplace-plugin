import { StoreDTO } from "@medusajs/framework/types";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";

export const getCurrentStoreStep = createStep("get-current-store-step", async ({}, { container }) => {
  const currentStore = container.resolve("currentStore") as StoreDTO;
  return new StepResponse(currentStore);
});
