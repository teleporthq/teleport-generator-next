export default function packageRenderer(project: any): any {
  const pkg = {
    author: project.userSlug || 'Unknown',
    dependencies: {
      next: '^6.1.1',
      react: '^16.3.0',
      'react-dom': '^16.3.0',
    },
    description: project.description || '',
    license: 'ISC',
    name: project.slug,
    scripts: {
      build: 'next build',
      dev: 'node server.js',
      export: 'npm run build && next export',
      start: 'next start',
    },
    version: project.version || '0.0.1',
  }

  return JSON.stringify(pkg, null, 2)
}
