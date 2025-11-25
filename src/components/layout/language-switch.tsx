import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useChangeLanguage } from "@/hooks/use-change-language";
import { useCurrentLanguage } from "@/hooks/use-current-language";
import { LANGUAGES } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { SupportedLanguages } from "@/types/translations";
import { useState } from "react";
import { RiCheckLine, RiGlobalLine } from "react-icons/ri";

interface LanguageSwitchProps {
  className?: string;
}

/**
 * Language Switch Popover Component
 *
 * A popover-based language switcher that displays a globe icon button.
 * When clicked, it shows a list of available languages for the user to select.
 * The current language is highlighted with a checkmark.
 *
 * @component
 * @example
 * ```tsx
 * // Desktop header (always visible)
 * <LanguageSwitch className="max-sm:hidden" />
 * ```
 *
 * Features:
 * - Globe icon button trigger
 * - Popover with language options
 * - Current language indicator (checkmark)
 * - Automatic route-based navigation on language change
 *
 * @param {LanguageSwitchProps} props - Component props
 * @param {string} [props.className] - Optional CSS class names
 */
export function LanguageSwitch({ className }: LanguageSwitchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentLang = useCurrentLanguage();
  const currentLanguageConfig = LANGUAGES[currentLang];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "text-foreground hover:text-muted-foreground size-12 rounded-full p-0 transition-colors [&>svg]:size-8",
            className,
          )}
          variant="secondary"
          aria-label={`Current language: ${currentLanguageConfig.name}`}
        >
          <RiGlobalLine />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-40 flex-col gap-1 p-2" align="end">
        <LanguageList setOpen={setIsOpen} />
      </PopoverContent>
    </Popover>
  );
}

interface LanguageListProps {
  setOpen: (open: boolean) => void;
}

/**
 * Language Options List Component
 *
 * Displays a vertical list of all available languages with interactive buttons.
 * The current language is highlighted with a checkmark icon.
 * This component is reusable and can be embedded in different popovers
 * (e.g., LanguageSwitch, Menu).
 *
 * @component
 * @example
 * ```tsx
 * // Inside a popover
 * <LanguageList setOpen={setIsOpen} />
 *
 * // Inside mobile menu
 * <Menu>
 *   <LanguageList setOpen={setMenuOpen} />
 * </Menu>
 * ```
 *
 * Features:
 * - Displays all supported languages from LANGUAGES config
 * - Globe icon for each language option
 * - Checkmark for currently selected language
 * - Closes parent popover after language selection
 * - Uses route-based navigation via useChangeLanguage hook
 *
 * @param {LanguageListProps} props - Component props
 * @param {function} props.setOpen - Function to control parent popover open state
 */
export function LanguageList({ setOpen }: LanguageListProps) {
  const currentLang = useCurrentLanguage();
  const changeLanguage = useChangeLanguage();
  const handleChangeLanguage = (langCode: SupportedLanguages) => {
    changeLanguage(langCode);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1">
      {Object.values(LANGUAGES).map((lang) => (
        <Button
          key={lang.code}
          variant="ghost"
          onClick={() => handleChangeLanguage(lang.code)}
          className={cn(
            "hover:bg-accent hover:text-accent-foreground justify-start rounded-md px-3 py-2 text-left text-sm transition-colors",
            lang.code === currentLang ? "bg-accent font-medium" : "",
          )}
          aria-current={lang.code === currentLang ? "true" : undefined}
        >
          <RiGlobalLine />
          <span className="flex-1">{lang.name}</span>
          {lang.code === currentLang && <RiCheckLine />}
        </Button>
      ))}
    </div>
  );
}
