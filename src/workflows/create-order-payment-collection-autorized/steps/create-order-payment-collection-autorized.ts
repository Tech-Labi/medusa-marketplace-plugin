import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { IPaymentModuleService } from "@medusajs/framework/types";

import { CreatePaymentCollectionAutorizedInput } from "..";
import { Link } from "@medusajs/framework/modules-sdk";

export const createOrderPaymentCollectionAutorizedStep = createStep(
  "create-order-payment-collection-autorized-step",
  async (input: CreatePaymentCollectionAutorizedInput, { container }) => {
    const paymentModuleService = container.resolve<IPaymentModuleService>(
      Modules.PAYMENT
    );

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
    const paymentCollectionId = paymentCollections[0].id;

    // connect order & payment
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);
    await link.create({
      [Modules.ORDER]: {
        order_id: input.orderId,
      },
      [Modules.PAYMENT]: {
        payment_collection_id: paymentCollectionId,
      },
    });

    return new StepResponse(paymentCollections[0], {
      paymentCollectionId,
      orderId: input.orderId,
    });
  },
  async ({ paymentCollectionId, orderId }, { container }) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);
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
    await paymentModuleService.deletePaymentCollections([paymentCollectionId]);
  }
);
