import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const CONTRACT_ADDRESS = "0x187cbc10c7d40c131e9d9491a5f56bfa2ecce8831ad7b85621622c9ae5b70174";

async function check_events() {
    // Create a new Aptos client with Testnet configuration
    const config = new AptosConfig({ network: Network.DEVNET }); // Specify your own network if needed
    const aptos = new Aptos(config);

    
    const fungibleAssetActivities = await aptos.getFungibleAssetMetadata({minimumLedgerVersion: 0, options: {limit: 1}});
    console.log(fungibleAssetActivities);

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