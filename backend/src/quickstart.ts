import { Account, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const CONTRACT_ADDRESS = "0xdb1798a5fac5be81bcf32eb2b4e170b241457f01b4180fb5b1a9e4a689071077";

async function check_events() {
  // Create a new Aptos client with Testnet configuration
  const config = new AptosConfig({ network: Network.DEVNET }); // Specify your own network if needed
  const aptos = new Aptos(config);

//   const accountOwnedObjects = await aptos.getAccountOwnedObjects({
//     accountAddress: "0x1", // replace with a real account address
//   });

//   console.log(accountOwnedObjects);

//   const fungibleAssetActivities = await aptos.getFungibleAssetMetadataByAssetType({
//     assetType: "0x1::aptos_coin::AptosCoin",
//   });
//   console.log(fungibleAssetActivities);

    // const events = await aptos.getModuleEventsByEventType({
    //     eventType: `${CONTRACT_ADDRESS}::campaign_manager::CampaignCreatedEvent`,
    // })
    // .catch((error) => {
    //     console.error("Error fetching events:", error);
    // });
    // console.log("Events", events);
    // const escrow_addr = events[0].data.escrow_address;

    const sender = Account.generate();
    await aptos.fundAccount({
        accountAddress: sender.accountAddress, amount: 100000000,
    });
    const transaction = await aptos.transaction.build.simple({
        sender: sender.accountAddress,
        data: {
            function: `${CONTRACT_ADDRESS}::campaign_manager::contribute_to_campaign`,
            functionArguments: [
                "0x53fe85b7bbfbb02c79cb7c094501fbfa4b452857ae343dbab8598553d9fd04a2",
                1,
                "0xa",
                "0xf7aab8eb269e87ff2b9ffcee6a8b4f1c1bd897ea1483b8755bdcac9679575cbf",
                10,
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

    //         console.log("data:")
    //         console.log(Object(transaction).payload);
    //     })
    //     .catch((error) => {
    //         console.error("Error fetching transaction:", error);
    //     });
}

check_events();
