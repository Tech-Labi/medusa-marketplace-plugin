import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { IPaymentModuleService } from "@medusajs/framework/types";
import { Link } from "@medusajs/framework/modules-sdk";

import { CreatePaymentCollectionAutorizedInput } from "..";

export type CreateOrderPaymentCollectionCompensationInput = {
  orderId: string;
  paymentCollectionId?: string;
};

export const createOrderPaymentCollectionAutorizedStep = createStep(
  "create-order-payment-collection-autorized-step",
  async (input: CreatePaymentCollectionAutorizedInput, { container }) => {
    const paymentModuleService = container.resolve<IPaymentModuleService>(
      Modules.PAYMENT
    );
    const compensationInput: CreateOrderPaymentCollectionCompensationInput = {
      orderId: input.orderId,
    };

    try {
      // create payment
      const paymentCollections =
        await paymentModuleService.createPaymentCollections([
          {
            currency_code: input.currencyCode,
            amount: input.amount,
            status: input.status,
            authorized_amount: input.authorized_amount,
            captured_amount: input.captured_amount,
          } as any,
        ]);
      compensationInput.paymentCollectionId = paymentCollections[0].id;

      // connect order & payment
      const link: Link = container.resolve(ContainerRegistrationKeys.LINK);
      await link.create({
        [Modules.ORDER]: {
          order_id: input.orderId,
        },
        [Modules.PAYMENT]: {
          payment_collection_id: compensationInput.paymentCollectionId,
        },
      });

      return new StepResponse(paymentCollections[0], compensationInput);
    } catch (e) {
      return StepResponse.permanentFailure(
        `Couldn't create the order payment collection: ${e}`,
        compensationInput
      );
    }
  },
  async (
    input: CreateOrderPaymentCollectionCompensationInput,
    { container }
  ) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    if (input.paymentCollectionId) {
      const { orderId, paymentCollectionId } = input;

      link.dismiss({
        [Modules.ORDER]: {
          order_id: orderId,
        },
        [Modules.PAYMENT]: {
          payment_collection_id: paymentCollectionId,
        },
      });

      const paymentModuleService = container.resolve<IPaymentModuleService>(
        Modules.PAYMENT
      );
      await paymentModuleService.deletePaymentCollections([
        paymentCollectionId,
      ]);
    }
  }
);
