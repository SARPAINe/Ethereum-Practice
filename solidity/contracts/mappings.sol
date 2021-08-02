pragma solidity >=0.4.0 <0.6.0;
contract Test{
    mapping(address => uint) balances;
    //nested mapping
    mapping(address=>mapping(address=>bool)) approved;
    //array inside mapping
    mapping(address=>uint[]) scores;
    mapping(address=>uint) count;
    function invest() external payable{
        //add element
        balances[msg.sender]+=msg.value;
        count[msg.sender]+=1;
        //read 
        //balances[msg.sender];
        //update 
        //balances[msg.sender]=200;
        // delete
        // delete balances[msg.sender];
        //default values
        //every key is accessible even if it doesn't exist, default value for uint 0,
        //bool =false
        if(count[msg.sender]==1)
        scores[msg.sender].push(1);
        else
        scores[msg.sender].push(scores[msg.sender][count[msg.sender]-2]+1);
        
    }
    
    function checkScore(address tmp) public view returns(uint[]){
        return scores[tmp];
    }
    
    function getBalances(address tmp) external view returns(uint){
        return balances[tmp];
    }
    
}