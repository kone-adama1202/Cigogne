export type Product = {
    id: string;
    name: string;
    description: string | null;
    category: string;
    price: number;
    image_url: string | null;
    stock: number;
    active: boolean;
  };