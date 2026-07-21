import { Button } from "../common/Button";

interface CTABannerProps {
  portfolio: any;
}

export function CTABanner({ portfolio }: CTABannerProps) {
  const title = portfolio?.contact?.ctaTitle || "Need a Reliable Front-End or HubSpot CMS Developer for your next project?";
  const description = portfolio?.contact?.ctaDescription || "Let's design and engineer high-performance web spaces, optimize PageSpeed, code custom drag-and-drop modules, or migrate your sites smoothly.";

  return (
    <section className="py-24 bg-transparent text-white relative overflow-hidden">
      
      {/* Soft inner glow overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/[0.03] rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
          {(() => {
            const target = "HubSpot CMS Developer";
            if (title.includes(target)) {
              const parts = title.split(target);
              return (
                <>
                  {parts[0]}
                  <span className="inline-block bg-gradient-to-r from-cyan-400 via-cyan-300 to-fuchsia-400 bg-clip-text text-transparent pr-1.5 pb-1">
                    {target}
                  </span>
                  {parts[1]}
                </>
              );
            }
            return title;
          })()}
        </h2>
        <p className="text-slate-300/90 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 w-full">
          <Button
            text="Hire Me Now"
            href="#contact"
            style="primary"
          />
          <Button
            text="Discuss Your Project"
            href="#contact"
            style="secondary"
          />
        </div>
      </div>
    </section>
  );
}
