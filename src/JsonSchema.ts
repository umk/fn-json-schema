type JsonSchema = {
  description?: string
} & (JsonSchemaAny | JsonSchemaObject | JsonSchemaArray | JsonSchemaPrimitive)

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

export default JsonSchema
