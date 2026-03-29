"use client";

import { useState } from "react";
import Link from "next/link";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Beranda", href: "/" },
    { name: "Cabang", href: "/branches" },
    { name: "Karyawan", href: "/employees" },
    { name: "Katalog", href: "/catalog" },
  ];

  return (
    <nav
      className="relative"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo and Mobile Menu */}
        <div className="flex items-center">
          {/* Mobile hamburger button */}
          <button
            className="lg:hidden p-2 mt-0.5 text-nav-foreground hover:text-nav-hover transition-colors duration-200 mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Buka menu"
          >
            <div className="w-5 h-5 relative">
              <span
                className={`absolute block w-5 h-px bg-current transform transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-45 top-2.5" : "top-1.5"
                }`}
              ></span>
              <span
                className={`absolute block w-5 h-px bg-current transform transition-all duration-300 top-2.5 ${
                  isMobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`absolute block w-5 h-px bg-current transform transition-all duration-300 ${
                  isMobileMenuOpen ? "-rotate-45 top-2.5" : "top-3.5"
                }`}
              ></span>
            </div>
          </button>

          <Link href="/" className="flex items-center gap-2">
            {/* <Image
              src="/logo.webp"
              alt="Semurni Emas Logo"
              width={16}
              height={16}
              className="object-contain"
            /> */}
            <span className="text-xl font-semibold tracking-wide text-foreground">
              SEMURNI EMAS
            </span>
          </Link>
        </div>

        {/* Navigation - Right aligned on desktop */}
        <div className="hidden lg:flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-sm font-light py-6 block"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile navigation menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-nav border-b border-border z-50">
          <div className="px-6 py-8">
            <div className="space-y-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-lg font-light block py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
