import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FAQS } from "../../data";

interface FAQsProps {
  portfolio: any;
}

export function FAQs({ portfolio }: FAQsProps) {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  return (
    <section id="faqs" className="py-20 md:py-28 bg-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/20 dark:border-cyan-500/10 text-cyan-500 dark:text-cyan-400 font-mono text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
            <span>{portfolio.faqsHeader?.badge || "FAQ Directory"}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            {(() => {
              const title = portfolio.faqsHeader?.title || "Frequently Asked Questions";
              const words = title.split(" ");
              if (words.length > 2) {
                const lastTwo = words.slice(-2).join(" ");
                const firstPart = words.slice(0, -2).join(" ");
                return (
                  <>
                    {firstPart}{" "}
                    <span className="inline-block bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-200 bg-clip-text text-transparent font-black pr-2 pb-1">
                      {lastTwo}
                    </span>
                  </>
                );
              }
              return title;
            })()}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
            {portfolio.faqsHeader?.description || "Get answers to deployment timelines, HubSpot configurations, and agency scaling questions."}
          </p>
        </div>

        {/* Accordion container */}
        <div className="space-y-4">
          {(portfolio.faqs || FAQS).map((faq: any, index: number) => {
            const isOpen = expandedFAQ === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200/20 dark:border-slate-800/60 bg-white/5 dark:bg-slate-900/20 backdrop-blur-md overflow-hidden transition-colors duration-300"
              >
                <button
                  onClick={() => setExpandedFAQ(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-900 dark:text-white text-base sm:text-lg focus:outline-none cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-cyan-500 dark:text-cyan-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
                  )}
                </button>

                {/* Answer slide */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden border-t border-slate-200/50 dark:border-slate-800/50"
                    >
                      <div className="p-5 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed text-left">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
