import ts from 'typescript'

import GenerateSchemaResult from './GenerateSchemaResult.js'
import resolvePrimitiveType from './resolvePrimitiveType.js'

function generatePrimitiveTypeSchema(type: ts.Type): GenerateSchemaResult | undefined {
  const primitiveType = resolvePrimitiveType(type.flags)
  return (
    primitiveType && {
      schema: {
        type: primitiveType,
      },
      isRequired: true,
    }
  )
}

export default generatePrimitiveTypeSchema
