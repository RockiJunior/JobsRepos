import { Injectable, PipeTransform } from '@nestjs/common';
import { BadRequestException } from '../../../config/exceptions/bad.request.exception';

@Injectable()
export class ValidateDatePipe implements PipeTransform {
  transform(value: string): string {
    try {
      return new Date(value).toISOString();
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
