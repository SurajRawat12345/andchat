import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/footer'
import Landing from '../components/LandingSection'
import About from '../components/About'
import MobileShowcase from '../components/MobileShowcase'

const Home = () => {
  return (
    <div>
        <Navbar />
        <Landing />
        <MobileShowcase />
        <About />
        <Footer />
    </div>
  )
}

export default Home
