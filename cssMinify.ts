import { transform } from 'lightningcss'
function removeUnusedCssVariables(css: string) {
  const usedVars = new Set(css.match(/(?<=var\()--[-\d\w]+(?=\))/g))

  const declarations = css.matchAll(/(--[-\w\d]+):[^;}]+[;]?(?=\})?/g)

  for (const match of declarations) {
    const [full, varName] = match
    if (!usedVars.has(varName)) {
      //console.log(full + '\n')
      css = css.replace(full, '')
    }
  }

  return css
}

function substituteCssVariables(css: string) {
  const declarations = css.matchAll(/(--[-\w\d]+):([^;}]+)[;}]/g)
  const references = css.matchAll(/var\((--[-\w\d]+)\)/g)
  const varLookup = {}
  for (const match of declarations) {
    const [full, varName, varValue] = match
    varLookup[varName] = varValue
  }
  for (const match of references) {
    const [full, varName] = match
    if (varLookup[varName]) {
      css = css.replace(full, varLookup[varName])
    }
  }
  return css
}

function retransform(css) {
  let { code, map } = transform({
    code: Buffer.from(css),
    minify: true,
    filename: '',
  })

  css = code.toString()
  return css
}

function minifyCSSVariables(css: string) {
  const varList = new Set(css.match(/(?<!@property\s*)--[-\w\d]+(?=\:)/g))
  const usedVarList = new Set(css.match(/--[-\w\d]+(?=:)/g))

  let i = 0
  varList.forEach(variable => {
    if (!usedVarList.has(variable)) {
      css = css.replaceAll(variable, '""')
      css = css.replaceAll('var("")', '')
      css = css.replaceAll(/var\("",([^\)]+)\)/g, '$1')
      css = css.replaceAll(/(?<!@property\s*)--[-\w\d]+:\s;/g, '')
    } else {
      css = css.replaceAll(variable, '--e' + i++)
    }
  })

  return css
}
/*
//@ts-ignore
const file = Bun.file('./dist/assets/index-DmRd3Q2H.css')

let css = await file.text()
css = substituteCssVariables(css)
css = removeUnusedCssVariables(css)
css = minifyCSSVariables(css)
css = retransform(css)
console.log(css)*/

export function cssMinify() {
  return {
    name: 'minifyCss',
    generateBundle(options, bundle) {
      const cssFiles = Object.keys(bundle)
        .filter(key => key.endsWith('.css'))
        .map(key => bundle[key])

      cssFiles.forEach(css => {
        let cssCode = css.source
        //cssCode = minifyCSSVariables(cssCode)

        cssCode = substituteCssVariables(cssCode)
        cssCode = removeUnusedCssVariables(cssCode)
        cssCode = minifyCSSVariables(cssCode)
        cssCode = retransform(cssCode)

        css.source = cssCode
      })
    },
  }
}
