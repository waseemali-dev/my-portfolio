import { Logo } from "./Logo";

interface FooterProps {
  portfolio: any;
}

export function Footer({ portfolio }: FooterProps) {
  const footer = portfolio.footer || { copyrightText: `© ${new Date().getFullYear()} ${portfolio.hero?.name || "Waseem Ali"}. All rights reserved.`, links: [] };

  return (
    <footer className="bg-slate-900 text-white dark:bg-slate-950 border-t border-slate-800 py-8 text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Copyright Area */}
        <div className="text-center flex flex-col sm:flex-row justify-center items-center gap-4 text-xs text-slate-500 font-mono">
          <p>{footer.copyrightText}</p>
          {footer.links.map((link: any) => (
            <a key={link.label} href={link.url} className="hover:text-cyan-400">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
