export interface MemoryImage {
  id: number;
  imageUrl: string;
  comment: string | null;
}

export interface BaseMemory {
  id: number;
  title: string;
  prefecture: string;
  date: string;
  description: string;
}

export interface DetailedMemory extends BaseMemory {
  images: MemoryImage[];
}
