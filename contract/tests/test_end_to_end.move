#[test_only]
module test_move::create_two {
    use campaign_manager_addr::campaign_manager;
    use std::string::{Self, String};
    use aptos_framework::account;
    use std::signer;


    #[test]
    fun main() {
        let goal: u64 = 1000;
        let recipient: address = @0x33; // Get the recipient address
        let title = string::utf8(b"My Campaign");
        let description = string::utf8(b"This is a test campaign");
        let image_url: vector<String> = vector[string::utf8(b"http://example.com/image1.png")];

        let test_acc = account::create_account_for_test(@0x1);
        let test_acc2 = account::create_account_for_test(@0x2);

        let token = string::utf8(b"0x1::aptos_coin::AptosCoin");
        campaign_manager::create_campaign(&test_acc, token, goal, recipient, title, description, image_url);
        let title = string::utf8(b"My Campaign2");
        campaign_manager::create_campaign(&test_acc, token, goal, recipient, title, description, image_url);

        campaign_manager::contribute_to_campaign(signer::address_of(test_acc), token, goal, recipient, 100);
    }
}