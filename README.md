# platformWeb

English | [简体中文](./README-zh.md)

> A minimal vue admin template with Element UI & axios & iconfont & permission control & lint

**基于vue+element-ui为基础搭建的一个后台管理系统**

## About Add Router

- 顶部的菜单栏添加时，需要添加对应的topMenuId，与左侧的菜单栏的leftMenuId对应关联
- 比如顶部用户管理的菜单对应左侧用户信息和用户分析两个子菜单，那么topMenuId的值要与leftMenuId 的值相同
- 如果顶部菜单需要隐藏，则添加hidden:true
- 左侧页面中如果有跳转三级子路由的话，那么三级子路由需要在children的meta中添加ruoterId: 3，并且设置hidden: true


## Build Setup

```bash
# clone the project
git clone http://192.168.8.70/webUser/platformWeb.git

# enter the project directory
cd platformWeb

# install dependency
npm install

# develop
npm run dev
```

This will automatically open http://localhost:8080

## Build

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

## Advanced

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```

Refer to [Documentation](https://panjiachen.github.io/vue-element-admin-site/guide/essentials/deploy.html) for more information

## Browsers support

Modern browsers and Internet Explorer 10+.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions

## License

[MIT](https://github.com/PanJiaChen/vue-admin-template/blob/master/LICENSE) license.

Copyright (c) 2017-present PanJiaChen
