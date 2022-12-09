const fs = require('fs')
const babel = require('@babel/core')
const traverse = require('@babel/traverse').default
const path = require('path')




function compiler(entry) {

  entry = path.resolve(__dirname, entry)
  const dirName = path.dirname(entry)

  let ID = 0


  function getAst(url) {

    const code = fs.readFileSync(path.resolve(dirName, url), 'utf-8')
    return babel.parseSync(code)
  }

  function generateModuleCode(ast) {
    return babel.transformFromAstSync(ast, undefined, {
      "presets": [
        [
          "@babel/preset-env",
          {
            "useBuiltIns": "entry",
            "corejs": "3.22"
          }
        ]
      ]
    })
  }

  const modules = [{
    id: ID++,
    fileName: entry,
    code: undefined,
    mapping: {

    }
  }]

  for (let module of modules) {
    const ast = getAst(module.fileName)
    const { code } = generateModuleCode(ast)
    module['code'] = code
    traverse(ast, {
      ImportDeclaration: {
        enter({ node }) {
          //
          console.log(node.source.value)
          module['mapping'][node.source.value] = ID

          modules.push({
            id: ID++,
            fileName: node.source.value,
            mapping: {},
            code: undefined
          })
        }
      }
    })
  }


  console.log(modules);

  let code = ''

  modules.forEach(module => {

    code += `
      ${module.id}:[
        function (require,module,exports) {
          ${module.code} 
        },
        ${JSON.stringify(module.mapping)}
      ],
    `

  })


  let result = `
    (function (modules) {
      function require(id) {
        const [fn,mapping] =modules[id]
        const localRequire =function (str) {
          const findedId =mapping[str]
          return require(findedId)
        }
        const module ={exports:{}}
         fn(localRequire,module,module.exports)
         return module.exports
      }

      return require(0)
      
    })({${code}})
  `
  return result
}


fs.writeFileSync(path.join(__dirname, './test/vendor.js'), compiler('./test/entry.js'))



// 

