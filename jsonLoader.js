// json loader 的简单实现
export function jsonLoader(context, map, mate) {
  // some properties in this
  // ep: this.async()
  console.log('json loader ------------------', context, map, mate, this);

  // loader 须要返回处理过的 string code 在异步的时候是不需要返回的 undefined
  return `module.exports = ${context}`;
}
