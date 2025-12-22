# Changelog

## 0.52.0

### Bug fixes

- fixed the error message that occurred during store creation

## 0.51.0

### Features

- added extraction of userId from the API key in the `registerLoggedInUser` middleware when `ALLOW_API_KEYS_FOR_VENDORS` is true

## 0.50.0

### Features

- added merchant workflow events

## 0.49.0

### Bug fixes

- removed `container.register` usage

## 0.48.0

### Bug fixes

- block user w/o store to access data

## 0.47.0

### Features

- Update admin/merchants route. Now it call entity: "store" instead of "user_store".
  - processing of store search params moved to middleware

## 0.46.0

### Misc

- `medusa-js` version updated to `2.11.1`.

### Bug fixes

- Fixed compensation flow

## 0.45.0

### Misc

- `medusa-js` version updated to `2.11.0`.

## 0.44.0

### Bug fixes

- Fixed bug in store creation, combined create-multi-store and create-store workflows.

## 0.43.0

### Bug fixes

- Bug fixes create-multi-store Cannot read properties of null (reading 'is_super_admin')

## 0.42.0

### Bug fixes

- Bug fixes list products `productStoreAccessMiddleware`

## 0.41.0

### Bug fixes

- Bug fixes Super admin is not allowed to create multiple stores

## 0.40.0

### Bug fixes

- Bug fixes list merchants make search query case-insensitive

## 0.39.0

### Features

- Add pagination query parametrs into /admin/merchants route
  - add search query parametr to make search by Store name or Email

### Bug fixes

- Bug fixes list products `productStoreAccessMiddleware`

## 0.38.0

### Bug fixes

- Impersonate bar not appearing

## 0.37.0

### Features

- Made stock locations and shipping profiles visible to supervisors
- Removed getStoreStep; use currentStore instead

### Bug fixes

- Fixed bug with user impersonation
- Fixed type bug for currentStore

### Misc

- Improved performance for price list functionality

## 0.36.0

### Misc

- `medusa-js` version updated to `2.10.2`.

### Features

- Split draft orders per store

### Bug fixes

- Bug fixes list products

## 0.35.0

### Features

- Split promotions and campaigns per store

## 0.34.0

### Features

- in createStoreWorkflow was added 'storeCreated' HOOK. Implementation of this hook in your project coluld help, for example, to automatically set default settings of: Stock Location, Shipping Profiles, Service Zone and Shipping Option etc.
- implement new steps of createStoreWorkflow : linkStockLocationToFulfilmentProviderStep, linkStockLocationToFulfillmentStep, retrieveRegionsStep, CreateFulfillmentSetsStepInput
- apiKeysCreated HOOK: when the store is not defined the hook will be skipped

## 0.33.0

### Features

- add admin/merchant-stores/[id] route

## 0.32.0

### Misc

- `medusa-js` version updated to `2.9.0`.

## 0.31.0

### Features

- introduce `__VITE_DISABLE_SIGNUP_WIDGET__` env disable signup widget

## 0.30.0

### Misc

- `medusa-js` version updated to `2.8.8`.

### Bug fixes

- Bug fixes create regular store

### Improvements

- Improved multi-store channel pricing in linkCustomersToSalesChannelWorkflow

## 0.29.0

### Bug fixes

- Bug fixes "Could not resolve 'currentStore'.\n\nResolution path: currentStore" in link-customer-to-store-step

## 0.28.0

### Improvements

- Improved GET merchants route - add user email and user_id field in response

## 0.27.0

### Bug fixes

- Bug fixes duplicate customer error when signing up with the same email across multiple stores

## 0.26.0

### Features

- Multi-store channel pricing

## 0.25.0

### Bug fixes

- Bug fixes multi-store capabilities

## 0.24.0

### Improvements

- Improved multi-store capabilities

## 0.23.0

### Features

- Multi-store capabilities

## 0.22.0

### Features

- introduce `ALLOW_API_KEYS_FOR_VENDORS` env to allow API keys management for regular vendors

### Misc

- `medusa-js` version updated to `2.8.3`.

## 0.21.0

### Misc

- `medusa-js` version updated to `2.8.0`.

## 0.20.0

### Misc

- `medusa-js` version updated to `2.7.1`.

## 0.19.0

### Bug fixes

- adopt `patch-admin.ts` to medusa-js 2.7.1

## 0.18.0

### Bug fixes

- Fixed customer-created.ts

## 0.17.0

### Improvements

- Adopt to `medusa-js` 2.7.1

## 0.16.0

### Improvements

- Split product collection per store

### Misc

- `medusa-js` version updated to `2.7.0`.

## 0.15.0

### Improvements

- Updated Sign Up widget button

## 0.14.0

### Bug fixes

- Allow regular merchants to retrieve regions

## 0.13.0

### Misc

- export all utils functions from `patch-admin.ts`

## 0.12.0

### Misc

- Fixed `package.json`

## 0.11.0

### Misc

- Updated docs and configs: `CONTRIBUTING.md`, `README.md`, `package.json`, `yarn.lock`
- Updated workflows and scripts: `.github/workflows/release.yml`, `src/patch-admin.ts`
- Fixed `CHANGELOG.md`

### Misc

- `medusa-js` version updated to `2.6.1`.

## 0.10.0

### Important Notes

- initial version
