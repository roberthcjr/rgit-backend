import { Brand, Bundle, Category, Tool_Status } from '@prisma/client';

export class Tool {
  id: string;
  name: string;
  insertedAt: Date;
  wastage: number;
  status: Tool_Status;
  category?: Category;
  brand?: Brand;
  bundle?: Bundle;
}
