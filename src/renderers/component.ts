import * as _ from 'lodash'

const renderDependency = (libraryName, types) => {
  return `import { ${types.join(', ')} } from '${libraryName}'`
}

export default function component(name: string, jsx: string, dependencies: any = {}, styles, props): any {
  const dependenciesArray = Object.keys(dependencies).map((libraryName) => renderDependency(libraryName, dependencies[libraryName]))

  let propsString = ''
  if (props && props.length > 0) {
    propsString = `const { ${props.join(', ')} } = this.props`
  }

  return `
    import React, { Component } from 'react'
    ${dependenciesArray.join(``)}

    export default class ${_.upperFirst(name)} extends Component {
      render () {
        ${propsString}
        return (
          ${jsx}
        )
      }
    }
  `
}
