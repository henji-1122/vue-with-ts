// 主要用于TS识别.vue文件模块
// TS默认不支持带入.vue模块，这个文件告诉TS导入.vue文件模块都按vueconstructor<vue>类型识别处理
declare module '*.vue' {
  import Vue from 'vue' // 类型为Vue构造函数
  export default Vue
}
