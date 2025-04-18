import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class CsvValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const fiveMb = 5 * 1024 * 1024;
    const mimeType = 'text/csv';
    return value.size < fiveMb && value.type === mimeType;
  }
}
