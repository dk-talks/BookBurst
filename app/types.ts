// app/types.ts

export interface BookType {
    _id: string;
    googleBooksId: string;
    title: string;
    authors?: string[];
    coverImage?: string;
    status?: string;
    rating?: number;
    user?: {
      _id: string;
      name: string;
    };
    reviewCount?: number;
    avgRating?: number;
    notes?: string;
    description?: string;
  }
  
  export interface ReviewType {
    _id: string;
    user: {
      _id: string;
      name: string;
      image?: string;
    };
    rating: number;
    reviewText: string;
    isPublic: boolean;
    createdAt: string;
  }