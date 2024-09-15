import { JsonSchema } from './schema/index.js'

type PackageFunction = {
  name: string
} & (PackageFunctionSignature | PackageFunctionError)

export type PackageFunctionSignature = {
  signature: Signature
}

export type PackageFunctionError = {
  error: string
}

export type Signature = {
  description?: string
  parameters: Array<SignatureParameter>
  response: SignatureReturn | undefined
}

export type SignatureParameter = {
  name: string
  schema: JsonSchema
  isRequired: boolean
}

export type SignatureReturn = {
  description?: string
  schema: JsonSchema
}

export default PackageFunction
