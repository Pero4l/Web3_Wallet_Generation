import { Wallet, verifyMessage, Mnemonic } from "ethers";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import crypto from "crypto";



// FROM ETHERS JS
function generateWalletFromSeed() {
  const mnemonic = Mnemonic.fromEntropy(
    crypto.getRandomValues(new Uint8Array(16))
  );

  const wallet = Wallet.fromPhrase(mnemonic.phrase);

  return { wallet, mnemonic: mnemonic.phrase };
}

function verifySignature(message, signature) {
  return verifyMessage(message, signature);
}

async function signMessage(wallet, message) {
  return await wallet.signMessage(message);
}

function restoreWalletFromSeed(seedPhrase) {
  return Wallet.fromPhrase(seedPhrase);
}




async function main() {
 
  const rl = readline.createInterface({ input, output });

  const createNewWallet = await rl.question(
    "Do you want to create a new wallet? (yes/no): "
  );

  if (createNewWallet.toLowerCase() !== "yes") {
    console.log("Exiting...");
    rl.close();
    return;
  }else {
    console.log("Creating a new wallet...");
  }

  const createPassword = (await rl.question(
  "Set a password for your wallet: "
)).trim();

if (!createPassword) {
  console.log("Password cannot be empty. Exiting...");
  rl.close();
  return;
}

console.log("Password set successfully.");

const password = createPassword;



  const { wallet, mnemonic } = generateWalletFromSeed();

  const askPassword = (await rl.question(
  "Enter your wallet password: "
)).trim();

if (askPassword !== password) {
  console.log("Incorrect password. Exiting...");
  rl.close();
  return;
}

console.log("Password verified successfully.");


  const message = `Sign-in request
Domain: example.com
Password: ${password}
Nonce: ${crypto.randomUUID()}
Timestamp: ${new Date().toISOString()}`;


  const signature = await signMessage(wallet, message);


  const recoveredAddress = verifySignature(message, signature);

 

  console.log("____________________________________________________________");

  console.log("Seed Phrase:", mnemonic);

  console.log("____________________________________________________________");

  console.log("Wallet Address:", wallet.address);
  console.log("____________________________________________________________");

  console.log("Private Key:", wallet.privateKey);
  console.log("____________________________________________________________");

  const signAMessage = await rl.question(
    "Do you want to sign a message? (yes/no): "
  );

  if (signAMessage.toLowerCase() !== "yes") {
    console.log("Exiting...");
    rl.close();
    return;
    
  } else {
     const askPassword = (await rl.question(
  "Enter your wallet password: "
)).trim();

if (askPassword !== password) {
  console.log("Incorrect password. Exiting...");
  rl.close();
  return;
}

console.log("Password verified successfully.");
  }

  console.log("Message:", message);
  console.log("____________________________________________________________");

   rl.close();
  console.log("Signature:", signature);
  console.log("____________________________________________________________");

  console.log("Recovered Address:", recoveredAddress);
  console.log("____________________________________________________________");
  console.log(
    "Signature valid?",
    recoveredAddress === wallet.address
  );
  console.log("____________________________________________________________");
  

  const restoredWallet = restoreWalletFromSeed(mnemonic);

  console.log(
    "Restored wallet matches?",
    restoredWallet.address === wallet.address
  );
  console.log("____________________________________________________________");
}

main();
