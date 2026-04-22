const { z } = require('zod');

const createPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  excerpt: z.string().optional(),
  primaryKeywords: z.string().optional(),
  secondaryKeywords: z.string().optional(),
  longTailKeywords: z.string().optional(),
  coverImage: z.string().url().optional().or(z.string().length(0)).or(z.null()),
  published: z.boolean().optional().default(false),
  categoryId: z.string().uuid('Invalid category ID'),
  tags: z.array(z.string()).optional().default([]),
});

const updatePostSchema = createPostSchema.partial();

module.exports = {
  createPostSchema,
  updatePostSchema,
};
