import { useLocalizedPath } from "@/hooks/use-localized-path";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiCloseLine, RiSearchLine } from "react-icons/ri";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

/**
 * SearchBar Component
 *
 * Purpose: Global search component (Spotify style)
 *
 * Features:
 * - Spotify style design (rounded, bg-muted)
 * - White ring on focus
 * - Clears input when navigating away from search page
 * - Responsive display
 */

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams.get("q") || "");
  const searchPath = useLocalizedPath("/search");

  // Sync input with URL param 'q' and clear if not on search page
  useEffect(() => {
    const isSearchPage =
      location.pathname === "/en/search" ||
      location.pathname === "/zh-TW/search" ||
      location.pathname === "/jp/search";

    if (isSearchPage) {
      setInputValue(searchParams.get("q") || "");
    } else {
      setInputValue("");
    }
  }, [location.pathname, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Immediate navigation, use replace to avoid history pollution
    navigate(`${searchPath}?q=${encodeURIComponent(value)}`, { replace: true });
  };

  const handleClear = () => {
    setInputValue("");
    navigate(`${searchPath}?q=`, { replace: true });
  };

  return (
    <div
      className={cn(
        "bg-muted flex h-12 max-w-2xl flex-row items-center rounded-full px-4 text-sm",
        "supports-backdrop-filter:bg-secondary/60 backdrop-blur",
        "focus-within:ring-ring focus-within:ring-2",
        "hover:bg-muted/80 transition-all",
        className,
      )}
    >
      <RiSearchLine className="text-muted-foreground mr-3 h-6 w-6 shrink-0" />
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={t("header.searchPlaceholder")}
        className="placeholder:text-muted-foreground text-foreground flex-1 bg-transparent text-base outline-none"
      />
      {inputValue && (
        <button
          onClick={handleClear}
          className="text-muted-foreground hover:text-foreground ml-2 focus:outline-none"
          aria-label={t("header.clearSearch")}
        >
          <RiCloseLine className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
