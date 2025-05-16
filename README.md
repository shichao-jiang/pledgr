# Pledger: A Decentralized Crowdfunding Solution

## Overview

Pledgr is a decentralized crowdfunding platform built on the Aptos blockchain, designed to significantly reduce transaction fees and eliminate middleman fraud by leveraging transparent and immutable smart contracts.

## Demo Video

[Include Link to Demo Video Here]

## Screenshots


## How it Works

Crowdfunding is increasingly popular for financing projects and supporting charitable causes. However, traditional centralized platforms like GoFundMe take substantial fees and pose risks related to fraud and lack of transparency. For instance, a $5 USD donation on GoFundMe typically loses nearly 9% to processing fees (2.9% + $0.30).

Pledgr resolves these issues by deploying a smart contract on the Aptos blockchain. Contributions are made in AptosCoin, with extremely low gas fees—typically fractions of a cent. The transparency provided by blockchain ensures that escrow balances and transactions can be publicly verified, removing the necessity to trust centralized intermediaries.

Blockchain Interaction

Pledgr utilizes Aptos' blockchain due to its performance, low fees, and fast transaction confirmations. We developed the frontend using Aptos’ TypeScript SDK, enabling direct, decentralized blockchain interaction without a backend. Smart contracts were created in the Aptos Move language and deployed using Aptos CLI tools.

The smart contract is published once at a known Aptos address. Users can initiate crowdfunding campaigns by specifying a funding goal, recipient address, and type of fungible asset accepted. Contributors send their donations to the smart contract’s escrow, visible publicly on-chain. Once the funding goal is achieved, the smart contract automatically transfers the funds from escrow directly to the recipient’s wallet.

## Detailed Video Explanation

[Include Link to Loom Video Explaining Project and GitHub Structure]

What's Covered:

* Explanation of the Pledgr project and its blockchain interactions
* Walkthrough of the GitHub repository structure
* Live demonstration of the platform in action

Clarification on how the platform meets all specified project criteria