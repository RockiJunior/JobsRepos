import { PipeTransform, Injectable, ArgumentMetadata, Logger } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { BadRequestException } from '../exceptions/bad.request.exception';
import { EXCEPTION_CODES } from '../exceptions/codes/exception.codes';

// dudes
// https://www.npmjs.com/package/class-validator
// https://docs.nestjs.com/techniques/validation
// https://docs.nestjs.com/pipes
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  private logger: Logger = new Logger('ValidationPipe');

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    // const errors = await validate(object, { whitelist: true, forbidNonWhitelisted: true });
    const errors: ValidationError[] = await validate(object, { whitelist: true });

    this.logger.debug(Object.keys(errors));
    this.logger.debug(errors);

    if (errors.length > 0) {
      // Si se requiere mas detalle usar la clase ValidationError de class-validator
      // e implementar un filtro propio para dichas excepciones
      const badAttributes: string = this.buildStringError(errors);
      throw new BadRequestException(EXCEPTION_CODES.PIPES.JOI, 'badAttributes', badAttributes);
    }

    return value;
  }

  /**
   * Build String Error
   * @private
   * @param {ValidationError[]} errors
   * @param {string} [accumulatorMessage='']
   * @param {string} [father='']
   * @return {*}
   * @memberof ValidationPipe
   */
  private buildStringError(errors: ValidationError[], accumulatorMessage: string = '', father: string = '') {
    for (const key in errors) {
      if (errors[key].children && errors[key].children.length === 0) {
        accumulatorMessage = accumulatorMessage.concat(` ${father}`, errors[key].property, ',');
      } else if (errors[key].children && errors[key].children.length > 0) {
        father = father === '' ? `${errors[key].property}.` : `${father}${errors[key].property}.`;
        accumulatorMessage = this.buildStringError(errors[key].children, accumulatorMessage, father);
      } else {
        father = father.substring(0, father.length - 1);
        accumulatorMessage = accumulatorMessage.concat(` ${father},`);
      }
    }

    return accumulatorMessage;
  }

  /**
   * Validate if class contain decorators
   * @private
   * @param {Function} metatype
   * @return {*}  {boolean}
   * @memberof ValidationPipe
   */
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];

    return !types.includes(metatype);
  }
}
