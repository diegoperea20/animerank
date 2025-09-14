"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Anime } from "@/lib/db";
import { cn } from "@/lib/utils";

interface AnimeCardProps {
  anime: Anime;
  onClick?: () => void;
  className?: string;
  showValue?: boolean;
}

export function AnimeCard({
  anime,
  onClick,
  className,
  showValue = false,
}: AnimeCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl group overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-400",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative">
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={anime.image}
              alt={anime.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/300x400/6366f1/ffffff?text=No+Image";
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {showValue && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
              ★ {anime.value.toFixed(1)}
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-lg md:text-xl font-bold mb-2 line-clamp-2">
              {anime.name}
            </h3>
            <p className="text-sm text-gray-200 mb-3 line-clamp-2">
              {anime.description}
            </p>

            <div className="flex flex-wrap gap-1 mb-2">
              {anime.category.slice(0, 3).map((cat) => (
                <Badge
                  key={cat}
                  variant="secondary"
                  className="text-xs bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  {cat}
                </Badge>
              ))}
              {anime.category.length > 3 && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-white/20 text-white border-white/30"
                >
                  +{anime.category.length - 3}
                </Badge>
              )}
            </div>

            <div className="flex justify-between items-center">
              <Badge
                variant={
                  anime.status === "Finalizado" ? "default" : "destructive"
                }
                className="text-xs"
              >
                {anime.status}
              </Badge>
              {showValue && (
                <span className="text-xs text-gray-300">
                  {anime.comparisons || 0} comparaciones
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
