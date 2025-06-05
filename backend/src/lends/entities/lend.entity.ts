import type { Tool, User } from '@prisma/client';

export class Lend {
  id: string;
  lendDate: Date;
  limitDate: Date;
  user: User;
  tool: Tool;
}
