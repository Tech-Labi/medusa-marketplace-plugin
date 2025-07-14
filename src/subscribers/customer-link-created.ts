import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework";
import { CustomerWorkflowEvents as MedusaCustomerWorkflowEvents } from "@medusajs/framework/utils";

export const CustomerWorkflowEvents = {
  ...MedusaCustomerWorkflowEvents,
  LINKED: "customer.linked",
} as const;

export default async function customerLinkCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  try {
    console.log("customerLinkCreateHandler data", data);
  } catch (error) {
    console.error(error);
  }
}

// subscriber config
export const config: SubscriberConfig = {
  event: CustomerWorkflowEvents.LINKED,
};
