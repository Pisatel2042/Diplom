import { Box } from "@chakra-ui/react";
import Section from "./components/ui/Section";
import './App.css'

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import About from "./components/About";
import Programs from "./components/Programs";
import Review from "./components/Review";
import FAQ from "./components/FAQ";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import ServicesMarquee from "./components/ServicesMarquee";

function App() {
  return (
    <Box bg="#f8f9fb" color="#2d2d3a" minH="100vh">

      <Section pb={12}>
      <Box maxW="6xl" mx="auto" px={6} position="relative">
        <Navbar/>
      </Box>
      </Section>

      <Section pt={100} pb={0}>
        <Box maxW="6xl" mx="auto" px={6}>
          <Hero/>
        </Box>
      </Section>

      <Section  pt={0} pb={0}>
        <Box maxW="6xl" mx="auto" px={6}>
          <Stats />
        </Box>
      </Section>

      <Section pt={0} pb={20}>
        <Box maxW="6xl" mx="auto" px={6} id="about">
          <About />
        </Box>
      </Section>

      <Section pt={20} pb={20}>
        <Box maxW="6xl" mx="auto" px={6} id="programs">
          <Programs />
        </Box>
      </Section>
        <Section pt={20} pb={20} >
          <Box maxW="6xl" mx="auto" px={6}  id="schedule">
            <ServicesMarquee />
          </Box>
        </Section>
      
      <Section pt={20} pb={20}>
        <Box maxW="6xl" mx="auto" px={6}>
          <Review/>
        </Box>
      </Section>
      <Section>
        <Box maxW="6xl" mx="auto" px={6}>
          <FAQ />
        </Box>
      </Section>
      <Section pt={20} pb={10}>
        <Box maxW="6xl" mx="auto" px={6}>
          <CTA />
        </Box>
      </Section >
     
        <Footer />
     
    </Box>
  );
}

export default App
