"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const { cart, openDrawer } = useCart();

  const itemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

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
              <div className="relative">
                <button 
                  className="relative p-2 -mr-2 text-on-surface"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  <User className="w-5 h-5" />
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-primary z-50 shadow-lg">
                     <div className="p-4 border-b border-primary text-xs font-bold bg-primary text-on-primary truncate">
                        Halo, {user.name}
                     </div>
                     <Link 
                        href="/profile" 
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="block p-4 border-b border-primary text-xs font-bold uppercase hover:bg-primary hover:text-on-primary transition-colors"
                     >
                       Profil Saya
                     </Link>
                     <Link 
                        href="/orders" 
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="block p-4 border-b border-primary text-xs font-bold uppercase hover:bg-primary hover:text-on-primary transition-colors"
                     >
                       Riwayat Pesanan
                     </Link>
                     <Link 
                        href="/address" 
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="block p-4 border-b border-primary text-xs font-bold uppercase hover:bg-primary hover:text-on-primary transition-colors"
                     >
                       Alamat Pengiriman
                     </Link>
                     <button 
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          logout();
                        }} 
                        className="w-full text-left p-4 text-xs font-bold uppercase hover:bg-primary hover:text-on-primary transition-colors text-red-600"
                     >
                       Logout
                     </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="hidden md:block font-inter text-sm font-bold tracking-widest uppercase text-on-surface-variant hover:text-primary">
                LOGIN
              </Link>
            )}
            <button onClick={openDrawer} className="relative p-2 -mr-2 text-on-surface">
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center bg-primary text-on-primary text-[10px] font-bold">
                    {itemCount}
                  </span>
              )}
            </button>
          </div>
        </div>
      </header>
      
      <CartDrawer />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 flex flex-col bg-surface border-r border-primary w-3/4 max-w-sm shadow-2xl"
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
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="hover:text-on-surface-variant transition-colors mt-8 text-2xl"
                  >
                    PROFIL SAYA
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="hover:text-on-surface-variant transition-colors text-2xl"
                  >
                    RIWAYAT PESANAN
                  </Link>
                  <Link
                    href="/address"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="hover:text-on-surface-variant transition-colors text-2xl"
                  >
                    ALAMAT PENGIRIMAN
                  </Link>
                  <button
                    onClick={() => {
                        setIsMobileMenuOpen(false);
                        logout();
                    }}
                    className="text-left hover:text-red-500 transition-colors text-2xl text-red-600"
                  >
                    LOGOUT
                  </button>
                </>
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
          </>
        )}
      </AnimatePresence>
    </>
  );
}
