// src/common/http/zod-validation.pipe.ts

import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import * as z from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema?: z.ZodTypeAny) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const schema = (metadata.metatype as any)?.schema ?? this.schema;

    if (!schema) {
      return value; 
    }

    try {
      return schema.parse(value);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestException({
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: error.flatten(),
          type: metadata.type,
        });
      }
      throw error;
    }
  }
}
