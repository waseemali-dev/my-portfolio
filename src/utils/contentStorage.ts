import { DEFAULT_PORTFOLIO_CONTENT } from "../data/portfolioContent";

const STORAGE_KEY = "portfolio_content";

/**
 * Retrieves the current portfolio content.
 * Checks localStorage first, and falls back to DEFAULT_PORTFOLIO_CONTENT if not present.
 */
export function getPortfolioContent() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure basic structure is intact
      if (parsed && typeof parsed === "object" && parsed.hero && parsed.about) {
        // Automatically migrate to the new, updated hero description if matching the old long text
        const oldDesc = "I am a Front-End & HubSpot CMS Developer with 8+ years of experience building fast, responsive, and SEO-friendly websites. My expertise includes HubSpot CMS, WordPress, reusable components, drag-and-drop modules, email templates, workflow automation, AI-powered solutions, and scalable frontend development.";
        let hasHeroMigration = false;
        if (parsed.hero.description === oldDesc) {
          parsed.hero.description = "I build clean, responsive, and high-performing websites using HubSpot CMS, WordPress, and modern front-end technologies.";
          hasHeroMigration = true;
        }

        const oldHeadline = "Front-End & HubSpot CMS Developer Building Fast, and Responsive Websites";
        if (parsed.hero.headline === oldHeadline) {
          parsed.hero.headline = "Waseem Ali | Front-End & HubSpot CMS Developer";
          hasHeroMigration = true;
        }

        if (hasHeroMigration) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          } catch (e) {
            console.warn("Could not save migrated portfolio content to localStorage:", e);
          }
        }

        // Migrate FAQs if they have more than 5 items or are missing
        let hasFaqMigration = false;
        if (parsed.faqs && parsed.faqs.length > 5) {
          parsed.faqs = parsed.faqs.filter((faq: any) => 
            !faq.question.includes("Figma designs") && 
            !faq.question.includes("landing pages")
          );
          hasFaqMigration = true;
        } else if (!parsed.faqs) {
          parsed.faqs = DEFAULT_PORTFOLIO_CONTENT.faqs;
          hasFaqMigration = true;
        }

        if (hasFaqMigration) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          } catch (e) {
            console.warn("Could not save migrated FAQs to localStorage:", e);
          }
        }

        // Migrate experience bullets to new copy
        let hasExpMigration = false;
        if (parsed.experience && Array.isArray(parsed.experience)) {
          parsed.experience = parsed.experience.map((exp: any) => {
            if (exp.id === "immentia") {
              // Check if they need update (if they have old or previous hubspot words, or aren't the exact new ones)
              const hasNewDesignedAndDeveloped = exp.description && exp.description.some((desc: string) => desc.includes("Designed and developed responsive web layouts"));
              if (!hasNewDesignedAndDeveloped) {
                exp.description = [
                  "Designed and developed responsive web layouts and HTML templates using HTML5, CSS3, Bootstrap, JavaScript, and jQuery, including PSD-to-HTML conversion.",
                  "Customized WordPress themes and landing pages based on client requirements while ensuring W3C standards, responsiveness, and cross-browser compatibility."
                ];
                hasExpMigration = true;
              }
            } else if (exp.id === "increate") {
              const hasNewWordPressDeveloped = exp.description && exp.description.some((desc: string) => desc.includes("Developed and maintained responsive, SEO-friendly"));
              if (!hasNewWordPressDeveloped) {
                exp.description = [
                  "Developed and maintained responsive, SEO-friendly WordPress websites focused on clean design, usability, and performance.",
                  "Customized WordPress themes and integrated plugins to improve website functionality and meet client requirements."
                ];
                hasExpMigration = true;
              }
            }
            return exp;
          });
        }

        if (hasExpMigration) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          } catch (e) {
            console.warn("Could not save migrated experience to localStorage:", e);
          }
        }

        // Migrate testimonials if they are using old content or have fewer than 11 items
        let hasTestimonialMigration = false;
        const containsOldTestimonials = parsed.testimonials && parsed.testimonials.some((test: any) => 
          test.name === "Gabriel Marguglio" || test.name === "Sarah Jenkins" || test.name === "Matthew O'Connor"
        );
        if (!parsed.testimonials || parsed.testimonials.length < 11 || containsOldTestimonials) {
          parsed.testimonials = DEFAULT_PORTFOLIO_CONTENT.testimonials;
          hasTestimonialMigration = true;
        } else if (parsed.testimonials && Array.isArray(parsed.testimonials)) {
          parsed.testimonials = parsed.testimonials.map((test: any) => {
            if (test.avatarUrl && test.avatarUrl.includes("images.unsplash.com")) {
              test.avatarUrl = "https://qapjrhwxw5rzkefc.private.blob.vercel-storage.com/images/fiverr-icon.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfcWFQanJod3hXNXJaa0VGYyIsIm93bmVySWQiOiJ0ZWFtX3lFeDd2TU5SNWZ4VlQ5c3pCTjhYSnoxTCIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgyODk3MjgzMjE3LCJpYXQiOjE3ODI4NTQwODMxNzh9.zce6yqk1KZQ-rEC78SSOXcMu-0NZK3BGcFFP54b8FOw&vercel-blob-signature=6k_oIUBsP_qwhDndgB_cPN8GEDiTArzLjdG5LofmZ-s";
              hasTestimonialMigration = true;
            }
            return test;
          });
        }

        if (hasTestimonialMigration) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          } catch (e) {
            console.warn("Could not save migrated testimonials to localStorage:", e);
          }
        }

        return parsed;
      }
    }
  } catch (error) {
    console.error("Error loading portfolio content from localStorage:", error);
  }
  return DEFAULT_PORTFOLIO_CONTENT;
}

/**
 * Saves updated portfolio content into localStorage.
 */
export function savePortfolioContent(content: any) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    // Trigger custom event so any listeners in App know to update
    window.dispatchEvent(new Event("portfolio_content_updated"));
    return true;
  } catch (error) {
    console.error("Error saving portfolio content to localStorage:", error);
    return false;
  }
}

/**
 * Resets portfolio content back to default values.
 */
export function resetPortfolioContent() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("portfolio_content_updated"));
    return true;
  } catch (error) {
    console.error("Error resetting portfolio content:", error);
    return false;
  }
}

/**
 * Generates and triggers a browser download for the content as a JSON file.
 */
export function exportPortfolioContent() {
  try {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(getPortfolioContent(), null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "portfolio_content.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    return true;
  } catch (error) {
    console.error("Error exporting portfolio content:", error);
    return false;
  }
}

/**
 * Imports content from a parsed JSON object or raw JSON string and saves it.
 */
export function importPortfolioContent(jsonInput: any) {
  try {
    let parsed = jsonInput;
    if (typeof jsonInput === "string") {
      parsed = JSON.parse(jsonInput);
    }
    
    // Check for necessary sections before writing
    if (parsed && typeof parsed === "object" && parsed.hero && parsed.about) {
      savePortfolioContent(parsed);
      return { success: true };
    } else {
      return { success: false, error: "Invalid content structure. Missing hero or about sections." };
    }
  } catch (error: any) {
    console.error("Error importing portfolio content:", error);
    return { success: false, error: error?.message || "Invalid JSON syntax" };
  }
}
