import ts from 'typescript'

import NotSupportedError from '../NotSupportedError.js'

import GenerateSchemaContext from './GenerateSchemaContext.js'
import GenerateSchemaResult from './GenerateSchemaResult.js'
import generateSchema from './generateSchema.js'

function generateArraySchema(
  context: GenerateSchemaContext,
  checker: ts.TypeChecker,
  type: ts.Type,
): GenerateSchemaResult | undefined {
  const item = getArrayItemType(checker, type)
  if (item) {
    const itemSchema = generateSchema(context, checker, item.symbol, item)
    if (!itemSchema) throw new NotSupportedError('Cannot determine schema for array item.')
    return {
      schema: { type: 'array', items: itemSchema.schema },
      isRequired: true,
    }
  }
  return undefined
}

function getArrayItemType(checker: ts.TypeChecker, type: ts.Type): ts.Type | undefined {
  const index = type.getNumberIndexType()
  if (index) return index
  if (type.flags & ts.TypeFlags.Object) {
    if (
      type.symbol &&
      ['Generator', 'AsyncGenerator', 'Iterator', 'AsyncIterator'].includes(type.symbol.name) &&
      (type.getProperty('next')?.flags || 0) & ts.SymbolFlags.Method
    ) {
      const argumentz = checker.getTypeArguments(type as ts.TypeReference)
      if (argumentz.length > 0) return argumentz[0]
    }
  }
  return undefined
}

export default generateArraySchema
