// 实现打包后的代码处理的结果
// 首先我们要把引入依赖的 import 改写为我们自定义的引入方法 (主要是基于 node 的 commonjs 模块规范的思想)
// 把每个文件的代码用一个函数包裹起来 为了避免变量冲突
// 把每个文件的 import 改为 require
// 把每个文件的 export 改为 module.exports = {}

// 创建一个自执行函数 依赖的模块映射可以作为函数传入进来
(function (modules) {
  // 一上来运行入口文件的代码
  require(0); //  0 => mainjs

  // 实现自己的 require
  function require(id) {
    const [fn, mapping] = modules[id];

    // 找到对应的依赖 并传递给函数几个固定的参数
    // 一个是用来函数内部使用的 require 方法
    // 一个是 module 的对象 另一个是 module.exports 对象 主要用来在函数内部实现导出的功能
    const module = {
      exports: {},
    };

    // 实现一个本地的 require 函数 用来在当前的 module 下 通过 mapping 映射 来查对应的模块 id 标识
    function localRequire(filePath) {
      const moduleId = mapping[filePath];

      return require(moduleId);
    }

    fn(localRequire, module, module.exports);

    // 返回 module.exports 对象 以供 require 接收使用
    return module.exports;
  }
})({
  // 首先要创建一个对应的函数映射
  // 映射的 key 不可以用路径 因为可能会命名冲突 还有就是在我们 require 的时候 会因为转换过的路径而找不到对应的函数
  // 所以这里须要使用唯一的标识去处理一下

  // 新的实现方式 -----------------------------------------
  // mainjs
  0: [
    function (require, module, exports) {
      const { foo } = require('./foo.js');
      const { bar } = require('./bar.js');

      foo();
      bar();

      console.log('main');
    },
    {
      './foo.js': 1,
      './bar.js': 2,
    },
  ],
  // foojs
  1: [
    function (require, module, exports) {
      const { bar } = require('./bar.js');

      module.exports = {
        foo() {
          console.log('foo');

          bar();
        },
      };
    },
    {
      './bar.js': 2,
    },
  ],
  // barjs
  2: [
    function (require, module, exports) {
      module.exports = {
        bar() {
          console.log('bar');
        },
      };
    },
    {},
  ],

  // 老的实现方式 -----------------------------------------
  './main.js': function (require, module, exports) {
    const { foo } = require('./foo.js');
    const { bar } = require('./bar.js');

    foo();
    bar();

    console.log('main');
  },
  './foo.js': function (require, module, exports) {
    const { bar } = require('./bar.js');

    module.exports = {
      foo() {
        console.log('foo');

        bar();
      },
    };
  },
  './bar.js': function (require, module, exports) {
    module.exports = {
      bar() {
        console.log('bar');
      },
    };
  },
});
