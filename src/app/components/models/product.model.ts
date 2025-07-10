export interface Products {
  _id: string;
  title: string;
  slug: string;
  description: string;
  author: string;
  quantity: number;
  sold: number;
  price: number;
  priceAfterDiscount: number;
  imageCover: string;
  images: string[];
  pdfLink: string;
  category: {
    _id: string;
    name: string;
  };
  subcategory: any[]; // Can be more specific if you know the structure
  ratingAverage: number;
  ratingQuantity: number;
  createdAt: string;
  updatedAt: string;
}
