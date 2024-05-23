import ts from 'typescript'

import PackageFunction from './PackageFunction'
import getSourceFileSchema from './getSourceFileSchema'

function getPackageFunctions(
  rootName: string,
  options: ts.CompilerOptions,
  host?: ts.CompilerHost,
): Array<PackageFunction> {
  const program = ts.createProgram([rootName], options, host)
  const checker = program.getTypeChecker()
  const sourceFile = program.getSourceFiles().find((f) => f.fileName === rootName)
  if (!sourceFile) {
    throw new Error('The source file could not be determined')
  }
  return getSourceFileSchema(sourceFile, checker)
}

export default getPackageFunctions
