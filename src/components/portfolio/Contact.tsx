import { FormEvent } from "react";
import { Mail, Smartphone, CheckCircle2, Award, ChevronDown, RefreshCw, Send } from "lucide-react";

interface ContactProps {
  portfolio: any;
  formState: {
    name: string;
    email: string;
    projectType: string;
    budget: string;
    message: string;
  };
  setFormState: (val: any) => void;
  isSubmitted: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  handleContactSubmit: (e: FormEvent) => void;
}

export function Contact({
  portfolio,
  formState,
  setFormState,
  isSubmitted,
  isSubmitting,
  submitError,
  handleContactSubmit
}: ContactProps) {
  return (
    <section id="contact" className="py-20 md:py-28 bg-transparent relative overflow-hidden">
      
      {/* Absolute Background Decoration */}
      <div className="absolute top-[30%] left-[5%] w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/20 dark:border-cyan-500/10 text-cyan-500 dark:text-cyan-400 font-mono text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
            <span>{portfolio.contact?.badge || "10 • Let's Connect"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {portfolio.contact?.heading || "Initiate a Digital Collaboration"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
            {portfolio.contact?.description || "Submit the form below, and let's craft modern web solutions matching your goals."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Info Panel */}
          <div className="lg:col-span-5 space-y-8 text-left" id="contact-info">
            
            <div className="p-6 sm:p-8 rounded-2xl bg-white/5 dark:bg-slate-900/20 backdrop-blur-md border border-slate-200/30 dark:border-slate-800/60 shadow-[0_0_15px_rgba(6,182,212,0.03)] space-y-6">
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100/10 dark:border-slate-800/50">
                Direct Contact Particulars
              </h3>

              <div className="space-y-5">
                
                {/* Email */}
                <a 
                  href={`mailto:${portfolio.contact?.email || "waseemali1031@gmail.com"}`}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors group"
                >
                  <div className="p-3 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/5 text-cyan-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">Email Address</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors truncate max-w-[200px] sm:max-w-[280px]">
                      {portfolio.contact?.email || "waseemali1031@gmail.com"}
                    </p>
                  </div>
                </a>

                {/* Phone */}
                <a 
                  href={`tel:${(portfolio.contact?.phone || "+923048687455").replace(/\s+/g, "")}`}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors group"
                >
                  <div className="p-3 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/5 text-cyan-500">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">Call / Whatsapp</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                      {portfolio.contact?.phone || "+92 304 8687455"}
                    </p>
                  </div>
                </a>

                {/* Availability */}
                <div className="flex items-center gap-4 p-3 rounded-xl">
                  <div className="p-3 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/5 text-cyan-500">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">Current Status</p>
                    <p className="text-sm font-bold text-cyan-500 dark:text-cyan-400">
                      Open for Freelance Projects
                    </p>
                  </div>
                </div>

              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-start gap-3">
                {[
                  { label: "LinkedIn", href: portfolio.socialLinks?.linkedin, imgUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png", imgClass: "object-contain rounded" },
                  { label: "Upwork", href: portfolio.socialLinks?.upwork, imgUrl: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/upwork-icon.png", imgClass: "object-contain rounded-full" },
                  { label: "Fiverr", href: portfolio.socialLinks?.fiverr, imgUrl: "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png", imgClass: "object-contain rounded-full" },
                  { label: "GitHub", href: portfolio.socialLinks?.github, imgUrl: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/github-icon.png", imgClass: "object-contain rounded-full dark:invert" }
                ].filter(soc => soc.href).map((soc) => (
                  <a
                    key={soc.label}
                    href={soc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-800 flex items-center justify-center w-10 h-10"
                    aria-label={soc.label}
                  >
                    <img
                      src={soc.imgUrl}
                      alt={soc.label}
                      className={`w-5 h-5 ${soc.imgClass}`}
                      referrerPolicy="no-referrer"
                    />
                  </a>
                ))}
              </div>

            </div>

            {/* Trust Badge Column Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-tr from-cyan-500/10 to-fuchsia-500/10 border border-cyan-500/30 dark:border-cyan-500/20 bg-white/5 dark:bg-slate-900/10 backdrop-blur-md space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan-500" />
                Satisfaction Guarantee
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                I believe in transparent collaboration, clean development, and regular progress updates. I ensure your project is implemented accurately, matches the requirements, and is thoroughly tested before delivery.
              </p>
            </div>

          </div>

          {/* Right Contact Form Column */}
          <div className="lg:col-span-7" id="contact-form-container">
            
            {!isSubmitted ? (
              <form
                onSubmit={handleContactSubmit}
                className="p-6 sm:p-8 rounded-2xl bg-white/5 dark:bg-slate-900/20 backdrop-blur-md border border-slate-200/30 dark:border-slate-800/60 shadow-[0_0_15px_rgba(6,182,212,0.03)] space-y-6 text-left"
              >
                <h3 className="text-xl font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100/10 dark:border-slate-800/50">
                  Send a Direct Inquiry
                </h3>

                {submitError && (
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">
                    <p className="font-semibold">Submission Error</p>
                    <p className="text-xs mt-1">{submitError}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="form-name" className="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wider">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="form-name"
                      required
                      placeholder="Gabriel Marguglio"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="form-email" className="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="form-email"
                      required
                      placeholder="client@agency.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Project Type */}
                  <div className="space-y-1.5 relative">
                    <label htmlFor="form-project-type" className="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wider block">
                      Project Type
                    </label>
                    <div className="relative">
                      <select
                        id="form-project-type"
                        className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 cursor-pointer appearance-none text-slate-900 dark:text-white"
                        value={formState.projectType}
                        onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                      >
                        <option>HubSpot CMS Development</option>
                        <option>Landing Page Optimization</option>
                        <option>Website Migration / Redesign</option>
                        <option>WordPress / ACF Blocks</option>
                        <option>Email Builder templates</option>
                        <option>Other Custom Front-End Fix</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 dark:text-slate-400">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Budget Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="form-budget" className="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wider block">
                      Approximate Budget
                    </label>
                    <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus-within:ring-2 focus-within:ring-cyan-500 dark:focus-within:ring-cyan-400 transition-all duration-200">
                      <input
                        type="text"
                        id="form-budget"
                        placeholder="e.g. $2,500"
                        className="w-full pl-4 pr-20 py-3 bg-transparent text-sm focus:outline-none text-slate-900 dark:text-white"
                        value={formState.budget}
                        onChange={(e) => setFormState({ ...formState, budget: e.target.value })}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-200/50 dark:bg-slate-900 px-2 py-0.5 rounded-md">
                          Est.
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      Rough estimate or budget range for matching resources.
                    </p>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="form-message" className="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wider">
                    Project Details / Message
                  </label>
                  <textarea
                    id="form-message"
                    required
                    rows={4}
                    placeholder="Share high-level requirements, timeline, or current website/Figma URL links..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 text-slate-900 dark:text-white"
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center sm:justify-start w-full">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full max-w-[220px] py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-bold hover:from-cyan-600 hover:to-fuchsia-600 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            ) : (
              <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/50 shadow-md text-center space-y-6">
                <div className="p-4 rounded-full bg-cyan-500/10 text-cyan-500 w-fit mx-auto">
                  <CheckCircle2 className="w-16 h-16" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Submission Received!
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto text-base leading-relaxed">
                    Thank you, <strong className="text-slate-900 dark:text-white">{formState.name}</strong> Your inquiry was successfully submitted, we will reachout to you shortly.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
