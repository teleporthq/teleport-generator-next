import * as teleport from 'teleport-lib-js'
import NextComponentGenerator from './generators/component'
import NextProjectGenerator from './generators/project'

const { Target, Generator, FileSet } = teleport

export default class TeleportGeneratorNext extends Generator {
  public name: string
  public type: string = 'generator'
  public targetName: string
  public target: Target
  public componentGenerator: NextComponentGenerator
  public projectGenerator: NextProjectGenerator

  constructor() {
    super('next-generator', 'next')

    this.componentGenerator = new NextComponentGenerator(this)
    this.projectGenerator = new NextProjectGenerator(this, this.componentGenerator)
  }

  public generateComponent(component: any, options: any): FileSet {
    return this.componentGenerator.generate(component, options)
  }

  public generateProject(component: any, options: any): FileSet {
    return this.projectGenerator.generate(component, options)
  }
}
