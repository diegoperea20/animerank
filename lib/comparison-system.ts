export interface ComparisonPair {
  anime1: number;
  anime2: number;
}

export class ComparisonManager {
  private allPairs: ComparisonPair[] = [];
  private currentIndex: number = 0;

  constructor(animeIds: number[]) {
    this.generateAllPairs(animeIds);
  }

  private generateAllPairs(animeIds: number[]): void {
    // Generar todas las combinaciones únicas exactamente como en Python:
    // for i in range(len(animes)):
    //     for j in range(i + 1, len(animes)):
    for (let i = 0; i < animeIds.length; i++) {
      for (let j = i + 1; j < animeIds.length; j++) {
        this.allPairs.push({
          anime1: animeIds[i],
          anime2: animeIds[j]
        });
      }
    }
    
    // NO mezclar las parejas para mantener el orden sistemático como en Python
    // this.shuffleArray(this.allPairs); // REMOVIDO
  }

  getCurrentPair(): ComparisonPair | null {
    if (this.currentIndex >= this.allPairs.length) {
      return null; // Todas las comparaciones completadas
    }
    return this.allPairs[this.currentIndex];
  }

  markCurrentPairAsCompleted(): void {
    if (this.currentIndex < this.allPairs.length) {
      this.currentIndex++;
    }
  }

  getTotalPairs(): number {
    return this.allPairs.length;
  }

  getCompletedCount(): number {
    return this.currentIndex;
  }

  isCompleted(): boolean {
    return this.currentIndex >= this.allPairs.length;
  }

  getProgress(): { current: number; total: number; percentage: number } {
    return {
      current: this.currentIndex,
      total: this.allPairs.length,
      percentage: this.allPairs.length > 0 ? (this.currentIndex / this.allPairs.length) * 100 : 0
    };
  }

  // Para animes nuevos: generar comparaciones solo con ese anime
  static createForNewAnime(newAnimeId: number, existingAnimeIds: number[]): ComparisonManager {
    const pairs: ComparisonPair[] = existingAnimeIds.map(id => ({
      anime1: newAnimeId,
      anime2: id
    }));
    
    const manager = new ComparisonManager([]);
    manager.allPairs = pairs;
    manager.currentIndex = 0;
    return manager;
  }
}