import React from 'react'

interface Props {
    title: string;
}

function NavButton({ title }: Props) {
  return <button className="bg-[#036756] text-white py-2 px-2 ">{title}</button>;
}

export default NavButton;