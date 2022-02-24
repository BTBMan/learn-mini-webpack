import fs from 'fs';
import parser from '@babel/parser';

function createAsset() {
  // 1. 读取入口文件 获取依赖的关系
  const source = fs.readFileSync('./example/main.js', {
    encoding: 'utf-8',
  });

  console.log(source);
}

createAsset();
