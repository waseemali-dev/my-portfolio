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
        // Upgrade or restore to Version 1 (1.1.0) if version is outdated, missing, or projects array is invalid
        if (!parsed.version || parsed.version !== "1.1.0" || !parsed.projects || !Array.isArray(parsed.projects)) {
          console.log("Forcing update to portfolio content Version 1.1.0...");
          try {
            const migratedContent = {
              ...DEFAULT_PORTFOLIO_CONTENT,
              lastUpdated: Date.now()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedContent));
            // Sync with server
            fetch("/api/portfolio-content", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(migratedContent),
            }).catch((err) => console.warn("Failed to sync updated portfolio content to server:", err));
            return migratedContent;
          } catch (e) {
            console.warn("Could not save migrated portfolio content to localStorage:", e);
          }
          return DEFAULT_PORTFOLIO_CONTENT;
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
    const contentWithTimestamp = {
      ...content,
      lastUpdated: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contentWithTimestamp));
    // Trigger custom event so any listeners in App know to update
    window.dispatchEvent(new Event("portfolio_content_updated"));

    // Async save to the server to synchronize across devices/tabs
    fetch("/api/portfolio-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contentWithTimestamp),
    }).catch((err) => {
      console.warn("Could not synchronize portfolio content with the server:", err);
    });

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

    // Async delete from the server to reset back to default content
    fetch("/api/portfolio-content", {
      method: "DELETE",
    }).catch((err) => {
      console.warn("Could not reset portfolio content on the server:", err);
    });

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
