import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { useWallet, InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { ConnectWalletDialog } from "@/components/WalletSelector";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

interface Campaign {
  escrow_address: string;
  campaign_num: number;
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  recipientAddress: string;
  token: string;
  raised: number;
  amount_donations: number;
  goal: number;
}

interface ContributionFormProps {
  campaign: Campaign;
  onSubmit: (token: string, amount: number) => void;
  close: () => void;
}

export function ContributionForm({ campaign, close }: ContributionFormProps) {
  const { connected, account, signAndSubmitTransaction } = useWallet();
  const [_transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [amount, setAmount] = useState<number | "">("");

  useEffect(() => {
    if (connected) {
      setWalletDialogOpen(true); // Show wallet connect dialog
    }
  }, [connected]);

  if (!connected) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="relative bg-white shadow-md rounded-lg p-6 max-w-md w-full">
          {/* Close Button */}
          <button
            onClick={close}
            className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
            aria-label="Close"
          >
            ×
          </button>

          <h2 className="text-xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="mb-4">Please connect your wallet to continue.</p>
          <div className="flex justify-end">
            <Dialog open={walletDialogOpen} onOpenChange={setWalletDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setWalletDialogOpen(true)}>Connect a Wallet</Button>
              </DialogTrigger>
              <ConnectWalletDialog close={() => setWalletDialogOpen(false)} />
            </Dialog>
          </div>
        </div>
      </div>
    );
  }

  // Wallet is connected — now show the actual contribution form
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 leading-snug">
        Support <span className="text-blue-600">{campaign.title}</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Amount input */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Amount</label>
          <input
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="e.g. 100"
          />
          {amount !== "" && Number(amount) <= 0 && <p className="text-sm text-red-500 mt-1">Enter a positive amount</p>}
        </div>

        {/* Token display */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Token</label>
          <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
            {/* You can swap this icon for actual token logos */}
            <span className="text-sm font-semibold">APT</span>
          </div>
        </div>
      </div>

      {/* Submit button */}
      <div className="text-right">
        <Button
          disabled={amount === "" || Number(amount) <= 0}
          onClick={async () => {
            if (!account) return [];
            setTransactionInProgress(true);
            //const config = new AptosConfig({ network: Network.DEVNET }); // Specify your own network if needed
            const config = new AptosConfig({
              network: Network.DEVNET,
              fullnode: "https://fullnode.devnet.aptoslabs.com/v1", // DEVNET fullnode URL
              faucet: "https://faucet.devnet.aptoslabs.com", // DEVNET faucet URL (if needed)
            });
            const aptos = new Aptos(config);
            const transaction: InputTransactionData = {
              data: {
                function:
                  "0x839cae61ca88d71477e65ebf54915cb23347b444289fa9eeb6372bd64e561718::campaign_manager::contribute_to_campaign",
                functionArguments: [
                  campaign.recipientAddress,
                  campaign.campaign_num,
                  "0xa",
                  campaign.escrow_address,
                  amount,
                ],
              },
            };
            try {
              // sign and submit transaction to chain
              const response = await signAndSubmitTransaction(transaction);
              // wait for transaction
              await aptos.waitForTransaction({ transactionHash: response.hash });
              // setAccountHasList(true);
            } catch (error: any) {
              //setAccountHasList(false);
            } finally {
              setTransactionInProgress(false);
              close(); // Close the dialog after submission
            }
          }}
          className="px-6 py-2 transition bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
