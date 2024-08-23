const { ethers } = require("hardhat");

async function main() {
    try {
        const DAOContractFactory = await ethers.getContractFactory("AdvancedDAO");
        console.log("Contract factory created successfully.");

        const tokenName = "MyAdvancedDAO";
        const tokenSymbol = "MDAO";
        const tokenDecimals = 18;
        const initialSupply = "1000000000000000000000000";

        const deployedDAOContract = await DAOContractFactory.deploy(
            tokenName,
            tokenSymbol,
            tokenDecimals,
            initialSupply
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
