const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({
      from: accounts[0],
      gas: "1000000",
    });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000",
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks the caller as the campaign manger", async () => {
    const manager = await campaign.methods.manager().call();
    assert.strictEqual(accounts[0], manager);
  });
  it("checks if someone can contribute to a campaign and mark them as approvers", async () => {
    await campaign.methods.contribute().send({
      value: "200",
      from: accounts[1],
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });
  it("requires a minimum contribution", async () => {
    let success = false;
    try {
      await campaign.methods.contribute().send({
        value: "50",
        from: accounts[1],
      });
    } catch (err) {
      success = true;
    }
    assert(success);
  });

  it("allows a manager to make a payment request", async () => {
    await campaign.methods
      .createRequest("Buy batteries", "150", accounts[1])
      .send({ from: accounts[0], gas: "1000000" });
    const request = await campaign.methods.requests(0).call();
    assert.strictEqual("Buy batteries", request.description);
  });

  it("processes request", async () => {
    //0 is the manager
    //1 is the contributor
    //2 is the vendor
    let vendorMoney = await web3.eth.getBalance(accounts[2]);
    vendorMoney = web3.utils.fromWei(vendorMoney, "ether");
    vendorMoney = parseFloat(vendorMoney);
    await campaign.methods.contribute().send({
      value: web3.utils.toWei("10", "ether"),
      from: accounts[1],
    });
    await campaign.methods
      .createRequest(
        "Buy batteries",
        web3.utils.toWei("5", "ether"),
        accounts[2]
      )
      .send({ from: accounts[0], gas: 1000000 });
    await campaign.methods.approveRequest(0).send({
      from: accounts[1],
      gas: "1000000",
    });
    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });
    let vendorMoneyAfter = await web3.eth.getBalance(accounts[2]);
    vendorMoneyAfter = web3.utils.fromWei(vendorMoneyAfter, "ether");
    vendorMoneyAfter = parseFloat(vendorMoneyAfter);
    console.log(vendorMoney);
    console.log(vendorMoneyAfter);
    // vendorMoneyAfter += 1.5;
    // console.log(vendorMoneyAfter);
    if (vendorMoneyAfter >= vendorMoney + 5) assert(true);
    else assert(false);
  });
});
