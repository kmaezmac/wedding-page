import React from 'react'
// import Header from './components/header'
import Main from './components/main'
// import Footer from './components/footer'
import Head from 'next/head'


const page = () => {
  return (
    <>
        <div className="bg-[url('./components/background.jpeg')] min-h-screen w-full bg-cover bg-center bg-no-repeat relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 py-6 relative z-10">
        <Head>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex, nocache" />
        <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="bingbot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        </Head>
        {/* <Header/> */}
        <Main/>
        {/* <Footer/> */}
        </div>
        </div>
    </>

  )
}

export default page