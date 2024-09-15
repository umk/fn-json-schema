import path from 'path'

import ts from 'typescript'

import PackageFunction from './PackageFunction.js'
import getPackageFunctions from './getPackageFunctions.js'
import { readTsConfig } from './helpers/index.js'

async function getPackageSchema(
  packagePath: string,
  packageTypes: string,
  options?: {
    tsconfig?: string
    host?: ts.CompilerHost
  },
): Promise<Array<PackageFunction>> {
  const { tsconfig = 'tsconfig.json', host } = options || {}
  const tsconfigPath = path.join(packagePath, tsconfig)
  const tsconfigData = readTsConfig(tsconfigPath)
  const rootName = path.resolve(packagePath, packageTypes)
  return getPackageFunctions(
    rootName,
    {
      ...tsconfigData.options,
      // Required to emit the undefined type by type checker
      strictNullChecks: true,
    },
    host,
  )
}

export default getPackageSchema
