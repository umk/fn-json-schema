import fs from 'fs/promises'
import path from 'path'

type PackageInfo = {
  /** The name of the package */
  name: string
  /** The version of the package */
  version: string
  /** A short description of the package */
  description: string | undefined
  /** Path to the TypeScript definition file for the package */
  types: string | undefined
}

export async function getPackageInfo(packagePath: string): Promise<PackageInfo> {
  const p = path.join(packagePath, 'package.json')
  try {
    const s = await fs.stat(p)
    if (!s.isFile()) {
      throw new Error('The package.json is not a file')
    }
  } catch (error) {
    if (error instanceof Object && 'code' in error && error.code === 'ENOENT') {
      throw new Error("The directory doesn't contain a package.json file")
    }
    throw error
  }
  try {
    const buffer = await fs.readFile(p)
    const { name, version, description, types, main } = JSON.parse(buffer.toString())
    if (!name || !version || !main) {
      throw new Error('The package.json is missing a name, version or entry point')
    }
    return { name, version, description, types }
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Cannot parse package.json file because it's not a valid JSON")
    }
    throw error
  }
}

export default PackageInfo
