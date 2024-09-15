import ts from 'typescript'

import NotSupportedError from './NotSupportedError.js'
import PackageFunction from './PackageFunction.js'
import getFunctionSchema from './getFunctionSchema.js'
import { resolveAlias } from './helpers/typescript/index.js'

function getSourceFileSchema(
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker,
): Array<PackageFunction> {
  const functions: Array<PackageFunction> = []
  const sourceFileSymbol = checker.getSymbolAtLocation(sourceFile)
  if (sourceFileSymbol) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const exports = checker.getExportsOfModule(sourceFileSymbol!)
    exports.forEach((symbol) => {
      symbol = resolveAlias(checker, symbol)
      if (symbol.flags & ts.SymbolFlags.Function) {
        try {
          functions.push(getFunctionSchema(checker, symbol))
        } catch (error) {
          if (error instanceof NotSupportedError) {
            functions.push({ name: symbol.name, error: error.message })
          } else {
            throw error
          }
        }
      }
    })
  }
  return functions
}

export default getSourceFileSchema
