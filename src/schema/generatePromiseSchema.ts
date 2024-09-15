import ts from 'typescript'

import GenerateSchemaContext from './GenerateSchemaContext.js'
import GenerateSchemaResult from './GenerateSchemaResult.js'
import generateSchemaByType from './generateSchemaByType.js'

function generatePromiseSchema(
  context: GenerateSchemaContext,
  checker: ts.TypeChecker,
  type: ts.Type,
): GenerateSchemaResult | undefined {
  if (
    type.symbol?.name === 'Promise' &&
    ['then', 'catch'].every((p) => (type.getProperty(p)?.flags ?? 0) & ts.SymbolFlags.Method)
  ) {
    const argumentz = checker.getTypeArguments(type as ts.TypeReference)
    if (argumentz.length === 1) {
      const [argument] = argumentz
      return generateSchemaByType(context, checker, argument.symbol, argument)
    }
  }
  return undefined
}

export default generatePromiseSchema
