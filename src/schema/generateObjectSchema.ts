import ts from 'typescript'

import NotSupportedError from '../NotSupportedError.js'
import { getDescription } from '../helpers/typescript/index.js'

import GenerateSchemaContext from './GenerateSchemaContext.js'
import GenerateSchemaResult from './GenerateSchemaResult.js'
import JsonSchema from './JsonSchema.js'
import cacheRecursiveTypes from './cacheRecursiveTypes.js'
import generateSchema from './generateSchema.js'

const generateObjectSchema = cacheRecursiveTypes(function (
  context: GenerateSchemaContext,
  checker: ts.TypeChecker,
  type: ts.Type,
): GenerateSchemaResult {
  const required: Array<string> = []
  const properties = type.getProperties().reduce(
    (prev, cur) => {
      const description = getDescription(checker, cur)
      const propertySchema = generateSchema(context, checker, cur)
      if (!propertySchema) throw new NotSupportedError(`Cannot determine schema for ${cur.name}`)
      const { schema, isRequired } = propertySchema
      if (isRequired) required.push(cur.name)
      schema.description = description ?? schema.description
      prev[cur.name] = schema
      return prev
    },
    {} as Record<string, JsonSchema>,
  )
  return {
    schema: { type: 'object', properties, required },
    isRequired: true,
  }
})

export default generateObjectSchema
