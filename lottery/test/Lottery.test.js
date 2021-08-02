const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const {interface, bytecode} = require('../compile');

let lottery;
let accounts;

beforeEach(async ()=>{
    accounts= await web3.eth.getAccounts();
    lottery= await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data:bytecode})
    .send({from:accounts[0], gas:'1000000'});
});

describe('Lottery Contract',()=>{
    it('deploys a contract',()=>{
        assert.ok(lottery.options.address);
    });

    it('allows one account to enter',async()=>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02','ether')
        });

        const players =await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.strictEqual(accounts[0],players[0]);
        assert.strictEqual(1,players.length);
    });

    it('allows multiple accounts to enter',async()=>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02','ether')
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02','ether')
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02','ether')
        });

        const players =await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.strictEqual(accounts[0],players[0]);
        assert.strictEqual(accounts[1],players[1]);
        assert.strictEqual(accounts[2],players[2]);
        assert.strictEqual(3,players.length);
    });

    it('requires a minimun amount of ether to enter', async ()=>{
        try{
            await lottery.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei('0.01', 'ether')
                // value: 0
                
            });
        }catch (err){

            assert(true);
            return;
        }
        assert(false);
    });

    it('only manager can call pickwinner', async ()=>{
        let executed;
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.2', 'ether')
        });
        try{
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            executed="success";
        } catch (err){
            executed="fail";
            // console.log(err);
        }
        assert.strictEqual('fail',executed);

    });
    //test passes if account 1 picks winner, 
    //fails if account 0 picks winner

    it('sends money to the winner and resets the players array', async ()=>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2','ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);

        console.log(await web3.eth.getBalance(lottery.options.address));

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });
        
        // console.log(await web3.eth.getBalance(lottery.options.address));
        
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference= finalBalance-initialBalance;
        // console.log(lottery.options.address);
        assert(difference>web3.utils.toWei('1.8','ether'));
        

        assert.strictEqual('0',await web3.eth.getBalance(lottery.options.address));
        
    });

});
