// 实现打包后的代码处理的结果

// 一上来运行如果文件的代码
require('./main.js');

// 首先我们要把引入依赖的 import 改写为我们自定义的引入方法 (主要是基于 node 的 commonjs 模块规范的思想)
// 把每个文件的代码用一个函数包裹起来 为了避免变量冲突
// 把每个文件的 import 改为 require
// 把每个文件的 export 改为 module.exports = {}

// 实现自己的 require
function require(filePath) {
  // 首先要创建一个对应的函数映射
  const maps = {
    './main.js': mainjs,
    './foo.js': foojs,
    './bar.js': barjs,
  };

  // 找到对应的依赖 并传递给函数几个固定的参数
  // 一个是用来函数内部使用的 require 方法
  // 一个是 module 的对象 另一个是 module.exports 对象 主要用来在函数内部实现导出的功能
  const module = {
    exports: {},
  };

  maps[filePath](require, module, module.exports);

  // 返回 module.exports 对象 以供 require 接收使用
  return module.exports;
}

function mainjs(require, module, exports) {
  // import { foo } from './foo.js';
  // import { bar } from './bar.js';
  const { foo } = require('./foo.js');
  const { bar } = require('./bar.js');

  foo();
  bar();

  console.log('main');
}

function foojs(require, module, exports) {
  // import bar from './bar.js';
  const { bar } = require('./bar.js');

  // export function foo() {
  //   console.log('foo');

  //   bar();
  // }
  module.exports = {
    foo() {
      console.log('foo');

      bar();
    },
  };
}

function barjs(require, module, exports) {
  // export function bar() {
  //   console.log('bar');
  // }

  module.exports = {
    bar() {
      console.log('bar');
    },
  };
}
