import React from 'react'
// import Header from './components/header'
import Main from './components/main'
// import Footer from './components/footer'
import Head from 'next/head'


const page = () => {
  return (
    <>
        <div className="bg-[url('./components/background.jpeg')] w-full  bg-cover bg-center bg-no-repeat">
        <div className="container mx-auto px-4 py-6">
        <Head>
        <meta name="robots" content="noindex" />
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