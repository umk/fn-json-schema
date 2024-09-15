import ts from 'typescript'

import NotSupportedError from '../NotSupportedError.js'

function resolvePrimitiveType(flags: ts.TypeFlags) {
  if (flags & ts.TypeFlags.StringLike) {
    return 'string' as const
  } else if (flags & ts.TypeFlags.NumberLike) {
    return 'number' as const
  } else if (flags & ts.TypeFlags.BooleanLike) {
    return 'boolean' as const
  } else if (flags & ts.TypeFlags.VoidLike) {
    return undefined
  }
  throw new NotSupportedError('Could not determine schema for the data type')
}

export default resolvePrimitiveType
