# Hedera WalletConnect v2 Minimal Demo

This project is a minimal example demonstrating how to connect a Vanilla JavaScript frontend application (built with Vite) to a Hedera wallet (such as HashPack) using WalletConnect v2 via the `@hashgraph/hedera-wallet-connect` library.

It showcases:
- Initializing the `DAppConnector` from `@hashgraph/hedera-wallet-connect`.
- Triggering the WalletConnect modal for pairing with a wallet.
- Establishing a session and retrieving the connected Hedera account ID.
- Displaying connection status and account information in the UI.
- Handling disconnection.
- Basic polyfilling for Node.js dependencies (like `Buffer`) using `vite-plugin-node-polyfills` for browser compatibility.

This demo is intended to provide a clear, focused example of the WalletConnect setup and connection lifecycle for Hedera dApps.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended, e.g., v18 or v20+)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A Hedera Testnet account with [HashPack Wallet](https://www.hashpack.app/) (browser extension or mobile).
- A **Project ID** from [WalletConnect Cloud](https://cloud.walletconnect.com/).

## Setup

1.  **Clone the repository (if you've put this on GitHub):**
    ```bash
    git clone <your-repo-url>
    cd my-wc-hedera-demo 
    ```
    (If running locally from the files provided, just navigate to the `my-wc-hedera-demo` directory).

2.  **Install dependencies:**
    Navigate to the project's root directory (`my-wc-hedera-demo`) in your terminal and run:
    ```bash
    npm install
    ```

3.  **Create Environment File:**
    In the root of the `my-wc-hedera-demo` project, create a new file named `.env`.

4.  **Add Your WalletConnect Project ID to `.env`:**
    Open the `.env` file and add your Project ID obtained from WalletConnect Cloud:
    ```env
    VITE_WALLETCONNECT_PROJECT_ID="YOUR_WALLETCONNECT_PROJECT_ID_HERE"
    ```
    Replace `"YOUR_WALLETCONNECT_PROJECT_ID_HERE"` with your actual Project ID.

## Running the Demo

1.  **Start the Vite development server:**
    ```bash
    npm run dev
    ```
2.  Open your web browser and navigate to the local URL provided by Vite (usually `http://localhost:5173/`).
3.  Ensure your HashPack wallet is set to the **Hedera Testnet**.
4.  Open your browser's Developer Console (F12) to see detailed logs.

## Usage

1.  Click the "Connect Wallet" button on the webpage.
2.  The WalletConnect modal should appear.
    * If you have HashPack as a browser extension, it might be automatically detected or listed under "Desktop" wallets. Select it.
    * Alternatively, you can use the "Scan QR Code" option with your HashPack mobile app.
3.  Approve the connection request in HashPack and select an account to connect.
4.  The demo page should update to show "Status: Connected," your Hedera Account ID, and the WalletConnect Session Topic.
5.  Click the "Disconnect Wallet" button to terminate the session. The UI will update accordingly.

## Key Files

-   `index.html`: The main HTML page with the basic UI elements.
-   `src/main.js`: Contains the core JavaScript logic for initializing WalletConnect, handling button clicks, and updating the UI.
-   `src/style.css`: Minimal CSS for basic layout.
-   `vite.config.js`: Vite configuration file, including setup for `vite-plugin-node-polyfills` to handle Node.js built-in polyfills like `Buffer`.
-   `.env`: Stores your WalletConnect Project ID (remember to add this to `.gitignore` if you haven't already via Vite's default).

## Notes & Troubleshooting

-   **Buffer/Node Polyfills:** This project uses `vite-plugin-node-polyfills` to handle dependencies that might expect Node.js built-in modules like `Buffer`. This is configured in `vite.config.js`.
-   **WalletConnect Modal Logs:** You might see some informational logs or even a 401 error related to `explorer-api.walletconnect.com` in the browser console when the WalletConnect modal initializes. This is often due to the modal trying to fetch a general list of wallets and may not affect direct pairing with HashPack if the extension is used or selected from the modal.
-   **Clearing Vite Cache:** If you make changes to `vite.config.js` or install/uninstall dependencies, it's often a good idea to stop the dev server, delete the `node_modules/.vite` directory, and then restart the dev server (`npm run dev`) to ensure changes are picked up cleanly.

---
*This demo was built to illustrate a basic Hedera WalletConnect v2 connection.*