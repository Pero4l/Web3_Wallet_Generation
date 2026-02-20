import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// Create provider
const provider = new ethers.InfuraProvider(
  "mainnet",
  process.env.INFURA_API_KEY
);

// Create random wallet
const wallet = ethers.Wallet.createRandom();
const newWallet = wallet.address;

// File name
const FILE = "address.json";


// Load existing wallets
function loadFile() {
  if (fs.existsSync(FILE)) {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  }
  return [];
}


// Push wallet to file
function push(address, balance) {
  const data = loadFile();

  const record = {
    address: address,
    balance: balance,
    timestamp: new Date().toISOString(),
  };

  data.push(record);

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

  console.log("Saved to file:", address);
}


// Balance check function
const balanceCheck = async (address) => {
  try {

    const balance = await provider.getBalance(address);

    const balanceEth = ethers.formatEther(balance);

    
    if (balance === 0n) {
      console.log("Balance is zero.");
    } else {

      console.log("Balance:", balanceEth, "ETH");

      push(address, balanceEth);
    }

    console.log("WALLET ADDRESS:", address);

  } catch (error) {
    console.error("Error checking balance:", error.message);
  }
  
  setInterval(() => balanceCheck(address), 1000);
};


// Run
balanceCheck(newWallet);