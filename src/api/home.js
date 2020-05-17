const allData = [
  '深入理解 flex 属性',
  '使用 vw+rem 进行移动端适配',
  '居中到底能有多少种方法',
  '一探 koa-session 源码',
  'JavaScript 数据类型与类型判断',
]

export function getAll() {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 1000, allData)
  })
}
