const fs = require('fs')
const postcss = require('postcss')
const tailwind = require('tailwindcss')
const CleanCSS = require('clean-css')


const normalizeStyles = postcss.parse(fs.readFileSync(require.resolve('normalize.css'), 'utf8'))
const preflight = fs.readFileSync('dist/preflight.css');

function buildDistFile() {
  return new Promise((resolve, reject) => {
    return postcss([
      tailwind({
        important:true,
        corePlugins: {
          preflight: false,
        },
        plugins: [
          require('./tailwind-ui.js'),
          require("tailwindcss-theming")({
            variants: {
              dark: true,
              light: true
            },
          })
        ],
      }),
      require('autoprefixer'),
    ])
      .process(
        `
@tailwind base;
@tailwind components;
@tailwind utilities;
      `,
        {
          from: undefined,
          to: `./dist/steedos-tailwind.css`,
          map: { inline: false },
        }
      )
      .then(result => {
        fs.writeFileSync(`./dist/steedos-tailwind.css`, normalizeStyles + preflight + result.css)
        return result
      })
      .then(result => {
        const minified = new CleanCSS().minify(normalizeStyles + preflight + result.css)
        fs.writeFileSync(`./dist/steedos-tailwind.min.css`, minified.styles)
      })
      .then(resolve)
      .catch(error => {
        console.log(error)
        reject()
      })
  })
}

console.info('Compiling Steedos build...')

Promise.all([
  buildDistFile()
]).then(() => {
  console.log('Finished.')
})
