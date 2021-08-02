pragma solidity ^0.6.0;

contract Test{
    address public owner;
    address[] public players;
    uint private a=3;
    constructor() public {
        owner=msg.sender;
    }
    function foo() external view returns(uint){
        uint b=a+1;
        return b;
    }
    function enter() external{
        // require(msg.value>=1 ether);
        players.push(msg.sender);
    }
    
    function addNumbers(uint[] calldata numbers) external view returns(uint){
        require(msg.sender==owner,"only owner can call this");
        uint sum=0;
        for(uint i=0;i<numbers.length;i++)
        sum+=numbers[i];
        return sum+a;
    }
    function sortNumbers(uint[] calldata numbers) external pure returns(uint[] memory){
        uint[] memory tempArray=numbers;
        for(uint i=0;i<tempArray.length;i++)
        {
            for(uint j=i+1;j<tempArray.length;j++)
            {
                if(tempArray[i]>=tempArray[j])
                {
                    uint tmp;
                    tmp=tempArray[i];
                    tempArray[i]=tempArray[j];
                    tempArray[j]=tmp;
                }
            }
        }
        // numbers=tempArray;
        return tempArray;
    }
    function stringLength(string calldata str) external pure returns(uint){
        return bytes(str).length;
    }
    function getTimestamp() public view returns(uint){
        return block.timestamp;
    }

}