import * as z from 'zod';

export const CreateCategorySchema = z.object({
  name: z.string().min(3).max(120),
  slug: z.string().min(3).max(160).optional(),
  icon: z.string().max(80).optional(),
  description: z.string().max(255).optional(),
  isActive: z.boolean().optional().default(true),
});

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = CreateCategorySchema.partial();
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
