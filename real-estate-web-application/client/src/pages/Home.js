import React, { useState } from "react";
import Banner from "../components/home/Banner";
import PropertiesCarousel from "../components/home/PropertiesCarousel";
import WhyChooseUs from "../components/home/WhyChooseUs";
import OurProperties from "../components/home/OurProperties";
import Footer from "../components/Footer";
import { operations, properties } from "./searchInfo";

const Home = () => {
  const [data, setData] = useState({
    operation: 2,
    property: [properties[0]],
    location: [],
    title: "",
    advancedSearch: {
      rooms: "",
      bedrooms: "",
      bathrooms: "",
      garages: "",
      surface: {
        min: "",
        max: "",
      },
      price: {
        min: "",
        max: "",
      },
      extras: [],
    },
  });
  const operation = operations.find((oper) => oper.value === data.operation);

  return (
    <>
      <div className="wrapper">
        <Banner data={data} setData={setData}/>
        {/* <PropertiesCarousel/> */}
        <WhyChooseUs />
        <OurProperties operation={operation?.label.toLocaleLowerCase()}/>
        <Footer />
      </div>
    </>
  );
};

export default Home;
