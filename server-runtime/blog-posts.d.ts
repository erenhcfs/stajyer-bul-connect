import type { BlogPost } from "./blog-helpers.js";
export type BlogSource = {
    label: string;
    url: string;
};
export type BlogFaq = {
    question: string;
    answer: string;
};
export type EditorialBlogPost = BlogPost & {
    sources?: BlogSource[];
    faqs?: BlogFaq[];
};
export declare const STATIC_BLOG_POSTS: EditorialBlogPost[];
export declare function mergeBlogPosts(databasePosts?: BlogPost[]): EditorialBlogPost[];
