import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const provider = new ethers.InfuraProvider(
  "mainnet",
  process.env.INFURA_API_KEY
);

const wallet = ethers.Wallet.createRandom();

const newWallet = wallet.address;

// console.log("WALLET ADDRESS :", newWallet);


const balanceCheck = async (address) => {
    try {
        
        let accAddress = address;
        const checkAddress =  async () => {
            try {
                const balance = await provider.getBalance(accAddress);
                const balanceEth = ethers.formatEther(balance);
                if (balanceEth === "0.0") {
                    console.log("Balance is zero. Exiting...");
                    return;
                }else{

                console.log("Balance:", balanceEth, "ETH");
                }

            } catch (error) {
                console.error("Error fetching balance:", error);
            }
        };

        await checkAddress();

       console.log("WALLET ADDRESS :", address);

    } catch (error) {
        console.error("Error checking balance:", error);
    }
};

balanceCheck(newWallet);
// const balance = await provider.getBalance(wallet.address);

// const balanceEth = ethers.formatEther(balance);

// console.log("Balance:", balanceEth, "ETH");