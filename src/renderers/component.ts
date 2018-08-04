const renderDependency = (libraryName, types) => {
  const isDefaultImport = types[0].defaultImport || false
  const componentName = typeof types[0] === 'string' ? types[0] : types[0].type

  const useDefaultImport =
    // local imports are default imports
    ((libraryName.indexOf('../components') === 0 || libraryName.indexOf('./') === 0) && types.length === 1) ||
    // next imports
    libraryName.indexOf('next/') === 0 ||
    // IR defaultImport
    isDefaultImport

  return useDefaultImport ? `import ${componentName} from '${libraryName}'` : `import { ${types.join(', ')} } from '${libraryName}'`
}

export default function component(name: string, jsx: string, dependencies: any = {}, props): any {
  const dependenciesArray = Object.keys(dependencies).map((libraryName) => renderDependency(libraryName, dependencies[libraryName]))

  let propsString = ''
  if (props && props.length > 0) {
    propsString = `const { ${props.join(', ')} } = this.props`
  }

  return `import React, { Component } from 'react'
${dependenciesArray.join(`\n`)}

export default class ${name} extends Component {
  componentDidMount() {
    
  }
  
  render () {
    ${propsString}
    return (
      ${jsx}
    )
  }
}`
}
