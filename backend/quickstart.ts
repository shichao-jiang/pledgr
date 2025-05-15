import { Account, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

interface Campaign {
    id: string;
    imageUrl: string;
    title: string;
    description: string;
    recipientAddress: string;
    token: string;
    raised: number;
    goal: number;
    status: string;
    endDate: string;
  }

export async function checkEvents(): Promise<Campaign[]> {
    // Create a new Aptos client with Testnet configuration
    const config = new AptosConfig({ network: Network.DEVNET }); // Specify your own network if needed
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
            eventType: "0x187cbc10c7d40c131e9d9491a5f56bfa2ecce8831ad7b85621622c9ae5b70174::campaign_manager::CampaignCreatedEvent",
        }
    ).catch((error) => {
        console.error("Error fetching events:", error);
    });

    const contributors = await aptos.getModuleEventsByEventType(
        {
            eventType: "0x187cbc10c7d40c131e9d9491a5f56bfa2ecce8831ad7b85621622c9ae5b70174::campaign_manager::ContributionEvent",
        }
    ).catch((error) => {
        console.error("Error fetching events:", error);
    });
    console.log("Contributors:", contributors);

    console.log(events);
    if (events && Array.isArray(events)) {
        events.forEach(async (event) => {
            console.log("Event Data:", event.data); // Access the `data` field
            const transaction_version = event.transaction_version;
            const transaction = await aptos.getTransactionByVersion(
                {
                    ledgerVersion: transaction_version,
                }
            ).catch((error) => {
                console.error("Error fetching transaction:", error);
            }
            );

            console.log("Transaction Data:", transaction); // Access the `data` field
            const payload = Object(transaction).payload;
            const argumnets = payload.arguments;
            console.log("Transaction Payload:", payload); // Access the `data` field
            console.log("Transaction Arguments:", argumnets); // Access the `data` field
            // return argumnets;
             const initialCampaigns: Campaign[] = [
                {
                  id: "1",
                  imageUrl: "https://via.placeholder.com/300",
                  title: "Save the Ocean",
                  description: "Join us to clean the oceans and protect marine life.",
                  recipientAddress: "0x123...ocean",
                  token: "USDC",
                  raised: 4200,
                  goal: 10000,
                  status: "active",
                  endDate: "2025-07-01",
                },
                {
                  id: "2",
                  imageUrl: "https://via.placeholder.com/300",
                  title: "Plant Trees",
                  description: "Help us plant trees to fight climate change.",
                  recipientAddress: "0x456...trees",
                  token: "USDC",
                  raised: 8000,
                  goal: 8000,
                  status: "completed",
                  endDate: "2025-05-01",
                },
                {
                  id: "3",
                  imageUrl: "HungerImage",
                  title: "Feed the Hungry",
                  description: "Donate to provide meals to those in need.",
                  recipientAddress: "0x789...hunger",
                  token: "APT",
                  raised: 1500,
                  goal: 5000,
                  status: "active",
                  endDate: "2025-06-15",
                },
                {
                  id: "4",
                  imageUrl: "https://via.placeholder.com/300",
                  title: "Save the Forests",
                  description: "Support efforts to protect and restore forests.",
                  recipientAddress: "0x987...forest",
                  token: "ETH",
                  raised: 2500,
                  goal: 10000,
                  status: "active",
                  endDate: "2025-08-30",
                },
                {
                  id: "5",
                  imageUrl: "https://via.placeholder.com/300",
                  title: "Clean Water for All",
                  description: "Help provide access to clean drinking water in underserved areas.",
                  recipientAddress: "0x321...water",
                  token: "DAI",
                  raised: 6000,
                  goal: 12000,
                  status: "active",
                  endDate: "2025-09-15",
                },
              ];
                return initialCampaigns;
              });
        console.log("No events found or invalid response.");
        return [];
    }

    // Ensure a default return in case no events are processed
    return [];
}
checkEvents();
