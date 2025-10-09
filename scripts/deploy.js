const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 开始部署 AstralCompatibility 合约...\n");

  // 获取部署账户
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 部署账户地址:", deployer.address);

  const balance = await deployer.getBalance();
  console.log("💰 账户余额:", hre.ethers.utils.formatEther(balance), "ETH\n");

  // 部署合约
  console.log("⏳ 正在部署 AstralCompatibility 合约...");
  const AstralCompatibility = await hre.ethers.getContractFactory("AstralCompatibility");
  const contract = await AstralCompatibility.deploy();

  await contract.deployed();

  console.log("✅ 合约部署成功!");
  console.log("📍 合约地址:", contract.address);
  console.log("🔗 交易哈希:", contract.deployTransaction.hash);
  console.log("⛽ Gas 使用量:", contract.deployTransaction.gasLimit.toString());

  // 等待几个区块确认
  console.log("\n⏳ 等待区块确认...");
  await contract.deployTransaction.wait(5);
  console.log("✅ 区块确认完成\n");

  // 显示合约信息
  console.log("📊 合约信息:");
  console.log("- Owner:", await contract.owner());
  console.log("- Total Matches:", (await contract.totalMatches()).toString());

  // 配置暂停器地址 (如果需要)
  const numPausers = parseInt(process.env.NUM_PAUSERS || "0");
  if (numPausers > 0) {
    console.log("\n⚙️  配置暂停器地址...");
    for (let i = 0; i < numPausers; i++) {
      const pauserAddress = process.env[`PAUSER_ADDRESS_${i}`];
      if (pauserAddress && pauserAddress !== "0x0000000000000000000000000000000000000000") {
        console.log(`- Pauser ${i}:`, pauserAddress);
        // 注意: AstralCompatibility 合约需要添加配置暂停器的函数
      }
    }
  }

  // 验证合约
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("\n🔍 准备验证合约...");
    console.log("等待 30 秒后开始验证...");
    await new Promise(resolve => setTimeout(resolve, 30000));

    try {
      await hre.run("verify:verify", {
        address: contract.address,
        constructorArguments: [],
      });
      console.log("✅ 合约验证成功!");
    } catch (error) {
      console.log("❌ 合约验证失败:", error.message);
    }
  }

  // 输出配置信息供前端使用
  console.log("\n📋 前端配置信息:");
  console.log("==================================");
  console.log("CONTRACT_ADDRESS:", contract.address);
  console.log("CHAIN_ID: 11155111");
  console.log("NETWORK: Sepolia");
  console.log("==================================\n");

  // 保存部署信息
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
  console.log("💾 部署信息已保存到 deployment-info.json\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 部署失败:", error);
    process.exit(1);
  });
