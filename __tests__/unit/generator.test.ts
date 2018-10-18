import { FileSet, Target } from '@teleporthq/teleport-lib-js'
import TeleportGeneratorReact from '@teleporthq/teleport-generator-react'
import TeleportGeneratorNext from '../../src'
import getFromLocal from './utils/getFromLocal'

const data = getFromLocal('data.json')

describe('Next generator', () => {
  it('should return react generator', () => {
    const generator = new TeleportGeneratorNext()
    expect(generator).toBeInstanceOf(TeleportGeneratorReact)
  })

  it('should generate component', () => {
    const { component } = data
    const generator = new TeleportGeneratorNext()
    const target = new Target('next')

    const generatedComponent = generator.generateComponent(component, { target })
    expect(generatedComponent).toBeInstanceOf(FileSet)
  })

  it('should generate project alone', () => {
    const { project } = data
    const generator = new TeleportGeneratorNext()
    const target = new Target('next')

    const generatedProject = generator.generateProject(project, { target })
    const generatedFilesLength = Object.keys(generatedProject.filesByName).length
    const componentsCount = Object.keys(project.components).length
    const pagesCount = Object.keys(project.pages).length

    expect(generatedProject).toBeInstanceOf(FileSet)
    expect(generatedFilesLength).toBe(componentsCount + pagesCount)
  })

  it('should generate project with config files', () => {
    const { project } = data
    const generator = new TeleportGeneratorNext()
    const target = new Target('next')
    const configFiles = {
      generatePackageFile: true,
      generateDocumentFile: true,
      generateConfigFile: true,
    }
    const options = { target, ...configFiles }

    const generatedProject = generator.generateProject(project, options)
    const generatedFilesLength = Object.keys(generatedProject.filesByName).length

    const configFilesCount = Object.keys(configFiles).length
    const componentsCount = Object.keys(project.components).length
    const pagesCount = Object.keys(project.pages).length

    expect(generatedProject).toBeInstanceOf(FileSet)
    expect(generatedFilesLength).toBe(componentsCount + pagesCount + configFilesCount)
  })
})
