# envision

以 Vue3 和 TypeScript 为核心技术，正确、简单、流畅的前端开发框架。

## 前提

- Node.js。经测试的版本包括 v16.16.0，v18.18.2 等。更高版本应当可以正确运行；
- pnpm。通过`npm install -g pnpm`安装。

> 建议前端开发者安装 [nvm-windows](https://github.com/coreybutler/nvm-windows)，以更方便地在多个安装的 node 版本间进行切换。

## 使用

```bash
git clone http://113.128.222.8:82/envision-team/envision.git

cd envision

# 安装依赖。任何一次拉取后若`package.json`文件存在变动都需要执行
pnpm install
# 在开发环境下运行
pnpm run dev
```

## 推荐开发环境

> 如果仅需要运行前端服务，你并不需要安装开发环境。

- 安装 [VSCode](https://code.visualstudio.com/)；
- 安装以下 VSCode 的插件：
  - [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
  - [UnoCSS](https://marketplace.visualstudio.com/items?itemName=antfu.unocss)
  - [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- 推荐安装以下 VSCode 的插件：
  - [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)
  - [GitLens - Git supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
  - [简体中文语言包](https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-zh-hans)

## 注意事项

- 发起 commit 前，系统将自动检查**已暂存、将要提交**的代码中存在的错误（通过 ESLint），并对这些文件进行统一格式化（通过 Prettier）。该流程将使提交过程变慢，属于正常现象；如果存在不可自动修复的问题，提交将被放弃，需要手动修复该错误后才能提交；
- 在 clone 后使用 Envision 框架前，请记得更改 git 源的地址，避免提交到本仓库而非业务项目仓库；
- Envision 具有多个完全同步的公网 repo 地址。如你在一个无法访问公司 git 服务的网络环境下，可以访问以下仓库获取源代码：
  - Github 地址：[https://github.com/Owen-Tsai/envision.git](https://github.com/Owen-Tsai/envision)。
  - Gitee 地址（需要获取授权）：[https://gitee.com/envision-team/envision.git](https://gitee.com/envision-team/envision)

## 设计和开发文档

*正在撰写，将发布于项目空间的 [Wiki](http://113.128.222.8:82/envision-team/envision/-/wikis/home) 中。*