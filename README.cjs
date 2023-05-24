// call with `node <this-file> <template-file`
const nunjucks = require('nunjucks')
console.log(nunjucks.render(process.argv[2]).trim())
