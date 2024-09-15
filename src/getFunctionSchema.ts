import ts from 'typescript'

import NotSupportedError from './NotSupportedError.js'
import PackageFunction, { Signature } from './PackageFunction.js'
import { getDescription, getDescriptionByTag } from './helpers/typescript/index.js'
import { generateRootSchema } from './schema/index.js'

function getFunctionSchema(checker: ts.TypeChecker, symbol: ts.Symbol): PackageFunction {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const type = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
  const signatures_ = type.getCallSignatures()
  if (signatures_.length === 0) throw new Error('Value of provided type is not callable')
  const n = Math.max(...signatures_.map((s) => s.parameters.length))
  const signatures = signatures_.filter((s) => s.parameters.length === n)
  if (signatures.length !== 1) {
    throw new NotSupportedError(`Cannot determine a single signature out of ${signatures_.length}`)
  }
  const signature = getSignatureSchema(checker, signatures[0])
  return { name: symbol.name, signature }
}

function getSignatureSchema(checker: ts.TypeChecker, signature: ts.Signature): Signature {
  const responseType = signature.getReturnType()
  const responseSchema = generateRootSchema(checker, undefined, responseType)
  return {
    parameters: signature.parameters.map((p) => {
      const parameterSchema = generateRootSchema(checker, p)
      if (!parameterSchema) {
        throw new NotSupportedError(`Cannot determine schema for parameter ${p.name}`)
      }
      const { schema, isRequired } = parameterSchema
      return { name: p.name, schema, isRequired }
    }),
    response: responseSchema && {
      schema: responseSchema.schema,
      description:
        getDescriptionByTag(signature, 'yields') || getDescriptionByTag(signature, 'returns'),
    },
    description: getDescription(checker, signature),
  }
}

export default getFunctionSchema
