import React from 'react'
import { useMetamask } from "@thirdweb-dev/react";

function Login() {
  const connectWithMetamask = useMetamask();
  return (
    <div className='bg-[#091b18] min-h-screen flex fle-col items-center justify-center text-center'>
      <div className="flex flex-col items-center mb-10">
        <img className="rounded-full h-56 w-56 mb-10"
        src="https://i.pinimg.com/564x/01/97/01/0197014b01d3a753fc7d0f32bc1d7b03.jpg" 
        alt="" />
        <h1 className="text-6xl text-white font-bold">The Golden Clover Lottery</h1>
        <h2 className="text-white">Get started by logging in with Metamask</h2>

        <button onClick={connectWithMetamask}className="bg-white px-8 py-5 mt-10 rounded-lg shadow-lg font-bold">Login with Metamask</button>
      </div>
    </div>
  )
}

export default Login