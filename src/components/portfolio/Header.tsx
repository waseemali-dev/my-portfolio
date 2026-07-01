import { Sun, Moon, Menu, X } from "lucide-react";
import { Logo } from "./Logo";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (val: boolean) => void;
}

export function Header({ darkMode, setDarkMode, isMenuOpen, setIsMenuOpen }: HeaderProps) {
  return (
    <header id="header" className="sticky top-0 z-50 w-full transition-all duration-300 glass-nav shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <a href="#home" id="header-logo" className="flex items-center gap-2 group">
          <Logo className="w-10 h-10 group-hover:scale-105 transition-transform duration-200" />
          <span className="font-sans font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
            Waseem<span className="inline-block bg-gradient-to-r from-cyan-500 to-fuchsia-500 bg-clip-text text-transparent pr-1.5 pb-1">.dev</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {[
            { label: "About", href: "#about" },
            { label: "Services", href: "#services" },
            { label: "Portfolio", href: "#portfolio" },
            { label: "Reviews", href: "#reviews" },
            { label: "FAQs", href: "#faqs" }
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Action Bar */}
        <div className="hidden sm:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            aria-label="Toggle Theme"
            id="theme-toggle"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>

          {/* Hire Me CTA */}
          <a
            href="#contact"
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-white font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
            id="header-cta"
          >
            Hire Me
          </a>
        </div>

        {/* Mobile Actions / Toggle */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 cursor-pointer"
            aria-label="Toggle Theme Mobile"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 cursor-pointer"
            aria-label="Toggle Navigation Menu"
            id="hamburger-btn"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-lg" id="mobile-menu">
          <div className="px-4 pt-2 pb-6 space-y-1 sm:px-6">
            {[
              { label: "About", href: "#about" },
              { label: "Services", href: "#services" },
              { label: "Portfolio", href: "#portfolio" },
              { label: "Reviews", href: "#reviews" },
              { label: "FAQs", href: "#faqs" }
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-3 text-base font-semibold rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-cyan-500 dark:hover:text-cyan-400"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 px-3 flex flex-col items-start gap-3">
              <a
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
                className="w-full max-w-[220px] text-center py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm shadow-xs hover:bg-cyan-400 block"
              >
                Hire Me Now
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
