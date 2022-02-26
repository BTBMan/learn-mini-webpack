import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import parser from '@babel/parser';
import traverse from '@babel/traverse';
import bc from 'babel-core';

// 创建资源
function createAsset(filePath) {
  // 1. 读取入口文件
  const source = fs.readFileSync(filePath, {
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
    filePath,
    source,
    deps,
  };
}

// 创建依赖关系的图
function createGraph() {
  const mainAsset = createAsset('./example/main.js');

  // 队列 广度优先搜索
  const queue = [mainAsset];

  // 这里使用 forof 循环 如果使用 forEach 的话则只会循环一次 不会像 forof 一样随着数组的长度增加而增加循环
  for (const asset of queue) {
    // 去遍历每个asset对应的依赖
    const { deps } = asset;

    deps.forEach((filePath) => {
      const depAsset = createAsset(path.resolve('./example', filePath));

      queue.push(depAsset);
    });
  }

  return queue;
}

const graph = createGraph();

// 构建代码
function build(graph) {
  const template = fs.readFileSync('./bundle.ejs', { encoding: 'utf-8' });
  const code = ejs.render(template);

  // 把处理过的代码转为 js 文件
  fs.writeFileSync('./dist/bundle.js', code, { encoding: 'utf-8' });
}

build(graph);
