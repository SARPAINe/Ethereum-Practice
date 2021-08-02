// contract test code will go here
const assert = require('assert');//assert is used for making 
//assertions about tests.

const ganache = require('ganache-cli');//this is going to serve as 
//our local ethereum test network

const Web3 = require('web3'); ///we capatalized it as it's a constructor function

const web3 = new Web3(ganache.provider()); //instances of Web3 so lowercase letter
const {interface, bytecode} = require('../compile');



let accounts;
let inbox;

beforeEach(async ()=>{
    //get a list of all accounts

    accounts= await web3.eth.getAccounts();

    //use one of these accounts to deploy the contract
    inbox=await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode, arguments:['Hi there!']})
    .send({from: accounts[0], gas: '1000000'});
});

describe('Inbox',() => {
    it('deploys a contract',() => {
        assert.ok(inbox.options.address);
    });

    it('has a default message',async ()=>{
        const message= await inbox.methods.message().call();
        assert.strictEqual(message,'Hi there!');
    });

    it('can change the message', async ()=>{
        await inbox.methods.setMessage('bye')
        .send({from: accounts[0]});
        const message=await inbox.methods.message().call();
        assert.strictEqual(message,'bye');

    });
});
