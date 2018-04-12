import * as _ from 'lodash'
import * as prettier from 'prettier'
import { ProjectGenerator, Generator, RenderResult } from '../../teleport-lib-js'
import TeleportGeneratorNext from '../index'
import packageRenderer from '../renderers/package'
import NextComponentGenerator from './component'

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
    result.addFile(
      'package.json',
      packageRenderer(project)
    )

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
