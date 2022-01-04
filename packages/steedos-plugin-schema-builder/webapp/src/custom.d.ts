declare module '*.scss' {
  const content: any
  export = content
}

declare module '*.xsd' {
  const content: any
  export = content
}

declare module '*.hbs' {
  const content: any
  export = content
}

declare module '*.json' {
  const content: any
  export = content
}

declare module '@terminus/nusi'
declare module '@terminus/react-monaco-async'
declare module 'react-splitter-layout'
// declare module 'require'

interface Window {
  require: any
  define: any
}

interface IDictionary {
  [index: string]: any
}
