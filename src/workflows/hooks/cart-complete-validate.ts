import { CartDTO } from "@medusajs/framework/types";
import {
  completeCartWorkflow,
  CompleteCartWorkflowInput,
} from "@medusajs/medusa/core-flows";
import { completeCartValidateWorkflow } from "../complete-cart-validate";

export type CompleteCartValidateInput = {
  input: CompleteCartWorkflowInput;
  cart: CartDTO;
};

completeCartWorkflow.hooks.validate(
  async ({ input, cart }: CompleteCartValidateInput, { container }) => {
    console.log("HOOK completeCart validate", { input, cart });

    await completeCartValidateWorkflow(container).run({
      input: {
        cart,
      },
    });
  }
);
