export interface Course {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  image: string;
  price: number;
  instructor?: string;
  category?: string;
  level?: string;
  duration?: number;
  students?: number;
  rating?: number;
  learningPoints?: string[];
  highlights?: { title?: string }[];
  modules?: { title?: string; lessons?: number; duration?: string }[];
  faqs?: { question?: string; answer?: string }[];
  reviews?: { author?: string; rating?: number; text?: string }[];
  createdAt?: string;
}
