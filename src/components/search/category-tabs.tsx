import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export type Category = "all" | "artists" | "tracks";

interface SearchCategoryTabsProps {
  category: Category;
  setCategory: (category: Category) => void;
  artistCount: number;
  trackCount: number;
}

export function SearchCategoryTabs({
  category,
  setCategory,
  artistCount,
  trackCount,
}: SearchCategoryTabsProps) {
  const { t } = useTranslation("search");

  if (artistCount === 0 && trackCount === 0) return null;

  return (
    <div className="flex gap-2">
      <Button
        variant={category === "all" ? "default" : "outline"}
        onClick={() => setCategory("all")}
      >
        {t("categories.all")}
      </Button>
      <Button
        variant={category === "artists" ? "default" : "outline"}
        onClick={() => setCategory("artists")}
      >
        {t("categories.artists", { count: artistCount })}
      </Button>
      <Button
        variant={category === "tracks" ? "default" : "outline"}
        onClick={() => setCategory("tracks")}
      >
        {t("categories.tracks", { count: trackCount })}
      </Button>
    </div>
  );
}
