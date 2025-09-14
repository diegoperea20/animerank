export interface Anime {
  id: number;
  name: string;
  image: string;
  value: number;
  category: string[];
  description: string;
  status: string;
  comparisons?: number;
}

export function updateAnimeValue(animeId: number, newValue: number) {
  const anime = db.find((a) => a.id === animeId);
  if (anime) {
    anime.value = Math.max(1.0, Math.min(10.0, Math.round(newValue * 10) / 10));
    anime.comparisons = (anime.comparisons || 0) + 1;
  }
}

export function addAnime(anime: Omit<Anime, "id" | "comparisons">) {
  const newId = Math.max(...db.map((a) => a.id)) + 1;
  db.push({
    ...anime,
    id: newId,
    comparisons: 0,
  });
  return newId;
}

export function exportDatabase() {
  // Crear una copia de la base de datos sin el campo 'comparisons' y con el orden correcto de campos
  const dbWithoutComparisons = db.map((anime) => {
    const { comparisons, ...rest } = anime;
    // Devolver los campos en el orden específico
    return {
      id: rest.id,
      name: rest.name,
      image: rest.image,
      value: rest.value,
      category: rest.category,
      description: rest.description,
      status: rest.status,
    };
  });
  return JSON.stringify(dbWithoutComparisons, null, 2);
}

export let db: Anime[] = [
  {
    id: 1,
    name: "Bleach",
    image: "https://www3.animeflv.net/uploads/animes/covers/1.jpg",
    value: 8.5,
    category: ["Acción", "Comedia", "Shounen", "Sobrenatural", "Superpoderes"],
    description:
      "Kurosaki Ichigo es un estudiante de instituto de 15 años, que tiene la extraña habilidad de ver, tocar y hablar con espíritus.",
    status: "Finalizado",
  },
  {
    id: 2,
    name: "Naruto",
    image: "https://www3.animeflv.net/uploads/animes/covers/2.jpg",
    value: 8.5,
    category: [
      "Acción",
      "Artes Marciales",
      "Comedia",
      "Shounen",
      "Superpoderes",
    ],
    description:
      "Naruto Uzumaki es un ninja adolescente que busca reconocimiento y sueña con convertirse en Hokage.",
    status: "Finalizado",
  },
  {
    id: 3,
    name: "Naruto Shippuden",
    image: "https://www3.animeflv.net/uploads/animes/covers/3.jpg",
    value: 9.2,
    category: [
      "Acción",
      "Artes Marciales",
      "Comedia",
      "Shounen",
      "Superpoderes",
    ],
    description:
      "Pasados dos años y medio de entrenamiento, Naruto regresa para reencontrarse con sus compañeros de equipo.",
    status: "Finalizado",
  },
  {
    id: 4,
    name: "Kimetsu no Yaiba",
    image: "https://www3.animeflv.net/uploads/animes/covers/3118.jpg",
    value: 8.9,
    category: ["Acción", "Demonios", "Histórico", "Shounen", "Sobrenatural"],
    description:
      "Estamos en la era Taisho en Japón. Tanjiro es un joven que vive feliz con su familia.",
    status: "Finalizado",
  },
];
