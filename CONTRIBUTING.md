# Contributing

## Development

To set up the development environment:

1.  **Clone the repository**
    ```bash
    git clone git@github.com:Tech-Labi/medusa-marketplace-plugin.git
    cd medusa-marketplace-plugin
    ```
2.  **Install dependencies**
    ```bash
    yarn
    ```
3.  **Start development mode**
    ```bash
    yarn dev
    ```
    This command will:
    * Watch for changes in the plugin. Whenever a file is changed, the plugin is automatically built.
    * Publish the plugin changes to the local package registry. This will automatically update the plugin in the Medusa     application using it.
    * Provide real-time HMR updates of admin extensions.
4.  **Build**
    ```bash
    yarn build
    ```

## How to publish a new version

1.  **Ensure you have Node 20 installed, then run `npm i`**
    ```bash
    npm i
    ```
2.  **Update the library version in `package.json`**
3.  **Login to npm:**
    ```bash
    npm login
    ```
4.  **Publish the library:**
    ```bash
    npm publish --access public
    ```
5.  **Verify that the library has been published successfully:**
    ```bash
    npm view @techlabi/medusa-marketplace-plugin
    ```
6.  **Create a new git tag:**
    ```bash
    git tag 0.13.0
    git push origin --tags
    ```
    (Replace `0.13.0` with the actual version number)
7.  **Create a release on GitHub:**
    [https://github.com/Tech-Labi/medusa-marketplace-plugin/releases](https://github.com/Tech-Labi/medusa-marketplace-plugin/releases)