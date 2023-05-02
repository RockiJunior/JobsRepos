import React from "react";
import Footer from "../components/Footer";
import Banner from "../components/home/Banner";
import WhyChooseUs from "../components/home/WhyChooseUs";
import PropertiesCarousel from "../components/home/PropertiesCarousel";
import OurProperties from "../components/home/OurProperties";
import { useEffect } from "react";

const Home = () => {
  // * Life Cycle
  useEffect(() => window.scrollTo({ top: 0 }));

  return (
    <>
      <div className="wrapper">
        <Banner />
        <PropertiesCarousel />
        <WhyChooseUs />
        <OurProperties />
        <Footer />
      </div>
    </>
  );
};

export default Home;
