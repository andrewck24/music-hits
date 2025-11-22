import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <div className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white shadow-2xl">
      {/* Background Pattern/Overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
      <div className="from-background/80 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />

      <div className="relative z-10 flex flex-col items-start justify-center px-8 py-20 md:px-16 md:py-32">
        <h1 className="mb-4 text-5xl font-extrabold tracking-tight md:text-7xl">
          Music Hits
        </h1>
        <p className="text-muted-foreground mb-8 max-w-lg text-lg md:text-xl">
          Explore the most popular artists and tracks on Spotify. Discover your
          next favorite hit today.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 text-lg font-bold"
        >
          <Link to="/search">Go to Search</Link>
        </Button>
      </div>
    </div>
  );
}
