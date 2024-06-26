import ts from 'typescript'

import NotSupportedError from './NotSupportedError'
import PackageFunction, { Signature } from './PackageFunction'
import generateSchema from './generateSchema'
import getDescription from './getDescription'
import getDescriptionByTag from './getDescriptionByTag'
import resolveAlias from './resolveAlias'

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
          functions.push(generateFunctionSchema(checker, symbol))
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

function generateFunctionSchema(checker: ts.TypeChecker, symbol: ts.Symbol): PackageFunction {
  function getSignatureSchema(signature: ts.Signature): Signature {
    const returnType = signature.getReturnType()
    const returnSchema = generateSchema(checker, undefined, returnType)
    return {
      parameters: signature.parameters.map((p) => {
        const parameterSchema = generateSchema(checker, p)
        if (!parameterSchema) {
          throw new NotSupportedError(`Cannot determine schema for parameter ${p.name}`)
        }
        const { schema, isRequired } = parameterSchema
        return { name: p.name, schema, isRequired }
      }),
      return: returnSchema && {
        schema: returnSchema.schema,
        description:
          getDescriptionByTag(signature, 'yields') || getDescriptionByTag(signature, 'returns'),
      },
      description: getDescription(checker, signature),
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const type = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
  const signatures_ = type.getCallSignatures()
  if (signatures_.length === 0) throw new Error('Value of provided type is not callable')
  const n = Math.max(...signatures_.map((s) => s.parameters.length))
  const signatures = signatures_.filter((s) => s.parameters.length === n)
  if (signatures.length !== 1) {
    throw new NotSupportedError(`Cannot determine a single signature out of ${signatures_.length}`)
  }
  const signature = getSignatureSchema(signatures[0])
  return { name: symbol.name, signature }
}

export default getSourceFileSchema
