import { retransform } from './cssMinify'
//@ts-ignore
const file = Bun.file('./dist/assets/index-DyY_E7DC.css')

let css = await file.text()

css = retransform(css)

//console.log(JSON.stringify([...referencedVariables], null, 2))
console.log(css)

export {}
