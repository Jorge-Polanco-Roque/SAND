const { ethers } = require("hardhat");

async function main() {
    try {
        // Define the contract address of your already deployed DAO
        const contractAddress = "your_contract_address_here";
        
        // Get the contract factory
        const DAOContractFactory = await ethers.getContractFactory("AdvancedDAO");
        
        // Attach to the deployed contract
        const dao = DAOContractFactory.attach(contractAddress);

        console.log("Connected to DAO at address:", dao.address);

        // Now you can interact with the contract, for example:
        const proposals = await dao.proposals(0);  // Assuming there's at least one proposal
        console.log("First Proposal:", proposals);
        
    } catch (error) {
        console.error("Error during interaction:", error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error in script execution:", error);
        process.exit(1);
    });
