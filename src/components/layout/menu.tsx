import { LanguageList } from "@/components/layout/language-switch";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RiCloseLine, RiGithubFill, RiMenuLine } from "react-icons/ri";
import { Link } from "react-router-dom";

interface MenuProps {
  className?: string;
}

/**
 * Menu Popover Component
 *
 * A responsive navigation menu that displays as a popover.
 * On mobile, it includes the language switcher and GitHub link.
 * On desktop, it only shows the GitHub link (language switcher is in header).
 *
 * @component
 * @example
 * ```tsx
 * // Mobile menu (includes language options)
 * <Menu className="sm:hidden" />
 * ```
 *
 * Features:
 * - Hamburger/close icon toggle
 * - Full-width dropdown from header
 * - Language switcher (reuses LanguageList component)
 * - GitHub repository link
 * - Supports close via button, ESC key, or outside click
 *
 * Layout:
 * - Mobile: [LanguageList] + [GitHub Link]
 * - Desktop: [GitHub Link] (language switch is separate in header)
 *
 * @param {MenuProps} props - Component props
 * @param {string} [props.className] - Optional CSS class names for responsive behavior
 */
export function Menu({ className }: MenuProps) {
  const { t } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "text-foreground hover:text-muted-foreground size-12 rounded-full p-0 transition-colors [&>svg]:size-8",
            className,
          )}
          variant="secondary"
          aria-label={t("menu.label")}
        >
          {isOpen ? <RiCloseLine /> : <RiMenuLine />}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "mx-4 mt-2 w-[calc(var(--radix-popover-content-available-width)-2rem)]",
          className,
        )}
        align="end"
      >
        <div className="flex flex-col gap-4">
          {/* Show language switch in menu */}
          <LanguageList setOpen={setIsOpen} />

          {/* GitHub link */}
          <Link
            to="https://github.com/andrewck24/music-hits"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors"
          >
            <RiGithubFill className="size-5" />
            <span>{t("menu.github")}</span>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
