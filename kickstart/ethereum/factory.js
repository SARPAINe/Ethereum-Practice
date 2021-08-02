import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0xbDBC153d75d2db75375E377D41e3CB2EB7Bc56A9"
);

export default instance;

//if we just import this file anywhere
// we can get access to our deployed contract.
// we don't have to go through the whole importing
// web3 process again and again and getting provider
// from browser.
