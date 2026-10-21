import { yupResolver } from '@hookform/resolvers/yup';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FieldValues, Resolver } from 'react-hook-form';
import type { ZodTypeAny } from 'zod';
import type { AnyObjectSchema } from 'yup';

/** One resolver factory for react-hook-form that accepts either a zod or a yup schema. */
export function schemaResolver<T extends FieldValues>(schema: ZodTypeAny | AnyObjectSchema): Resolver<T> {
  const isYup = typeof (schema as AnyObjectSchema).validateSync === 'function';
  return (isYup ? yupResolver(schema as AnyObjectSchema) : zodResolver(schema as ZodTypeAny)) as unknown as Resolver<T>;
}
