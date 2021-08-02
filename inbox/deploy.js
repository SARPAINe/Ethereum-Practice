// deploy code will go here
const HDWalletProvider= require('truffle-hdwallet-provider');
const Web3= require('web3');
const {interface, bytecode}=require('./compile');

const provider= new HDWalletProvider(
   'sweet weekend trouble patient execute pepper lake timber state coral girl reform',
'https://rinkeby.infura.io/v3/0916d37d35c648168bae4f724c2f9d13'
);

const web3=new Web3(provider);

const deploy = async()=>{
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    console.log('Attempting to deploy from account: ',accounts[0]);

    const result=await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data:bytecode,arguments:['Hi there!']})
    .send({gas:'1000000', from: accounts[0]});

    console.log('Contract deployed to', result.options.address);
}
deploy();