const ContentsFactory = artifacts.require("./ContentsFactory.sol");

module.exports = deployer => {
  deployer.deploy(ContentsFactory);
};
