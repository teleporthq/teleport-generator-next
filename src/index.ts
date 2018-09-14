import { FileSet, ComponentCodeGenerator } from '@teleporthq/teleport-lib-js'
import TeleportGeneratorReact from '@teleporthq/teleport-generator-react'
import { Project, Component, ProjectGeneratorOptions, ComponentGeneratorOptions } from '@teleporthq/teleport-lib-js/dist/types'
import { NextProjectGeneratorOptions } from './types'

export default class TeleportGeneratorNext extends TeleportGeneratorReact {
  constructor(name?: string, targetName?: string, customRenderers?: { [ley: string]: ComponentCodeGenerator }) {
    super('next-generator', 'next')
  }

  public generateComponent(component: Component, options: ComponentGeneratorOptions): FileSet {
    return this.componentGenerator.generate(component, { ...options, renderer: 'styled-jsx' })
  }

  public generateProject(project: Project, options: ProjectGeneratorOptions & NextProjectGeneratorOptions): FileSet {
    const { generateDocumentFile, generateConfigFile, generateAllFiles, ...projectGeneratorOptions } = options
    const result = this.projectGenerator.generate(project, { ...projectGeneratorOptions, renderer: 'styled-jsx' })

    if (options.generatePackageFile || generateAllFiles) {
      result.merge(this.generatePackage(project))
    }

    if (generateDocumentFile || generateAllFiles) {
      result.merge(this.generateDocumentsPage(project))
    }

    if (generateConfigFile || generateAllFiles) {
      result.merge(this.generateConfigFile(project))
    }

    return result
  }

  public generatePackage(project: Project): FileSet {
    const result = new FileSet()

    const pkg = {
      author: 'Unknown',
      dependencies: {
        next: '^6.1.1',
        react: '^16.3.0',
        'react-dom': '^16.3.0',
      },
      description: '',
      license: 'ISC',
      name: project.slug,
      scripts: {
        build: 'next build',
        dev: 'node server.js',
        export: 'npm run build && next export',
        start: 'next start',
      },
      version: '0.0.1',
    }

    result.addFile('package.json', JSON.stringify(pkg, null, 2))
    return result
  }

  public generateDocumentsPage(project: Project) {
    const result = new FileSet()
    const { targets } = project

    const metadata = this.parsePageMetadata(targets)
    const htmlAttrs = this.parseHTMLTagAttributes(targets)

    const content = `import Document, { Head, Main, NextScript } from 'next/document'
    export default class MyDocument extends Document {
      static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
      }
      render() {
        return (
          <html ${htmlAttrs}>
            ${metadata ? `<Head>${metadata}</Head>` : ''}
            <body className="custom_class">
              <Main />
              <NextScript />
            </body>
          </html>
        )
      }
    }`

    result.addFile('pages/_document.js', content)

    return result
  }

  public generateConfigFile(project: Project): FileSet {
    const result = new FileSet()

    const routes = {}

    if (project.pages) {
      Object.keys(project.pages).map((pageName) => {
        let { url } = project.pages[pageName]
        if (url) {
          if (url[0] === '/') {
            url = url.substr(1)
          }
        }

        routes[`/${url || pageName}`] = { page: '/' + pageName }
      })
    }
    result.addFile(
      'next.config.js',
      `module.exports = {
      exportPathMap: function(defaultPathMap) {
        return ${JSON.stringify(routes, null, 4)}
      }
    }`
    )
    return result
  }

  private parseHTMLTagAttributes(targets) {
    if (!targets || !targets.web || !targets.web.htmlTag) return ''

    const { attributes } = targets.web.htmlTag
    return this.buildAttributesString(attributes)
  }

  private parsePageMetadata(targets) {
    if (!targets || !targets.web || !targets.web.head) return null

    return targets.web.head
      .map(({ innerString, attributes, tagName }) => {
        const attributesString = attributes ? this.buildAttributesString(attributes) : ''

        if (!innerString) {
          return `<${tagName} ${attributesString}/>\n`
        }

        return `<${tagName} ${attributesString}>{\`
            ${innerString}
          \`}</${tagName}>\n`
      })
      .join('\n')
  }

  private buildAttributesString(attributes) {
    if (!attributes || typeof attributes !== 'object') return null

    return Object.keys(attributes)
      .map((key) => `${key}="${attributes[key]}"`)
      .join(' ')
  }
}
