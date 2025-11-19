import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ScrollableRowProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollableRow({ children, className }: ScrollableRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      // Use a small tolerance (1px) for float calculation errors
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.8; // Scroll 80% of the view
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={cn("group relative", className)}>
      {/* Left Overlay & Button */}
      {canScrollLeft && (
        <ScrollableIndicator direction="left" scroll={scroll} />
      )}

      {/* Scroll Container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      {/* Right Overlay & Button */}
      {canScrollRight && (
        <ScrollableIndicator direction="right" scroll={scroll} />
      )}
    </div>
  );
}

interface ScrollableIndicatorProps {
  direction: "left" | "right";
  scroll: (direction: "left" | "right") => void;
}

function ScrollableIndicator({ direction, scroll }: ScrollableIndicatorProps) {
  const style =
    direction === "left"
      ? "left-0 justify-start bg-gradient-to-r"
      : "right-0 justify-end bg-gradient-to-l";

  return (
    <div
      className={cn(
        "from-background/90 absolute top-0 z-10 flex h-full w-12 items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100",
        style,
      )}
    >
      <Button
        variant="secondary"
        size="icon"
        className="h-8 w-8 rounded-full shadow-md"
        onClick={() => scroll(direction)}
      >
        {direction === "left" ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
