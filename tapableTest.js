// 为 plugin 创建的钩子类
import { AsyncParallelHook } from 'tapable';
import { SyncHook } from 'tapable';

// 注册同步钩子 钩子类须要一个list作为参数 每个list下的值都是注册时接收的参数
const syncHook = new SyncHook(['name', 'age', 'job']);

syncHook.tap('hello', (name) => {
  console.log(name);
});

syncHook.tap('hello again', (name, age, job) => {
  console.log(name, age, job);
});

// 触发钩子
// syncHook.call('john', 18, 'developer');

// 注册异步钩子
const asyncHook = new AsyncParallelHook(['name']);

// 回调形势的钩子
asyncHook.callAsync('hello', (name, cb) => {
  setTimeout(() => {
    console.log(name);
    cb();
  }, 2000);
});

// promise形势的钩子
asyncHook.tapPromise('hello again', (name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(name);
      resolve();
    }, 1000);
  });
});

// 触发回调的钩子
// asyncHook.callAsync('john', () => {
//   console.log('done');
// });

// 触发promise的钩子
asyncHook.promise('john').then(() => {
  console.log('done');
});
