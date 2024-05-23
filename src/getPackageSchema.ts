import path from 'path'

import ts from 'typescript'

import PackageFunction from './PackageFunction'
import getPackageFunctions from './getPackageFunctions'
import readTsconfig from './readTsconfig'

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
  const tsconfigData = readTsconfig(tsconfigPath)
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
