import Spotify from "@/components/icons/spotify.svg?react";
import { LanguageSwitch } from "@/components/layout/language-switch";
import { Menu } from "@/components/layout/menu";
import { SearchBar } from "@/components/layout/search-bar";
import { Button } from "@/components/ui/button";
import { useLocalizedPath } from "@/hooks/use-localized-path";
import { cn } from "@/lib/utils";
import { RiGithubFill, RiSearchLine } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

/**
 * Header Component
 *
 * Purpose: Application top bar (Logo + SearchBar + Navigation)
 *
 * Features:
 * - Application branding
 * - Global search bar (Spotify-style, visible on sm+)
 * - Language switcher (desktop: visible as popover button, mobile: embedded in menu)
 * - GitHub link (desktop: visible as icon button, mobile: embedded in menu)
 * - Menu popover (mobile only, contains language switch and GitHub link)
 * - Spotify theme with gradient background
 * - Sticky positioning at top
 *
 * Layout:
 *   Desktop (sm+): [Logo] [SearchBar (flex-1)] [LanguageSwitch] [GitHubLink]
 *   Mobile (<sm):  [Logo] [SearchButton*] [Menu]
 *                  *SearchButton only shows when not on /search page
 *
 * Usage:
 *   <Header />
 */
export function Header() {
  const { t } = useTranslation("common");
  const location = useLocation();
  const homePath = useLocalizedPath("/");
  const showSearchButton = location.pathname !== "/search";

  return (
    <header className="from-background h-header-height fixed top-0 z-50 flex w-full items-center justify-between gap-4 bg-linear-to-b to-transparent px-6 py-4">
      {/* Logo */}
      <Link
        to={homePath}
        className="flex items-center gap-2 transition-opacity hover:opacity-80"
      >
        <Spotify className="size-10" />
        <h1 className="text-foreground text-xl font-bold max-lg:hidden">
          {t("header.title")}
        </h1>
      </Link>

      {/* Search Bar (centered, visible on sm+) */}
      <SearchBar className="flex-1 max-sm:hidden" />

      {/* Navigation */}
      <nav className="flex items-center gap-2">
        {/* Search Button (mobile only, hidden on /search page), Menu (mobile only) */}
        {showSearchButton && <SearchButton className="sm:hidden" />}
        <Menu className="sm:hidden" />

        {/* Language Switch, GitHub Link (visible on sm+) */}
        <LanguageSwitch className="max-sm:hidden" />
        <GitHubLink className="max-sm:hidden" />
      </nav>
    </header>
  );
}

function SearchButton({ className }: { className?: string }) {
  const { t } = useTranslation("common");
  const searchPath = useLocalizedPath("/search");

  return (
    <Button
      asChild
      className={cn(
        "text-foreground hover:text-muted-foreground size-12 rounded-full p-0 transition-colors [&>svg]:size-8",
        className,
      )}
      variant="secondary"
      aria-label={t("header.search")}
    >
      <Link to={searchPath} aria-label={t("header.search")}>
        <RiSearchLine />
      </Link>
    </Button>
  );
}

function GitHubLink({ className }: { className?: string }) {
  const { t } = useTranslation("common");

  return (
    <Button
      asChild
      variant="secondary"
      className={cn(
        "text-foreground hover:text-muted-foreground size-12 rounded-full p-0 transition-colors [&>svg]:size-8",
        className,
      )}
      aria-label={t("menu.github")}
    >
      <Link
        to="https://github.com/andrewck24/music-hits"
        target="_blank"
        rel="noopener noreferrer"
      >
        <RiGithubFill />
      </Link>
    </Button>
  );
}
