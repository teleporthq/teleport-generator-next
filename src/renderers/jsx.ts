import styleTransformers from '@teleporthq/teleport-lib-js/dist/transformers/styles'
const { jsstocss } = styleTransformers

function buildStyleJsx(styles) {
  if (Object.keys(styles).length === 0) {
    return ''
  }

  return `<style jsx>{\`
    ${jsstocss.stylesheet(styles).css}
  \`}</style>`
}

function parseForProps(content: any, isStyleObject?: boolean) {
  if (!content) return

  if (typeof content === 'string') {
    if (content.indexOf('$props.') === 0) {
      return `{${content.replace('$props.', 'this.props.')}}`
    } else {
      return `"${content}"`
    }
  } else {
    Object.keys(content).forEach((value) => {
      if (typeof content[value] === 'string') {
        if (content[value].indexOf('$props.') === 0) {
          content[value] = `\${${content[value].replace('$props.', 'this.props.')}}`
        }
      } else {
        parseForProps(content[value])
      }
    })

    if (isStyleObject) {
      return content
    }

    return isStyleObject ? content : `{${JSON.stringify(content)}}`
  }
}

export default function jsx(name: string, childrenJSX?: string, classNames?: string[], isRoot?: boolean, styles?: string, props?: any): string {
  let classNamesString = ''
  if (classNames) {
    classNamesString = classNames.length > 0 ? `className="${classNames.join(' ')}"` : `className="${classNames}"`
  }

  const propsArray = []
  if (props) {
    Object.keys(props).map((propName) => {
      const propValue = parseForProps(props[propName])

      if (propValue) propsArray.push(`${propName}=${propValue}`)
    })
  }

  const propsString = propsArray.length ? ' ' + propsArray.join(' ') : ''

  // if (styles)
  //   console.log('styles', parseForProps(styles, true), typeof styles)

  if (isRoot) {
    return `
      <${name} ${classNamesString} ${propsString}>
        ${childrenJSX}
        ${buildStyleJsx(parseForProps(styles, true))}
      </${name}>`
  }

  if (childrenJSX && childrenJSX.length > 0) {
    return `
      <${name} ${classNamesString} ${propsString}>
        ${childrenJSX}
      </${name}>
    `
  } else {
    return `<${name} ${classNamesString} ${propsString}/>`
  }
}
