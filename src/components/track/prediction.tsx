import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { tracksLoader } from "@/loaders/tracks-loader";
import { useTranslation } from "react-i18next";
import type { IconType } from "react-icons";
import { RiDiscLine, RiFireFill, RiSeedlingFill } from "react-icons/ri";
import { useRouteLoaderData } from "react-router-dom";

interface PopularityPredictionProps {
  trackId: string;
  className?: string;
}

type CategoryKey = "niche" | "mainstream" | "promising";

interface IndicatorConfig {
  category: CategoryKey;
  icon: IconType;
  iconClassName: string;
  titleClassName: string;
  descriptionClassName: string;
}

const indicatorConfigs: Record<0 | 1 | 2, IndicatorConfig> = {
  0: {
    category: "niche",
    icon: RiDiscLine,
    iconClassName: "text-gray-400",
    titleClassName: "text-gray-300",
    descriptionClassName: "text-gray-400/80",
  },
  1: {
    category: "mainstream",
    icon: RiFireFill,
    iconClassName: "text-orange-400",
    titleClassName: "text-orange-300",
    descriptionClassName: "text-orange-200/80",
  },
  2: {
    category: "promising",
    icon: RiSeedlingFill,
    iconClassName: "text-green-400",
    titleClassName: "text-green-300",
    descriptionClassName: "text-green-200/80",
  },
};

export function PopularityPrediction({
  trackId,
  className,
}: PopularityPredictionProps) {
  const { t } = useTranslation("track");
  const { tracks: tracksDatabase } = useRouteLoaderData("root") as Awaited<
    ReturnType<typeof tracksLoader>
  >;
  const track = tracksDatabase.tracks.find((t) => t.trackId === trackId);

  if (!track || track.indicator === undefined) return null;

  const config = indicatorConfigs[track.indicator];
  const Icon = config.icon;

  return (
    <Card
      className={cn(
        "flex h-full min-h-90 items-center justify-center overflow-hidden border",
        className,
      )}
    >
      <CardContent className="relative z-10 flex h-full flex-col items-center justify-center gap-6 p-6">
        {/* Icon */}
        <div className="flex justify-center">
          <Icon
            className={cn("h-12 w-12", config.iconClassName)}
            aria-hidden="true"
          />
        </div>

        {/* Section Title */}
        <h2 className="text-foreground text-center text-xl font-semibold">
          {t("prediction.title")}
        </h2>

        {/* Category Content */}
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <h3
            className={cn(
              "text-center text-3xl font-bold",
              config.titleClassName,
            )}
          >
            {t(`prediction.categories.${config.category}.title`)}
          </h3>
          <p
            className={cn(
              "max-w-sm text-center text-sm leading-relaxed",
              config.descriptionClassName,
            )}
          >
            {t(`prediction.categories.${config.category}.description`)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default PopularityPrediction;
