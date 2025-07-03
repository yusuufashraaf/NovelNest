export interface NewReview {
    userId: string,
    bookId: string,
    postedAt: number,
    comment: string;
    rate: number,
}
