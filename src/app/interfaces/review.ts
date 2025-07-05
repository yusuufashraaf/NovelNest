export interface Review {
  _id: string,
  userId: {
    _id: string;
    name: string;
  },
  bookId: string,
  postedAt: string,
  comment: string;
  rate: number,
}
export interface ReviewResponse {
  comments: Review[];
  count: number;
  avgRate:number
}
