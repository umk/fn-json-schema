import ts from 'typescript'

import { resolveAlias } from '../helpers/typescript/index.js'

import GenerateSchemaContext from './GenerateSchemaContext.js'
import GenerateSchemaResult from './GenerateSchemaResult.js'
import generateSchemaByType from './generateSchemaByType.js'

function generateSchema(
  context: GenerateSchemaContext,
  checker: ts.TypeChecker,
  symbol: ts.Symbol | undefined,
  type?: ts.Type,
): GenerateSchemaResult | undefined {
  if (type) return generateSchemaByType(context, checker, symbol, type)
  if (!symbol) throw new Error('Either symbol or type must be provided')
  symbol = resolveAlias(checker, symbol)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  type = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
  return generateSchemaByType(context, checker, symbol, type)
}

export default generateSchema
