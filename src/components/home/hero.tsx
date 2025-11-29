import { Button } from "@/components/ui/button";
import { useLocalizedPath } from "@/hooks/use-localized-path";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function Hero() {
  const { t } = useTranslation("home");
  const searchPath = useLocalizedPath("/search");

  return (
    <div className="relative mb-12 h-[40vh] min-h-80 overflow-hidden rounded-3xl bg-linear-to-br from-purple-900 via-indigo-900 to-black text-white shadow-2xl">
      {/* Background Pattern/Overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
      <div className="from-background/80 absolute inset-0 bg-linear-to-t via-transparent to-transparent" />

      <div className="relative z-10 flex h-full flex-col items-start justify-end px-4 py-6 md:px-6">
        <h1 className="mb-2 text-5xl font-extrabold tracking-tight md:text-7xl">
          {t("hero.title")}
        </h1>
        <p className="text-muted-foreground mb-6 max-w-lg text-lg md:text-xl">
          {t("hero.subtitle")}
        </p>
        <Button
          asChild
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 text-lg font-bold"
        >
          <Link to={searchPath}>{t("hero.ctaButton")}</Link>
        </Button>
      </div>
    </div>
  );
}
