const { assert, expect, use } = require('chai');
const { utils } = require('@aeternity/aeproject');
const chaiAsPromised = require('chai-as-promised');

use(chaiAsPromised);

BigInt.prototype.toJSON = function() { return this.toString() }

const CONTRACT_SOURCE = './contracts/CollectionUniqueNFTs.aes';
const MARKETPLACE_CONTRACT_SOURCE = './contracts//SimpleNFTMarketplaceAE.aes';

const collectionUniqueMetadata = require('../nfts/collection_unique_nfts.json');

describe('CollectionUniqueNFTs', () => {
  let aeSdk;
  let contract;
  let marketplaceContract;
  let accounts;

  before(async () => {
    aeSdk = await utils.getSdk();
    accounts = utils.getDefaultAccounts();

    // a filesystem object must be passed to the compiler if the contract uses custom includes
    const fileSystem = utils.getFilesystem(CONTRACT_SOURCE);

    // get content of contract
    const sourceCode = utils.getContractContent(CONTRACT_SOURCE);

    // initialize the contract instance
    contract = await aeSdk.initializeContract({ sourceCode, fileSystem });

    // deploy the contract
    await contract.init(
      collectionUniqueMetadata.name,
      collectionUniqueMetadata.symbol
    );

    // init and deploy receiver contract
    const marketplaceContractSource = utils.getContractContent(MARKETPLACE_CONTRACT_SOURCE);
    marketplaceContract = await aeSdk.initializeContract({ sourceCode: marketplaceContractSource, fileSystem: utils.getFilesystem(MARKETPLACE_CONTRACT_SOURCE) });
    await marketplaceContract.init();
  });

  describe('NFT collection', async () => {
    it('aex141_extensions', async () => {
      const { decodedResult } = await contract.aex141_extensions();
      assert.deepEqual(decodedResult, ['mintable']);
    });
    it('meta_info', async () => {
      const { decodedResult } = await contract.meta_info();
      assert.equal(decodedResult.name, collectionUniqueMetadata.name);
      assert.equal(decodedResult.symbol, collectionUniqueMetadata.symbol);
      assert.equal(decodedResult.metadata_type.MAP.length, 0);
      assert.equal(decodedResult.base_url, undefined);
    });
    it('minting', async () => {
      const address = accounts[0].address;

      // check total supply before minting
      let totalSupply = await contract.total_supply();
      assert.equal(totalSupply.decodedResult, 0)

      const metadataMapAllNFTs = new Array();
      for(let i=0; i<collectionUniqueMetadata.immutable_metadata_urls.length; i++) {
        metadataMapAllNFTs.push(new Map([['immutable_metadata_url', collectionUniqueMetadata.immutable_metadata_urls[i]]]))
      }

      // mint all nfts
      for(let i=0; i<collectionUniqueMetadata.immutable_metadata_urls.length; i++) {
        const mintTx = await contract.mint(address, {'MetadataMap': [metadataMapAllNFTs[i]]}, undefined, { onAccount: accounts[0] });
        assert.equal(mintTx.decodedEvents[0].name, 'Mint');
        assert.equal(mintTx.decodedEvents[0].args[0], address);
        assert.equal(mintTx.decodedEvents[0].args[1], i+1);
      }

      // check total supply after minting
      totalSupplyDryRun = await contract.total_supply();
      assert.equal(totalSupplyDryRun.decodedResult, 8);

      // check amount of NFTs of the owner / minter
      const balanceDryRun = await contract.balance(address);
      assert.equal(balanceDryRun.decodedResult, 8);

      // expect metadata for NFT with id "0" to be not existent as we start counting with id "1"
      let metadataDryRun = await contract.metadata(0);
      assert.equal(metadataDryRun.decodedResult, undefined);

      // expect metadata for NFT with id "1" to equal the metadata of the first minted NFT
      metadataDryRun = await contract.metadata(1);
      assert.deepEqual(metadataDryRun.decodedResult.MetadataMap[0], metadataMapAllNFTs[0]);

      // expect metadata for NFT with last id to equal the metadata of the last minted NFT
      metadataDryRun = await contract.metadata(metadataMapAllNFTs.length);
      assert.deepEqual(metadataDryRun.decodedResult.MetadataMap[0], metadataMapAllNFTs[metadataMapAllNFTs.length - 1]);
    });
  });

  describe('NFT marketplace interactions', async () => {
    it('announce, cancel & execute a sale', async () => {
      const marketplaceContractId = marketplaceContract.$options.address;
      const marketplaceContractAddress = marketplaceContractId.replace("ct_", "ak_");

      // approve marketplace contract
      let approveTx = await contract.approve(marketplaceContractAddress, 1, true, { onAccount: accounts[0] });
      assert.equal(approveTx.decodedEvents[0].name, 'Approval');
      assert.equal(approveTx.decodedEvents[0].args[0], accounts[0].address);
      assert.equal(approveTx.decodedEvents[0].args[1], marketplaceContractAddress);
      assert.equal(approveTx.decodedEvents[0].args[2], 1);
      assert.equal(approveTx.decodedEvents[0].args[3], "true");

      // announce sale via marketplace contract
      let announceSaleTx = await marketplaceContract.announce_sale(contract.$options.address, 1, 10, { onAccount: accounts[0] });
      assert.equal(announceSaleTx.decodedEvents[0].name, 'AnnounceSale');
      assert.equal(announceSaleTx.decodedEvents[0].args[0], accounts[0].address);
      assert.equal(announceSaleTx.decodedEvents[0].args[1], 1);

      // expected failed cancellation
      await expect(
        marketplaceContract.cancel_sale(1, { onAccount: accounts[1] }))
        .to.be.rejectedWith(`Invocation failed: "SALE_CAN_ONLY_BE_CANCELLED_BY_SELLER"`);
      const cancelSaleTx = await marketplaceContract.cancel_sale(1, { onAccount: accounts[0] });
      assert.equal(cancelSaleTx.decodedEvents[0].name, 'CancelSale');
      assert.equal(cancelSaleTx.decodedEvents[0].args[0], 1);

      // approve marketplace contract again (approval has been removed meanwhile due to transfer to marketplace contract)
      approveTx = await contract.approve(marketplaceContractAddress, 1, true, { onAccount: accounts[0] });
      announceSaleTx = await marketplaceContract.announce_sale(contract.$options.address, 1, 10, { onAccount: accounts[0] });
      assert.equal(announceSaleTx.decodedEvents[0].name, 'AnnounceSale');
      assert.equal(announceSaleTx.decodedEvents[0].args[0], accounts[0].address);
      assert.equal(announceSaleTx.decodedEvents[0].args[1], 2);

      // expect failed executions
      await expect(
        marketplaceContract.execute_sale(1, { onAccount: accounts[1] }))
        .to.be.rejectedWith(`Invocation failed: "SALE_NOT_IN_STATUS_OPEN"`);
      await expect(
        marketplaceContract.execute_sale(2, { onAccount: accounts[1], amount: 9 }))
        .to.be.rejectedWith(`Invocation failed: "PROVIDED_AMOUNT_NOT_MATCHES_PRICE"`);
      await expect(
        marketplaceContract.execute_sale(2, { onAccount: accounts[1], amount: 11 }))
        .to.be.rejectedWith(`Invocation failed: "PROVIDED_AMOUNT_NOT_MATCHES_PRICE"`);

      // execute the trade marketplace contract
      const executeSaleTx = await marketplaceContract.execute_sale(2, { onAccount: accounts[1], amount: 10 });
      assert.equal(executeSaleTx.decodedEvents[0].name, 'ExecuteSale');
      assert.equal(executeSaleTx.decodedEvents[0].args[0], accounts[0].address);
      assert.equal(executeSaleTx.decodedEvents[0].args[1], accounts[1].address);
      assert.equal(executeSaleTx.decodedEvents[0].args[2], 2);

      // check balances
      let balanceDryRun = await contract.balance(accounts[0].address);
      assert.equal(balanceDryRun.decodedResult, 7);
      balanceDryRun = await contract.balance(accounts[1].address);
      assert.equal(balanceDryRun.decodedResult, 1);

      // check new owner
      const ownerDryRun = await contract.owner(1);
      assert.equal(ownerDryRun.decodedResult, accounts[1].address);
    });
  });
});
