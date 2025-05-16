import { ClientConfig, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { APTOS_API_KEY, NETWORK } from "../frontend/constants";

interface Campaign {
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

interface Contribution {
    id: string;
    campaign_num: number;
    recipientAddress: string;
    amount: number;
}

export async function checkEvents(): Promise<Campaign[]> {
    // Create a new Aptos client with Testnet configuration
    const clientConfig: ClientConfig = {
        API_KEY: APTOS_API_KEY
      };
    const config = new AptosConfig({ network: Network.DEVNET, clientConfig }); // Specify your own network if needed
    const aptos = new Aptos(config);

    // aptos.getModuleEventsByEventType(
    //     {
    //     eventType: "0x187cbc10c7d40c131e9d9491a5f56bfa2ecce8831ad7b85621622c9ae5b70174::campaign_manager::CampaignCreatedEvent",
    //     }
    // ).then((events) => {
    //     console.log(events);
    //     console.log("Events fetched successfully");
    // });

    const events = await aptos.getModuleEventsByEventType(
        {
            eventType: "0xe772c372ec3ec4540bc592f75e689a72552987616255e731fdbe52cb713cf832::campaign_manager::CampaignCreatedEvent",
        }
    ).catch((error) => {
        console.error("Error fetching events:", error);
    });
    console.log("Events", events);
    const contributors = await aptos.getModuleEventsByEventType(
        {
            eventType: "0xe772c372ec3ec4540bc592f75e689a72552987616255e731fdbe52cb713cf832::campaign_manager::ContributionEvent",
        }
    ).catch((error) => {
        console.error("Error fetching events:", error);
    });

    let filtered_campaigns: Campaign[] = []; // Declare campaigns outside the if block
    if (events && Array.isArray(events)) {
        filtered_campaigns = (
            await Promise.all(
                events.map(async (event) => {
                    console.log("Event Data:", event.data); // Access the `data` field
                    const transaction_version = event.transaction_version;
                    const transaction = await aptos.getTransactionByVersion(
                        {
                            ledgerVersion: transaction_version,
                        }
                    ).catch((error) => {
                        console.error("Error fetching transaction:", error);
                        return null; // Return null if there's an error
                    });
        
                    if (!transaction) return null; // Skip if transaction is null
        
                    console.log("Transaction Data:", transaction); // Access the `data` field
                    const payload = Object(transaction).payload;
                    const args = payload.arguments;
                    console.log("Transaction Payload:", payload); // Access the `data` field
                    console.log("Transaction Arguments:", args); // Access the `data` field

                    const campaign_num = args[0];
                    const token = args[1];
                    const goal = args[2];
                    const recipientAddress = args[3];
                    const title = args[4];
                    const description = args[5];
                    const imageUrl = args[6];
                    const id = transaction_version;
        
                    const campaign: Campaign = {
                        campaign_num: campaign_num,
                        id: id,
                        imageUrl: imageUrl,
                        title: title,
                        description: description,
                        recipientAddress: recipientAddress,
                        token: token,
                        raised: 0,
                        amount_donations: 0,
                        goal: goal,
                    };
        
                    return campaign;
                })
            )
        ).filter((campaign): campaign is Campaign => campaign !== null);
    
        // Filter out any null values in case of errors
        
        // return campaigns.filter((campaign) => campaign !== null);
    }
    
    console.log("Filteredx Campaigns:", filtered_campaigns);





    let filtered_contributions: Contribution[] = []; 
    if (contributors && Array.isArray(contributors)) {
        filtered_contributions = ( await Promise.all(
            contributors.map(async (event) => {
                const transaction_version = event.transaction_version;
                const transaction = await aptos.getTransactionByVersion(
                    {
                        ledgerVersion: transaction_version,
                    }
                ).catch((error) => {
                    console.error("Error fetching transaction:", error);
                    return null; // Return null if there's an error
                });
    
                if (!transaction) return null; // Skip if transaction is null
    
                console.log("Transaction Data:", transaction); // Access the `data` field
                const payload = Object(transaction).payload;
                const args = payload.arguments;
                console.log("Transaction Payload:", payload); // Access the `data` field
                console.log("Transaction Arguments:", args); // Access the `data` field
                
                const recipientAddress = args[0];
                //const campaign_num = args[1];
                const campaign_num = filtered_campaigns[0].campaign_num;
                const amount = args[2];
                const id = transaction_version;
                const contribution: Contribution = {
                    id: id,
                    campaign_num: campaign_num,
                    recipientAddress: recipientAddress,
                    amount: amount,
                };

                filtered_campaigns.forEach((campaign) => {
                    if (campaign.recipientAddress === recipientAddress && campaign.campaign_num === campaign_num) {
                        campaign.amount_donations += 1;
                        campaign.raised += Number(amount);
                    }
                });

                
                return contribution;
            }
        )
        )).filter((contribution): contribution is Contribution => contribution !== null);
        console.log("Filtered Contributors:", filtered_contributions);
        console.log("Updated Campaigns:", filtered_campaigns);

    }

    return filtered_campaigns;

    // console.log("Events:", events);
    // if (events && Array.isArray(events)) {
    //     const campaigns = await Promise.all(
    //         events.map(async (event) => {
    //             console.log("Event Data:", event.data); // Access the `data` field
    //             const transaction_version = event.transaction_version;
    //             const transaction = await aptos.getTransactionByVersion(
    //                 {
    //                     ledgerVersion: transaction_version,
    //                 }
    //             ).catch((error) => {
    //                 console.error("Error fetching transaction:", error);
    //                 return null; // Return null if there's an error
    //             });
    
    //             if (!transaction) return null; // Skip if transaction is null
    
    //             console.log("Transaction Data:", transaction); // Access the `data` field
    //             const payload = Object(transaction).payload;
    //             const args = payload.arguments;
    //             console.log("Transaction Payload:", payload); // Access the `data` field
    //             console.log("Transaction Arguments:", args); // Access the `data` field

    //             const token = args[0];
    //             const goal = args[1];
    //             const recipientAddress = args[2];
    //             const title = args[3];
    //             const description = args[4];
    //             const imageUrl = args[5];
    //             const id = transaction_version;
    
    //             const campaign: Campaign = {
    //                 id: id,
    //                 imageUrl: imageUrl,
    //                 title: title,
    //                 description: description,
    //                 recipientAddress: recipientAddress,
    //                 token: token,
    //                 raised: 0,
    //                 amount_donations: 0,
    //                 goal: goal,
    //             };
    
    //             return campaign;
    //         })
    //     );
    
    //     // Filter out any null values in case of errors
    //     console.log("Filtered Campaigns:", campaigns);
    //     return campaigns.filter((campaign) => campaign !== null);
    // }
    
    // // Ensure a default return in case no events are processed
    return [];
}
//checkEvents();
checkEvents();