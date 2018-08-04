import { Generator, FileSet } from '@teleporthq/teleport-lib-js'
import NextComponentGenerator from './generators/component'
import NextProjectGenerator from './generators/project'

type GeneratorPlugin = (output: string) => string

export default class TeleportGeneratorNext extends Generator {
  public componentGenerator: NextComponentGenerator
  public projectGenerator: NextProjectGenerator
  public plugins: {
    [key: string]: GeneratorPlugin
  } = {}

  constructor() {
    super('next-generator', 'next')

    this.componentGenerator = new NextComponentGenerator(this)
    this.projectGenerator = new NextProjectGenerator(this, this.componentGenerator)
  }

  public generateComponent<T, U>(component: T, options: U): FileSet {
    return this.componentGenerator.generate(component, options)
  }

  public generateProject(component: any, options: any): FileSet {
    return this.projectGenerator.generate(component, options)
  }

  public usePlugin(pluginName: string, plugin: GeneratorPlugin) {
    if (this.plugins[pluginName]) throw new Error(`Plugin has \`${pluginName}\` has already been registered`)

    this.plugins[pluginName] = plugin
  }
}
