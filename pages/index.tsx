import type { NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/Header';
import Login from '../components/Login';
import Loading from '../components/Loading';
import CountdownTimer from '../components/CountdownTimer';
import AdminControls from '../components/AdminControls';
import toast from 'react-hot-toast';
import React, { useEffect } from 'react';
import Marquee from "react-fast-marquee";
import { useState } from 'react';
import { ethers } from "ethers";
import { currency } from '../constants';
import {
  useContract,
  useMetamask,
  useDisconnect,
  useAddress,
  useContractData,
  useContractCall,
} from "@thirdweb-dev/react";

const Home: NextPage = () => {
  const address = useAddress();
  const [userTickets, setUserTickets] = useState(0);
  const [quantity, setQuantity] =useState<number>(1);
  const { contract, isLoading } = useContract(
    process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
  );

  const { data: remainingTickets } = useContractData(
    contract,
    "RemainingTickets"
  );
  const { data: currentWinningReward } = useContractData(
    contract,
    "CurrentWinningReward"
  );
  const { data: ticketPrice } = useContractData(
    contract,
    "ticketPrice"
  );
  const { data: ticketCommission } = useContractData(
    contract,
    "ticketCommission"
  );
  const { data: expiration } = useContractData(
    contract,
    "expiration"
  );

  const { data: isLotteryOperator } = useContractData(contract, "lotteryOperator");

  const { data: lastWinner } = useContractData(contract, "lastWinner");

  const { data: lastWinnerAmount } = useContractData(contract, "lastWinnerAmount");

  const { data: tickets } = useContractData(contract, "getTickets");

  const { mutateAsync: BuyTickets } = useContractCall(contract, "BuyTickets");

  const { data: winnings } = useContractData(
    contract,
    "getWinningsForAddress",
    address
  );

  const { mutateAsync: WithdrawWinnings } = useContractCall(
    contract, 
    "WithdrawWinnings"
  );

  useEffect(() => {
    if(!tickets) return

    const totalTickets: string[] = tickets;

    const noOfUserTickets = totalTickets.reduce((total, ticketAddress) => (ticketAddress === address? total + 1 : 
      total),
      0
    );

    setUserTickets(noOfUserTickets);
  }, [tickets, address])
  

  const handleClick = async () => {
    if (!ticketPrice) return;

    const notification = toast.loading("Buying your tickets...");

    try {
      const data = await BuyTickets([
        {
          value: ethers.utils.parseEther(
            (
              Number(ethers.utils.formatEther(ticketPrice)) * quantity
            ).toString()
          ),
        },
      ]);

      toast.success("Tickets purchased successfully!", {
        id:  notification,
      });

      console.info("contract call success", data);
    } catch (err) {
      toast.error("Whoops something went wrong.", {
        id: notification,
      });
      console.error("contract call failure", err);
    }
  };

  const onWithdrawWinnings = async () => {
    const notification = toast.loading("withdrawing winnings...");

    try{

      const data = await WithdrawWinnings([{}]);

      toast.success("Winnings withdrawn successfully.", {
        id: notification,
      });

    } catch(err){
      toast.error("Whoops something went wrong.",{
        id: notification,
      });

      console.error("contract call failure", err);
    }
  }

  /*
  if (isLoading) return <Loading />;
  if (!address) return <Login />;

  */

  return (
    <div className="bg-[#091818] min-h-screen flex flex-col">
      <Head>
        <title>Golden Clover Lottery</title>
      </Head>

      <div className="flex flex-col justify-between items-center">
        <Header />
        <Marquee className="bg-[#0a1f1c]  p-5 mb-5" gradient={false} speed={100}>
          <div className="flex space-x-2 mx-10" >
            <h4 className="text-white font-bold" >Last winner: {lastWinner?.toString()} {" "}</h4>
            <h4 className="text-white font-bold" >Last winning: {" "} {lastWinnerAmount && ethers.utils.formatEther(lastWinnerAmount?.toString())} {" "} {currency} </h4>
          </div>
        </Marquee>

        {isLotteryOperator === address && (
          <div className="flex justify-center" >
            <AdminControls />
          </div>
        )}

        {winnings > 0 && (
          <div className="mx-w-md md:mx-w-4xl lg:mx-w-6xl mx-auto mt-5 flex flex-1">
            <button onClick={onWithdrawWinnings} className="p-5 bg-gradient-to-b from-orange-500 to-emerald-600 animate-pulse text-center rounded-xl w-full">
              <p className="text-white text-xl font-bold animate-bounce ">Winner Winner Chicken Dinner!</p>
              <p className="text-white font-semibold">Total winnings:{ethers.utils.formatEther(winnings.toString())} {""} {currency}</p>
              <br />
              <p className="text-white font-semibold">Click here to withdraw</p>
            </button>
          </div>
        )}

        {/* The Next Draw box */}
        <div className="space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5 max-w-6xl">
          <div className="stats-container">
            <h1 className="text=5xl text-white font-semibold text-center">The Next Draw</h1>
            <div className="flex justify-between p-2 space-x-2">
              <div className="stats">
                <h2 className="text-sm">Total pool</h2>
                <p className="text-xl">
                  {currentWinningReward && ethers.utils.formatEther(currentWinningReward.toString())}{" "}
                  {currency}
                </p>
              </div>
              <div className="stats">
                <h2 className="text-sm">Tickets remaining</h2>
                <p className="text-xl">{remainingTickets?.toNumber()}</p>
              </div>
            </div>

            {/* Countdown timer */}
            <div className="mt-5 mb-3">
              <CountdownTimer />
            </div>
          </div>

          <div className="stats-container space-y-2">
            <div className="stats-container">
              <div className="flex justify-between items-center text-white">
                <h2>Price per ticket</h2>
                <p>
                  {ticketPrice && 
                    ethers.utils.formatEther(ticketPrice.toString())}{" "}
                  {currency}
                </p>
              </div>

              <div className="flex text-white items-center space-x-2  bg-[#091b18] border-[#004337] border p-4">
                <p>TICKETS</p>
                <input className="flex w-full bg-transparent text-right outline-none" type="number"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}            
                />
              </div>

              <div className="space-y-2 mt-5">
                <div className="flex items-center justify-between text-emerald-300 text-sm italic font-extrabold">
                  <p>Total cost of tickets</p>
                  <p>
                    {ticketPrice && Number(ethers.utils.formatEther(ticketPrice.toString())) * quantity}{" "}
                    {currency}
                  </p>
                </div>

                <div className="flex items-center justify-between text-emerald-300 text-xs italic">
                  <p>Service fees</p>
                  <p>
                  {ticketCommission && 
                    ethers.utils.formatEther(ticketCommission.toString())}{" "}
                  {currency}
                  </p>
                </div>

                <div className="flex items-center justify-between text-emerald-300 text-xs italic">
                  <p>Network fees</p>
                  <p>TBC</p>
                </div>
              </div>

              <button
              disabled={expiration?.toString() < Date.now().toString() || remainingTickets?.toNumber() === 0
              }
              onClick={handleClick}
              className="mt-5 w-full bg-gradient-to-br from-orange-500 to-emerald-600 px-10 py-5 rounded-md 
              text-white shadow-xl disabled:from-gray-600 disabled:text-gray-100 disabled:to-gray-100 disabled:cursor-not-allowed font-bold">
                Buy {quantity} ticket for {ticketPrice && Number(ethers.utils.formatEther(ticketPrice.toString
                ())) * quantity} {" "} {currency}
              </button>
            </div>
            
            {userTickets > 0 && (
              <div className="stats">
                <p className=" text-lg font-bold mb-2">You have {userTickets} Tickets in draw</p> 
                <div className="flex max-w-sm flex-wrap gap-x-2 gap-y-2 ">
                  {Array(userTickets)
                    .fill("")
                    .map((_, index) => (
                      <p key={index} className="text-emerald-300 h-20 w-12 bg-emerald-500/30 rounded-lg flex flex-shrink-0 items-center justify-center text-xs italic">
                        {index + 1}</p>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* The price per ticket box */}
        <div>
          <div>
            <h2></h2>
          </div>
        </div>
      </div>
      <footer className="border-t border-emerald-500/20 flex flex-col items-center text-white justify-between p-6">
        <p className="text-xs text-emerald-900 pl-5">
          DISCLAIMER: Play at your own risk. Do not gamble with more money than you are willing to lose. Pay off your loans first, plan ahead and save up! We are not liable for any financial loss.</p>
        <p className="text-xs text-emerald-600 font-bold pl-5"> 
          FORTUNE FAVOURS THE BOLD.</p>
      </footer>
    </div>
  );
};

export default Home
