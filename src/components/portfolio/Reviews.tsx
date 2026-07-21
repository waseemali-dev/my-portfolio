import { useState } from "react";
import { Star, ChevronDown } from "lucide-react";
import { Button } from "../common/Button";
import { motion } from "motion/react";

interface ReviewsProps {
  portfolio: any;
  getProjectImage: (imgUrlOrKey: string) => string;
}

export function Reviews({ portfolio, getProjectImage }: ReviewsProps) {
  const [visibleReviews, setVisibleReviews] = useState<number>(3);

  return (
    <section id="reviews" className="py-20 md:py-28 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <motion.div 
          className="text-center max-w-3xl mx-auto space-y-4"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/20 dark:border-cyan-500/10 text-cyan-500 dark:text-cyan-400 font-mono text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
            <span>{portfolio.testimonialsHeader?.badge || "Testimonials"}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            {(() => {
              const title = portfolio.testimonialsHeader?.title || "What Clients & Partners Say";
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
            {portfolio.testimonialsHeader?.description || "Real endorsements from corporate executives, agency owners, and tech founders globally."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {(portfolio.testimonials || []).slice(0, visibleReviews).map((review: any) => (
            <div
              key={review.id}
              id={`review-card-${review.id}`}
              className="p-6 sm:p-8 rounded-2xl bg-white/5 dark:bg-slate-900/20 backdrop-blur-md border border-slate-200/30 dark:border-slate-800/60 flex flex-col justify-between shadow-[0_0_15px_rgba(6,182,212,0.03)] hover:border-cyan-500/30 transition-all duration-300"
            >
              <div className="space-y-4">
                
                {/* Rating Stars */}
                <div className="flex gap-1">
                  {[...Array(review.rating || 5)].map((_, index) => (
                    <Star key={index} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-slate-600 dark:text-slate-300 italic text-sm sm:text-base leading-relaxed">
                  "{review.text}"
                </p>

              </div>

              {/* Author Info */}
              <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800 bg-cyan-500/10 dark:bg-cyan-500/5 text-cyan-500 dark:text-cyan-400 flex items-center justify-center font-bold text-base sm:text-lg select-none">
                    {review.name ? review.name.trim().charAt(0).toUpperCase() : "?"}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                    {review.name}
                  </h3>
                  {review.sourceUrl ? (
                    <a
                      href={review.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold hover:underline inline-flex items-center gap-1 transition-all duration-200"
                    >
                      <span>Source: {review.platform || "Fiverr"}</span>
                      <span className="text-[10px] select-none">↗</span>
                    </a>
                  ) : (
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Source: {review.platform || "Fiverr"}
                    </p>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

        {visibleReviews < (portfolio.testimonials || []).length && (
          <div className="flex justify-center pt-4 w-full">
            <Button
              text="Load More Reviews"
              style="secondary"
              icon={<ChevronDown size={16} />}
              onClick={() => setVisibleReviews((prev) => prev + 3)}
            />
          </div>
        )}

      </div>
    </section>
  );
}
