import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import express from "express";

dotenv.config();

// Create provider
const provider = new ethers.InfuraProvider(
  "mainnet",
  process.env.INFURA_API_KEY,
);


const wallet = ethers.Wallet.createRandom();
const newWallet = wallet.address;


const FILE = "address.json";


function loadFile() {
  if (fs.existsSync(FILE)) {
    try {
      const content = fs.readFileSync(FILE, "utf-8");
      return content.trim() ? JSON.parse(content) : [];
    } catch (error) {
      console.warn("Could not parse JSON file, starting fresh:", error.message);
      return [];
    }
  }
  return [];
}


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

const balanceCheck = async (address) => {
  try {
    let newAddress = address;

    if (newAddress.startsWith("0x")) {
      newAddress = newAddress.slice(2);

      function shuffleString(str) {
        const arr = str.split("");
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join("");
      }

      let result = "0x" + shuffleString(newAddress).slice(0, 40);

      newAddress = result;
    }

    console.log("ROOT TEST ADDRESS", newAddress);
    console.log("-----------------------------------------------------");

    try {
      newAddress = ethers.getAddress(newAddress);
      if (!ethers.isAddress(newAddress)) {
        throw new Error("Invalid address format");
      } else {
        console.log("VALID ADDRESS FORMAT :", newAddress);
      }
    } catch (error) {
      console.error("INVALID ADDRESS FORMAT :", error.message);
      return;
    }

    console.log("-----------------------------------------------------");

    const balance = await provider.getBalance(newAddress);

    const balanceEth = ethers.formatEther(balance);

    if (balance === 0n) {
      console.log("BALANCE IS ZERO.");
    } else {
      console.log("BALANCE:", balanceEth, "ETH");
      push(newAddress, balanceEth);
    }

    console.log("-----------------------------------------------------");

    // console.log("WALLET ADDRESS CHECKING.... :", address);
  } catch (error) {
    console.error("ERROR CHECKING BALANCE:", error.message);
  }

  //   setInterval(() => balanceCheck(address), 1000);
};

setInterval(() => balanceCheck(newWallet), 1000);
