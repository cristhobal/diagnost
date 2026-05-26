<div align="center">

[English](../README.md) · [中文](zh.md) · [हिन्दी](hi.md) · [Español](es.md) · [Français](fr.md)

</div>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/diagnost-Astro%20Diagnostic%20Tool-ff5a03?style=for-the-badge&logo=astro&logoColor=white&labelColor=1e1e1e">
  <img alt="diagnost" src="https://img.shields.io/badge/diagnost-Astro%20Diagnostic%20Tool-ff5a03?style=for-the-badge&logo=astro&logoColor=white&labelColor=1e1e1e">
</picture>

---

**diagnost** 是一款面向 [Astro](https://astro.build) 项目的诊断与代码检查工具集。它能够扫描您的项目，执行 20 多条涵盖 11 个类别的检查规则，计算健康评分，并帮助您在 SEO、无障碍、性能、安全等方面保持最佳实践。

## 包

| 包 | 发布 | 描述 |
|---|---|---|
| `diagnost-core` | [npm](https://www.npmjs.com/package/diagnost-core) | 诊断引擎：项目检测、检查规则、过滤管道和评分计算 |
| `diagnost` | [npm](https://www.npmjs.com/package/diagnost) | 命令行工具，在终端中扫描 Astro 项目 |
| `eslint-plugin-diagnost` | [npm](https://www.npmjs.com/package/eslint-plugin-diagnost) | ESLint 插件，将规则暴露为 ESLint 规则 |

## 功能特性

- **20 多条检查规则**，涵盖 11 个类别：SEO、无障碍、性能、安全、内容集合、视图过渡、路由、图片、交互岛屿、国际化及配置
- **健康评分**（0–100），支持本地计算或远程 API（带降级方案）
- **基于场景的过滤** — 为 CLI、PR 评论、CI 等不同场景配置不同规则
- **Git 集成** — 仅扫描暂存文件（pre-commit）或与基准分支的差异文件（CI）
- **可配置** — 通过 `.diagnost.json` 配置文件覆盖规则/类别设置和忽略模式
- **多种输出格式** — 彩色 CLI、JSON 和紧凑 JSON
- **ESLint 插件** — 提供规则元数据和配置预设，方便 IDE 集成
- **并发流式处理** — 通过 Effect Stream 实现并行文件检查
- **失败模式** — 超出严重级别阈值时返回 exit code 1（适用于 CI）

## 安装

```bash
# 全局安装 CLI
npm install -g diagnost

# 或使用 npx
npx diagnost .

# 作为项目依赖安装
npm install --save-dev diagnost-core
```

### 环境要求

- Node.js >= 18
- pnpm >= 9.1（开发用）

## 使用方法

### CLI

```bash
# 扫描当前目录
diagnost

# 扫描指定目录
diagnost ./path/to/project

# JSON 输出
diagnost . --json

# 仅检查自 main 分支以来的变更文件（CI）
diagnost . --diff main

# 仅检查暂存文件（pre-commit）
diagnost . --staged

# 出现错误时退出码为 1
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
console.log(`评分: ${result.score}`)
```

### ESLint 插件

在 `.eslintrc` 中：

```json
{
  "plugins": ["diagnost"],
  "extends": ["plugin:diagnost/recommended"]
}
```

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

## 许可证

MIT
