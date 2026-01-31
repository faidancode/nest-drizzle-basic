import * as z from 'zod';

export const CreateBrandSchema = z.object({
  name: z.string().min(3).max(120),
  slug: z.string().min(3).max(160).optional(),
  icon: z.string().max(80).optional(),
  description: z.string().max(255).optional(),
  isActive: z.boolean().optional().default(true),
});

export type CreateBrandInput = z.infer<typeof CreateBrandSchema>;

export const UpdateBrandSchema = CreateBrandSchema.partial();
export type UpdateBrandInput = z.infer<typeof UpdateBrandSchema>;
