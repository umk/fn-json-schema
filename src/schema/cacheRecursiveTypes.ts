import ts from 'typescript'

import GenerateSchemaContext, { SchemaDefinition } from './GenerateSchemaContext.js'
import GenerateSchemaResult from './GenerateSchemaResult.js'
import getSymbolDeclarationName from './getSymbolDeclarationName.js'

function cacheRecursiveTypes<
  P extends [
    context: GenerateSchemaContext,
    checker: ts.TypeChecker,
    type: ts.Type,
    ...rest: Array<unknown>,
  ],
>(f: (...params: P) => GenerateSchemaResult) {
  return function (...params: P) {
    const [context, _checker, type] = params
    let current: SchemaDefinition | undefined
    if (type.symbol) {
      const name = getSymbolDeclarationName(type.symbol)
      current = context.createDefinition(type.symbol, name)
    }
    const result = f(...params)
    if (current) {
      current.generated = result
      if (current.isRecursive) {
        if (!result.isRequired) {
          throw new Error('The resulting type must be required for cached result.')
        }
        return { schema: current.ref, isRequired: true }
      }
    }
    return result
  }
}

export default cacheRecursiveTypes
