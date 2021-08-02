/ pragma solidity ^0.4.17;
// pragma solidity >=0.4.16 <0.9.0;
pragma solidity >=0.4.17 <0.7.0;


contract QuestionFactory {
    address[] public deployedQuestions;
    mapping(address=>bool) public postedQuestion;
    
    function createQuestion(string _questionTitle,string _questionBody,uint _reward) public {
    // postNotClosed[0x5B38Da6a701c568545dCfcB03FcB875f56beddC4]=true;
        require(!postedQuestion[msg.sender],"User have unresolved question! User should close question");
        address newQuestion = new Question(_questionTitle,_questionBody,_reward, msg.sender,this);
        deployedQuestions.push(newQuestion);
        postedQuestion[msg.sender]=true;
    }
    
    function updateData(address user,bool a) public { 
        postedQuestion[user]=a;
    }
    function getDeployedQuestions() public view returns(address[]){
        return deployedQuestions;
    }
}


contract Question{ 
    string public questionBody;
    string public questionTitle;
    address public questionOwner;
    address public factoryAddress;
    uint public reward;
    bool public closed;
    uint public winner;
    bool public answerSelected;
    
    struct Answer {
        address answerOwner;
        string solution;
    }
    Answer[] public answers;
    
    constructor(string _questionTitle,string _questionBody,uint _reward,address creator,address _factoryAddress) public{
        questionTitle=_questionTitle;
        questionBody=_questionBody;
        questionOwner=creator;
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
    
    modifier restricted(){
        require(msg.sender==questionOwner,"Only question owner has the authority");
        _;
    }   
    
    function chooseAnswer(uint index) public restricted{
        require(answers[index].answerOwner!=msg.sender,"You can't choose your own comment as answer!");
        winner=index;
        answerSelected=true;
    }
    
    function sendReward() public payable restricted{
        require(answerSelected=true,"First select a answer to send reward!");
        require(msg.value>=reward*1 wei,"Reward should be greater than the least amount!");
        answers[winner].answerOwner.transfer(msg.value);
        closed=true;
        
    }
    
    function closeQuestion() public restricted{
        require((closed==true||answers.length==0),"You can close the question only after you have sent reward! or if there is no posted answer");
        QuestionFactory questionFactory =QuestionFactory(factoryAddress);
        questionFactory.updateData(msg.sender,false);         
    }
    
    function getAnswerCount() public view returns (uint){
        return answers.length;
    }
    
}

