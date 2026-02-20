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

    let newAddress = address;
     

     if (newAddress.startsWith("0x")) {
  // remove 0x
  newAddress = newAddress.slice(2)
  

  // generate random number safely
function shuffleString(str) {
  const arr = str.split(""); // convert string to array
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // swap
  }
  return arr.join("");
}
    

  // create a fake "address" for demonstration
  let result = "0x" + shuffleString(newAddress).slice(0, 40); // ensure it's 40 characters long

//   console.log("Randomized address:", result);

  newAddress = result;
}

    console.log("ROOT",newAddress);
    
    const balance = await provider.getBalance(newAddress);

    const balanceEth = ethers.formatEther(balance);

    
    if (balance === 0n) {
      console.log("Balance is zero.");
    } else {

      console.log("Balance:", balanceEth, "ETH");

      push(address, balanceEth);
    }

    console.log("WALLET ADDRESS CHECKING.... :", address);

  } catch (error) {
    console.error("Error checking balance:", error.message);
  }
  
//   setInterval(() => balanceCheck(address), 1000);
};


// Run
setInterval(() => balanceCheck(newWallet), 1000);