// const ContentsFactory = artifacts.require("./ContentsFactory.sol");
const BallotableContents = artifacts.require("./BallotableContents.sol");

module.exports = deployer => {
  // deployer.deploy(ContentsFactory);
  deployer.deploy(BallotableContents);
};
