// components/Home/Home.jsx
import React from "react";

import Hero from "../components/Hero";
import BrowseTheRange from "../components/BrowseTheRange";
import OurProducts from "../components/OurProducts";
import RoomsInspiration from "../components/RoomsInspiration";
import FurniroFurniture from "../components/FurniroFurniture";



const Home = () => {
  return (
    <div className="min-h-screen bg-white">
    
      <Hero />
      <BrowseTheRange />
      <OurProducts />
       <RoomsInspiration />
      <FurniroFurniture />
      
    </div>
  );
};

export default Home;