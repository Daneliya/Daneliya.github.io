---
url: /AIGC/AI应用开发/01.AI开发指南/CodeBuddy.md
---

# CodeBuddy

## 一、CodeBuddy 简介

CodeBuddy 是腾讯云推出的 AI 代码助手，支持多种 AI 模型接入，帮助开发者提高编码效率。它提供 IDE 插件和命令行工具两种使用方式。

### 1.1 核心特性

| 特性 | 说明 |
|------|------|
| **多模型支持** | 支持接入 OpenAI、DeepSeek、小米 MiMo 等多种模型 |
| **代码生成** | 根据自然语言描述生成代码 |
| **代码补全** | 智能代码补全建议 |
| **代码解释** | 解释复杂代码逻辑 |
| **代码重构** | 智能优化和重构代码 |
| **多平台支持** | 支持 VS Code、JetBrains IDE、命令行 |

### 1.2 使用方式

* **CodeBuddy IDE**：独立的 IDE 应用
* **VS Code 插件**：通过扩展市场安装
* **CLI 命令行**：通过 npm 安装命令行工具

## 二、安装配置

### 2.1 前置要求

* Node.js 18.20 或更高版本（CLI 方式需要）
* 有效的 API 密钥

### 2.2 安装方式

#### 方式一：CodeBuddy IDE

1. 访问 [CodeBuddy 官网](https://www.codebuddy.cn/home/)
2. 下载对应系统的安装包
3. 安装并启动

#### 方式二：VS Code 插件

1. 打开 VS Code
2. 进入扩展市场
3. 搜索 "Tencent Cloud CodeBuddy"
4. 安装插件

#### 方式三：CLI 命令行

```bash
# 全局安装
npm install -g @tencent-ai/codebuddy-code

# 验证安装
codebuddy --version
```

## 三、模型配置

CodeBuddy 支持通过 `models.json` 配置文件自定义模型列表。

### 3.1 配置文件位置

| 系统 | 路径 |
|------|------|
| **Windows** | `用户目录\.codebuddy\models.json` |
| **macOS** | `~/.codebuddy/models.json` |
| **项目级** | `<项目根目录>/.codebuddy/models.json` |

**配置优先级**（从高到低）：

1. 项目级 `models.json`
2. 用户级 `models.json`
3. 内置默认配置

### 3.2 配置文件结构

```json
{
  "models": [
    {
      "id": "model-id",
      "name": "显示名称",
      "vendor": "供应商",
      "apiKey": "API密钥",
      "url": "API端点/chat/completions",
      "supportsToolCall": true,
      "supportsImages": false
    }
  ],
  "availableModels": ["model-id-1", "model-id-2"]
}
```

### 3.3 关键字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `id` | 是 | 模型唯一标识符 |
| `name` | 否 | 显示名称 |
| `vendor` | 否 | 模型供应商 |
| `apiKey` | 是 | API 密钥，支持 `${环境变量名}` 语法 |
| `url` | 是 | API 端点，必须以 `/chat/completions` 结尾 |
| `maxInputTokens` | 否 | 最大输入 Token 数 |
| `maxOutputTokens` | 否 | 最大输出 Token 数 |
| `supportsToolCall` | 否 | 是否支持工具调用 |
| `supportsImages` | 否 | 是否支持图片输入 |
| `supportsReasoning` | 否 | 是否支持推理模式 |
| `relatedModels` | 否 | 关联模型配置 |

### 3.4 配置示例：小米 MiMo

#### 获取 API 密钥

| 使用方式 | BASE\_URL | API Key 格式 | 获取地址 |
|----------|----------|--------------|----------|
| **按量付费 API** | `https://api.xiaomimimo.com/v1` | `sk-xxxxx` | [API Keys 管理](https://platform.xiaomimimo.com/#/console/api-keys) |
| **Token Plan** | `https://token-plan-cn.xiaomimimo.com/v1` | `tp-xxxxx` | [订阅管理](https://platform.xiaomimimo.com/#/console/plan-manage) |

#### 配置文件

创建或修改配置文件 `models.json`：

```json
{
  "models": [
    {
      "id": "mimo-v2.5-pro",
      "name": "mimo-v2.5-pro",
      "vendor": "MiMo",
      "apiKey": "${MIMO_API_KEY}",
      "url": "https://api.xiaomimimo.com/v1/chat/completions",
      "supportsToolCall": true,
      "supportsImages": false
    },
    {
      "id": "mimo-v2.5",
      "name": "mimo-v2.5",
      "vendor": "MiMo",
      "apiKey": "${MIMO_API_KEY}",
      "url": "https://api.xiaomimimo.com/v1/chat/completions",
      "supportsToolCall": true,
      "supportsImages": true
    }
  ],
  "availableModels": ["mimo-v2.5-pro", "mimo-v2.5"]
}
```

#### 设置环境变量

```bash
# Windows PowerShell
$env:MIMO_API_KEY="sk-xxxxx"

# Windows CMD
set MIMO_API_KEY=sk-xxxxx

# macOS/Linux
export MIMO_API_KEY="sk-xxxxx"
```

### 3.5 配置其他模型

#### OpenAI

```json
{
  "models": [
    {
      "id": "gpt-4o",
      "name": "GPT-4o",
      "vendor": "OpenAI",
      "apiKey": "${OPENAI_API_KEY}",
      "url": "https://api.openai.com/v1/chat/completions",
      "supportsToolCall": true,
      "supportsImages": true
    }
  ]
}
```

#### DeepSeek

```json
{
  "models": [
    {
      "id": "deepseek-chat",
      "name": "DeepSeek Chat",
      "vendor": "DeepSeek",
      "apiKey": "${DEEPSEEK_API_KEY}",
      "url": "https://api.deepseek.com/v1/chat/completions",
      "supportsToolCall": true,
      "supportsImages": false
    }
  ]
}
```

#### 本地模型（如 Ollama）

```json
{
  "models": [
    {
      "id": "llama3",
      "name": "Llama 3 (Local)",
      "vendor": "Ollama",
      "apiKey": "ollama",
      "url": "http://localhost:11434/v1/chat/completions",
      "supportsToolCall": true,
      "supportsImages": false
    }
  ]
}
```

## 四、基本使用

### 4.1 IDE 使用

#### 启动使用

1. 打开 CodeBuddy IDE 或 VS Code
2. 关闭 `Auto mode`
3. 从模型列表选择配置好的模型
4. 开始对话

#### 常用快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+Shift+C` | 打开 Claude 面板 |
| `Ctrl+Shift+P` | 命令面板 |

### 4.2 CLI 使用

#### 启动会话

```bash
# 进入项目目录
cd /path/to/your/project

# 启动 CodeBuddy
codebuddy

# 带初始提示启动
codebuddy "帮我分析这个项目的结构"
```

#### 常用命令

```bash
# 查看当前模型
/status

# 切换模型
/model

# 查看帮助
/help

# 退出
/exit
```

#### 单次命令执行

```bash
# 执行单次命令
codebuddy -p "解释这段代码的作用"

# 管道输入
cat main.py | codebuddy -p "找出这段代码中的潜在问题"
```

## 五、高级功能

### 5.1 使用上下文

```bash
# 引用特定文件
codebuddy "根据 @src/config.ts 中的配置，生成对应的测试用例"

# 引用多个文件
codebuddy "对比 @src/old.ts 和 @src/new.ts 的差异"
```

### 5.2 工作区模式

```bash
# 启动工作区模式
codebuddy --workspace

# 指定工作区路径
codebuddy --workspace /path/to/project
```

### 5.3 关联模型配置

可以为不同场景配置不同的关联模型：

```json
{
  "models": [
    {
      "id": "mimo-v2.5-pro",
      "name": "mimo-v2.5-pro",
      "vendor": "MiMo",
      "apiKey": "${MIMO_API_KEY}",
      "url": "https://api.xiaomimimo.com/v1/chat/completions",
      "supportsToolCall": true,
      "relatedModels": {
        "lite": "mimo-v2.5",
        "reasoning": "mimo-v2.5-pro"
      }
    }
  ]
}
```

**关联模型场景说明**：

| 场景 | 说明 |
|------|------|
| `lite` | 轻量级任务，如简单代码补全 |
| `reasoning` | 需要深度推理的任务 |

### 5.4 配置热重载

* 配置文件修改后支持热重载
* 1 秒防抖延迟
* 无需重启应用

## 六、最佳实践

### 6.1 安全建议

* 使用环境变量存储 API 密钥，避免明文存储
* 不要在提示词中包含敏感信息
* 审查生成的代码，避免引入安全漏洞

### 6.2 提示词技巧

**明确具体的需求**

```bash
# 不推荐
codebuddy "写个函数"

# 推荐
codebuddy "写一个 TypeScript 函数，输入一个字符串数组，返回去重后按字母排序的结果，使用 Set 和 Array.sort"
```

**提供上下文**

```bash
# 不推荐
codebuddy "修复这个 bug"

# 推荐
codebuddy "运行 tests/unit/auth.test.ts 时出现 'TypeError: Cannot read property undefined'，帮我定位并修复问题"
```

### 6.3 工作流程建议

1. **先理解后修改**：让 AI 先解释代码逻辑，再提出修改建议
2. **小步迭代**：将大任务拆分为多个小任务逐步完成
3. **验证输出**：生成代码后及时运行测试验证
4. **版本控制**：重要修改前先提交当前代码

## 七、常见问题

### 7.1 配置后模型未出现

**问题**：配置了 `models.json` 但模型未出现在下拉菜单中

**解决**：

1. 检查 JSON 语法是否正确
2. 确认配置文件路径正确
3. 如果配置了 `availableModels` 字段，确保模型 ID 已包含在内
4. 等待 1 秒热重载完成

### 7.2 API 密钥相关

**问题**：提示 "API key not found" 或 "Unauthorized"

**解决**：

```bash
# 检查环境变量
echo $MIMO_API_KEY

# 重新设置
export MIMO_API_KEY="your-api-key"
```

### 7.3 网络问题

**问题**：连接超时或无法访问 API

**解决**：

```bash
# 检查网络连接
ping api.xiaomimimo.com

# 配置代理（如需要）
export HTTPS_PROXY="http://your-proxy:port"
```

### 7.4 JSON 格式错误

**问题**：配置文件无法加载

**解决**：

* 使用 JSON 验证工具检查格式
* 确保没有多余的逗号
* 检查引号是否正确闭合

## 参考资料

\[1] CodeBuddy 官方文档：https://www.codebuddy.ai/docs/zh/cli/models

\[2] 小米 MiMo 开放平台：https://platform.xiaomimimo.com/docs/zh-CN/integration/codebuddy

\[3] CodeBuddy 官网：https://www.codebuddy.cn/home/

\[4] 菜鸟教程 - Claude Code：https://www.runoob.com/claude-code/claude-code-tutorial.html
