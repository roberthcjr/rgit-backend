import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  pepper: string;

  constructor() {
    this.pepper = process.env.PEPPER ?? '';
  }

  async hash(password: string) {
    const pepperedPassword = this.getPepperedPassword(password);
    const rounds = this.getRounds();
    return await bcrypt.hash(pepperedPassword, rounds);
  }

  async compare(insertedPassword, hashedPassword) {
    const pepperedPassword = this.getPepperedPassword(insertedPassword);
    return await bcrypt.compare(pepperedPassword, hashedPassword);
  }

  getPepperedPassword(password: string) {
    return password + this.pepper;
  }

  getRounds() {
    return Number(process.env.ROUNDS ?? 1);
  }
}
