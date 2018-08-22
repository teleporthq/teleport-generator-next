import union = require('lodash/union')

import { ComponentGenerator, Generator, FileSet } from '@teleporthq/teleport-lib-js'
import TeleportGeneratorNext from '../index'
import JSXrenderer from '../renderers/jsx'
import COMPONENTrenderer from '../renderers/component'

function findNextIndexedKeyInObject(object, key) {
  if (!object[key]) return key
  let i = 1
  while (object[key + '_' + i] !== undefined) {
    i++
  }
  return key + '_' + i
}

export default class NextComponentGenerator extends ComponentGenerator {
  public generator: TeleportGeneratorNext

  constructor(generator: TeleportGeneratorNext) {
    super(generator as Generator)
  }

  public processStyles(componentContent: any, styles: any): any {
    const content = JSON.parse(JSON.stringify(componentContent))

    if (content.style) {
      const className = content.name || findNextIndexedKeyInObject(styles, content.type)
      styles[className] = content.style
      delete content.style
      content.className = [className]
    }

    // if has children, do the same for children
    if (content.children && content.children.length > 0) {
      if (typeof content.children !== 'string') {
        content.children = content.children.map((child) => {
          const childStyledResults = this.processStyles(child, styles)
          styles = {
            ...styles,
            ...childStyledResults.styles,
          }
          return childStyledResults.content
        })
      }
    }

    return { styles, content }
  }

  public computeDependencies(content: any, isPage: boolean): any {
    const dependencies = {}

    const { type, children, props } = content
    let { source } = content

    // if no source is specified, default to 'components'
    if (!source) source = 'components'

    if (type) {
      if (source === 'components') {
        // manage the case of component being a page
        const componentDependencies = {
          [`${isPage ? '../components/' : './'}${type}`]: [type],
        }

        if (props && props.children && props.children.length > 0 && typeof props.children !== 'string') {
          const childrenDependenciesArray = props.children.map((child) => {
            return this.computeDependencies(child, isPage)
          })

          if (childrenDependenciesArray.length) {
            childrenDependenciesArray.forEach((childrenDependency) => {
              Object.keys(childrenDependency).forEach((childrenDependencyLibrary) => {
                if (!componentDependencies[childrenDependencyLibrary]) componentDependencies[childrenDependencyLibrary] = []

                componentDependencies[childrenDependencyLibrary] = union(
                  componentDependencies[childrenDependencyLibrary],
                  childrenDependency[childrenDependencyLibrary]
                )
              })
            })
          }
        }

        return componentDependencies
      }

      const elementMapping = this.generator.target.map(source, type)
      // custom source case
      if (elementMapping) {
        if (elementMapping.source) {
          // if the library is not yet in the dependencies, add it
          if (!dependencies[elementMapping.source]) dependencies[elementMapping.source] = []

          // if the type is not yet in the deps for the current library, add it
          if (dependencies[elementMapping.source].indexOf(elementMapping.type) < 0)
            dependencies[elementMapping.source].push({
              // @ts-ignore
              defaultImport: elementMapping.defaultImport,
              type: elementMapping.type,
            })
        }
      } else {
        // tslint:disable:no-console
        // console.error(`could not map '${type}' from '${source}' for target '${this.generator.targetName}'`)
      }
    }

    // if there are childrens, get their deps and merge them with the current ones
    if (children && children.length > 0 && typeof children !== 'string') {
      const childrenDependenciesArray = children.map((child) => this.computeDependencies(child, isPage))
      if (childrenDependenciesArray.length) {
        childrenDependenciesArray.forEach((childrenDependency) => {
          Object.keys(childrenDependency).forEach((childrenDependencyLibrary) => {
            if (!dependencies[childrenDependencyLibrary]) dependencies[childrenDependencyLibrary] = []

            dependencies[childrenDependencyLibrary] = union(dependencies[childrenDependencyLibrary], childrenDependency[childrenDependencyLibrary])
          })
        })
      }
    }

    return dependencies
  }

  public renderComponentJSX(content: any, isRoot: boolean = false, styles?: any): any {
    const { type, className, source, ...props } = content
    // retrieve the target type from the lib
    let mapping: any = null
    let mappedType: string = type

    if (source !== 'components') {
      mapping = this.generator.target.map(source, type)
      if (mapping) mappedType = mapping.type
    }

    // there are cases when no children are passed via structure, so the deconstruction will fail
    let children = null
    if (props.children) children = props.children

    // remove the children from props
    delete props.children

    let childrenJSX: any = []
    if (children && children.length > 0) {
      if (typeof children === 'string') {
        if (children.indexOf('$props.') === 0) {
          const propKey = children.replace('$props.', '')
          childrenJSX = `{this.props.${propKey}}`
        } else {
          // override Html default behavior regarding left and right trimming
          if (children.indexOf(' ') === 0) children = '&nbsp;' + children

          if (children.substr(children.length - 1) === ' ') children += '&nbsp;'

          // check for < and > and replace with their html entities otherwise
          childrenJSX = children.replace(/</g, '&lt;').replace(/>/g, '&gt;')
        }
      } else {
        childrenJSX = children.map((child) => this.renderComponentJSX(child))
      }
    }

    const { name, props: componentProps, ...otherProps } = props // this is to cover img uri props; aka static props

    let mappedProps = { ...componentProps, ...otherProps }

    if (mapping && typeof mapping.props === 'function') {
      mappedProps = mapping.props(mappedProps)
    }

    if (mappedProps.children && Array.isArray(mappedProps.children)) {
      childrenJSX = mappedProps.children.map((child) => this.renderComponentJSX(child))
      delete mappedProps.children
    }

    if (Array.isArray(childrenJSX)) {
      childrenJSX = childrenJSX.join('')
    }

    return JSXrenderer(mappedType, childrenJSX, className, isRoot, styles, mappedProps)
  }

  public generate(component: any, options: any = {}): FileSet {
    const { isPage } = options
    const { name } = component

    let { content } = component
    const dependencies = this.computeDependencies(content, isPage)

    const stylingResults = this.processStyles(content, {})

    const styles = stylingResults.styles
    content = stylingResults.content

    const jsx = this.renderComponentJSX(content, true, styles)

    const props = component.editableProps ? Object.keys(component.editableProps) : null

    const result = new FileSet()

    result.addFile(`${component.name}.js`, COMPONENTrenderer(name, jsx, dependencies, props))

    return result
  }
}
