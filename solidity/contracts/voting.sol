pragma solidity ^0.4.17;

contract Voting{
    
    mapping(address=>bool)voters;
    address public owner;
    struct Candidate{
        string description;
        uint votes;
        address locator;
    }
    Candidate[] public candidates;
    uint[] public votes;
    
    constructor() {
        owner=msg.sender;
    }
    
    function becomeCandidate(string description) public{
        Candidate memory newCandidate=Candidate({
            description:description,
            votes:0,
            locator:msg.sender
        });
        candidates.push(newCandidate);
    }
    
    // function getCandidates() public view returns(Candidates[]){
    //      return candidates;
    // }
    function getResult() public view returns(uint[]){
         uint[] results;
         for(uint i=0;i<candidates.length;i++)
         {
             results.push(candidates[i].votes);
         }
         return results;
    }
    
    function vote(uint index) public {
        require(!voters[msg.sender],"You have already voted!");
        voters[msg.sender]=true;
        candidates[index].votes++;
    }
    
}
