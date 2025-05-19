// src/main.js for hedera-wc-example

import './style.css'; // Import basic styles

// Import necessary components from WalletConnect and Hedera libraries
import { DAppConnector, HederaChainId, HederaJsonRpcMethod, HederaSessionEvent } from "@hashgraph/hedera-wallet-connect";
import { LedgerId } from "@hashgraph/sdk"; // For specifying network (e.g., Testnet)

// --- DOM Elements (from our simplified index.html) ---
const connectWalletBtn = document.getElementById('connectWalletBtn');
const disconnectWalletBtn = document.getElementById('disconnectWalletBtn');
const walletStatusSpan = document.getElementById('walletStatus');
const connectedAccountIdSpan = document.getElementById('connectedAccountId');
const sessionTopicSpan = document.getElementById('sessionTopic');

// --- WalletConnect & Hedera dApp State ---
let dAppConnector = null; // DAppConnector instance
let activeSessionTopic = null;
let connectedAccountId = null;

// dApp Metadata for WalletConnect
const dAppMetadata = {
    name: "Hedera WalletConnect v2 Demo",
    description: "Minimal example for WalletConnect v2 with Hedera.",
    url: window.location.origin, 
    icons: [`${window.location.origin}/favicon.ico`], 
};

// WalletConnect Project ID from .env (Vite handles this import)
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

/**
 * Updates the UI based on wallet connection status.
 */
function updateUI() {
    console.log("Demo: updateUI called. Connected Account:", connectedAccountId, "Session Topic:", activeSessionTopic);
    if (connectedAccountId && activeSessionTopic) {
        if (walletStatusSpan) walletStatusSpan.textContent = "Connected";
        if (connectedAccountIdSpan) connectedAccountIdSpan.textContent = connectedAccountId;
        if (sessionTopicSpan) sessionTopicSpan.textContent = activeSessionTopic;
        if (connectWalletBtn) connectWalletBtn.style.display = 'none';
        if (disconnectWalletBtn) disconnectWalletBtn.style.display = 'inline-block';
    } else {
        if (walletStatusSpan) walletStatusSpan.textContent = "Not Connected";
        if (connectedAccountIdSpan) connectedAccountIdSpan.textContent = "N/A";
        if (sessionTopicSpan) sessionTopicSpan.textContent = "N/A";
        if (connectWalletBtn) connectWalletBtn.style.display = 'inline-block';
        if (disconnectWalletBtn) disconnectWalletBtn.style.display = 'none';
    }
}

/**
 * Initializes the Hedera DAppConnector and sets up event listeners.
 */
async function initializeWalletConnect() {
    if (!walletConnectProjectId) {
        console.error("Demo: VITE_WALLETCONNECT_PROJECT_ID is not set in .env file!");
        if (walletStatusSpan) walletStatusSpan.textContent = "WalletConnect Project ID missing. Check .env file.";
        return;
    }

    if (dAppConnector && dAppConnector.initialized) {
        console.log("Demo: DAppConnector already initialized.");
        if (dAppConnector.walletConnectClient && dAppConnector.walletConnectClient.session.length > 0) {
            const lastSession = dAppConnector.walletConnectClient.session.getAll().pop();
            console.log("Demo: Found existing session during re-check:", lastSession);
            activeSessionTopic = lastSession.topic;
            if (lastSession.namespaces.hedera && lastSession.namespaces.hedera.accounts.length > 0) {
                const fullAccountId = lastSession.namespaces.hedera.accounts[0];
                connectedAccountId = fullAccountId.split(':')[2];
            }
        }
        updateUI();
        return;
    }

    try {
        console.log("Demo: Initializing Hedera DAppConnector...");
        dAppConnector = new DAppConnector(
            dAppMetadata,
            LedgerId.TESTNET, 
            walletConnectProjectId,
            Object.values(HederaJsonRpcMethod), 
            [HederaSessionEvent.ChainChanged, HederaSessionEvent.AccountsChanged],
            [HederaChainId.Testnet] 
        );

        await dAppConnector.init({ logger: "debug" }); 
        console.log("Demo: DAppConnector initialized successfully.");

        if (dAppConnector.walletConnectClient) {
            const wcClient = dAppConnector.walletConnectClient;

            wcClient.on("session_event", (event) => {
                console.log("Demo: WalletConnect Session Event:", event);
                const { topic, params } = event;
                if (activeSessionTopic && topic === activeSessionTopic) {
                    const { event: eventData } = params;
                    if (eventData.name === "accountsChanged") {
                        const newAccountIdFull = eventData.data[0];
                        if (newAccountIdFull) {
                            connectedAccountId = newAccountIdFull.split(':')[2];
                            console.log("Demo: Accounts changed. New account:", connectedAccountId);
                            localStorage.setItem("wc_hedera_demo_last_account", connectedAccountId);
                            updateUI();
                        }
                    }
                }
            });

            wcClient.session.on("session_delete", ({ topic }) => {
                console.log("Demo: WalletConnect 'session_delete' event received for topic:", topic);
                if (activeSessionTopic === topic || !activeSessionTopic) { 
                    console.log("Demo: Clearing state and updating UI due to session_delete.");
                    connectedAccountId = null;
                    activeSessionTopic = null;
                    localStorage.removeItem("wc_hedera_demo_session_topic");
                    localStorage.removeItem("wc_hedera_demo_last_account");
                    updateUI(); 
                }
            });

            if (wcClient.session.length > 0) {
                const lastSession = wcClient.session.getAll().pop();
                console.log("Demo: Found existing session after init:", lastSession);
                activeSessionTopic = lastSession.topic;
                if (lastSession.namespaces.hedera && lastSession.namespaces.hedera.accounts.length > 0) {
                    const fullAccountId = lastSession.namespaces.hedera.accounts[0];
                    connectedAccountId = fullAccountId.split(':')[2];
                    localStorage.setItem("wc_hedera_demo_last_account", connectedAccountId);
                    localStorage.setItem("wc_hedera_demo_session_topic", activeSessionTopic);
                }
            }
        } else {
            console.error("Demo: DAppConnector.walletConnectClient not available for event listeners.");
        }
        
        updateUI();

    } catch (error) {
        console.error("Demo: Error initializing DAppConnector:", error);
        if (walletStatusSpan) walletStatusSpan.textContent = "Error initializing WalletConnect.";
    }
}

/**
 * Handles the "Connect Wallet" button click.
 */
async function handleConnectClick() {
    if (!dAppConnector) {
        console.error("Demo: DAppConnector not initialized. Cannot connect.");
        if (walletStatusSpan) walletStatusSpan.textContent = "Error: Connector not ready.";
        await initializeWalletConnect(); 
        if (!dAppConnector) return; 
    }

    if (connectedAccountId) { 
        console.log("Demo: Already connected. If this button is visible, it's a UI state error. Attempting disconnect.");
        await handleDisconnectClick();
        return;
    }

    console.log("Demo: 'Connect Wallet' clicked. Opening WalletConnect modal...");
    if (walletStatusSpan) walletStatusSpan.textContent = "Connecting... Check Wallet";

    try {
        const session = await dAppConnector.openModal(); 
        
        if (session) {
            console.log("Demo: WalletConnect Session Established via modal:", session);
            activeSessionTopic = session.topic;
            if (session.namespaces.hedera && session.namespaces.hedera.accounts.length > 0) {
                const fullAccountId = session.namespaces.hedera.accounts[0]; 
                connectedAccountId = fullAccountId.split(':')[2]; 
                console.log("Demo: Connected Account ID:", connectedAccountId);
                localStorage.setItem("wc_hedera_demo_last_account", connectedAccountId);
                localStorage.setItem("wc_hedera_demo_session_topic", activeSessionTopic); 
            } else {
                console.warn("Demo: Session established but no Hedera accounts found or shared.");
                connectedAccountId = null; 
                activeSessionTopic = null;
            }
        } else {
            console.warn("Demo: dAppConnector.openModal() did not return a session (user might have cancelled).");
            connectedAccountId = null; 
            activeSessionTopic = null;
        }
    } catch (error) {
        console.error("Demo: Error connecting to wallet / opening modal:", error);
        if (walletStatusSpan && (!connectedAccountId)) walletStatusSpan.textContent = `Connection Error`; 
        connectedAccountId = null;
        activeSessionTopic = null;
    }
    updateUI(); 
}

/**
 * Handles the "Disconnect Wallet" button click.
 */
async function handleDisconnectClick() {
    const topicToDisconnect = activeSessionTopic; 
    console.log("Demo: 'Disconnect Wallet' clicked. Attempting to disconnect session:", topicToDisconnect);

    connectedAccountId = null;
    activeSessionTopic = null;
    localStorage.removeItem("wc_hedera_demo_session_topic");
    localStorage.removeItem("wc_hedera_demo_last_account");
    updateUI(); 

    if (dAppConnector && topicToDisconnect) {
        try {
            await dAppConnector.disconnect(topicToDisconnect); 
            console.log("Demo: dAppConnector.disconnect call successful for topic:", topicToDisconnect);
        } catch (error) {
            console.error("Demo: Error during dAppConnector.disconnect:", error);
        }
    } else {
        console.warn("Demo: No active session topic to disconnect or dAppConnector not ready.");
    }
}

// --- Attach Event Listeners when DOM is loaded ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Demo: DOMContentLoaded event fired.");

    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', handleConnectClick);
    } else {
        console.error("Demo: Connect Wallet button (connectWalletBtn) not found!");
    }

    if (disconnectWalletBtn) {
        disconnectWalletBtn.addEventListener('click', handleDisconnectClick);
    } else {
        console.error("Demo: Disconnect Wallet button (disconnectWalletBtn) not found!");
    }

    initializeWalletConnect();
});