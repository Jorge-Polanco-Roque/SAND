// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Importing the ERC20 and Ownable contracts from OpenZeppelin
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// DAO contract inheriting from ERC20 and Ownable
contract DAO is ERC20, Ownable {

    // Struct to represent a proposal in the DAO
    struct Proposal {
        string description;      // Brief description of the proposal
        uint256 deadline;        // Timestamp until which votes can be cast
        uint256 yesVotes;        // Count of votes in favor of the proposal
        uint256 noVotes;         // Count of votes against the proposal
        bool executed;           // Flag to track if the proposal has been executed
        mapping(address => bool) hasVoted; // Tracks whether a user has voted
    }

    // Array to store all proposals created in the DAO
    Proposal[] public proposals;

    // Duration for voting on a proposal, set to 1 week by default
    uint256 public votingDuration = 1 weeks;

    // Constructor to initialize the ERC20 token and DAO contract
    constructor(
        string memory name,      // Token name for the DAO
        string memory symbol,    // Token symbol for the DAO
        uint8 decimals,          // Decimal places for the token
        uint256 initialSupply,   // Initial token supply
        address initialOwner     // Address of the initial owner
    ) 
        ERC20(name, symbol)      // Pass name and symbol to ERC20 constructor
        Ownable(initialOwner)    // Pass initialOwner to the Ownable constructor
    {
        // Mint initial supply to the owner
        _mint(initialOwner, initialSupply * 10 ** uint256(decimals));
    }

    // Function to create a new proposal (accessible to any token holder)
    function createProposal(string memory description) external {
        // Create a new proposal and store it in the proposals array
        Proposal storage newProposal = proposals.push(); 
        newProposal.description = description;           // Set the proposal's description
        newProposal.deadline = block.timestamp + votingDuration; // Set the proposal's voting deadline
        newProposal.executed = false;                    // Initialize the executed flag to false
    }

    // Function to vote on a proposal (accessible to any token holder)
    function vote(uint256 proposalIndex, bool support) external {
        // Retrieve the proposal to vote on
        Proposal storage proposal = proposals[proposalIndex]; 
        // Ensure the voting period is still open
        require(block.timestamp < proposal.deadline, "Voting period has ended.");
        // Ensure the voter has not already voted
        require(!proposal.hasVoted[msg.sender], "You have already voted.");

        // Mark the user as having voted
        proposal.hasVoted[msg.sender] = true;

        // Determine the voting power based on the user's token balance
        uint256 votingPower = balanceOf(msg.sender);
        if (support) {
            // Add the user's voting power to yesVotes
            proposal.yesVotes += votingPower;
        } else {
            // Add the user's voting power to noVotes
            proposal.noVotes += votingPower;
        }
    }

    // Function to execute a proposal after the voting period has ended (accessible to anyone)
    function executeProposal(uint256 proposalIndex) external {
        // Retrieve the proposal to execute
        Proposal storage proposal = proposals[proposalIndex]; 
        // Ensure the voting period has ended
        require(block.timestamp >= proposal.deadline, "Voting period is not over.");
        // Ensure the proposal hasn't already been executed
        require(!proposal.executed, "Proposal has already been executed.");

        // Mark the proposal as executed
        proposal.executed = true;

        if (proposal.yesVotes > proposal.noVotes) {
            // Placeholder: Implement the logic to execute the proposal
        }
    }
}
