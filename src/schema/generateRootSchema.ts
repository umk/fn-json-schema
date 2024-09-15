import ts from 'typescript'

import GenerateSchemaContext from './GenerateSchemaContext.js'
import GenerateSchemaResult from './GenerateSchemaResult.js'
import JsonSchema from './JsonSchema.js'
import generateSchema from './generateSchema.js'

function generateRootSchema(
  checker: ts.TypeChecker,
  symbol: ts.Symbol | undefined,
  type?: ts.Type,
): GenerateSchemaResult | undefined {
  const context = new GenerateSchemaContext()
  const schema = generateSchema(context, checker, symbol, type)
  if (schema) {
    const recursiveDefs = Array.from(context.definitions)
      .filter((d) => d.isRecursive)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .map((d) => [d.name, d.generated!.schema] as const)
    if (recursiveDefs.length > 0) {
      schema.schema = {
        ...schema.schema,
        $defs: Object.fromEntries(recursiveDefs),
      } as JsonSchema
    }
  }
  return schema
}

export default generateRootSchema
