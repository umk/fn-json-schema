type JsonSchema = {
  description?: string
} & (JsonSchemaObject | JsonSchemaArray | JsonSchemaPrimitive)

export type JsonSchemaObject = {
  type: 'object'
  properties: Record<string, JsonSchema>
  required?: Array<string>
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
