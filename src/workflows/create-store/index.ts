import { createWorkflow, transform, when, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import {
  createRegionsWorkflow,
  createShippingOptionsWorkflow,
  createStockLocations,
  createStoresWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";

import { createShippingProfilesForStoreWorkflow } from "../create-shipping-profiles-for-store";
import { createFulfillmentSetsStep } from "./steps/create-fulfillment-sets";
import { createUserStep } from "./steps/create-user";
import { getSalesChannelStep } from "./steps/get-sales-channel";
import { linkStockLocationStep } from "./steps/link-stock-location";
import { linkStockLocationToFulfillmentStep } from "./steps/link-stock-lock-to-fullfilment";
import { linkUserToStoreStep } from "./steps/link-user-to-store";

import { linkStockLocationToStoreWorkflow } from "../link-stock-location-to-store";
import { retrieveShippingOptionsStep } from "./steps/retrieve-shipping-options";
import { retrieveShippingProfileStep } from "./steps/retrieve-shippping-profile";
import { retrieveRegionsStep } from "./steps/retrieve-regions";
import { retrieveStockLocationStep } from "./steps/retrieve-stock-location";

export type CreateStoreInput = {
  store_name: string;
  email: string;
  password: string;
  is_super_admin?: boolean;
  metadata?: Record<string, any>;
};

export const createStoreWorkflow = createWorkflow("create-store", (input: CreateStoreInput) => {
  const salesChannel = getSalesChannelStep();

  const storesData = transform({ input, salesChannel }, (data) => [
    {
      name: data.input.store_name,
      supported_currencies: [{ currency_code: "usd", is_default: true }],
      default_sales_channel_id: data.salesChannel.id,
      metadata: data.input.is_super_admin ? { ...data.input.metadata, is_super_admin: true } : data.input.metadata,
    },
  ]);

  const stores = createStoresWorkflow.runAsStep({
    input: {
      stores: storesData,
    },
  });

  const store = stores[0];

  const { user, registerResponse } = createUserStep(input);

  // super admins users do not have a link to store
  // so they will see all products and orders
  const userStoreLinkArray = when(input, (input) => {
    return !input.is_super_admin;
  }).then(() => {
    return linkUserToStoreStep({ userId: user.id, storeId: store.id });
  });

  // //Default Sales Channel

  updateStoresWorkflow.runAsStep({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          {
            currency_code: "eur",
            is_default: true,
          },
          {
            currency_code: "usd",
          },
        ],
        default_sales_channel_id: salesChannel.id,
      },
    },
  });

  /// Default Region
  const { region } = retrieveRegionsStep();
  const createdRegion = when("check-regions", region, (input) => {
    return !input;
  }).then(() => {
    const countries = ["gb", "de", "dk", "se", "fr", "es", "it"];
    const regions = createRegionsWorkflow.runAsStep({
      input: {
        regions: [
          {
            name: "Europe",
            currency_code: "eur",
            countries,
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });
    return regions[0];
  });
  const defaultRegion = transform({ createdRegion, region }, (data) => data.region || data.createdRegion);

  //Stock Location

  const { stockLocation } = retrieveStockLocationStep();
  const createdStockLocation = when("check-stock-location", stockLocation, (input) => {
    return !input;
  }).then(() => {
    const stockLocations = createStockLocations([
      {
        name: "European Warehouse",
        address: {
          city: "Copenhagen",
          country_code: "DK",
          address_1: "",
        },
      },
    ]);
    //enable Shipping for Stock Location
    linkStockLocationStep({ locationId: stockLocations[0]?.id });
    linkStockLocationToStoreWorkflow.runAsStep({
      input: {
        stockLocations,
        storeId: store.id,
      },
    });
    return stockLocations[0];
  });

  const defaultStockLocation = transform(
    { createdStockLocation, stockLocation },
    (data) => data.stockLocation || data.createdStockLocation
  );

  //Shipping Profiles
  const { profile } = retrieveShippingProfileStep();
  const createdShippingProfile = when("cxheck-shipping-profiles", profile, (input) => {
    return !input;
  }).then(() => {
    const { shippingProfiles } = createShippingProfilesForStoreWorkflow.runAsStep({
      input: {
        data: [
          {
            name: "Default Shipping Profile",
            type: "default",
          },
        ],
        userId: user.id,
      },
    });
    return shippingProfiles[0];
  });

  const defaultShippingProfile = transform(
    { createdShippingProfile, profile },
    (data) => data.profile || data.createdShippingProfile
  );

  //create Service Zone and Shipping Option
  const { fulfillmentSet } = createFulfillmentSetsStep();
  linkStockLocationToFulfillmentStep({ locationId: defaultStockLocation.id, fulfillmentSetId: fulfillmentSet.id });

  const { shippingOptions } = retrieveShippingOptionsStep({ defaultShippingProfileId: defaultShippingProfile.id });
  const checkShippingOptions = when("check-shipping-options", shippingOptions, (input) => {
    return !input;
  }).then(() => {
    createShippingOptionsWorkflow.runAsStep({
      input: [
        {
          name: "Standard Shipping",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[0].id,
          shipping_profile_id: defaultShippingProfile.id,
          type: {
            label: "Standard",
            description: "Ship in 2-3 days.",
            code: "standard",
          },
          prices: [
            {
              currency_code: "usd",
              amount: 10,
            },
            {
              currency_code: "eur",
              amount: 10,
            },
            {
              region_id: defaultRegion.id,
              amount: 10,
            },
          ],
          rules: [
            {
              attribute: "enabled_in_store",
              value: "true",
              operator: "eq",
            },
            {
              attribute: "is_return",
              value: "false",
              operator: "eq",
            },
          ],
        },
      ],
    });
  });

  return new WorkflowResponse({
    store,
    user,
    userStoreLinkArray,
    registerResponse,
  });
});
