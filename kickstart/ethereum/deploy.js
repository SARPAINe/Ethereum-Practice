const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(
  "sweet weekend trouble patient execute pepper lake timber state coral girl reform",
  // remember to change this to your own phrase!
  "https://rinkeby.infura.io/v3/0916d37d35c648168bae4f724c2f9d13"
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: "1000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
};
deploy();

//Contract 1 deployed to 0xbDBC153d75d2db75375E377D41e3CB2EB7Bc56A9
//contract 2 deployed to 0xA03D7739Faa25581374D7AdF45e3Bc23DEa43EBa
