export class CreateLendDto {
  limit_date: Date;
  user: {
    id: string;
  };
  tool: {
    id: number;
  };
}
