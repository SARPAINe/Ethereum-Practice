pragma solidity ^0.4.17;

contract Post{
    
    string public postBody;
    address public postOwner;
    uint public reward;
    bool public closed;
    uint public winner;
    
    struct Answer {
        address answerOwner;
        string solution;
    }
    
    Answer[] public answers;
    constructor(string _postBody,uint _reward) payable{
        postBody=_postBody;
        postOwner=msg.sender;
        reward=_reward;
    }
    
    function createAnswer(string answer) public {
        Answer memory newAnswer=Answer({
            answerOwner:msg.sender,
            solution:answer
        });
        
        answers.push(newAnswer);
    }
    
    function chooseAnswer(uint index) public payable{
        require(msg.sender==postOwner,"Only post owner can choose answer");
        winner=index;
    }
    
    function sendReward() public payable{
        require(msg.sender==postOwner,"Only post owner can sendReward");
        require(msg.value>=reward*1 wei,"Value must be at least equal to reward!");
        answers[winner].answerOwner.transfer(msg.value);
        closed=true;
    }
    
    
}
