const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 Starting AstralCompatibility contract deployment...\n");

  // Get deployment account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deployer address:", deployer.address);

  const balance = await deployer.getBalance();
  console.log("💰 Account balance:", hre.ethers.utils.formatEther(balance), "ETH\n");

  // Deploy contract
  console.log("⏳ Deploying AstralCompatibility contract...");
  const AstralCompatibility = await hre.ethers.getContractFactory("AstralCompatibility");
  const contract = await AstralCompatibility.deploy();

  await contract.deployed();

  console.log("✅ Contract deployed successfully!");
  console.log("📍 Contract address:", contract.address);
  console.log("🔗 Transaction hash:", contract.deployTransaction.hash);
  console.log("⛽ Gas used:", contract.deployTransaction.gasLimit.toString());

  // Wait for block confirmations
  console.log("\n⏳ Waiting for block confirmations...");
  await contract.deployTransaction.wait(5);
  console.log("✅ Block confirmations complete\n");

  // Display contract information
  console.log("📊 Contract information:");
  console.log("- Owner:", await contract.owner());
  console.log("- Total Matches:", (await contract.totalMatches()).toString());

  // Configure pauser addresses (if needed)
  const numPausers = parseInt(process.env.NUM_PAUSERS || "0");
  if (numPausers > 0) {
    console.log("\n⚙️  Configuring pauser addresses...");
    for (let i = 0; i < numPausers; i++) {
      const pauserAddress = process.env[`PAUSER_ADDRESS_${i}`];
      if (pauserAddress && pauserAddress !== "0x0000000000000000000000000000000000000000") {
        console.log(`- Pauser ${i}:`, pauserAddress);
        // Note: AstralCompatibility contract needs pauser configuration function
      }
    }
  }

  // Verify contract
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("\n🔍 Preparing contract verification...");
    console.log("Waiting 30 seconds before verification...");
    await new Promise(resolve => setTimeout(resolve, 30000));

    try {
      await hre.run("verify:verify", {
        address: contract.address,
        constructorArguments: [],
      });
      console.log("✅ Contract verified successfully!");
    } catch (error) {
      console.log("❌ Contract verification failed:", error.message);
    }
  }

  // Output configuration for frontend
  console.log("\n📋 Frontend configuration:");
  console.log("==================================");
  console.log("CONTRACT_ADDRESS:", contract.address);
  console.log("CHAIN_ID: 11155111");
  console.log("NETWORK: Sepolia");
  console.log("==================================\n");

  // Save deployment information
  const fs = require("fs");
  const deploymentInfo = {
    network: "sepolia",
    contractAddress: contract.address,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    txHash: contract.deployTransaction.hash,
    blockNumber: contract.deployTransaction.blockNumber,
    gasUsed: contract.deployTransaction.gasLimit.toString()
  };

  fs.writeFileSync(
    "deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("💾 Deployment information saved to deployment-info.json\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
