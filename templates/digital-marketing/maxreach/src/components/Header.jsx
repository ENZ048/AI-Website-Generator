import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import * as FiIcons from "react-icons/fi";

// Keep your current import so the standalone app still works:
import { header as fallbackHeader } from "../data/siteContent";

function NavLink({ children }) {
  return (
    <a
      href="#"
      className="px-3 py-2 text-sm leading-6 text-white/80 hover:text-white"
    >
      {children}
    </a>
  );
}

/**
 * New: accepts a `data` prop.
 * If not provided, falls back to the imported `header` from siteContent.js
 */
export default function Header({ data }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const d = data || fallbackHeader; // ← key line: prop first, fallback second

  const toggleMenu = () => setIsMenuOpen((v) => !v);

  // Resolve icon safely
  const LogoIcon =
    (d?.logo && FiIcons[d.logo]) || FiIcons.FiZap; // fallback icon if name missing

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-custom-br flex h-8 w-8 items-center justify-center rounded">
              <LogoIcon className="text-lg text-white" />
            </div>
            <span className="font-display text-lg tracking-wide text-white">
              {d?.companyName || "Company"}
            </span>
          </div>

          <nav className="hidden items-center md:flex">
            {["Home", "About", "Services", "Pricing", "Contact"].map((item) => (
              <NavLink key={item}>{item}</NavLink>
            ))}
          </nav>

          <div className="hidden items-center md:flex">
            <button className="bg-gradient-custom rounded-full px-4 py-2 text-sm font-medium leading-6 text-white">
              Get Started
            </button>
          </div>

          <button
            className="p-2 md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FiX className="text-white/90" />
            ) : (
              <FiMenu className="text-white/90" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="bg-black/60 border-t border-white/10 md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <div className="grid gap-2">
              {["Home", "Services", "Pricing", "About", "Contact"].map(
                (item) => (
                  <a key={item} className="py-2 text-white/80" href="#">
                    {item}
                  </a>
                )
              )}
              <button className="bg-gradient-custom mt-2 rounded-full px-4 py-2 text-sm font-medium leading-6 text-white">
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
