const { ethers } = require("hardhat");

async function main() {
    try {
        // Get the contract factory
        const DAOContractFactory = await ethers.getContractFactory("AdvancedDAO");
        console.log("Contract factory created successfully.");

        const tokenName = "ANATEMA";
        const tokenSymbol = "ANTM";
        const tokenDecimals = 18;
        const initialSupply = "1000000000000000000000000";
        const treasuryAddress = "0xf860f960F985a3Ad90EBd3Ed0AF64FC29Ff2b285"; // Replace with your treasury address

        // Deploy the contract
        const deployedDAOContract = await DAOContractFactory.deploy(
            tokenName,
            tokenSymbol,
            tokenDecimals,
            initialSupply,
            treasuryAddress
        );

        console.log("Contract deployed to:", deployedDAOContract.target);

    } catch (error) {
        console.error("Error during deployment:", error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error in deployment:", error);
        process.exit(1);
    });
