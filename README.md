##### vue-with-ts
* 使用VueCLI创建项目
* Babel + TypeScript + Router + Vuex + CSS Pre-processors + Linter / Formatter  + ESLint


##### 本地运行预览
* 本地运行预览： 
    - npm run serve
* 项目打包预览： 
    - npm run build
    - npm run preview


##### 使用Git版本管理


##### 目录结构
* public：存放纯静态资源，不会被webpack打包，内部的资源都可以直接使用/xxx使用
* .browserslistrc：浏览器相关信息
* .editorconfig：编辑器相关配置信息
* .eslintrc.js：slint代码校验工具配置文件


##### 使用TS开发Vue项目
###### 环境说明
* 在vue项目中启用TypeScript支持：
  - 全新的项目：使用Vue Cli脚手架工具创建项目时，选择TypeScript,会自动完成TS的相关配置，开箱即用，基本不用额外的配置
  - 已有项目：添加Vue官方配置的TypeScript适配插件,后天集成
  ```js
  <!--使用@vue/cli安装TypeScript插件：-->
  vue add @Vue/typescript
  ```

###### 环境说明
* (1) 安装TS相关的依赖
* (2) TS配置文件tsconfig.json
* (3) shims-tsx.d.ts 
    - 作用：为jsx组件模板补充类型声明
* (4) shims-vue.d.ts
    - 主要用于TS识别.vue文件模块
    - TS默认不支持带入.vue模块，这个文件告诉TS导入.vue文件模块都按vueconstructor<vue>类型识别处理
* (5) TS模块都使用.ts后缀

###### 使用OptionsAPI定义Vue组件
* https://cn.vuejs.org/---->学习--->教程---->TypeScript支持--->基本用法
* 基本用法
  - (1) 给script标签上加lang="ts"
  - (2) 要让 TypeScript 正确推断 Vue 组件选项中的类型，您需要使用 Vue.component 或 Vue.extend 定义组件：
  - 有了以上两点才能有：编译器给的类型提示和TS编译期间的类型验证


##### 代码格式规范
* 标准
  - 没有绝对的标准，下面是一些大厂商根据多数开发者的编码习惯指定的一些编码规范，仅供参考
  - JavaScript Standard Style：https://standardjs.com/
    * 最常用的一些规范，本项目采用
  - Airbnb JavaScript Style Guide：https://github.com/airbnb/javascript
    * 更细致一些，适合大型团队
  - Google JavaScript Style Guide：https://google.github.io/styleguide/jsguide.html
    * 适合大型团队

###### 项目中的代码规范说明
* 项目中的代码规范是ESLint
* ESLint配置文件
* 自定义代码格式校验规范
* TS规则的配置：在文档(https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)中搜索到，然后根据详细说明进行配置
* 当配置文件修改后必须重启服务才能生效(因为在编译的过程中node_modules下会生成一个.cache目录，会将校验编译的结果缓存在此没有更新，所以将项目刷新并将.cach目录删除，重启服务就会生效)

##### 使用了Element组件库

##### 样式处理
crc/styles      
|--index.scss #全局样式(在入口模块中被加载生效)      
|--mixin.scss #公共的mixin混入(可以把重复的样式封装为mixin混入到复用的地方)       
|--reset.scss #重置基础样式       
|--variables.scss #公共样式变量 

* 共享全局样式变量：在vue.config.js中全局配置

##### 接口处理
* 配置后端代理：在vue.config.js中配置
* 封装请求模块：使用axios（src/utils/request.js）
* 封装请求方法：src/services


##### 请求数据类型转换： 
* axios默认发送的是application/json格式的数据类型，而项目中需要的是x-www-form-urlencoded格式的数据
* application/json类型 -----> x-www-form-urlencoded类型
  - axios仓库(https://github.com/axios/axios)点击Using application/x-www-form-urlencoded format
  - 方式1：URLSearchParams是html5中新增的一个API，但是这种方式有兼容问题，如果要使用此方式要使用polyfill进行兼容处理
  - 方式2：第三方模块qs(query string)


##### 接口测试
* postman


##### 表单验证
* ElementUI表单支持验证功能


##### 身份认证
* 利用路由拦截器判断用户在访问某个需要登陆状态才能访问的页面时进行拦截，如果未登录就跳转到登录页面
* 官网：https://router.vuejs.org/zh/guide/advanced/navigation-guards.html
* 配置路由元信息mate字段,校验页面访问权限
* 登录成功跳转回原来页面: login/index.ts
  - 在路由拦截器中往登录页面跳转时传递一个从哪里来的参数，通过路径当中的query参数设置
  - 在登录页面登录成功后拿到这个参数，如果有就跳到对应页面，如果没有就跳至首页

###### 使用请求拦截器统一设置Token
* https://github.com/axios/axios:Interceptors拦截器
* src/utils/request.ts 在请求拦截器中通过改写config配置信息来实现业务功能的统一处理



##### 处理Token过期
* token相关的数据信息：
  - access_token：获取需要授权的接口数据
  - expires_in：设置access_token过期时间
  - refresh_token：刷新获取新的access_token
  - 用户在使用期间access_token过期了，可以使用refresh_token刷新获取新的access_token进行后续的操作
* 本项目采用拦截返回后的数据，先发起请求，接口返回过期后，先刷新token，再进行一次重试

###### axios响应拦截错误处理
* axios的github仓库中找到Handling Errors错误处理示例
* 根据不同的响应状态码进行错误处理

###### 处理刷新token的实现方式
* 1.发请求，获取当前登录失败返回401
* 2.请求refresh_token刷新token
* 3.刷新token成功，将之前的失败请求重新发出去
* 4.获取当前登录用户信息
* 5.由此就实现无痛刷新，重新获取到access_token

###### 关于多次请求的问题
* 如果Token过期,同一时间有多个请求都出现401时就会出现请求多次刷新token的问题

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
