import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const provider = new ethers.InfuraProvider(
  "mainnet",
  process.env.INFURA_API_KEY
);

