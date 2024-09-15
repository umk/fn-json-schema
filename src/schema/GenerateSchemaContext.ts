import ts from 'typescript'

import GenerateSchemaResult from './GenerateSchemaResult.js'
import { JsonSchemaRef } from './JsonSchema.js'

export type SchemaDefinition = {
  name: string
  ref: JsonSchemaRef
  generated?: GenerateSchemaResult
  isRecursive: boolean
}

class GenerateSchemaContext {
  private readonly _definitions = new Map<ts.Symbol, SchemaDefinition>()
  private readonly _enteredSymbols = new Set<ts.Symbol>()

  createDefinition(symbol: ts.Symbol, name: string): SchemaDefinition {
    if (this._definitions.has(symbol)) {
      throw new Error(`The schema for type "${name}" is already defined.`)
    }
    let n = 0
    for (const definition of this._definitions.values()) {
      if (definition.name.startsWith(name)) {
        const suffix = definition.name.substring(name.length)
        if (/^\d*$/.test(suffix)) n++
      }
    }
    const suffix = n === 0 ? '' : String(n)
    const name_ = name + suffix
    const definition: SchemaDefinition = {
      name: name_,
      ref: { $ref: `#/$defs/${name_}` },
      isRecursive: false,
    }
    this._definitions.set(symbol, definition)
    return definition
  }

  get definitions() {
    return this._definitions.values()
  }

  getDefinition(symbol: ts.Symbol | undefined): SchemaDefinition | undefined {
    return symbol && this._definitions.get(symbol)
  }

  enter(symbol: ts.Symbol | undefined) {
    if (symbol) {
      if (this._enteredSymbols.has(symbol)) {
        throw new Error('A recursive dependency of the type on itself is not supported.')
      }
      this._enteredSymbols.add(symbol)
    }
  }

  leave(symbol: ts.Symbol | undefined) {
    if (symbol) {
      if (!this._enteredSymbols.delete(symbol)) {
        throw new Error('The type was not entered and therefore cannot be left.')
      }
    }
  }

  isEntered(symbol: ts.Symbol | undefined): boolean {
    return !!symbol && this._enteredSymbols.has(symbol)
  }
}

export default GenerateSchemaContext
