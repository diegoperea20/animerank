"use client";

import { cn } from "@/lib/utils";
import { AnimeCard } from "./anime-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Trophy } from "lucide-react";
import { Anime } from "@/lib/db";

interface RankingViewProps {
  animes: Anime[];
  onBack: () => void;
  onExport: () => void;
}

export function RankingView({ animes, onBack, onExport }: RankingViewProps) {
  const sortedAnimes = [...animes].sort((a, b) => b.value - a.value);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Volver a Comparar</span>
          </Button>

          <div className="text-center flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              <Trophy className="inline w-6 h-6 md:w-8 md:h-8 mr-2 text-yellow-500" />
              Ranking de Animes
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Basado en tus comparaciones
            </p>
          </div>

          <Button
            onClick={onExport}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar JSON</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {sortedAnimes.map((anime, index) => (
            <div key={anime.id} className="relative">
              <div className="absolute -top-2 -left-2 z-10">
                <div
                  className={cn(
                    "w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-lg",
                    index === 0 &&
                      "bg-gradient-to-r from-yellow-400 to-orange-500",
                    index === 1 && "bg-gradient-to-r from-gray-400 to-gray-600",
                    index === 2 &&
                      "bg-gradient-to-r from-orange-400 to-orange-600",
                    index > 2 && "bg-gradient-to-r from-blue-400 to-blue-600"
                  )}
                >
                  {index + 1}
                </div>
              </div>
              <AnimeCard anime={anime} showValue />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
