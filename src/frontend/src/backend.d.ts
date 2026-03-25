import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BlogPost {
    title: string;
    content: string;
    author: string;
    timestamp: Time;
    excerpt: string;
    category: string;
    postId: bigint;
}
export interface AffiliateProduct {
    url: string;
    name: string;
    description: string;
    productId: bigint;
    discount: string;
    price: string;
}
export type Time = bigint;
export interface Feedback {
    name: string;
    email: string;
    message: string;
    timestamp: Time;
    feedbackId: bigint;
}
export interface backendInterface {
    addAffiliateProduct(name: string, description: string, url: string, discount: string, price: string): Promise<bigint>;
    createBlogPost(title: string, content: string, excerpt: string, category: string, author: string): Promise<bigint>;
    getAffiliateProduct(productId: bigint): Promise<AffiliateProduct>;
    getAllAffiliateProducts(): Promise<Array<AffiliateProduct>>;
    getAllBlogPosts(): Promise<Array<BlogPost>>;
    getAllFeedbackEntries(): Promise<Array<Feedback>>;
    getBlogPost(postId: bigint): Promise<BlogPost>;
    submitFeedback(name: string, email: string, message: string): Promise<bigint>;
}
