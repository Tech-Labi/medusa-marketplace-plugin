import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework";

export const CustomerWorkflowEvents = {
  CREATED: "customer.created",
  UPDATED: "customer.updated",
  DELETED: "customer.deleted",
  LINKED: "customer.linked",
};

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
