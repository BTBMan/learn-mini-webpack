import fs from 'fs';
import parser from '@babel/parser';
import traverse from '@babel/traverse';

function createAsset() {
  // 1. 读取入口文件
  const source = fs.readFileSync('./example/main.js', {
    encoding: 'utf-8',
  });

  // 2.获取依赖的关系
  // 首先通过文件内容解析为 ast
  const ast = parser.parse(source, {
    sourceType: 'module',
  });

  traverse.default(ast, {
    enter(path) {
      console.log(path);

      if (path.isIdentifier({ name: 'n' })) {
        path.node.name = 'x';
      }
    },
  });
}

createAsset();
