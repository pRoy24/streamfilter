// var ContentsFactory = artifacts.require("./ContentsFactory.sol");
// var BallotableContent = artifacts.require("./BallotableContent.sol");

// contract("ContentsFactory", function(accounts) {
//   it("contentsCount should be 0 in first time", function() {
//     return ContentsFactory.deployed()
//       .then(function(instance) {
//         return instance.getContentsCount.call();
//       })
//       .then(function(count) {
//         assert.equal(count.valueOf(), 0, "initialization process is wrong.");
//       });
//   });

//   it("should content added", function() {
//     return ContentsFactory.deployed()
//       .then(function(instance) {
//         return instance.addContent.call(1);
//       })
//       .then(function(contentAddress) {
//         console.log("contentContractAddress:", contentAddress);
//         assert.ok(
//           contentAddress,
//           "addContent function returned unexpected function, linkage may be broken"
//         );

//         return BallotableContent.at(contentAddress);
//       })
//       .then(function(instance) {
//         console.log(instance);
//         return instance.creator;
//       })
//       .then(function(creator) {
//         console.log("creator:", creator);
//         assert.ok(creator, "Content contract may be broken.");
//       });
//   });
// });

// v1.0
const { getWeb3, getContractInstance } = require("../helpers");
const web3 = getWeb3();
const getInstance = getContractInstance(web3);

contract("BallotableContents", accounts => {
  it("ballot", async () => {
    const BallotableContents = getInstance("BallotableContents");
    await BallotableContents.methods.ballot(1, 5, 5, 100000).call();

    const ballots = await BallotableContents.methods.getBallots(1).call();

    assert.ok(ballots, "add ballot process is wrong.");
  });
});
