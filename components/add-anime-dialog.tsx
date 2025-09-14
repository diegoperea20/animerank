"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const CATEGORIES = [
  "Acción",
  "Artes Marciales",
  "Aventuras",
  "Comedia",
  "Demonios",
  "Fantasía",
  "Histórico",
  "Misterio",
  "Policía",
  "Psicológico",
  "Shounen",
  "Sobrenatural",
  "Superpoderes",
  "Suspenso",
];

const STATUSES = ["Activo", "Finalizado"];

interface AddAnimeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAnime: (anime: any) => void;
}

export function AddAnimeDialog({
  open,
  onOpenChange,
  onAddAnime,
}: AddAnimeDialogProps) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryToAdd, setCategoryToAdd] = useState("");

  const handleAddCategory = () => {
    if (categoryToAdd && !selectedCategories.includes(categoryToAdd)) {
      setSelectedCategories([...selectedCategories, categoryToAdd]);
      setCategoryToAdd("");
    }
  };

  const handleRemoveCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
  };

  const handleSubmit = () => {
    if (
      name &&
      image &&
      description &&
      status &&
      selectedCategories.length > 0
    ) {
      onAddAnime({
        name,
        image,
        category: selectedCategories,
        description,
        status,
        value: 7.0, // Los nuevos animes empiezan en 7.0
      });

      // Reset form
      setName("");
      setImage("");
      setDescription("");
      setStatus("");
      setSelectedCategories([]);
      setCategoryToAdd("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Calificar Anime
          </DialogTitle>
          <DialogDescription>
            Agrega un nuevo anime para comparar con la base de datos existente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium">
              Nombre del Anime
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Attack on Titan"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="image" className="text-sm font-medium">
              URL de la Imagen
            </Label>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Descripción
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descripción del anime..."
              className="mt-1 resize-none"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="status" className="text-sm font-medium">
              Estado
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecciona el estado" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Categorías</Label>
            <div className="flex gap-2 mt-1 flex-col sm:flex-row">
              <Select value={categoryToAdd} onValueChange={setCategoryToAdd}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecciona categoría" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter(
                    (cat) => !selectedCategories.includes(cat)
                  ).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={handleAddCategory}
                disabled={!categoryToAdd}
                size="sm"
                className="w-full sm:w-auto"
              >
                Agregar
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCategories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  {category}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-red-600"
                    onClick={() => handleRemoveCategory(category)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={
              !name ||
              !image ||
              !description ||
              !status ||
              selectedCategories.length === 0
            }
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Comenzar Comparaciones
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
