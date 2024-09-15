import ts from 'typescript'

import NotSupportedError from '../NotSupportedError.js'

import GenerateSchemaContext from './GenerateSchemaContext.js'
import GenerateSchemaResult from './GenerateSchemaResult.js'
import generateSchemaByType from './generateSchemaByType.js'
import resolvePrimitiveType from './resolvePrimitiveType.js'

function generateUnionSchema(
  context: GenerateSchemaContext,
  checker: ts.TypeChecker,
  type: ts.UnionType,
): GenerateSchemaResult | undefined {
  const types = type.types.filter((t) => !(t.flags & ts.TypeFlags.VoidLike))
  // Were there any types removed as being undefined?
  const isRequired = types.length === type.types.length
  if (
    types.length === 1 ||
    // A special case of a boolean represented as a union of true + false
    types.every((t) => t.flags & ts.TypeFlags.BooleanLike)
  ) {
    const [current] = types
    const schema = generateSchemaByType(context, checker, current.symbol, current)
    return schema && { ...schema, isRequired }
  } else {
    const { flags, values } = resolveUnion(type)
    const primitiveType = resolvePrimitiveType(flags)
    return (
      primitiveType && {
        schema: { type: primitiveType, enum: values },
        isRequired,
      }
    )
  }
}

function resolveUnion(type: ts.UnionType): {
  /** Bitwise AND of the union members flags */
  flags: ts.TypeFlags
  /** The values assignable to variable of the union type */
  values?: Array<string | number>
} {
  const values = type.types.map(
    (cur) => {
      if (!cur.isLiteral()) {
        throw new NotSupportedError('The union value can only be represented by a literal')
      }
      const value = cur.value
      if (typeof value === 'string' || typeof value === 'number') {
        return value
      }
      throw new NotSupportedError('The union value must be a string or number')
    },
    [] as Array<string | number>,
  )
  const flags = type.types.reduce((prev, cur) => prev & cur.flags, -1 as ts.TypeFlags)
  if (flags === (0 as ts.TypeFlags)) {
    throw new NotSupportedError('The union must be represented by values of the same type')
  }
  return { flags, values }
}

export default generateUnionSchema
