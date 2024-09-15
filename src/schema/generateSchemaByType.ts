import ts from 'typescript'

import { getDescription } from '../helpers/typescript/index.js'

import GenerateSchemaContext from './GenerateSchemaContext.js'
import GenerateSchemaResult from './GenerateSchemaResult.js'
import generateArraySchema from './generateArraySchema.js'
import generateMappedTypeSchema from './generateMappedTypeSchema.js'
import generateObjectSchema from './generateObjectSchema.js'
import generatePrimitiveTypeSchema from './generatePrimitiveTypeSchema.js'
import generatePromiseSchema from './generatePromiseSchema.js'
import generateUnionSchema from './generateUnionSchema.js'

function generateSchemaByType(
  context: GenerateSchemaContext,
  checker: ts.TypeChecker,
  symbol: ts.Symbol | undefined,
  type: ts.Type,
): GenerateSchemaResult | undefined {
  const description = symbol && getDescription(checker, symbol)
  const isOptional = !!((symbol?.flags || 0) & ts.SymbolFlags.Optional)
  const schema = generateSchemaByTypeImpl(context, checker, type)
  if (schema) {
    schema.schema.description = description
    schema.isRequired &&= !isOptional
  }
  return schema
}

function generateSchemaByTypeImpl(
  context: GenerateSchemaContext,
  checker: ts.TypeChecker,
  type: ts.Type,
): GenerateSchemaResult | undefined {
  const current = context.getDefinition(type.symbol)
  if (current) {
    if (context.isEntered(type.symbol)) {
      current.isRecursive = true
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return current.isRecursive ? { schema: current.ref, isRequired: true } : current.generated!
  }
  context.enter(type.symbol)
  try {
    if (type.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) {
      return { schema: {}, isRequired: true }
    }
    if (type.flags & ts.TypeFlags.Object) {
      return (
        generateMappedTypeSchema(context, checker, type) ||
        generatePromiseSchema(context, checker, type) ||
        generateArraySchema(context, checker, type) ||
        generateObjectSchema(context, checker, type)
      )
    }
    if (type.isUnion()) {
      return generateUnionSchema(context, checker, type)
    }
    return generatePrimitiveTypeSchema(type)
  } finally {
    context.leave(type.symbol)
  }
}

export default generateSchemaByType
