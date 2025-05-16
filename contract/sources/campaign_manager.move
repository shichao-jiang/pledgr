module campaign_manager_addr::campaign_manager {
    use std::string::{String};
    use std::signer;
    use aptos_std::table::{Self, Table};
    use aptos_framework::dispatchable_fungible_asset;
    use aptos_framework::fungible_asset::{Self, Metadata, FungibleStore};
    use aptos_framework::object::{Self, Object};
    use aptos_framework::primary_fungible_store;
    // use std::debug;

    #[event]
    struct ContributionEvent has drop, store {
    }

    #[event]
    struct CampaignCreatedEvent has drop, store {
        campaign_num: u64,
        escrow_address: address,
    }

    struct Campaign has store, drop, key {
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

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct ObjectController has key {
        extend_ref: object::ExtendRef,
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
            fa_metadata,
            goal,
            recipient,
            title,
            description,
            image_url,
        };

        let constructor_ref = object::create_object(creator_addr);
        let object_signer = object::generate_signer(&constructor_ref);
        let extend_ref = object::generate_extend_ref(&constructor_ref);
        
        move_to(&object_signer, ObjectController { extend_ref });

        fungible_asset::create_store(&constructor_ref, fa_metadata);
        let escrow_address = object::address_from_constructor_ref(&constructor_ref);

        table::add(&mut campaign_table.table, campaign_table.next_num, new_campaign);
        0x1::event::emit(CampaignCreatedEvent { campaign_num: campaign_table.next_num, escrow_address });
    }
 
    public entry fun contribute_to_campaign(
        contributor: &signer,
        campaign_creator: address,
        campaign_num: u64,
        fa_metadata: Object<Metadata>,
        escrow_address: address,
        amount: u64,
    ) acquires CampaignTable, ObjectController {
        let table = borrow_global_mut<CampaignTable>(campaign_creator);
        let campaign = table::borrow(&table.table, campaign_num);

        let escrow_obj = object::address_to_object<FungibleStore>(escrow_address);
        let contributor_addr = signer::address_of(contributor);
        
        let user_primary_store = primary_fungible_store::primary_store_inlined(contributor_addr, fa_metadata);
        dispatchable_fungible_asset::transfer(contributor, user_primary_store, escrow_obj, amount);
        0x1::event::emit(ContributionEvent {});

        if (primary_fungible_store::balance(escrow_address, fa_metadata) >= campaign.goal) {
            let extend_ref = &borrow_global<ObjectController>(escrow_address).extend_ref;
            let object_signer = object::generate_signer_for_extending(extend_ref);

            let recipient_primary_store = primary_fungible_store::primary_store_inlined(campaign.recipient, fa_metadata);
            dispatchable_fungible_asset::transfer(&object_signer, escrow_obj, recipient_primary_store, amount);
            // TODO: maybe emit event?
        };
    }
}