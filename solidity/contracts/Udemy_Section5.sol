pragma solidity ^0.4.17;

contract CampaignFactory{
    address[] public deployedCampaigns;
    function createCampaign(uint minimum) public{
        address newCampaign=new Campaign(minimum,msg.sender);
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns(address[]){
        return deployedCampaigns;
    }
}

contract Campaign{
    
    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping (address=>bool) approvals;
    }
    
    //by convention we use capital letter for defining a struct
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping (address=>bool) public approvers;
    uint public approversCount;
    
    modifier restricted(){
        require(msg.sender==manager);
        _;
    }
    
    
    constructor(uint minimum,address creator) payable{
        manager=creator;
        minimumContribution=minimum;
    }
    
    function contribute() public payable {
        require(msg.value>=minimumContribution,"Minimum Contribution was not met!");
        approvers[msg.sender]=true;
        approversCount++;
    }
    function createRequest(string description,uint value, address recipient)
    public restricted{
        Request memory newRequest=Request({
            description:description,
            value:value,
            recipient:recipient,
            complete:false,
            approvalCount:0
        });
        
        requests.push(newRequest);
    }
    
    function approveRequesst(uint index) public {
        Request storage request=requests[index];
        
        require(approvers[msg.sender], "Only an approver can approve request!");
        require(!request.approvals[msg.sender],"You have already voted once!");
        request.approvals[msg.sender]=true;
        request.approvalCount++;
        
    }
    
    function finalizieRequest(uint index) public restricted{
        Request storage request=requests[index];
        require(request.approvalCount>(approversCount/2));
        require(!request.complete,"Already finalized!");
        
        request.recipient.transfer(request.value);
        request.complete=true;
    }
}


















