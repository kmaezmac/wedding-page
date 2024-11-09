import React from 'react'

const Header = () => {
  return (
    // <header className='flex justify-center bg-red-100 p-6 relative h-screen'>
    //         <div className='flex justify-center'>
    //       {/* <Image src={background} alt='' width={500} height={500} /> */}
    //     </div>
    // </header>

      <header className="text-center py-12 bg-[#fff7f0] shadow-lg">
        <h1 className="text-5xl font-serif text-[#b56576]">結婚式へようこそ</h1>
        <p className="text-xl text-[#7d5a50] mt-4">
          私たちの特別な日にご参加ください
        </p>
      </header>
  )
}

export default Header