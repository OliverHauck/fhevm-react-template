const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 Starting AstralCompatibilityMock contract deployment...\n");

  // Get deployment account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deployer address:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy contract
  console.log("⏳ Deploying AstralCompatibilityMock contract...");
  const AstralCompatibilityMock = await hre.ethers.getContractFactory("AstralCompatibilityMock");
  const contract = await AstralCompatibilityMock.deploy();

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("✅ Contract deployed successfully!");
  console.log("📍 Contract address:", contractAddress);

  const deployTx = contract.deploymentTransaction();
  if (deployTx) {
    console.log("🔗 Transaction hash:", deployTx.hash);
    console.log("⛽ Gas limit:", deployTx.gasLimit.toString());
  }

  // Wait for block confirmations
  console.log("\n⏳ Waiting for block confirmations...");
  if (deployTx) {
    await deployTx.wait(5);
  }
  console.log("✅ Block confirmations complete\n");

  // Display contract information
  console.log("📊 Contract information:");
  console.log("- Owner:", await contract.owner());
  console.log("- Total Matches:", (await contract.totalMatches()).toString());

  // Verify contract
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("\n🔍 Preparing to verify contract...");
    console.log("Waiting 30 seconds before verification...");
    await new Promise(resolve => setTimeout(resolve, 30000));

    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verification successful!");
    } catch (error) {
      console.log("❌ Contract verification failed:", error.message);
    }
  }

  // Output configuration for frontend
  console.log("\n📋 Frontend configuration:");
  console.log("==================================");
  console.log("CONTRACT_ADDRESS:", contractAddress);
  console.log("CHAIN_ID: 11155111");
  console.log("NETWORK: Sepolia");
  console.log("CONTRACT_TYPE: Mock (Non-FHE)");
  console.log("==================================\n");

  // Save deployment information
  const fs = require("fs");
  const deploymentInfo = {
    network: "sepolia",
    contractAddress: contractAddress,
    contractType: "AstralCompatibilityMock",
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    txHash: deployTx ? deployTx.hash : "unknown",
    chainId: 11155111,
    note: "Mock version for Sepolia - simulates FHE functionality without actual encryption"
  };

  fs.writeFileSync(
    "deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("💾 Deployment information saved to deployment-info.json\n");

  // Test basic functionality
  console.log("🧪 Testing basic functionality...");
  try {
    // Create a test profile
    console.log("Creating test profile...");
    const tx = await contract.createProfile(0, 0, 0); // Aries, Fire, Cardinal
    await tx.wait();
    console.log("✅ Test profile created successfully");

    // Check profile status
    const [hasProfile, timestamp] = await contract.getUserProfileStatus(deployer.address);
    console.log("Profile status:", hasProfile ? "Active" : "Inactive");
    console.log("Profile timestamp:", new Date(Number(timestamp) * 1000).toISOString());
  } catch (error) {
    console.log("⚠️  Test failed:", error.message);
  }

  console.log("\n🎉 Deployment complete!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
