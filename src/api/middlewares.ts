import { defineMiddlewares } from "@medusajs/medusa";
import { registerLoggedInUser } from "./middlewares/logged-in-user";
import { adminStockLocationRoutesMiddlewares } from "./admin/stock-locations/middlewares";
import { adminShippingProfileRoutesMiddlewares } from "./admin/shipping-profiles/middlewares";
import { adminSalesChannelRoutesMiddlewares } from "./admin/sales-channels/middlewares";
import { adminRegionsRoutesMiddlewares } from "./admin/regions/middlewares";
import { adminTaxRegionsRoutesMiddlewares } from "./admin/tax-regions/middlewares";
import { adminTaxRatesRoutesMiddlewares } from "./admin/tax-rates/middlewares";
import { adminPriceListRoutesMiddlewares } from "./admin/price-lists/middlewares";
import { adminCustomerRoutesMiddlewares } from "./admin/customers/middlewares";
import { adminApiKeyRoutesMiddlewares } from "./admin/api-keys/middlewares";
import { adminOrderRoutesMiddlewares } from "./admin/orders/middlewares";
import { adminProductsRoutesMiddlewares } from "./admin/products/middlewares";
import { adminUsersRoutesMiddlewares } from "./admin/users/middlewares";
import { storesRoutesMiddlewares } from "./stores/middlewares";
import { adminCollectionRoutesMiddlewares } from "./admin/collections/middlewares";

export default defineMiddlewares({
  routes: [
    {
      method: ["GET", "POST"],
      matcher: "/admin/*",
      middlewares: [registerLoggedInUser],
    },
    ...storesRoutesMiddlewares,
    ...adminProductsRoutesMiddlewares,
    ...adminUsersRoutesMiddlewares,
    ...adminStockLocationRoutesMiddlewares,
    ...adminShippingProfileRoutesMiddlewares,
    ...adminSalesChannelRoutesMiddlewares,
    ...adminRegionsRoutesMiddlewares,
    ...adminTaxRegionsRoutesMiddlewares,
    ...adminTaxRatesRoutesMiddlewares,
    ...adminPriceListRoutesMiddlewares,
    ...adminCustomerRoutesMiddlewares,
    ...adminApiKeyRoutesMiddlewares,
    ...adminOrderRoutesMiddlewares,
    ...adminCollectionRoutesMiddlewares,
  ],
});
