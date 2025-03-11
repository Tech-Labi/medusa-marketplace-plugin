# medusa-marketplace-plugin
Medusa multivendor marketplace plugin 

## Installation

1.  Add the following variables to your `.env` file:

    ```
    API_KEY=supersecret
    VITE_BACKEND_URL=http://localhost:9000
    ```

    * `API_KEY` - The secret key used to create the super admin.
    * `VITE_BACKEND_URL` - The URL of your Medusa backend, required for custom admin components.

2.  **Apply `postinstall` patch:**

    To ensure proper setup, follow these steps:

    1.  **Open `package.json`:**
        Open the `package.json` file in your project's root directory.

    2.  **Add `postinstall` script:**
        Add the following script under the `scripts` section:

        ```json
        "scripts": {
          "postinstall": "node node_modules/medusa-marketplace-plugin/.medusa/server/patch-admin.js",
          // ... other scripts ...
        }
        ```

    3.  **Run installation:**
        Execute the installation process using npm:

        ```bash
        npm install
        ```

        This `postinstall` script will automatically execute after all dependencies are installed, applying the necessary patch.

3.  Add the following code to your `medusa-config.ts` file:

    ```typescript
    module.exports = defineConfig({
      admin: {
        vite: () => {
          return {
            optimizeDeps: {
              include: ["qs"],
            },
          };
        },
      },
      projectConfig: { ... },
    })
    ```

    This code helps to resolve an issue similar to [https://github.com/medusajs/medusa/issues/11248](https://github.com/medusajs/medusa/issues/11248).

4.  Run database migrations:

    ```bash
    npx medusa db:migrate
    ```

5.  Start the project:

    ```bash
    npm run dev
    ```

## Creating a Super Admin

To create a super admin, use the following `curl` request:

```bash
curl -X POST http://localhost:9000/stores/super -d '{ "email":"admin@test.com", "password": "supersecret"}' -H 'Content-Type: application/json' -H 'Authorization: supersecret'