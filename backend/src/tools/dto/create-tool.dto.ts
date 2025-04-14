import { Brand, Category } from '@prisma/client';

export class CreateToolDto {
  name: string;
  category?: Category;
  brand?: Brand;
}
