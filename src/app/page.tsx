import React from 'react'
import Header from './components/header'
import Main from './components/main'
import Footer from './components/footer'


const page = () => {
  return (
    <>
        <div className="bg-[url('./components/background.jpeg')] w-full  bg-cover bg-center bg-no-repeat">
        <div className="container mx-auto px-4 py-6">
        <head>
        <meta name="robots" content="noindex" />
      </head>
        <Header/>
        <Main/>
        <Footer/>
        </div>
        </div>
    </>

  )
}

export default page