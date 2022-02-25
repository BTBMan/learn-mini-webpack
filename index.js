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

  // 保存依赖关系
  const deps = [];

  traverse.default(ast, {
    ImportDeclaration({ node }) {
      const { value } = node.source;

      // 拿到当前文件中的 import 依赖对应的路径
      deps.push(value);
    },
  });

  return {
    source,
    deps,
  };
}

const { source, deps } = createAsset();

console.log(source, deps);
