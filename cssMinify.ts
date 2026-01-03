import { composeVisitors, transform } from 'lightningcss'
function resolveThemeVariables(themeLookup: Map<string, any>) {
  themeLookup.forEach((values, key, map) => {
    map.set(
      key,
      values.flatMap(v => {
        if (v.type === 'var') {
          const lookup = map.get(v.value.name.ident)
          if (lookup) {
            return lookup
          }
        }
        return v
      }),
    )
  })
  return themeLookup
}
const referencedVariables = new Map<string, number>()
const referencedAnimations = new Set<string>()
let themeLookup = new Map<string, any>()
let variableCounter = 0
let pass1Visitor = {
  Variable(v) {
    const name = v.name.ident
    if (!referencedVariables.has(name))
      referencedVariables.set(name, variableCounter++)
  },
  Declaration: {
    animation(v) {
      v.value.forEach(element => {
        const name = element?.name?.value
        if (name) referencedAnimations.add(name)
      })
    },
  },
  Rule(v) {
    if (v.type === 'layer-block' && v.value.name?.includes('theme')) {
      const declarations = v.value.rules
        .flatMap(r => {
          return r.value?.declarations?.declarations
        })
        .filter(r => r?.property === 'custom')

      declarations?.forEach(declaration => {
        const name = declaration.value.name
        const value = declaration.value.value
        themeLookup.set(name, value)
      })
    }
    return v
  },
}
let pass2Visitor = {
  Declaration(v) {
    if (v.property === 'custom' && v?.value?.name?.startsWith('--')) {
      if (!referencedVariables.has(v.value.name)) {
        return []
      }
    }
    return v
  },
  VariableExit(v) {
    if (themeLookup.has(v.name.ident)) {
      return themeLookup.get(v.name.ident)
    }
  },
  Rule: {
    keyframes(v) {
      if (!referencedAnimations.has(v.value.name.value)) return []
    },
    property(v) {
      if (!referencedVariables.has(v.value.name)) return []
    },
  },
}
let pass3Visitor = {
  Declaration(v) {
    if (v.property === 'custom') {
      if (themeLookup.has(v.value.name)) {
        return []
      }
    }
  },
  DashedIdent(v) {
    const lookup = referencedVariables.get(v)
    if (lookup) {
      return '--e' + lookup
    }
  },
}
export function retransform(css) {
  let pass1 = transform({
    code: Buffer.from(css),
    minify: false,
    filename: '',
    visitor: composeVisitors([pass1Visitor]),
  })
  themeLookup = resolveThemeVariables(themeLookup)
  themeLookup = resolveThemeVariables(themeLookup)
  let pass2 = transform({
    code: pass1.code,
    minify: false,
    filename: '',
    visitor: composeVisitors([pass2Visitor]),
  })
  let pass3 = transform({
    code: pass2.code,
    minify: true,
    filename: '',
    visitor: composeVisitors([pass3Visitor]),
    unusedSymbols: [
      'container',
      '!transition',
      '!transform',
      '!visible',
      '!block',
    ],
  })
  return pass3.code.toString()
}

export function cssMinify() {
  return {
    name: 'minifyCss',
    generateBundle(options, bundle) {
      const cssFiles = Object.keys(bundle)
        .filter(key => key.endsWith('.css'))
        .map(key => bundle[key])

      cssFiles.forEach(css => {
        let cssCode = css.source

        cssCode = retransform(cssCode)

        css.source = cssCode
      })
    },
  }
}
