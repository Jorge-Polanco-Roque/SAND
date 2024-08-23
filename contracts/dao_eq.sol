// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AdvancedDAO is ERC20 {

    struct Proposal {
        string description;
        uint256 deadline;
        uint256 yesVotes;
        uint256 noVotes;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    Proposal[] public proposals;
    uint256 public votingDuration = 1 weeks;
    uint256 public quorumPercentage = 20;  // Quorum requirement: 20%
    address public treasury;

    event ProposalCreated(uint256 indexed proposalIndex, string description);
    event ProposalExecuted(uint256 indexed proposalIndex, address indexed recipient, uint256 amount);
    event VoteCast(address indexed voter, uint256 indexed proposalIndex, bool support);

    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 initialSupply
    ) 
        ERC20(name, symbol)
    {
        _mint(msg.sender, initialSupply * 10 ** uint256(decimals));
        treasury = address(this);  // DAO itself holds the funds
    }

    // Function to create a new proposal, accessible by any token holder
    function createProposal(string memory description) external {
        Proposal storage newProposal = proposals.push();
        newProposal.description = description;
        newProposal.deadline = block.timestamp + votingDuration;
        newProposal.executed = false;

        emit ProposalCreated(proposals.length - 1, description);
    }

    // Function to vote on a proposal, accessible by any token holder
    function vote(uint256 proposalIndex, bool support) external {
        Proposal storage proposal = proposals[proposalIndex];
        require(block.timestamp < proposal.deadline, "Voting period has ended.");
        require(!proposal.hasVoted[msg.sender], "You have already voted.");

        proposal.hasVoted[msg.sender] = true;

        uint256 votingPower = balanceOf(msg.sender);
        if (support) {
            proposal.yesVotes += votingPower;
        } else {
            proposal.noVotes += votingPower;
        }

        emit VoteCast(msg.sender, proposalIndex, support);
    }

    // Function to execute a proposal after the voting period has ended
    function executeProposal(uint256 proposalIndex, address payable recipient, uint256 amount) external {
        Proposal storage proposal = proposals[proposalIndex];
        require(block.timestamp >= proposal.deadline, "Voting period is not over.");
        require(!proposal.executed, "Proposal has already been executed.");

        uint256 totalVotes = proposal.yesVotes + proposal.noVotes;
        uint256 quorum = (totalSupply() * quorumPercentage) / 100;
        require(totalVotes >= quorum, "Quorum not reached.");

        proposal.executed = true;

        if (proposal.yesVotes > proposal.noVotes) {
            require(amount <= address(this).balance, "Not enough funds in treasury.");
            recipient.transfer(amount);  // Send funds to the recipient
            emit ProposalExecuted(proposalIndex, recipient, amount);
        }
    }

    // Allow the contract to receive funds
    receive() external payable {}
}

