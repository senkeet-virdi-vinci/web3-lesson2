import type { Category } from "../types/category.ts";
import { db } from "../src/prisma/db.ts";

export class CategoriesService {
  public static async getCategories(): Promise<Category[]> {
    return await db.orm.public.Category.all();
  }
}