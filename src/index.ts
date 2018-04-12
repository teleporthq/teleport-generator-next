import { Generator, RenderResult } from '../teleport-lib-js'
import ReactComponentGenerator from './generators/component'
import ReactProjectGenerator from './generators/project'

export default class TeleportGeneratorNext extends Generator {
  constructor() {
    super('next-generator', 'next')

    this.componentGenerator = new ReactComponentGenerator(this)
    this.projectGenerator = new ReactProjectGenerator(this, this.componentGenerator)
  }

  public generateComponent(component: any, options: any): RenderResult {
    return this.componentGenerator.generate(component, options)
  }

  public generateProject(component: any, options: any): RenderResult {
    return this.projectGenerator.generate(component, options)
  }
}
