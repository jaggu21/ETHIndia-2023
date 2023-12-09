// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

contract ethVoting {

    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    // party structure
    struct Party{
        uint256 id;
        string name;
        string symbol; 
        string url; // cid hash of image or url of party symbol image
        uint256 votes;
    }

    Party[] public parties;

    // mapping for storing aadhar proof => voted/ not voted
    mapping(string => bool) public aadharProof;

    constructor() {
        owner = msg.sender; // The creator of the contract is the initial owner.
        parties.push(Party(1, "Indian National Congress", "INC", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/200px-Bharatiya_Janata_Party_logo.svg.png", 0));
        parties.push(Party(2, "Bharatiya Janata Party", "BJP", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Indian_National_Congress_hand_logo.svg/200px-Indian_National_Congress_hand_logo.svg.png", 0));
        parties.push(Party(3, "Aam Aadmi Party", "AAP", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Aam_Aadmi_Party_logo_%28English%29.svg/200px-Aam_Aadmi_Party_logo_%28English%29.svg.png", 0));
        parties.push(Party(4, "Communist Party of India (Marxist)", "CPI(M)", "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Cpm_election_symbol.svg/200px-Cpm_election_symbol.svg.png", 0));
        parties.push(Party(5, "Bahujan Samaj Party", "BSP", "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Elephant_Bahujan_Samaj_Party.svg/200px-Elephant_Bahujan_Samaj_Party.svg.png", 0));
    }

    function voteParty(string memory proof, uint256[] memory votesDistribution) public {
        require(aadharProof[proof] == false, "Following aadhar is already used for voting");

        uint256 totVotes = 0;
        for (uint256 i = 0; i < votesDistribution.length; i++) {
            totVotes += votesDistribution[i];
        }

        require(totVotes == 10, "Total votes in the distribution is more than 10");

        for (uint256 i = 0; i < votesDistribution.length; i++) {
            parties[i].votes += votesDistribution[i]**2;
        }

        aadharProof[proof] = true;
    }

}