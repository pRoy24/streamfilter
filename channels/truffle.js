/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*", // Match any network id
      websockets: true,
      gas: 6000000,
      gasPrice: 1
    }
  },
  compilers: {
    solc: {
      version: "0.4.24", // ex:  "0.4.20". (Default: Truffle's installed solc)
      docker: true,
      optimizer: { enabled: true, runs: 200 }
    }
  }
};
