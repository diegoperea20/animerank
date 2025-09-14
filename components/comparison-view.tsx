"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AnimeCard } from "./anime-card";
import { Button } from "@/components/ui/button";
import { Equal, Zap } from "lucide-react";
import { Anime } from "@/lib/db";
import { processComparison } from "@/lib/rating-algorithm";
import { ProgressBar } from "@/components/progress-bar";

interface ComparisonViewProps {
  animes: [Anime, Anime];
  onComparison: (winnerId: number, loserId: number, isDraw?: boolean) => void;
  onNewPair: () => void;
  progress?: { current: number; total: number; percentage: number };
  isNewAnimeMode?: boolean;
}

export function ComparisonView({
  animes,
  onComparison,
  onNewPair,
  progress,
  isNewAnimeMode = false,
}: ComparisonViewProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastComparison, setLastComparison] = useState<{
    winner?: number;
    loser?: number;
    isDraw?: boolean;
  } | null>(null);

  const handleChoice = async (
    winnerId: number,
    loserId: number,
    isDraw: boolean = false
  ) => {
    setIsAnimating(true);
    setLastComparison({ winner: winnerId, loser: loserId, isDraw });

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 800));

    onComparison(winnerId, loserId, isDraw);
    setShowResult(true);

    // Auto advance after showing result
    setTimeout(() => {
      setIsAnimating(false);
      setShowResult(false);
      setLastComparison(null);
      onNewPair();
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            ¿Cuál es mejor?
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Compara los animes y ayúdanos a crear el ranking perfecto
          </p>
          {progress && (
            <div className="mt-2">
              <div className="bg-white dark:bg-gray-800 rounded-full px-3 py-2 md:px-4 md:py-2 inline-block shadow-sm">
                <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Progreso: {progress.current}/{progress.total} comparaciones
                </span>
                <ProgressBar
                  current={progress.current}
                  total={progress.total}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
          {/* Card izquierda */}
          <div
            className={cn(
              "transition-all duration-500",
              isAnimating &&
                lastComparison?.winner === animes[0].id &&
                !lastComparison?.isDraw &&
                "scale-110 ring-4 ring-green-400",
              isAnimating &&
                lastComparison?.loser === animes[0].id &&
                !lastComparison?.isDraw &&
                "scale-95 opacity-60"
            )}
          >
            <AnimeCard
              anime={animes[0]}
              onClick={() => handleChoice(animes[0].id, animes[1].id)}
              className={cn(
                "h-full",
                !isAnimating &&
                  "hover:border-blue-500 hover:shadow-blue-200 dark:hover:border-blue-400 dark:hover:shadow-blue-900/50"
              )}
              showValue={showResult}
            />
          </div>

          {/* Botón central */}
          <div className="flex flex-col items-center space-y-4">
            <Button
              onClick={() => handleChoice(animes[0].id, animes[1].id, true)}
              disabled={isAnimating}
              className={cn(
                "w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-lg transition-all duration-300 hover:scale-110",
                isAnimating &&
                  lastComparison?.isDraw &&
                  "scale-110 ring-4 ring-yellow-400"
              )}
            >
              <Equal className="w-4 h-4 md:w-6 md:h-6" />
            </Button>
            <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
              Empate
            </span>

            {showResult && (
              <div className="text-center animate-fade-in">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 shadow-lg border dark:border-gray-700">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                    {lastComparison?.isDraw
                      ? "¡Empate registrado!"
                      : "¡Comparación registrada!"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Valores actualizados automáticamente
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Card derecha */}
          <div
            className={cn(
              "transition-all duration-500",
              isAnimating &&
                lastComparison?.winner === animes[1].id &&
                !lastComparison?.isDraw &&
                "scale-110 ring-4 ring-green-400",
              isAnimating &&
                lastComparison?.loser === animes[1].id &&
                !lastComparison?.isDraw &&
                "scale-95 opacity-60"
            )}
          >
            <AnimeCard
              anime={animes[1]}
              onClick={() => handleChoice(animes[1].id, animes[0].id)}
              className={cn(
                "h-full",
                !isAnimating &&
                  "hover:border-purple-500 hover:shadow-purple-200 dark:hover:border-purple-400 dark:hover:shadow-purple-900/50"
              )}
              showValue={showResult}
            />
          </div>
        </div>

        <div className="text-center mt-6 md:mt-8">
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">
            {isNewAnimeMode
              ? "Comparando el nuevo anime con los existentes para determinar su posición"
              : "Haz clic en la card del anime que prefieres o en el botón de empate si ambos son iguales"}
          </p>
        </div>
      </div>
    </div>
  );
}
