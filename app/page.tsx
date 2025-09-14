"use client";

import { useState, useCallback, useEffect } from "react";
import { ComparisonView } from "@/components/comparison-view";
import { RankingView } from "@/components/ranking-view";
import { AddAnimeDialog } from "@/components/add-anime-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { db, addAnime, exportDatabase, Anime } from "@/lib/db";
import { processComparison } from "@/lib/rating-algorithm";
import { ComparisonManager } from "@/lib/comparison-system";
import { Plus, BarChart3 } from "lucide-react";

type ViewMode = "comparison" | "ranking" | "new-anime-comparison" | "completed";

export default function Home() {
  const [currentPair, setCurrentPair] = useState<[Anime, Anime] | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("comparison");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newAnimeId, setNewAnimeId] = useState<number | null>(null);
  const [comparisonManager, setComparisonManager] =
    useState<ComparisonManager | null>(null);

  // Initialize currentPair on client side to avoid hydration mismatch
  useEffect(() => {
    if (!comparisonManager && viewMode === "comparison") {
      const animeIds = db.map((a) => a.id);
      const manager = new ComparisonManager(animeIds);
      setComparisonManager(manager);

      const pair = manager.getCurrentPair();
      if (pair) {
        const anime1 = db.find((a) => a.id === pair.anime1);
        const anime2 = db.find((a) => a.id === pair.anime2);
        if (anime1 && anime2) {
          setCurrentPair([anime1, anime2]);
        }
      }
    }
  }, [comparisonManager, viewMode]);

  const handleComparison = useCallback(
    (winnerId: number, loserId: number, isDraw: boolean = false) => {
      processComparison(winnerId, loserId, isDraw);

      if (comparisonManager) {
        comparisonManager.markCurrentPairAsCompleted();

        if (comparisonManager.isCompleted()) {
          // Todas las comparaciones completadas
          setTimeout(() => {
            setViewMode("completed");
          }, 1500);
        } else {
          // Continuar con la siguiente comparación
          setTimeout(() => {
            const nextPair = comparisonManager.getCurrentPair();
            if (nextPair) {
              const anime1 = db.find((a) => a.id === nextPair.anime1);
              const anime2 = db.find((a) => a.id === nextPair.anime2);
              if (anime1 && anime2) {
                setCurrentPair([anime1, anime2]);
              }
            }
          }, 1500);
        }
      }
    },
    [comparisonManager]
  );

  const handleNewPair = useCallback(() => {
    if (comparisonManager) {
      const nextPair = comparisonManager.getCurrentPair();
      if (nextPair) {
        const anime1 = db.find((a) => a.id === nextPair.anime1);
        const anime2 = db.find((a) => a.id === nextPair.anime2);
        if (anime1 && anime2) {
          setCurrentPair([anime1, anime2]);
        }
      }
    }
  }, [comparisonManager]);

  const handleAddAnime = (animeData: Omit<Anime, "id" | "comparisons">) => {
    const newId = addAnime(animeData);

    // Crear manager para comparar el nuevo anime con todos los existentes
    const existingIds = db.filter((a) => a.id !== newId).map((a) => a.id);
    const newAnimeManager = ComparisonManager.createForNewAnime(
      newId,
      existingIds
    );
    setComparisonManager(newAnimeManager);
    setViewMode("new-anime-comparison");
    setNewAnimeId(newId);

    // Iniciar primera comparación
    const firstPair = newAnimeManager.getCurrentPair();
    if (firstPair) {
      const anime1 = db.find((a) => a.id === firstPair.anime1);
      const anime2 = db.find((a) => a.id === firstPair.anime2);
      if (anime1 && anime2) {
        setCurrentPair([anime1, anime2]);
      }
    }
  };

  const handleRestartComparisons = () => {
    const animeIds = db.map((a) => a.id);
    const manager = new ComparisonManager(animeIds);
    setComparisonManager(manager);
    setViewMode("comparison");
    setNewAnimeId(null);

    const pair = manager.getCurrentPair();
    if (pair) {
      const anime1 = db.find((a) => a.id === pair.anime1);
      const anime2 = db.find((a) => a.id === pair.anime2);
      if (anime1 && anime2) {
        setCurrentPair([anime1, anime2]);
      }
    }
  };

  const handleExportDatabase = () => {
    const dataStr = exportDatabase();
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "anime-rankings.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  if (viewMode === "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-2xl border border-green-200 dark:border-gray-700 max-w-md w-full">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              ¡Comparaciones Finalizadas!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Has completado todas las comparaciones posibles entre los animes.
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => setViewMode("ranking")}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Ver Ranking Final
              </Button>
              <Button
                onClick={handleRestartComparisons}
                variant="outline"
                className="w-full"
              >
                Reiniciar Comparaciones
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (viewMode === "ranking") {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <RankingView
            animes={db}
            onBack={() => {
              if (comparisonManager && !comparisonManager.isCompleted()) {
                setViewMode("comparison");
              } else {
                setViewMode("completed");
              }
            }}
            onExport={handleExportDatabase}
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AnimeRank
            </h1>
            {viewMode === "new-anime-comparison" && (
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                Comparando nuevo anime:{" "}
                {comparisonManager?.getProgress().current || 0} de{" "}
                {comparisonManager?.getProgress().total || 0}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button
              onClick={() => setViewMode("ranking")}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Ver Ranking</span>
            </Button>
            <Button
              onClick={() => setShowAddDialog(true)}
              size="sm"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Calificar Anime</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pt-[4rem] flex-grow">
        {currentPair && (
          <ComparisonView
            animes={currentPair}
            onComparison={handleComparison}
            onNewPair={handleNewPair}
            progress={comparisonManager?.getProgress()}
            isNewAnimeMode={viewMode === "new-anime-comparison"}
          />
        )}
      </div>

      {/* Add anime dialog */}
      <AddAnimeDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddAnime={handleAddAnime}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
