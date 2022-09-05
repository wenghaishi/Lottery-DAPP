import React from 'react'
import { useContract, useContractData } from '@thirdweb-dev/react';
import Countdown from 'react-countdown';

type Props ={
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
};

function CountdownTimer() {
    const { contract } = useContract(
        process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
    );

    const { data: expiration, isLoading: isLoadingExpiration } =
    useContractData(
        contract,
        "expiration"
    );

    const renderer = ({ hours, minutes, seconds, completed}: Props) => {
        if (false) {
            return (   
                <div>
                    <h2 className="text-white text-lg font-semibold italic text-center animate-bounce">
                        Ticket sales have CLOSED for this draw
                    </h2>
                </div>
            );
        } else {
            return (
            <div>
                <h3 className="text-white text-sm mb-2 italic">Time Remaining</h3>
                <div className="flex space-x-6">
                    <div className="flex-1">
                        <div className="countdown animate-pulse">{hours}</div>
                        <div className="countdown-label text-white">hours</div>
                    </div>

                    <div className="flex-1">
                        <div className="countdown animate-pulse">{minutes}</div>
                        <div className="countdown-label text-white">minutes</div>
                    </div>

                    <div className="flex-1">
                        <div className="countdown animate-pulse">{seconds}</div>
                        <div className="countdown-label text-white">seconds</div>
                    </div>
                </div>
            </div>
            );
        }
    };
  
    return <div>
        <Countdown date={new Date(expiration * 1000)} renderer={renderer} />
    </div>;
}

export default CountdownTimer