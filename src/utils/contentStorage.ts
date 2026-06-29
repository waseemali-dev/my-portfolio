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
