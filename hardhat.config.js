require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    iopnTestnet: {
      url: "https://testnet-rpc2.iopn.tech",
      chainId: 984,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};