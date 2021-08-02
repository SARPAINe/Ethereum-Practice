pragma solidity >=0.4.0 <0.6.0;

contract Test{
    address public owner;
    address[] public players;
    constructor(){
        owner=msg.sender;
    }
    
    function() external payable { }
    
    function enter() public payable{
        require (msg.value>= 1 ether);
        players.push(msg.sender);
    }
    function random() public view returns (uint){
        return uint(keccak256(block.difficulty, now, players));
    }
    function checkLength() public view returns(uint){
        return players.length;
    }
    function sendMoney(address reciever) public payable {
        bool exist=false;
        for(uint i=0;i<players.length;i++){
            if(players[i]==reciever)
            exist=true;
        }
        if(exist==true)
        reciever.transfer(msg.value);
        else if(exist==false)
        address(this).transfer(msg.value);
        
    }
   
    function pickWinner() public restricted{
        uint index=random()%players.length;
        players[index].transfer(address(this).balance);
        players=new address[](0);
    }
    modifier restricted(){
        require (msg.sender==owner);
        _;
    }
}