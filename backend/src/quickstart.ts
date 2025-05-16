import { Account, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const CONTRACT_ADDRESS = "0x3ca8983ddcb73a19cedee0ea857b5113b6a151fa13e343b49178ec7d48d8c867";

async function check_events() {
  // Create a new Aptos client with Testnet configuration
  const config = new AptosConfig({ network: Network.DEVNET }); // Specify your own network if needed
  const aptos = new Aptos(config);

  const accountOwnedObjects = await aptos.getAccountOwnedObjects({
    accountAddress: "0x1", // replace with a real account address
  });

  console.log(accountOwnedObjects);

  const fungibleAssetActivities = await aptos.getFungibleAssetMetadataByAssetType({
    assetType: "0x1::aptos_coin::AptosCoin",
  });
  console.log(fungibleAssetActivities);

  const sender = Account.generate();
  const transaction = await aptos.transaction.build.simple({
    sender: sender.accountAddress,
    data: {
      function: "0x3ca8983ddcb73a19cedee0ea857b5113b6a151fa13e343b49178ec7d48d8c867::campaign_manager::create_campaign",
      functionArguments: [
        Object(fungibleAssetActivities).creator_address,
        10,
        "0x3ca8983ddcb73a19cedee0ea857b5113b6a151fa13e343b49178ec7d48d8c867",
        "test",
        "test",
        ["test"],
      ],
    },
  });

  const response = await aptos.signAndSubmitTransaction({
    signer: sender,
    transaction,
  });
  console.log(response);

  // aptos.getTransactionByVersion({ledgerVersion: 37858249})
  //     .then((transaction) => {
  //         // console.log(transaction);
  //         console.log("data:")
  //         console.log(Object(transaction).payload);
  //         // console.log("Transaction fetched successfully");
  //     })
  //     .catch((error) => {
  //         console.error("Error fetching transaction:", error);
  //     });

  //     // const txn = await aptos.getTransactionByVersion({ledgerVersion: 37858249});
  //     // //                                       ↑ only on-chain txns have versions :contentReference[oaicite:1]{index=1}

  //     // // 3. Now you can read any of its fields:
  //     // console.log("Payload:           ", txn.payload);        // entry-function, module-publish, etc.
}

check_events();
