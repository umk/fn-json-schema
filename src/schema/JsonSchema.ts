type JsonSchema = {
  description?: string
  $defs?: JsonSchemaDefinitions
} & (JsonSchemaAny | JsonSchemaObject | JsonSchemaArray | JsonSchemaPrimitive | JsonSchemaRef)

export type JsonSchemaConcrete = JsonSchema &
  (JsonSchemaObject | JsonSchemaArray | JsonSchemaPrimitive)

export type JsonSchemaType = JsonSchemaConcrete['type']

export type JsonSchemaDefinitions = Record<string, JsonSchema>

export type JsonSchemaAny = Record<string, never>

export type JsonSchemaObject = {
  type: 'object'
  properties?: Record<string, JsonSchema>
  required?: Array<string>
  additionalProperties?: JsonSchema
}

export type JsonSchemaArray = {
  type: 'array'
  items: JsonSchema
}

export type JsonSchemaPrimitive = {
  type: 'string' | 'number' | 'integer' | 'boolean'
  enum?: Array<string | number | boolean>
}

export type JsonSchemaRef = { $ref: `#/$defs/${string}` }

export default JsonSchema
