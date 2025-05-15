module campaign_manager_addr::campaign_manager {
    use std::string::{String};
    use std::signer;
    use aptos_framework::coin::transfer;
    use aptos_std::type_info;
    use aptos_std::table::{Self, Table};

    #[event]
    struct ContributionEvent has drop, store {
    }

    #[event]
    struct CampaignCreatedEvent has drop, store {
    }

    struct Campaign has store, drop, key {
        num: u64,
        token: String,
        goal: u64,
        recipient: address,
        title: String,
        description: String,
        image_url: vector<String>,
    }

    struct CampaignTable has store, key {
        table: Table<u64, Campaign>,
        next_num: u64,
    }

    public entry fun create_campaign(
        campaign_creator: &signer,
        token: String,
        goal: u64,
        recipient: address,
        title: String,
        description: String,
        image_url: vector<String>,
    ) acquires CampaignTable {
        let creator_addr = signer::address_of(campaign_creator);
        if (!exists<CampaignTable>(creator_addr)) {
            move_to<CampaignTable>(campaign_creator, CampaignTable { 
                table: table::new(), 
                next_num: 0,
            });
        };
        let campaign_table = borrow_global_mut<CampaignTable>(creator_addr);
        campaign_table.next_num += 1;
        let new_campaign = Campaign {
            num: campaign_table.next_num,
            token,
            goal,
            recipient,
            title,
            description,
            image_url,
        };

        table::add(&mut campaign_table.table, campaign_table.next_num, new_campaign);
        0x1::event::emit(CampaignCreatedEvent {});
    }
 
    public entry fun contribute_to_campaign<CoinType>(
        contributor: &signer,
        campaign_creator: address,
        campaign_num: u64,
        amount: u64,
    ) acquires CampaignTable {
        let table = borrow_global_mut<CampaignTable>(campaign_creator);
        let campaign = table::borrow(&table.table, campaign_num);
        assert!(type_info::type_name<CoinType>() == campaign.token);
        0x1::event::emit(ContributionEvent {});
        transfer<CoinType>(contributor, campaign.recipient, amount);
    }
}