# Medusa Multivendor Marketplace Plugin

This plugin transforms your Medusa store into a robust multivendor marketplace.

## Background 

The plugin was created as a result of a four-part series articles on Medium re how to create multivendor marketplace with Medusa 2.0:

- 🛠 [**Part 1**](https://medium.com/@igorkhomenko/building-a-multivendor-marketplace-with-medusa-js-2-0-a-dev-guide-f55aec971126): setting up the multi-vendor structure and understanding how to manage multiple sellers on a single Medusa instance
- 🧑‍💼 [**Part 2**](https://medium.com/@igorkhomenko/building-a-multivendor-marketplace-with-medusa-js-2-0-super-admin-d899353b0b1e): building a powerful Super Admin layer to oversee vendors, products, orders, and more
- 🎨 [**Part 3**](https://medium.com/@igorkhomenko/building-a-multivendor-marketplace-with-medusa-js-2-0-dashboard-customization-part-3-6ce584b8c1c1): customizing the Medusa Admin Dashboard to give super admins and vendors a clean, user-friendly experience
- 🎨 [**Part 4**](https://medium.com/@igorkhomenko/building-a-multivendor-marketplace-with-medusa-js-2-0-medusa-plugin-part-4-a4c7ac08f2d4): bring it all together - packaging everything into a Medusa 2 plugin 

## Features

* **Store Creation:**
    * The plugin provides an intuitive interface for creating new vendor stores, simplifying the onboarding process for new sellers.
* **Entity Separation:**
    * The plugin ensures that each store has its own independent set of entities (customers, orders, products, etc.), preventing data conflicts and ensuring privacy.
* **Impersonation:**
    * Super admins can seamlessly switch between vendor accounts, enabling them to:
        * View the marketplace from a vendor's perspective.
        * Troubleshoot issues efficiently.
        * Provide personalized support.

## Installation

1.  Add plugin:
   
    ```
    yarn add @techlabi/medusa-marketplace-plugin
    ```

2.  Add the following variables to your `.env` file:

    ```
    API_KEY=supersecret
    VITE_BACKEND_URL=http://localhost:9000
    ```

    * `API_KEY` - The secret key used to create the super admin.
    * `VITE_BACKEND_URL` - The URL of your Medusa backend, required for custom admin components.

3.  **Apply `postinstall` patch:**

    To ensure proper setup, follow these steps:

    1.  **Open `package.json`:**
        Open the `package.json` file in your project's root directory.

    2.  **Add `postinstall` script:**
        Add the following script under the `scripts` section:

        ```json
        "scripts": {
          "postinstall": "node node_modules/@techlabi/medusa-marketplace-plugin/.medusa/server/src/patch-admin.js",
          // ... other scripts ...
        }
        ```

    3.  **Run installation:**
        Execute the installation process using yarn:

        ```bash
        yarn
        ```

        This `postinstall` script will automatically execute after all dependencies are installed, applying the necessary patch.

4.  Add the following code to your `medusa-config.ts` file:

    ```typescript
    module.exports = defineConfig({
      projectConfig: { ... },
      plugins: [
        {
          resolve: "@techlabi/medusa-marketplace-plugin",
          options: {},
        },
      ],
    })
    ```

    This code connect plugin and helps to resolve an issue similar to [https://github.com/medusajs/medusa/issues/11248](https://github.com/medusajs/medusa/issues/11248).

5.  Run database migrations:

    ```bash
    npx medusa db:migrate
    ```

6.  Start the project:

    ```bash
    yarn dev
    ```

## Demo app

https://github.com/Tech-Labi/medusa2-marketplace-demo

## Functionality Overview

Key features included:

* **Super Admin Role:**
    * Introduces a super admin role with the ability to manage all aspects of the marketplace.
    * Super admins can:
        * Create and manage multiple vendor stores.
        * Impersonate vendor accounts to troubleshoot and provide support.
        * Access and analyze data across all stores.
* **Vendor Store Management:**
    * Enables the creation of individual vendor stores, each with its own:
        * **Customer Base:** Independent customer lists for each vendor.
        * **Order Management:** Separate order tracking and fulfillment.
        * **Price Lists:** Unique pricing strategies for each vendor.
        * **Product Catalogs:** Distinct product offerings per store.
        * **Shipping Profiles:** Tailored shipping options.
        * **Stock Locations:** Independent inventory management.
        * **User Accounts:** Vendor-specific user management.
* **Data Separation:**
    * The plugin ensures clear separation of data between stores using Medusa's module links:
        * `customer-store.ts`
        * `order-store.ts`
        * `price-list-store.ts`
        * `product-store.ts`
        * `shipping-profile-store.ts`
        * `stock-location-store.ts`
        * `user-store.ts`
    * This architecture allows vendors to operate independently while maintaining a cohesive marketplace experience for customers.

## Creating a Super Admin

To create a super admin, use the following `curl` request:

```bash
curl -X POST http://localhost:9000/stores/super -d '{ "email":"admin@test.com", "password": "supersecret"}' -H 'Content-Type: application/json' -H 'Authorization: supersecret'
```

## Contributing

Feel free to contribute to this plugin by submitting pull requests or creating issues for bug reports and feature requests.

## License

Apache 2.0

TEMP
