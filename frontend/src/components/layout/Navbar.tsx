"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/useAuth";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "SHOP", href: "/products" },
    { name: "LOOKBOOK", href: "/lookbook" },
    { name: "CONTACT", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
          isScrolled ? "bg-surface border-b border-primary" : "bg-transparent"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 md:px-8">
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 -ml-2 text-on-surface"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="font-anton text-2xl tracking-widest uppercase">
            MANNABW
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-inter text-sm font-bold tracking-widest uppercase">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative group ${
                  pathname === link.href ? "text-primary" : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300 ${
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {!isLoading && user ? (
              <Link href="/complete-profile" className="relative p-2 -mr-2 text-on-surface">
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <Link href="/login" className="hidden md:block font-inter text-sm font-bold tracking-widest uppercase text-on-surface-variant hover:text-primary">
                LOGIN
              </Link>
            )}
            <Link href="/checkout" className="relative p-2 -mr-2 text-on-surface">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center bg-primary text-on-primary text-[10px] font-bold">
                0
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col bg-surface border-r border-primary w-full max-w-sm"
          >
            <div className="flex h-16 items-center justify-between px-4 border-b border-primary">
              <Link href="/" className="font-anton text-2xl tracking-widest uppercase" onClick={() => setIsMobileMenuOpen(false)}>
                MANNABW
              </Link>
              <button
                className="p-2 -mr-2 text-on-surface"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col p-8 gap-8 font-anton text-4xl uppercase">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-on-surface-variant transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              {!isLoading && user ? (
                <Link
                  href="/complete-profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-on-surface-variant transition-colors mt-8 text-2xl"
                >
                  MY PROFILE
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-on-surface-variant transition-colors mt-8 text-2xl"
                >
                  LOGIN
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
