const { ethers } = require("hardhat")

const networkConfig = {
    11155111: {
        name: "Sepolia",
        vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625", // VRF Coordinator contract address is listed in the chainlink docs
        entranceFee: ethers.parseEther("0.01")
    },
    31337: {
        name: "hardhat",
        entranceFee: ethers.parseEther("0.01")
    }
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig, 
    developmentChains,
}