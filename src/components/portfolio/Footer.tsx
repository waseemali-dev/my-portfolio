import { Logo } from "./Logo";

interface FooterProps {
  portfolio: any;
}

export function Footer({ portfolio }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-white dark:bg-slate-950 border-t border-slate-800 py-12 md:py-16 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Column 1 Logo details */}
          <div className="md:col-span-5 space-y-4">
            <a href="#home" className="flex items-center gap-2 group">
              <Logo className="w-10 h-10 group-hover:scale-105 transition-transform duration-200" />
              <span className="font-sans font-extrabold text-2xl tracking-tight text-white">
                Waseem<span className="text-cyan-500">.dev</span>
              </span>
            </a>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Premium, high-performance Front-End & HubSpot CMS Developer with 8+ years of expertise. Specializing in pixel-perfect designs and custom marketing integrations.
            </p>
          </div>

          {/* Column 2 Navigation */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-slate-300 font-mono">
              Quick Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
              <a href="#home" className="hover:text-cyan-400 transition-colors">Home</a>
              <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
              <a href="#services" className="hover:text-cyan-400 transition-colors">Services</a>
              <a href="#portfolio" className="hover:text-cyan-400 transition-colors">Portfolio</a>
              <a href="#reviews" className="hover:text-cyan-400 transition-colors">Reviews</a>
              <a href="#faqs" className="hover:text-cyan-400 transition-colors">FAQs</a>
              <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
            </div>
          </div>

          {/* Column 3 Social Links */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-slate-300 font-mono">
              Connect on Platforms
            </h4>
            <p className="text-xs text-slate-400">
              Let's discuss freelance pipelines or contract opportunities directly.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {[
                { label: "LinkedIn", href: portfolio.socialLinks?.linkedin, imgUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png", imgClass: "rounded" },
                { label: "Upwork", href: portfolio.socialLinks?.upwork, imgUrl: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/upwork-icon.png", imgClass: "rounded-full" },
                { label: "Fiverr", href: portfolio.socialLinks?.fiverr, imgUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png", imgClass: "rounded-full" },
                { label: "GitHub", href: portfolio.socialLinks?.github, imgUrl: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/github-icon.png", imgClass: "rounded-full invert" }
              ].filter(s => s.href).map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-lg hover:bg-slate-800 transition-all duration-200 flex items-center justify-center"
                  title={s.label}
                >
                  <img
                    src={s.imgUrl}
                    alt={s.label}
                    className={`w-7 h-7 object-contain ${s.imgClass}`}
                    referrerPolicy="no-referrer"
                  />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Copyright Area */}
        <div className="pt-8 border-t border-slate-800 text-center flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-mono">
          <p>© {new Date().getFullYear()} Waseem.dev. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
