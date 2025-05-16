import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosClient, Types } from "aptos";

// Constants
const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const client = new AptosClient(NODE_URL);

// Token Mapping
function getTypeForToken(token: string): string {
  const map: Record<string, string> = {
    APT: "0x1::aptos_coin::AptosCoin",
    USDC: "0xYourUSDCModuleAddress::usdc::USDC",
    DAI: "0xYourDAIModuleAddress::dai::DAI",
  };

  const type = map[token];
  if (!type) {
    throw new Error(`Unsupported token: ${token}`);
  }
  return type;
}


// Main function to call your Move function
export async function contributeToCampaign({
  moduleAddress,
  moduleName,
  campaignCreator,
  campaignId,
  tokenSymbol,
  amount,
  wallet,
}: {
  moduleAddress: string;
  moduleName: string;
  campaignCreator: string;
  campaignId: number;
  tokenSymbol: string;
  amount: number;
  wallet: {
    account: { address: string };
    signAndSubmitTransaction: (tx: Types.EntryFunctionPayload) => Promise<string>;
  };
}) {
  const typeArg = getTypeForToken(tokenSymbol);

  const payload: Types.EntryFunctionPayload = {
    function: `${moduleAddress}::${moduleName}::contribute_to_campaign`,
    type_arguments: [typeArg],
    arguments: [campaignCreator, campaignId, amount],
  };

  try {
    const txHash = await wallet.signAndSubmitTransaction(payload);
    await client.waitForTransaction(txHash);
    return txHash;
    } catch (error) {
    console.error("Transaction failed:", error);
    throw error;
    }

}
