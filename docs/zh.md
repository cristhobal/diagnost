<div align="center">

<br />

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/diagnost-Astro%20Diagnostic%20Tool-FAFAFA?style=for-the-badge&logo=astro&logoColor=080808&labelColor=FAFAFA">
  <img alt="diagnost" src="https://img.shields.io/badge/diagnost-Astro%20Diagnostic%20Tool-080808?style=for-the-badge&logo=astro&logoColor=FAFAFA&labelColor=080808">
</picture>

<br />
<br />

**面向 [Astro](https://astro.build) 项目的诊断与代码检查工具包。**  
扫描代码库、落实最佳实践、跟踪项目健康状况 —— 一个工具搞定。

<br />

[![npm](https://img.shields.io/npm/v/diagnost?color=080808&labelColor=080808&label=diagnost&style=flat-square&logoColor=FAFAFA)](https://www.npmjs.com/package/diagnost)
[![npm](https://img.shields.io/npm/v/diagnost-core?color=080808&labelColor=080808&label=diagnost-core&style=flat-square&logoColor=FAFAFA)](https://www.npmjs.com/package/diagnost-core)
[![npm](https://img.shields.io/npm/v/eslint-plugin-diagnost?color=080808&labelColor=080808&label=eslint-plugin-diagnost&style=flat-square&logoColor=FAFAFA)](https://www.npmjs.com/package/eslint-plugin-diagnost)
[![License: MIT](https://img.shields.io/badge/license-MIT-080808?style=flat-square&labelColor=080808&color=080808)](../LICENSES/zh.md)
[![Node.js >= 18](https://img.shields.io/badge/node-%3E%3D18-080808?style=flat-square&labelColor=080808&logo=node.js&logoColor=FAFAFA)](https://nodejs.org)

<br />

[English](../README.md) · [中文](zh.md) · [हिन्दी](hi.md) · [Español](es.md) · [Français](fr.md)

<br />

**🌐 [官方网站](https://usediagnost.vercel.app/) —— 文档、在线演示与可视化概览**

<br />

</div>

---

## 概述

**diagnost** 运行 11 个类别中的 20 多条检查规则，计算 0–100 的健康评分，并帮助你在 SEO、无障碍、性能、安全等方面保持最佳实践 —— 完整支持 CI/CD 与 Git 集成。

```
$ diagnost .

  diagnost  Astro Diagnostic Tool

  ✖  seo/missing-title          src/pages/about.astro
  ⚠  a11y/missing-lang          src/layouts/Base.astro
  ⚠  images/missing-alt         src/components/Hero.astro

  Health score: 74/100   3 issues found (1 error, 2 warnings)
```

---

## 包

| 包 | 版本 | 描述 |
|---|---|---|
| [`diagnost`](https://www.npmjs.com/package/diagnost) | [![npm](https://img.shields.io/npm/v/diagnost?style=flat-square&color=080808&labelColor=080808&logoColor=FAFAFA)](https://www.npmjs.com/package/diagnost) | 命令行工具，在终端中扫描 Astro 项目 |
| [`diagnost-core`](https://www.npmjs.com/package/diagnost-core) | [![npm](https://img.shields.io/npm/v/diagnost-core?style=flat-square&color=080808&labelColor=080808&logoColor=FAFAFA)](https://www.npmjs.com/package/diagnost-core) | 诊断引擎：项目检测、检查规则、过滤管道与评分计算 |
| [`eslint-plugin-diagnost`](https://www.npmjs.com/package/eslint-plugin-diagnost) | [![npm](https://img.shields.io/npm/v/eslint-plugin-diagnost?style=flat-square&color=080808&labelColor=080808&logoColor=FAFAFA)](https://www.npmjs.com/package/eslint-plugin-diagnost) | ESLint 插件，将规则暴露为 ESLint 规则以便 IDE 集成 |

---

## 功能特性

- **20 多条检查规则**，涵盖 11 个类别：SEO、无障碍、性能、安全、内容集合、视图过渡、路由、图片、交互岛屿、国际化及配置
- **健康评分**（0–100），支持本地计算或带降级方案的远程 API
- **基于场景的过滤** —— 为 CLI、PR 评论、CI 等不同场景配置不同规则
- **Git 集成** —— 仅扫描暂存文件（pre-commit）或与基准分支的差异文件（CI）
- **可配置** —— 通过 `.diagnost.json` 配置文件按规则/类别覆盖设置及忽略模式
- **多种输出格式** —— 彩色 CLI、JSON 和紧凑 JSON
- **ESLint 插件** —— 提供规则元数据和配置预设，便于 IDE 集成
- **并发流式处理** —— 通过 Effect Stream 实现并行文件检查
- **失败模式** —— 超出严重级别阈值时返回退出码 1（适用于 CI）

---

## 安装

```bash
# 全局安装 CLI
npm install -g diagnost

# 或免安装运行
npx diagnost .

# 作为项目依赖安装
npm install --save-dev diagnost-core
```

> **环境要求：** Node.js >= 18 · pnpm >= 9.1（开发用）

---

## 使用方法

### CLI

```bash
# 扫描当前目录
diagnost

# 扫描指定路径
diagnost ./path/to/project

# JSON 输出
diagnost . --json

# 仅自 main 分支以来变更的文件（CI）
diagnost . --diff main

# 仅暂存文件（pre-commit 钩子）
diagnost . --staged

# 出现错误时以退出码 1 退出
diagnost . --fail-on error

# 显示修复建议和文档链接
diagnost . --verbose

# 为 AI 助手安装技能文件（Claude Code、OpenCode）
diagnost install
```

### 作为库使用

```typescript
import { runInspect } from "diagnost-core"
import * as Effect from "effect/Effect"

const result = await Effect.runPromise(
  runInspect({ rootDir: "/path/to/project" })
)

console.log(result.diagnostics)
console.log(`Score: ${result.score}`)
```

### ESLint 插件

```json
{
  "plugins": ["diagnost"],
  "extends": ["plugin:diagnost/recommended"]
}
```

---

## 检查规则

| 类别 | 规则 |
|---|---|
| **a11y** | `missing-lang`、`invalid-aria` |
| **config** | `missing-config`、`outdated-integration` |
| **content-collections** | `missing-schema`、`invalid-reference` |
| **i18n** | `missing-i18n-config` |
| **images** | `missing-image-component`、`missing-alt` |
| **islands** | `heavy-client-load`、`unnecessary-client-directive` |
| **performance** | `missing-prefetch`、`large-client-component` |
| **routing** | `missing-get-static-paths`、`invalid-dynamic-route` |
| **security** | `dangerous-script` |
| **seo** | `missing-head`、`missing-title`、`missing-meta-description` |
| **view-transitions** | `missing-view-transition`、`missing-animation` |

---

## 配置

在项目根目录创建 `.diagnost.json` 文件：

```json
{
  "rules": {
    "seo/missing-title": "error",
    "a11y/missing-lang": "off"
  },
  "categories": {
    "performance": "warn"
  },
  "ignore": ["node_modules", "dist"],
  "surfaces": {
    "cli": {
      "excludeTags": ["ci-only"]
    }
  }
}
```

| 字段 | 类型 | 描述 |
|---|---|---|
| `rules` | `Record<string, "error" \| "warn" \| "off">` | 覆盖单条规则的严重级别 |
| `categories` | `Record<string, "error" \| "warn" \| "off">` | 覆盖某一类别中所有规则的严重级别 |
| `ignore` | `string[]` | 用于排除扫描的 glob 模式 |
| `surfaces` | `Record<string, SurfaceConfig>` | 按场景（CLI、CI 等）配置规则集 |

---

## 开发

```bash
# 安装依赖
pnpm install

# 编译所有包
pnpm build

# 类型检查
pnpm typecheck

# 运行测试
pnpm test

# 清理构建产物
pnpm clean
```

---

## 致谢

**diagnost** 的灵感来自并基于 [millionco](https://github.com/millionco) 开发的 [**react-doctor**](https://github.com/millionco/react-doctor) —— 一款面向 React 项目、理念相近的诊断与代码检查工具包：扫描代码库、落实最佳实践，并给出 0–100 的健康评分。

- 🔗 GitHub：[millionco/react-doctor](https://github.com/millionco/react-doctor)
- 🌐 网站：[react.doctor](https://www.react.doctor/)
- 📦 npm：[react-doctor](https://www.npmjs.com/package/react-doctor)

## 许可证

[MIT](../LICENSES/zh.md) © Cristhobal Canales
