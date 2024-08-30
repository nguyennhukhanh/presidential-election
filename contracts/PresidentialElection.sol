// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PresidentialElection {
    address public operator;
    uint256 public totalVotes;
    
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    mapping(uint256 => Candidate) public candidates;
    mapping(address => bool) public hasVoted;
    uint256 public candidateCount;

    modifier onlyOperator() {
        require(msg.sender == operator, "Only the operator can perform this action");
        _;
    }

    event CandidateAdded(uint256 candidateId, string name);
    event Voted(address voter, uint256 candidateId);

    constructor() {
        operator = msg.sender;
    }

    function addCandidate(string memory _name) public onlyOperator {
        candidateCount++;
        candidates[candidateCount] = Candidate(_name, 0);
        emit CandidateAdded(candidateCount, _name);
    }

    function vote(uint256 _candidateId) public {
        require(!hasVoted[msg.sender], "You have already voted");
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID");

        candidates[_candidateId].voteCount++;
        hasVoted[msg.sender] = true;
        totalVotes++;

        emit Voted(msg.sender, _candidateId);
    }

    function getCandidate(uint256 _candidateId) public view returns (string memory name, uint256 voteCount) {
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID");
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.name, candidate.voteCount);
    }
}
