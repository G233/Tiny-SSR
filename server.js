const fs = require('fs')
const path = require('path')
const express = require('express')
const microcache = require('route-cache')
const resolve = (file) => path.resolve(__dirname, file)
const { createBundleRenderer } = require('vue-server-renderer')

const isProd = process.env.NODE_ENV === 'production'
const useMicroCache = process.env.MICRO_CACHE !== 'false'
const serverInfo =
  `express/${require('express/package.json').version} ` +
  `vue-server-renderer/${require('vue-server-renderer/package.json').version} `

const app = express()

function createRenderer(bundle, options) {
  return createBundleRenderer(
    bundle,
    Object.assign(options, {
      // this is only needed when vue-server-renderer is npm-linked
      basedir: resolve('./dist'),
      // recommended for performance
      runInNewContext: false,
    })
  )
}

let renderer
let readyPromise
const templatePath = resolve('./src/index.template.html')

if (isProd) {
  // In production: create server renderer using template and built server bundle.
  // The server bundle is generated by vue-ssr-webpack-plugin.
  const template = fs.readFileSync(templatePath, 'utf-8')
  const bundle = require('./dist/vue-ssr-server-bundle.json')
  // The client manifest are optional, but it allows the renderer
  // to automatically infer preload/prefetch links and directly add <script>
  // tags for any async chunks used during render, avoiding waterfall requests.
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  renderer = createRenderer(bundle, {
    template,
    clientManifest,
  })
} else {
  // In development: setup the dev server with watch and hot-reload,
  // and create a new renderer on bundle / index template update.
  readyPromise = require('./build/setup-dev-server')(
    app,
    templatePath,
    (bundle, options) => {
      renderer = createRenderer(bundle, options)
    }
  )
}

const serve = (path, cache) =>
  express.static(resolve(path), {
    maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0,
  })

app.use('/dist', serve('./dist', true))
app.use('/public', serve('./public', true))
app.use('/manifest.json', serve('./manifest.json', true))

// 如果内容不是用户特定 (user-specific)
//（即对于相同的 URL，总是为所有用户渲染相同的内容），
// 我们可以利用名为 micro-caching 的缓存策略，
// 来大幅度提高应用程序处理高流量的能力。
app.use(microcache.cacheSeconds(10, (req) => useMicroCache && req.originalUrl))

function render(req, res) {
  const s = Date.now()

  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Server', serverInfo)

  const handleError = (err) => {
    if (err.url) {
      res.redirect(err.url)
    } else if (err.code === 404) {
      res.status(404).send('404 | Page Not Found')
    } else {
      // Render Error Page or Redirect
      res.status(500).send('500 | Internal Server Error')
      console.error(`error during render : ${req.url}`)
      console.error(err.stack)
    }
  }

  const context = {
    title: 'My Vue SSR Title', // default title
    meta: `
      <meta name="theme-color" content="#4285f4">
    `,
    url: req.url,
  }
  // 这里无需传入一个应用程序，因为在执行 bundle 时已经自动创建过。
  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err)
    }
    res.send(html)
    if (!isProd) {
      console.log(`whole request: ${Date.now() - s} ms`)
    }
  })
}
app.get(
  '*',
  isProd
    ? render
    : (req, res) => {
        readyPromise.then(() => render(req, res))
      }
)
app.set('port', process.env.PORT || 8111)
let hostname = '127.0.0.1'
app.listen(app.get('port'), hostname, () => {
  console.log(`Server running at http://${hostname}:${app.get('port')}`)
})
