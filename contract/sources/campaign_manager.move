module campaign_manager_addr::campaign_manager {
    use std::string::{String};
    use std::signer;
    use aptos_framework::coin::transfer;
    use aptos_std::type_info;
    use aptos_std::table::{Self, Table};
    use aptos_framework::dispatchable_fungible_asset;
    use aptos_framework::fungible_asset::{Self, Metadata, FungibleStore};
    use aptos_framework::object::{Self, Object, ExtendRef, DeleteRef};
    use aptos_framework::primary_fungible_store;
    use std::debug;

    #[event]
    struct ContributionEvent has drop, store {
    }

    #[event]
    struct CampaignCreatedEvent has drop, store {
        escrow_address: address,
    }

    struct Campaign has store, drop, key {
        num: u64,
        fa_metadata: Object<Metadata>,
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
        fa_metadata: Object<Metadata>,
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
            fa_metadata,
            goal,
            recipient,
            title,
            description,
            image_url,
        };

        let constructor_ref = object::create_object(creator_addr); // TODO: is this an issue?
        let object_signer = object::generate_signer(&constructor_ref);

        fungible_asset::create_store(&constructor_ref, fa_metadata);
        let escrow_address = object::address_from_constructor_ref(&constructor_ref);

        table::add(&mut campaign_table.table, campaign_table.next_num, new_campaign);
        campaign_table.next_num += 1;
        0x1::event::emit(CampaignCreatedEvent {escrow_address});
    }
 
    public entry fun contribute_to_campaign<CoinType>(
        contributor: &signer,
        campaign_creator: address,
        campaign_num: u64,
        fa_metadata: Object<Metadata>,
        escrow_address: address,
        amount: u64,
    ) acquires CampaignTable {
        let table = borrow_global_mut<CampaignTable>(campaign_creator);
        let campaign = table::borrow(&table.table, campaign_num);

        let escrow_obj = object::address_to_object<FungibleStore>(escrow_address);
        let user_primary_store = primary_fungible_store::primary_store_inlined(signer::address_of(contributor), fa_metadata);
        // TODO check if goal

        dispatchable_fungible_asset::transfer(contributor, user_primary_store, escrow_obj, amount);
        0x1::event::emit(ContributionEvent {});
        // transfer<CoinType>(contributor, campaign.recipient, amount);
        let recipient_primary_store = primary_fungible_store::primary_store_inlined(campaign.recipient, fa_metadata);
        dispatchable_fungible_asset::transfer(contributor, escrow_obj, recipient_primary_store, amount);
    }
}