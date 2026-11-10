---
url: /AIGC/AI应用开发/01.AI开发指南/Cursor教程笔记.md
---

# Cursor 教程笔记

> 整理自菜鸟教程、Cursor 官方博客等多个来源，覆盖从安装到高阶使用的完整流程。

***

## 目录

1. [概述](#1-概述)
2. [安装与初始配置](#2-安装与初始配置)
3. [界面与基础操作](#3-界面与基础操作)
4. [中文设置（全方位）](#4-中文设置全方位)
5. [AI 模型配置](#5-ai-模型配置)
6. [Chat 与 Composer](#6-chat-与-composer)
7. [@ 符号：上下文引用利器](#7--符号上下文引用利器)
8. [集成终端](#8-集成终端)
9. [网络优化（国内用户）](#9-网络优化国内用户)
10. [免费版 vs 付费版](#10-免费版-vs-付费版)
11. [附录：快捷键速查](#11-附录快捷键速查)

***

## 1. 概述

### 1.1 Cursor 是什么？

Cursor 是一款**基于 VS Code 构建的 AI 驱动代码编辑器**，集成了 GPT-4、Claude 3.5 等大型语言模型，目标是在不改变开发者习惯的前提下，用 AI 提升编码效率和质量。

### 1.2 与 VS Code 的关系

| 维度 | 说明 |
|:---|:---|
| **底层** | 基于 VS Code 开源代码构建 |
| **插件** | 完全兼容 VS Code 扩展生态 |
| **操作** | 界面、快捷键、设置体系与 VS Code 一致 |
| **差异** | 原生集成 AI Chat / Composer / Tab 补全 / @ 上下文引用 |
| **学习成本** | VS Code 用户几乎零成本上手 |

### 1.3 核心 AI 功能一览

| 功能 | 说明 | 快捷键 |
|:---|:---|:---|
| **Tab 补全（Copilot++）** | 根据上下文智能预测并补全代码 | 编码时自动触发 |
| **Cmd+K / Ctrl+K** | 选中代码，用自然语言指令修改 | `Ctrl+K` |
| **Chat** | 交互式 AI 对话，解释/调试/学习 | `Ctrl+L` |
| **Composer** | 多文件代码生成，按需求文档构建 | `Ctrl+I` |
| **@ 符号** | 引用文件/文件夹/代码库/Git/网络等作为上下文 | 对话中输入 `@` |

### 1.4 同类产品对比

| 产品 | 开发商 | 特点 |
|:---|:---|:---|
| **Cursor** | Cursor Inc. | VS Code 基础 + 原生 AI |
| **GitHub Copilot** | GitHub/Microsoft | 插件形式，需 VS Code |
| **Qoder** | 阿里巴巴 | 国内 VS Code 分支 |
| **Trae** | 字节跳动 | 国内 VS Code 分支 |

***

## 2. 安装与初始配置

### 2.1 系统要求

| 操作系统 | 版本要求 | 架构 |
|:---|:---|:---|
| Windows | Windows 10 1903+ | x64 / ARM64 |
| macOS | 10.15 Catalina+ | Intel / Apple Silicon |
| Linux | Ubuntu 18.04+ / Debian 10+ / RHEL 8+ | x64 / ARM64 |

**硬件最低要求**：4GB RAM（推荐 8GB+）、2GB 磁盘、支持 SSE2 处理器、稳定网络。

### 2.2 下载

官网：**<https://www.cursor.com/downloads>**，自动匹配操作系统。

### 2.3 Windows 安装

1. 官网下载 `.exe` → 双击运行
2. 选择安装路径（建议默认）
3. 点击 Install → 等待完成 → Finish 启动

### 2.4 macOS 安装

1. 官网下载 `.dmg` → 双击打开
2. 拖动 Cursor 图标到 Applications 文件夹
3. 从 Applications 中双击启动

### 2.5 Linux 安装

**Debian/Ubuntu：**

```bash
sudo dpkg -i cursor_<version>_amd64.deb
sudo apt-get install -f
```

**Fedora/RHEL：**

```bash
sudo rpm -ivh cursor_<version>_x86_64.rpm
```

### 2.6 首次启动配置

1. 选择界面语言（建议中文）
2. 可选：从本机 VS Code 导入扩展
3. 注册账号（支持 GitHub 授权登录）
4. 勾选默认选项 → Continue 完成

***

## 3. 界面与基础操作

与 VS Code 完全一致：

* **活动栏**（左侧）— 文件、搜索、Git、扩展、运行
* **编辑区**（中央）— 标签页式代码编辑
* **面板区**（底部）— 终端、问题、输出、调试控制台
* **状态栏**（底部）— 编码、行号、语言模式等

核心操作：

| 操作 | 方式 |
|:---|:---|
| 打开文件夹/项目 | `Ctrl+K Ctrl+O` 或菜单 → File → Open Folder |
| 新建文件 | `Ctrl+N` |
| 命令面板 | `Ctrl+Shift+P` |
| 扩展商店 | `Ctrl+Shift+X` |
| 切换终端 | `` Ctrl+` `` |

***

## 4. 中文设置（全方位）

### 4.1 界面汉化

**方法一：扩展商店安装（推荐）**

1. `Ctrl+Shift+X` 打开扩展商店
2. 搜索 **"Chinese"**
3. 安装 **Chinese (Simplified) Language Pack for Visual Studio Code**（发布者：Microsoft）
4. 右下角弹窗提示重启 → 确认

**方法二：命令面板手动切换**

1. `Ctrl+Shift+P` → 输入 **"Configure Display Language"**
2. 选择 **"zh-cn"** → 重启

> Cursor 特有功能（如 Composer、Agent 模式）部分界面可能保持英文，正常现象。

### 4.2 AI 中文回复

| 配置方式 | 作用范围 | 优先级 | 推荐场景 |
|:---|:---|:---|:---|
| **Rules for AI（全局）** | 所有项目 | 低 | 个人默认设置 |
| **.cursorrules** | 单个项目 | 中 | 项目级统一规范 |
| **.cursor/rules/\*.mdc** | 单项目（可按文件过滤） | 高 | 大型团队精细化管理 |

**全局配置（最快）：**

`File → Preferences → Cursor Settings → General → Rules for AI`，输入：

```
Always respond in Chinese (Simplified).
代码注释使用中文。
技术术语保留英文原文，并在首次出现时用括号标注中文翻译。
```

**项目级配置 .cursorrules（推荐）：**

在项目根目录创建 `.cursorrules`：

```
# 语言规范
- 所有回复使用简体中文
- 代码注释使用中文
- commit message 使用中文
- 技术术语保留英文，括号注明中文（如：Container（容器））
```

**新版 .cursor/rules/ 目录（更精细）：**

```
.cursor/
└── rules/
    ├── language.mdc       # 语言规范
    ├── code-style.mdc     # 代码风格
    └── documentation.mdc  # 文档规范
```

`language.mdc` 示例：

```markdown
---
description: 语言和回复规范
globs: ["**/*"]
---

## 语言规则
- 所有AI回复使用简体中文
- 代码注释统一使用中文
- 保留英文技术术语，首次出现时括号注明中文翻译
- Git commit message 使用中文描述
```

### 4.3 中文乱码修复

**编辑器乱码：**

* 临时：点击右下角编码标识 → **Reopen with Encoding** → 选 GBK/GB2312
* 永久：设置中搜索 `auto guess encoding`，勾选 `Files: Auto Guess Encoding`

项目 `.vscode/settings.json`：

```json
{
  "files.encoding": "utf8",
  "files.autoGuessEncoding": true
}
```

**终端乱码（Windows）：**

```json
{
  "terminal.integrated.profiles.windows": {
    "PowerShell": {
      "source": "PowerShell",
      "args": ["-NoExit", "-Command", "chcp 65001"]
    }
  }
}
```

### 4.4 中文字体推荐

| 操作系统 | 推荐字体 | 行高 |
|:---|:---|:---|
| Windows | `'Cascadia Code', 'Microsoft YaHei', monospace` | 1.6~1.7 |
| macOS | `'JetBrains Mono', 'PingFang SC', monospace` | 1.6~1.7 |
| Linux | `'Fira Code', 'Noto Sans CJK SC', monospace` | 1.6~1.7 |

***

## 5. AI 模型配置

### 5.1 内置模型

Cursor 默认预设了 GPT-4、GPT-3.5 等模型，Pro 用户可直接使用。

### 5.2 添加自定义模型（如 DeepSeek）

1. 右上角齿轮 → **Models**
2. 底部点击 **Add Model**
3. 输入模型名称（如 `deepseek-v3`、`deepseek-r1`）
4. 配置 API Key 和请求地址：
   * API Key 获取：model 官方平台（如 [platform.deepseek.com](https://platform.deepseek.com/usage)）
   * 请求地址：`https://api.deepseek.com/chat/completions`
5. 点击 **Verify** 验证
6. 去掉其他模型勾选，只保留需要使用的模型
7. 在聊天窗口下拉菜单中选择对应模型即可

### 5.3 常见模型 API 地址参考

| 模型 | API 地址 |
|:---|:---|
| OpenAI (GPT-4) | `https://api.openai.com/v1/chat/completions` |
| DeepSeek | `https://api.deepseek.com/chat/completions` |
| 通义千问 | `https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions` |
| Moonshot | `https://api.moonshot.cn/v1/chat/completions` |

***

## 6. Chat 与 Composer

### 6.1 定位区别

| 维度 | Chat | Composer |
|:---|:---|:---|
| **用途** | 交互式问答、代码解释、调试 | 多文件代码生成、需求驱动构建 |
| **范围** | 单文件/单问题 | 跨文件/整个项目 |
| **场景** | 解释代码、修 bug、添加注释 | 建新功能、重构、按需求文档生成项目 |
| **快捷键** | `Ctrl+L` | `Ctrl+I` |

### 6.2 Chat 使用

1. `Ctrl+L` 打开聊天面板
2. 输入自然语言指令（如"给这段代码添加中文注释"）
3. AI 返回修改建议
4. 点击 **Apply** 应用到文件

Chat 会记住对话上下文，支持逐步深入提问。

### 6.3 Composer 使用

1. 创建需求文档描述要实现的功能
2. `Ctrl+I` 打开 Composer
3. 让 AI 根据需求文档生成代码
4. AI 分析需求后自动创建/修改多个文件
5. 通过额外指令迭代优化

### 6.4 推荐工作流

```
需求分析 → 写需求文档 → Composer 生成代码 → Chat 解释/优化 → 完成
```

***

## 7. @ 符号：上下文引用利器

在 Chat / Composer / Cmd+K 中输入 `@`，触发上下文引用菜单。

### 7.1 全部指令

| 指令 | 功能 | 典型场景 |
|:---|:---|:---|
| **@Files** | 引用整个文件 | 让 AI 基于某个现有文件修改 |
| **@Folders** | 引用整个文件夹 | 批量分析多个文件 |
| **@Code** | 引用特定代码片段 | 针对某几行代码提问 |
| **@Codebase** | 搜索整个代码库 | 全局查找相关代码 |
| **@Git** | 引用 Git 提交/差异 | 分析最近改动、排查故障 |
| **@Web** | 搜索网络信息 | 获取最新文档或资料 |
| **@Docs** | 引用预设文档 | 按官方文档生成代码 |
| **@Definitions** | 引用附近所有定义 | 理解当前作用域上下文 |
| **@Chat** | 引用之前的对话 | 在聊天中引用历史消息 |

### 7.2 组合用法

可以同时使用多个 @ 指令：

```
@Files src/models/user.js @Docs https://jwt.io/introduction
生成用户登录功能
```

### 7.3 实用案例

| 场景 | 指令示例 |
|:---|:---|
| **代码生成** | `生成用户登录 @Files src/models/user.js @Docs JWT` |
| **错误排查** | `解释报错原因 @Code 12-25行 @Git HEAD~1` |
| **跨文件重构** | `改为函数式组件 @Folders src/components @Codebase` |
| **学习概念** | `解释这段代码在哪里被调用 @Codebase` |

### 7.4 高级配置

* **.cursorignore**：类似 `.gitignore`，排除敏感文件不被索引
* **自定义文档**：`Settings → Features → Docs` 添加自定义文档链接，增强 @Docs 覆盖

***

## 8. 集成终端

### 8.1 基本操作

| 操作 | 快捷键 |
|:---|:---|
| 打开/关闭终端 | `` Ctrl+` `` |
| 新建终端 | `` Ctrl+Shift+` `` |
| 切换终端 | 下拉选择 |
| 清屏 | `Ctrl+L`（终端内） |

### 8.2 Windows 终端中文化

在设置中搜索 `terminal.integrated.profiles.windows`：

```json
{
  "terminal.integrated.profiles.windows": {
    "PowerShell": {
      "source": "PowerShell",
      "args": ["-NoExit", "-Command", "chcp 65001"]
    }
  },
  "terminal.integrated.fontFamily": "'Consolas', 'Microsoft YaHei Mono', monospace"
}
```

***

## 9. 网络优化（国内用户）

| 问题 | 说明 |
|:---|:---|
| **AI 服务延迟** | Cursor AI 推理服务部署在海外，Chat/Composer/Cmd+K 可能较慢 |
| **编辑器本身** | 不受影响，本地编辑、文件操作正常 |
| **替代方案** | 可使用 API 中转服务优化连接；网络不佳时优先用 Tab 补全（对网络要求低） |

***

## 10. 免费版 vs 付费版

| 对比维度 | 免费版（Hobby） | Pro（$20/月） | Business（$40/月） |
|:---|:---|:---|:---|
| 界面中文化 | ✅ | ✅ | ✅ |
| AI 中文回复 | ✅（有限额） | ✅（500次快速请求/月） | ✅（无限制） |
| .cursorrules | ✅ | ✅ | ✅ |
| Tab 补全 | ✅ | ✅ | ✅ |
| Chat | ✅（有限额） | ✅ | ✅ |
| Composer | ✅（有限额） | ✅ | ✅ |
| Agent 模式 | 有限制 | ✅ | ✅ |
| 中文字体配置 | ✅ | ✅ | ✅ |

> 中文化配置在所有版本中功能完全一致。

***

## 11. 附录：快捷键速查

### 11.1 通用

| 功能 | Windows/Linux | macOS |
|:---|:---|:---|
| 命令面板 | `Ctrl+Shift+P` | `Cmd+Shift+P` |
| 打开设置 | `Ctrl+,` | `Cmd+,` |
| 扩展商店 | `Ctrl+Shift+X` | `Cmd+Shift+X` |
| 切换终端 | `` Ctrl+` `` | `` Cmd+` `` |
| 打开文件夹 | `Ctrl+K Ctrl+O` | `Cmd+K Cmd+O` |

### 11.2 AI 功能

| 功能 | Windows/Linux | macOS |
|:---|:---|:---|
| Chat 对话 | `Ctrl+L` | `Cmd+L` |
| Composer | `Ctrl+I` | `Cmd+I` |
| 行内编辑 | `Ctrl+K` | `Cmd+K` |
| Tab 补全 | `Tab`（自动触发） | `Tab`（自动触发） |

### 11.3 @ 符号引用

在 Chat / Composer / Cmd+K 中输入 `@` → 方向键选择 → Enter 确认。

对文件引用可按 `Ctrl+M`（macOS: `Cmd+M`）切换"完整读取"和"摘要读取"模式。

***

> **参考来源**
>
> * [菜鸟教程 - Cursor 教程](https://www.runoob.com/cursor/cursor-tutorial.html)
> * [Cursor 官方 - 中文设置指南](https://www.cursor-ide.com/blog/cursor-chinese-setup-guide)
> * [CURSOR 使用自定义模型教程](https://zhuanlan.zhihu.com/p/19138455026)
