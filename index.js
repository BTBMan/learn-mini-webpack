import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import { parse, traverse, transformFromAst } from '@babel/core';

// 用来标记依赖的标识 id
let id = 0;

// 创建资源
function createAsset(filePath) {
  // 1. 读取入口文件
  const source = fs.readFileSync(filePath, {
    encoding: 'utf-8',
  });

  // 2.获取依赖的关系
  // 首先通过文件内容解析为 ast
  const ast = parse(source, {
    sourceType: 'module',
  });

  // 转换代码里的内容
  // 首先要把 esm 的格式转换为 cjs 的格式 此时须要设置预设为 env
  const { code } = transformFromAst(ast, null, {
    presets: ['env'],
  });

  // 保存依赖关系
  const deps = [];

  traverse(ast, {
    ImportDeclaration({ node }) {
      const { value } = node.source;

      // 拿到当前文件中的 import 依赖对应的路径
      deps.push(value);
    },
  });

  return {
    filePath,
    code,
    deps,
    id: id++, // 每次创建一个 asset 资源的时候 就把 id 自增1
    mapping: {}, // 用来存储对应的依赖关系
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

      // 处理传递给 ejs 模板里的关系映射数据
      asset.mapping[filePath] = depAsset.id;

      queue.push(depAsset);
    });
  }

  return queue;
}

// 构建代码
function build(graph) {
  const template = fs.readFileSync('./bundle.ejs', { encoding: 'utf-8' });

  const data = graph.map(({ id, filePath, code, mapping }) => {
    return {
      filePath,
      id,
      code,
      mapping,
    };
  });

  const code = ejs.render(template, {
    data,
  });

  // 把处理过的代码转为 js 文件
  fs.writeFileSync('./dist/bundle.js', code, { encoding: 'utf-8' });
}

const graph = createGraph();

build(graph);
