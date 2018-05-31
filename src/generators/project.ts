import * as _ from 'lodash'
import * as prettier from 'prettier-standalone'
import * as teleport from 'teleport-lib-js'
import TeleportGeneratorNext from '../index'
import packageRenderer from '../renderers/package'
import NextComponentGenerator from './component'

const { ProjectGenerator, Generator, RenderResult } = teleport

export default class ReactProjectGenerator extends ProjectGenerator {
  public generator: TeleportGeneratorNext
  public componentGenerator: NextComponentGenerator

  constructor(generator: TeleportGeneratorNext, componentGenerator: NextComponentGenerator) {
    super(generator as Generator)
    this.componentGenerator = componentGenerator
  }

  public generate(project: any, options: any = {}): RenderResult {
    const { name, components, pages } = project

    const result = new RenderResult()
    const pkg = packageRenderer(project)

    result.addFile(
      'package.json',
      pkg
    )

    console.log('after pkg render')
    if (components) {
      Object.keys(components).map(componentName => {
        const component = components[componentName]
        const componentResults = this.componentGenerator.generate(component)
        componentResults.getFileNames().map(fileName => {
          result.addFile(
            `components/${fileName}`,
            componentResults.getContent(fileName)
          )
        })
      })
    }

    if (pages) {
      Object.keys(pages).map(pageName => {
        const page = pages[pageName]
        const pageResults = this.componentGenerator.generate(page)
        pageResults.getFileNames().map(fileName => {
          result.addFile(
            `pages/${fileName}`,
            pageResults.getContent(fileName)
          )
        })
      })
    }

    return result
  }

  public publish(path: string, archive: boolean = false): void {
  }
}
