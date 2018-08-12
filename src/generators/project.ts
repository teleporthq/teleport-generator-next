import { ProjectGenerator, Generator, FileSet } from '@teleporthq/teleport-lib-js'
import TeleportGeneratorNext from '../index'
import packageRenderer from '../renderers/package'
import NextComponentGenerator from './component'
import documentPage from '../templates/documentPage'
import serverFile from '../templates/server'

export default class ReactProjectGenerator extends ProjectGenerator {
  public componentGenerator: NextComponentGenerator

  constructor(generator: TeleportGeneratorNext, componentGenerator: NextComponentGenerator) {
    super(generator as Generator)
    this.componentGenerator = componentGenerator
  }

  public getHtmlHeadItemAttributes(attributes) {
    const attributesStrings = []
    Object.keys(attributes).forEach((attributeName) => {
      attributesStrings.push(`${attributeName}="${attributes[attributeName]}"`)
    })
    return attributesStrings.join(' ')
  }

  public generate(project: any, options: any = {}): FileSet {
    const { components, pages, targets } = project

    const result = new FileSet()
    const pkg = packageRenderer(project)

    result.addFile('package.json', pkg)

    if (components) {
      Object.keys(components).map((componentName) => {
        const component = components[componentName]
        const componentResults = this.componentGenerator.generate(component)
        componentResults.getFileNames().map((fileName) => {
          result.addFile(`components/${fileName}`, componentResults.getContent(fileName))
        })
      })
    }

    if (targets && targets.web && targets.web.head) {
      const headString = Object.keys(targets.web.head)
        .map((tagName) => {
          const tag = targets.web.head[tagName]
          const { innerString, attributes } = tag
          const attributesString = attributes ? this.getHtmlHeadItemAttributes(attributes) : ''

          if (!innerString) {
            return `<${tagName} ${attributesString}/>\n`
          } else {
            return `<${tagName} ${attributesString}>{\`
              ${innerString}
            \`}</${tagName}>\n`
          }
        })
        .join('\n')

      result.addFile(`pages/_document.js`, documentPage(headString))
    }

    if (pages) {
      Object.keys(pages).map((pageName) => {
        const page = pages[pageName]
        const pageResults = this.componentGenerator.generate(page, { isPage: true })
        pageResults.getFileNames().map((fileName) => {
          result.addFile(`pages/${fileName}`, pageResults.getContent(fileName))
        })
      })
    }

    // add routes, if any
    result.addFile('routes.js', this.getRoutesFile(pages))

    // add the server.js file
    result.addFile('server.js', serverFile())

    return result
  }

  public getRoutesFile(pages) {
    const routes = {}

    if (pages) {
      Object.keys(pages).map((pageName) => {
        const { url } = pages[pageName]
        routes['/' + url] = '/' + pageName
      })
    }

    return `module.exports = ${JSON.stringify(routes, null, 2)}`
  }
}
