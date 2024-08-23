const { Web3 } = require('web3');

async function main() {
  // Instantiate Web3 and connect to the local Hardhat node
  const web3 = new Web3('http://127.0.0.1:8545');

  // Get the accounts available on the node
  const accounts = await web3.eth.getAccounts();

  // Load the DAO contract JSON artifact
  // Ensure that the correct path to the JSON file is provided based on your project structure
  const contractJSON = require('../artifacts/contracts/DAO.sol/DAO.json');

  // Create a contract instance using the ABI from the JSON file
  const DAOContract = new web3.eth.Contract(contractJSON.abi);

  // Deploy the DAO contract
  // The deploy method takes an object with the bytecode and constructor arguments
  const deployedDAOContract = await DAOContract.deploy({
    data: contractJSON.bytecode, // Contract bytecode extracted from the JSON file
    arguments: [
      "MyDAO",                      // Token name for the DAO
      "MDAO",                       // Token symbol for the DAO
      18,                           // Decimal places for the token
      web3.utils.toWei("1000000", "ether"), // Initial supply converted to Wei
      accounts[0]                   // Initial owner's address passed to the contract
    ]
  }).send({
    from: accounts[0],  // The deployment transaction is sent from the first account available
    gas: 3000000,       // Gas limit for the deployment transaction
    gasPrice: '30000000000' // Gas price set to 30 gwei
  });

  // Log the address of the deployed contract to the console
  console.log('DAO Contract deployed to:', deployedDAOContract.options.address);
}

// Execute the main function
// If the deployment is successful, the script exits cleanly
// If there is an error, it is caught and logged, and the process exits with an error code
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
