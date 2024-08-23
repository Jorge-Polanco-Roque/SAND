const { Web3 } = require('web3');

async function main() {
  // Instantiate Web3 and connect to the local Hardhat node
  const web3 = new Web3('http://127.0.0.1:8545');

  // Get the accounts available on the node
  const accounts = await web3.eth.getAccounts();

  // Load the contract JSON artifact
  const contractJSON = require('../artifacts/contracts/token.sol/Token.json');
  const TokenContract = new web3.eth.Contract(contractJSON.abi);

  // Deploy the contract
  const deployedContract = await TokenContract.deploy({
    data: contractJSON.bytecode,
    arguments: ["MyToken", "MTK", 18, web3.utils.toWei("1000000", "ether")]
  }).send({
    from: accounts[0],  // Use the first account
    gas: 1500000,
    gasPrice: '30000000000'
  });

  console.log('Contract deployed to:', deployedContract.options.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
