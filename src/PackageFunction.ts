import JsonSchema from './JsonSchema'

type PackageFunction = {
  name: string
  signature: Signature
}

export type Signature = {
  description?: string
  parameters: Array<SignatureParameter>
  result: SignatureResult | undefined
  required?: Array<string>
}

export type SignatureParameter = {
  name: string
  schema: JsonSchema
}

export type SignatureResult = {
  description?: string
  schema: JsonSchema
}

export default PackageFunction
