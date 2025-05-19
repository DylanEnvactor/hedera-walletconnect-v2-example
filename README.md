# Hedera WalletConnect v2 Minimal Demo (Vanilla JS + Vite)

This project provides a minimal, working example of how to integrate WalletConnect v2 into a Vanilla JavaScript frontend application (built with Vite) to connect to a Hedera wallet (such as HashPack).

It demonstrates the core functionalities:
- Initializing the `@hashgraph/hedera-wallet-connect` library's `DAppConnector`.
- Triggering the WalletConnect modal for pairing with a wallet (e.g., showing a QR code or prompting a browser extension).
- Establishing a WalletConnect session with the user's wallet.
- Retrieving the connected Hedera account ID from the session.
- Displaying the connection status and basic session information in the UI.
- Handling disconnection from the wallet.
- Basic polyfilling for Node.js dependencies (like `Buffer`) using `vite-plugin-node-polyfills` for browser compatibility, configured in `vite.config.js`.

This demo is intended to be a clean, straightforward example for developers looking to get started with WalletConnect for their Hedera dApps.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS version, e.g., v18, v20+)
- [npm](https://www.npmjs.com/) (included with Node.js)
- A Hedera Testnet account accessible via a WalletConnect v2 compatible Hedera wallet (e.g., [HashPack Wallet](https://www.hashpack.app/) browser extension or mobile app).
- A **Project ID** from [WalletConnect Cloud](https://cloud.walletconnect.com/).

## Project Setup

1.  **Clone the Repository (if applicable):**
    If you've obtained this project from a Git repository:
    ```bash
    git clone <repository-url>
    cd my-wc-hedera-demo 
    ```
    If you're setting it up from scratch based on these files, ensure all files are in a directory named `my-wc-hedera-demo`.

2.  **Navigate to the Project Directory:**
    ```bash
    cd path/to/my-wc-hedera-demo
    ```

3.  **Install Dependencies:**
    Install the necessary npm packages:
    ```bash
    npm install
    ```
    This will install Vite, `@walletconnect/sign-client`, `@hashgraph/hedera-wallet-connect`, `@hashgraph/sdk`, and `vite-plugin-node-polyfills`.

4.  **Create and Configure the Environment File:**
    * In the root of the `my-wc-hedera-demo` project directory, create a new file named `.env`.
    * Add the following lines to your `.env` file, replacing the placeholder with your actual WalletConnect Project ID:

        ```env
        # WalletConnect Project ID (Required - Get from [https://cloud.walletconnect.com/](https://cloud.walletconnect.com/))
        VITE_WALLETCONNECT_PROJECT_ID="YOUR_WALLETCONNECT_PROJECT_ID_HERE"

        # Hedera Network to target (Optional for this demo as main.js defaults to Testnet, but good practice to have)
        # Options: "testnet", "mainnet"
        VITE_HEDERA_NETWORK_NAME="testnet"
        ```
    * **Important:** Ensure this `.env` file is listed in your `.gitignore` file (Vite's default template usually includes this) to prevent committing your Project ID if this repository is made public.

## Running the Demo

1.  **Start the Vite Development Server:**
    ```bash
    npm run dev
    ```
2.  Vite will start the server and provide a local URL (typically `http://localhost:5173/`). Open this URL in your web browser.
3.  Ensure your HashPack wallet (or other WalletConnect-compatible Hedera wallet) is set to the **Hedera Testnet**.
4.  Open your browser's Developer Console (F12 or Right-click > Inspect > Console) to see detailed logs from the application.

## How to Use the Demo

1.  **Click the "Connect Wallet" button** on the webpage.
2.  The WalletConnect modal should appear, offering ways to connect (e.g., QR code, or direct connection if a compatible browser extension like HashPack is detected).
3.  Follow the prompts in your HashPack wallet to approve the connection and select an account.
4.  Once connected, the demo page will update to show:
    * Status: "Connected"
    * Account ID: Your connected Hedera Testnet account ID (e.g., `0.0.xxxxx`).
    * Session Topic: The active WalletConnect session topic string.
5.  **Click the "Disconnect Wallet" button** to terminate the session. The UI will update to reflect the disconnected state.

## Key Files in This Demo

-   **`index.html`**: The main HTML page providing the basic UI structure (buttons, status display areas).
-   **`src/main.js`**: Contains the core JavaScript logic. It initializes the `DAppConnector` from `@hashgraph/hedera-wallet-connect`, handles button click events for connecting/disconnecting, and updates the UI.
-   **`src/style.css`**: Provides minimal CSS for basic layout and appearance.
-   **`vite.config.js`**: The Vite configuration file. It's set up with `vite-plugin-node-polyfills` to ensure browser compatibility for Node.js built-in modules (like `Buffer`) that might be used by dependencies.
-   **`.env`**: Stores your `VITE_WALLETCONNECT_PROJECT_ID` and optionally `VITE_HEDERA_NETWORK_NAME`. **This file should not be committed to version control.**
-   **`package.json`**: Lists project dependencies and scripts.

---
*This demo illustrates the fundamental steps for integrating WalletConnect v2 for Hedera dApp wallet connections.*