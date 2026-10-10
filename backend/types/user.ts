import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  bankAccount: z.string().nullable(),
});

export type User = z.infer<typeof userSchema>;

const userFilterSchema = z.object({
  id: z.coerce.number().nonnegative().optional(),
})

export type UserFilter = z.infer<typeof userFilterSchema>;

export function parseUserFilter(data: unknown): UserFilter | false {
  return parseWithSchema(userFilterSchema, data);
}

function parseWithSchema<T>(schema: z.ZodType<T>, data:unknown): T | false{
  const result = schema.safeParse(data);
  return result.success ? result.data : false;
}
