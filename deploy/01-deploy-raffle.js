const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../helper-hardhat-config")

const VRF_SUB_FUND_AMOUNT = ethers.parseEther("30")

module.exports = async function({ getNamedAccounts, deployments }) {
    
    const { deploy, log } = deployments
    const {deployer} = await getNamedAccounts()
    const chainId = network.config.chainId
    let vrfCoordinatorV2Address, subscriptionId
    

    if (developmentChains.includes(network.name)) {
        const VRFCoordinatorV2Mock = await ethers.getContractAt("VRFCoordinatorV2Mock") // Thought this was a fix, but doesn't work: This might break. If so, replace ethers.getContractAt with deployments.get
        vrfCoordinatorV2Address = VRFCoordinatorV2Mock.address
        const transactionResponse = await VRFCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.waitConfirmations(1) //This might break things.
        subscriptionId = transactionReceipt.events[0].args.subId
        // Normal operations - now we would fund the subscription
        // Here is where we would need the link token on a real network
        await VRFCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT)
    } else {
        
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }
    

    const entranceFee = networkConfig[chainId]["entranceFee"]
    const gasLane = networkConfig[chainId]["gasLane"]
    const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]
    const interval = networkConfig[chainId]["interval"]
    const args = [vrfCoordinatorV2Address, entranceFee, gasLane, subscriptionId, callbackGasLimit, interval]

    const raffle = await deploy("Raffle", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(raffle.address, args)
    }
    log("----------------------------------------")
}

module.exports.tags = ["all", "raffle"]