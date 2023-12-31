const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")

module.exports = async function({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const {deployer} = await getNamedAccounts
    const chainId = network.config.chainId
    let vrfCoordinatorV2Address

    if (developmentChains.includes(network.name)) {
        const VRFCoordinatorV2Mock = await ethers.getContractAt("VRFCoordinatorV2Mock") // This might break. If so, replace ethers.getContractAt with deployments.get
        vrfCoordinatorV2Address = VRFCoordinatorV2Mock.address
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
    }

    const entranceFee = networkConfig[chainId]["entranceFee"]
    const args = [vrfCoordinatorV2Address, entranceFee]
    const raffle = await deploy("Raffle", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
}