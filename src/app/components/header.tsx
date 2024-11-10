// Header.js
'use client'
import React from 'react'
import { useState } from 'react';

const Header = () => {
  const [groomName] = useState(process.env.NEXT_PUBLIC_GROOM_NAME || '');
  const [brideName] = useState(process.env.NEXT_PUBLIC_BRIDE_NAME || '');
  return (
      <header className="text-center py-12 bg-[#fff7f0] shadow-lg opacity-85" >
        <h1 className="text-5xl font-serif text-[#b56576]">Wedding Website</h1>
        <p className="text-xl text-[#7d5a50] mt-4">
          {groomName} & {brideName}
        </p>
      </header>
  )
}

export default Header
