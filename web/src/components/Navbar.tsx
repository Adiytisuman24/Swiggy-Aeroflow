"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Brain, ShoppingCart, LayoutDashboard, Layers } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: "/intelligence", label: "Intelligence", icon: <Brain className="w-4 h-4" /> },
  { href: "/cart", label: "Living Cart", icon: <ShoppingCart className="w-4 h-4" /> },
  { href: "/ecosystem", label: "Ecosystem", icon: <Layers className="w-4 h-4" /> },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(252,128,25,0.4)]">
            <Zap className="text-black w-6 h-6 fill-current" />
          </div>
          <span className="text-2xl font-heading font-bold tracking-tight">
            Aero<span className="text-primary">flow</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                pathname === link.href
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/intelligence"
          className="px-6 py-2.5 bg-primary text-black font-bold rounded-full hover:shadow-[0_0_25px_rgba(252,128,25,0.5)] transition-all transform hover:scale-105"
        >
          Launch Portal
        </Link>
      </div>
    </nav>
  );
}
