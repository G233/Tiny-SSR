# Vue-SSR Demo

依据[官方文档](https://ssr.vuejs.org/zh/)和官方[Demo](https://github.com/vuejs/vue-hackernews-2.0/)写出来的 Vue 服务端渲染 Deme。仅保留基础功能，包含大量注释。方便学习服务端渲染原理。（值得注意的是使用的使 webpack 3）

# Features

- Vue + vue-router + vuex working together
- Server-side data pre-fetching
- Client-side state & DOM hydration
- Hot-reload in development

# Architecture Overview

![原理图](https://img.liuxiaogu.com/blog-img/2020-5-17-1589726832072.png)
请配合[官方文档](https://ssr.vuejs.org/zh/)食用

# Build Setup

```
# install dependencies
yarn

# serve in dev mode, with hot reload at localhost:8111
npm run dev

# build for production
npm run build

# serve in production mode
npm server
```
