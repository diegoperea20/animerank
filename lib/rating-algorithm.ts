// Algoritmo de rating basado exactamente en el código Python proporcionado
export function calcularIncremento(animeGanador: { value: number }, animePerdedor: { value: number }): number {
  /**
   * Calcula el incremento para el anime ganador. El incremento será mayor cuando la diferencia de
   * puntajes entre los dos animes sea más grande, lo que reflejaría una victoria más clara.
   */
  const diferenciaPuntajes = animeGanador.value - animePerdedor.value;
  
  // Si la diferencia es pequeña, el incremento será menor (victoria ajustada)
  // Si la diferencia es grande, el incremento será mayor (victoria clara)
  const incremento = 0.2 + Math.max(0, diferenciaPuntajes / 10);
  
  return incremento;
}

export function processComparison(
  winnerId: number,
  loserId: number,
  isDraw: boolean = false
) {
  const { db, updateAnimeValue } = require('./db');
  
  const winner = db.find((anime: any) => anime.id === winnerId);
  const loser = db.find((anime: any) => anime.id === loserId);

  if (!winner || !loser) return;

  if (isDraw) {
    // No hacer ningún ajuste si son igualmente buenos
    console.log("Ambos animes son igualmente buenos. No se asignan puntos.");
    return {
      winner: { id: winnerId, oldValue: winner.value, newValue: winner.value },
      loser: { id: loserId, oldValue: loser.value, newValue: loser.value }
    };
  }

  // El ganador recibe un incremento ponderado
  const incremento = calcularIncremento(winner, loser);
  let newWinnerValue = winner.value + incremento;
  
  // Limitar el puntaje máximo a 10.0
  if (newWinnerValue > 10.0) {
    newWinnerValue = 10.0;
  }

  // El perdedor mantiene su puntaje (no pierde puntos)
  const newLoserValue = loser.value;

  // Redondear a 1 decimal
  newWinnerValue = Math.round(newWinnerValue * 10) / 10;

  updateAnimeValue(winnerId, newWinnerValue);
  updateAnimeValue(loserId, newLoserValue);

  return {
    winner: { id: winnerId, oldValue: winner.value, newValue: newWinnerValue },
    loser: { id: loserId, oldValue: loser.value, newValue: newLoserValue }
  };
}