import abi from '../utils/BuyMeACoffee.json';
import FroskaABI from '../utils/froska.json';
import { ethers } from "ethers";
import Head from 'next/head'
import Image from 'next/image'
import React, { useEffect, useState } from "react";
import styles from '../styles/Home.module.css';

export default function Home() {
  // Contract Address & ABI
  const contractAddress = "0x230D4867372A07F423D32EF310Bea5c5cA3B5ECE";
  const contractABI = abi.abi;
  const froskaToken = "0x920912668fE3B30F2f286E913a5F3c974e002aEB"
  const froskaABI = FroskaABI.abi;
  
  // Component state
  const [currentAccount, setCurrentAccount] = useState("");
  const [contractBalance, setContractBalance] = useState("");
  const [isVisible, setIisVisible] = useState(false);
  
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");


  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({method: 'eth_accounts'})
      console.log("accounts: ", accounts);
      await getContractBalance()


      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account );
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const connectWallet = async () => {
    try {
      const {ethereum} = window;

      if (!ethereum) {
        console.log("please install MetaMask");
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      setCurrentAccount(accounts[0]);
      await handleVisibility()
      await getContractBalance()
    } catch (error) {
      console.log(error);
    }
  }

  // ==================Approve deposit=================
  const approveDeposit = async () => {
    try {
      const {ethereum} = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();

        const froskaTokenContract = new ethers.Contract(
          froskaToken,
          froskaABI,
          signer
        );

        console.log("approval initieated..")
        const approvalCall = await froskaTokenContract.approve(
          contractAddress,
          ethers.utils.parseEther(amount.toString()),
          // {value: ethers.utils.parseEther(amount.toString())}
        );
        await approvalCall.wait();

        console.log("Amount approver!");

      }
    } catch (error) {
      console.log(error);
    }
  };

// ============= deposit ======================
  const deposit = async () => {
    try {
      const {ethereum} = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const airdropContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
      
        console.log("deposit initieated..")        
        const coffeeTxn = await airdropContract.depositAirdropFunds(
          {value: ethers.utils.parseEther(amount.toString())}
        );

        await coffeeTxn.wait();
        await getContractBalance()

        console.log("Amount deposited!");

        // Clear the form fields.
        setAmount("");
      }
    } catch (error) {
      console.log(error);
    }
  };


  // ========== claim ======================

  const claimAirdropContract = async () => {
    try {
      const {ethereum} = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const airdrop = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const coffeeTxn = await airdrop.claimAirdrop();

        await coffeeTxn.wait();
        await getContractBalance()

        console.log("mined ", coffeeTxn.hash);

        console.log("airdrop claimed!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ============ withdraw ================

  const withdrawBal = async () => {
    try {
      const {ethereum} = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();

        const froskaTokenContract = new ethers.Contract(
          froskaToken,
          froskaABI,
          signer
        );

        console.log("Withdrawl initieated..")
        const Withdrawl = await froskaTokenContract.withdrawRemainingBalance();
        await Withdrawl.wait();

        console.log("Amount approver!");

      }
    } catch (error) {
      console.log(error);
    }
  };

// check balance
const getContractBalance = async()=>{
    
  try{
        const { ethereum } = window;
      if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      console.log("getting the balance of the contract..");
      const signer = provider.getSigner();
      const froska = new ethers.Contract(
        froskaToken,
        froskaABI,
        signer
      );
      const froskaBal = await froska.balanceOf(contractAddress);
      setContractBalance(ethers.utils.formatEther(froskaBal).toString());
      console.log("froskaBal",ethers.utils.formatEther(froskaBal).toString());
    } else {
      console.log("Metamask is not connected");
    }
    
  }catch (error) {
    console.log(error);
  }
}




async function handleVisibility() {
   const { ethereum } = window;
if(ethereum){
  const accounts = await ethereum.request({method: 'eth_accounts'})
   if (accounts.length > 0) {
        const account = accounts[0];
  if(account.slice(-5)=="41c2a"){
    setIisVisible(true)
    console.log("here is true")
    console.log(account.slice(-5)=="41c2a")
  }else{
    setIisVisible(false)
    
  }
     
   }else{
    setIisVisible(false)
     
   }
}else{
    setIisVisible(false)
    
  }
}
 
  useEffect(() => {
    let buyMeACoffee;
    isWalletConnected();
    getContractBalance();
    handleVisibility();
    
  }, []);

  useEffect(()=>{
    async function accountChange(){
      const {ethereum} = window;
      if(ethereum){
      await getContractBalance()
      }
    }

     accountChange();
  },[])

  return (
    <div className='font-globalFont min-h-screen bg-purple-700 pt-16'>
      <Head>
        <title>Buy Galien a Coffee!</title>
        <meta name="description" content="Tipping site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
     
      <div className="max-w-4xl flex flex-col  mx-auto text-gray-100 bg-purple-700  pb-4  rounded-2xl">  
       <div className="flex flex-col md:flex-row m-5 gap-4 ">
          {currentAccount ?(
          <div className="bg-purple-600 p-5 w-full basis-2/6 text-center flex flex-col items-center justify-center rounded-lg gap-4  shadow-lg w-full">
              <img className = "w-24 rounded-full" src="https://lh3.googleusercontent.com/Nm2XUNejwv4dyshcY1hnOGHkO8AXNcj0GDVMYT4qwShDKR83AU6kQh95huvQfEl4yraKz2XWBGaRQ9Lx6P1M5hM-RF4TIVKJG135hg"/>
          
           <h2 className="font-bold text-2xl">Your wallet details</h2>
            <div className="">
              <label className="text-lg font-medium ">Account address</label>
              <p >{currentAccount.slice(0,6)}...{currentAccount.slice(-4)}</p>
              <button className="text-lg font-medium border font-semiblod text-lg px-2 p-1 text-white rounded-2xl">Contract Balance</button>
              <p onClick={()=> getContractBalance()}>{contractBalance} FROSKAS</p>
            </div>
           <button className=" bg-purple-900  font-semiblod text-lg px-3 p-2 text-white rounded-2xl" disabled type="button">
              connected
           </button>
          
         </div>  
    ):(
            <div className="bg-purple-600 p-5 w-full basis-2/6 text-center flex flex-col items-center justify-center rounded-lg gap-6  shadow-lg">
              <img className = "w-20 rounded-full" src="https://lh3.googleusercontent.com/Nm2XUNejwv4dyshcY1hnOGHkO8AXNcj0GDVMYT4qwShDKR83AU6kQh95huvQfEl4yraKz2XWBGaRQ9Lx6P1M5hM-RF4TIVKJG135hg"/>
          
           <h2 className="font-bold text-2xl">Buy Galien Coffee</h2>
            <img className = "w-20" src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/ethereum-eth-icon.png"/>
           <button className="bg-purple-700 font-semiblod text-lg px-3 p-2 text-white rounded-2xl" type="button" onClick={connectWallet}>
              connect your wallet
           </button>
          
         </div>
          )}
     
            <div className="bg-purple-600 shadow-lg w-full basis-4/6 p-4 gap-4 rounded-lg gap-4  shadow-lg flex flex-col items-center justify-center">             
           <h2 className="font-bold text-2xl text-center">Welcome to Buy Galien Coffee</h2>
               <p className='text-center'>Please connect your meta mastk wallet</p>
               <form>
              <input 
                  id="amount"
                  type="number"
                  placeholder="100"
                 className="w-full bg-inherit border p-2  mt-2 rounded-2xl placeholder-white"
                 onChange={(event) => {
                  setAmount(event.target.value);
                }}/>
               <div className='flex justify-between gap-6 py-4'>
               <button className="bg-purple-700 font-semiblod text-medium px-3 p-2 text-white rounded-2xl" type="button"
                  onClick={approveDeposit}>
                 (1) Apprve
              </button>
              <button className="bg-purple-700 font-semiblod text-medium px-3 p-2 text-white rounded-2xl" type="button"
                  onClick={deposit}>
                 (2) deposit
              </button>
               </div>
          </form>
          <div className='flex justify-between gap-6 py-4'>
          <button button className="text-lg font-medium bg-black font-semiblod text-lg px-2 p-1 text-white rounded-2xl" 
            onClick={()=>getContractBalance()}>
              Get Balance
            </button>
            <button button className="text-lg font-medium bg-black font-semiblod text-lg px-2 p-1 text-white rounded-2xl" 
            onClick={claimAirdropContract}>
              claim
            </button>
            <button button className="text-lg font-medium bg-black font-semiblod text-lg px-2 p-1 text-white rounded-2xl" 
            onClick={withdrawBal}>
              Withdraw
            </button>
            
          </div>
            </div>
       
       </div>
 </div>
    </div>
  )
}
