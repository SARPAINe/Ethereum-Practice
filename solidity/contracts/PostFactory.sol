// pragma solidity ^0.4.17;
pragma solidity >=0.4.16 <0.9.0;

contract PostFactory {
    address[] public deployedPosts;
    mapping(address=>bool) public postNotClosed;

    // constructor(){
    //     postNotClosed[msg.sender]=true;
    // }
    
     function createPost(string _postBody,uint _reward) public {
    // postNotClosed[0x5B38Da6a701c568545dCfcB03FcB875f56beddC4]=true;
        require(!postNotClosed[msg.sender],"You need to close your first post first!");
        address newPost = new Post(_postBody,_reward, msg.sender,this);
        deployedPosts.push(newPost);
        postNotClosed[msg.sender]=true;
    }
    
    function updateData(address user,bool a) public { 
        postNotClosed[user]=a;
    }
}

contract Post{
    
    string public postBody;
    address public postOwner;
    address public factoryAddress;
    uint public reward;
    bool public closed;
    uint public winner;
    
    
    struct Answer {
        address answerOwner;
        string solution;
    }
    
   function setData() public {
    //   function readData() public returns(uint) {
      PostFactory postFactory =PostFactory(factoryAddress);
      postFactory.updateData(msg.sender,false);         
    //   return c.getData();
    }
    
    Answer[] public answers;
    constructor(string _postBody,uint _reward,address creator,address _factoryAddress) public{
        postBody=_postBody;
        postOwner=creator;
        reward=_reward;
        factoryAddress=_factoryAddress;
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


