import {
  PipeTransform,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class CsvValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!this.isAccetableSize(value))
      throw new HttpException(
        'File size greater than accepted',
        HttpStatus.BAD_REQUEST,
      );

    if (!this.isAcetableType(value))
      throw new HttpException('File type not accepted', HttpStatus.BAD_REQUEST);

    return value;
  }

  isAccetableSize(value) {
    const fiveMb = 5 * 1024 * 1024;
    return value.size < fiveMb;
  }

  isAcetableType(value) {
    const mimeType = 'text/csv';
    return value.mimetype === mimeType;
  }
}
