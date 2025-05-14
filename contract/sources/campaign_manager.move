module campaign_manager_addr::campaign_manager {
    use std::string::{Self, String};
    use aptos_framework::coin::transfer;
    use aptos_std::type_info;
    
    struct Campaign has store, drop, key {
        paid: u64,
        goal: u64,
        recipient: address,
        title: String,
        description: String,
        image_url: vector<String>,
    }

    // struct CampaignList has store, drop, key {
    //     list: Vec<Campaign>
    // }

    public entry fun create_campaign(
        campaign_creator: &signer,
        goal: u64,
        recipient: address,
        title: String,
        description: String,
        image_url: vector<String>,
    )  {

        let new_campaign: Campaign = Campaign {
            paid: 0,
            goal,
            recipient,
            title,
            description,
            image_url,
        };
        
        move_to<Campaign>(campaign_creator, new_campaign);
    }

    public entry fun contribute_to_campaign<CoinType>(
        contributor: &signer,
        campaign_creator: address,
        amount: u64,
    ) acquires Campaign {
        let campaign = borrow_global_mut<Campaign>(campaign_creator);
        assert!(type_info::type_name<CoinType>() == string::utf8(b"0x1::aptos_coin::AptosCoin"));
        transfer<CoinType>(contributor, campaign.recipient, amount);
        campaign.paid = campaign.paid + amount;
    }
}

// script {
//     use campaign_manager_addr::campaign_manager;
//     use std::string::String;
//     use std::vector;

//     fun main() {
//         let goal: u64 = 1000;
//         let recipient: address = 0x33; // Get the recipient address
//         let title: String = b"My Campaign".to_string();
//         let description: String = b"This is a test campaign".to_string();
//         let image_url: vector<String> = vector[b"http://example.com/image1.png".to_string()];

//         campaign_manager::create_campaign(0x3d67821fbb753aebd79461ca0a1e3bd43c54de7fbd082b7a54ede1f02ce21a8e, goal, recipient, title, description, image_url);
//     }
// }