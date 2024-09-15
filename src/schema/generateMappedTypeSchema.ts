import ts from 'typescript'

import GenerateSchemaContext from './GenerateSchemaContext.js'
import GenerateSchemaResult from './GenerateSchemaResult.js'
import generateSchemaByType from './generateSchemaByType.js'

function generateMappedTypeSchema(
  context: GenerateSchemaContext,
  checker: ts.TypeChecker,
  type: ts.Type,
): GenerateSchemaResult | undefined {
  const objectType = type as ts.ObjectType
  if (objectType.objectFlags & ts.ObjectFlags.Mapped) {
    const value = objectType.getStringIndexType()
    if (value) {
      const { schema } = generateSchemaByType(context, checker, value.symbol, value) || {}
      return (
        schema && {
          schema: {
            type: 'object',
            additionalProperties: schema,
          },
          isRequired: true,
        }
      )
    }
  }
  return undefined
}

export default generateMappedTypeSchema
