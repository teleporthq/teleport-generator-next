export default function jsx(name: string, childrenJSX?: string, classNames?: string[], isRoot?: boolean, styles?: string, props?: any): string {
  let classNamesString = ''
  if (classNames) {
    classNamesString = classNames.length > 0 ? `className="${classNames.join(' ')}"` : `className="${classNames}"`
  }

  const propsArray = []
  if (props) {
    Object.keys(props).map((propName) => {
      const propValue = props[propName]
      propsArray.push(`${propName}={${JSON.stringify(propValue)}}`)
    })
  }

  const propsString = propsArray.length ? ' ' + propsArray.join(' ') : ''

  if (isRoot) {
    return `
      <${name} ${classNamesString} ${propsString}>
        ${childrenJSX}
        <style jsx>{\`
          ${styles}
        \`}</style>
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
