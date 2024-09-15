import ts from 'typescript'

function getSymbolDeclarationName(symbol: ts.Symbol): string {
  const declarations = symbol.getDeclarations()
  if (declarations) {
    const names = declarations
      .map((d) => {
        if (ts.isInterfaceDeclaration(d)) {
          return d.name.text
        } else if (ts.isTypeAliasDeclaration(d.parent)) {
          return d.parent.name.text
        }
        return undefined
      })
      .filter((d) => d !== undefined)
    if (names.length === 1) return names[0]
    const unique = new Set(names)
    if (unique.size === 1) return Array.from(unique)[0]
  }
  return 'anonymousType'
}

export default getSymbolDeclarationName
