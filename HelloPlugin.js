export class HelloPlugin {
  apply(compiler) {
    compiler.hooks.beginParseAst.tap('begin', (text) => {
      console.log('begin parse ast', text);
    });
    compiler.hooks.parseAstDone.tap('done', (ast) => {
      console.log('parse ast done', ast);
    });
  }
}
