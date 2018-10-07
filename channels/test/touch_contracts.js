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

var sum = function(arr, fn) {
  if (fn) {
    return sum(arr.map(fn));
  } else {
    return arr.reduce(function(prev, current, i, arr) {
      return prev + current;
    });
  }
};

var average = function(arr, fn) {
  return sum(arr, fn) / arr.length;
};

contract("BallotableContents", accounts => {
  it("ballot", async () => {
    const BallotableContents = getInstance("BallotableContents");
    await BallotableContents.methods.ballot(1, 5, 5, 100000).call();

    const ballots = await BallotableContents.methods.getBallots(1).call();

    assert.ok(ballots, "add ballot process is wrong.");
  });

  it("cannot ballot more than once", async () => {
    const accounts = await web3.eth.getAccounts();
    const a1 = accounts[0];
    const BallotableContents = getInstance("BallotableContents");

    console.log("account 1:", a1);
    await BallotableContents.methods
      .ballot(1, 5, 5, 100000)
      .send({ from: a1, gas: 6000000 });

    try {
      await BallotableContents.methods
        .ballot(1, 5, 5, 100000)
        .send({ from: a1, gas: 6000000 });
      assert(false, "no error thrown.");
    } catch (err) {
      console.log("error:", err.message);
      assert(
        err.message.includes("Only one-time to to call this function."),
        "something went to wrong."
      );
    }
  });

  it("calc accuracy score", async () => {
    const accounts = await web3.eth.getAccounts();
    const BallotableContents = getInstance("BallotableContents");

    var scores = [];
    for (let account of accounts) {
      var score = (Math.floor(Math.random() * 10) % 5) + 1;
      scores.push(score);
      await BallotableContents.methods
        .ballot(2, score, score, 100000)
        .send({ from: account, gas: 6000000 });
    }

    const remoteScore = await BallotableContents.methods
      .getAccuracyScore(2)
      .call();

    const expectedScore = Math.floor(average(scores));
    console.log(remoteScore, expectedScore, scores);
    assert(
      remoteScore == expectedScore,
      "The result of accuracyScoore is wrong"
    );
  });

  it("get rewards according to accuracy score", async () => {
    const accounts = await web3.eth.getAccounts();
    const BallotableContents = getInstance("BallotableContents");

    var scores = [5, 5, 5, 2, 5, 3, 4, 5, 5, 5];
    const expectedScore = Math.floor(average(scores));
    var expectedWonPlayers = [];
    for (let account of accounts) {
      var score = scores.pop();
      if (score > expectedScore) {
        expectedWonPlayers.push(account);
      }

      await BallotableContents.methods
        .ballot(3, score, score, 100000)
        .send({ from: account, gas: 6000000 });
    }

    const remoteScore = await BallotableContents.methods
      .getAccuracyScore(3)
      .call();

    console.log(remoteScore, expectedScore);
    assert(
      remoteScore == expectedScore,
      "The result of accuracyScoore is wrong"
    );

    var rewardWonPlayers = await BallotableContents.methods
      .getRewardWonPlayers(3)
      .call();

    rewardWonPlayers.splice(expectedWonPlayers.length);
    console.log(
      "rewardWonPlayers:",
      rewardWonPlayers,
      "expectedWonPlayers",
      expectedWonPlayers
    );

    for (let player of rewardWonPlayers) {
      assert(
        expectedWonPlayers.includes(player),
        "The result of rewardWonPlayers is wrong"
      );
    }
  });
});
