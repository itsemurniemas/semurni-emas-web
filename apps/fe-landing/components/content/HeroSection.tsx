"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import heroImage from "@/assets/hero-image.webp";

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative w-full h-[80vh] overflow-hidden">
      {/* Parallax Background */}
      <div
        className="absolute inset-0 w-full h-[130%]"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <Image
          src={heroImage}
          alt="Koleksi perhiasan emas mewah Semurni Emas"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <h1 className="text-4xl md:text-6xl font-light text-white mb-4 tracking-wide">
          Semurni Emas
        </h1>
        <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl">
          Toko Emas & Logam Mulia Terpercaya
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
