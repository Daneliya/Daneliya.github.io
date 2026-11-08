---
url: /AIGC/AI应用开发/01.AI开发指南/CC switch.md
---

# CC Switch

## 一、CC Switch 简介

CC Switch 是一个**开源**的跨平台桌面应用程序，作为多种 AI 编程助手的**一体化管理助手**。它可以帮助开发者在一个界面中统一管理多个 AI CLI 工具，告别手动编辑配置文件的繁琐。

### 1.1 支持的 AI 工具

| 工具 | 说明 |
|------|------|
| **Claude Code** | Anthropic 的 AI 编程助手 |
| **Codex** | OpenAI 的代码生成工具 |
| **Gemini CLI** | Google 的 AI 命令行工具 |
| **OpenCode** | 开源代码助手 |
| **OpenClaw** | 开源 AI 代理 |
| **Hermes Agent** | AI 代理工具 |

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **统一管理** | 一个界面管理多个 AI 工具 |
| **快速切换** | 内置 50+ 提供商预设，一键导入 |
| **MCP 管理** | 统一的 MCP 服务器管理面板 |
| **提示词管理** | Markdown 编辑器，支持跨应用同步 |
| **技能管理** | 支持从 GitHub 仓库或 ZIP 文件一键安装 |
| **代理与故障转移** | 内置本地代理，支持热切换和自动故障转移 |
| **会话管理** | 浏览、搜索和恢复对话历史 |
| **用量追踪** | 追踪花费、请求数和 Token 使用量 |
| **云同步** | 支持 Dropbox、OneDrive、iCloud、WebDAV 同步 |
| **跨平台** | 支持 Windows、macOS 和 Linux |

## 二、安装配置

### 2.1 系统要求

* **Node.js**：18+
* **pnpm**：8+
* **Rust**：1.85+（开发需要）
* **Tauri CLI**：2.8+（开发需要）

### 2.2 安装方式

#### Windows

```bash
# 方式一：下载安装程序
# 从 GitHub Releases 页面下载 .msi 安装程序

# 方式二：便携版
# 下载 .zip 文件解压即可使用
```

#### macOS

```bash
# 推荐使用 Homebrew
brew install --cask cc-switch

# 或者下载 .dmg 文件
# 应用已通过 Apple 公证，可安全使用
```

#### Linux

```bash
# Arch Linux
paru -S cc-switch-bin

# Debian/Ubuntu
sudo dpkg -i cc-switch_*.deb

# Fedora/RHEL
sudo rpm -i cc-switch_*.rpm

# 通用
# 下载 .AppImage 文件，添加执行权限后运行
chmod +x cc-switch_*.AppImage
./cc-switch_*.AppImage
```

### 2.3 验证安装

安装完成后，启动 CC Switch 应用程序。

## 三、基本使用

### 3.1 界面概览

CC Switch 提供了直观的图形界面：

* **主界面**：管理所有 AI 工具和配置
* **系统托盘**：快速切换提供商
* **设置面板**：配置同步、代理等

### 3.2 添加提供商

#### 使用预设提供商

1. 打开 CC Switch 主界面
2. 点击「添加提供商」
3. 从 50+ 预设中选择（如 AWS Bedrock、NVIDIA NIM 等）
4. 填入 API 密钥
5. 保存配置

#### 自定义提供商

```json
{
  "name": "自定义提供商",
  "baseUrl": "https://api.example.com/v1",
  "apiKey": "your-api-key",
  "models": ["model-1", "model-2"]
}
```

### 3.3 切换提供商

#### 方式一：主界面切换

1. 打开 CC Switch 主界面
2. 选择要使用的 AI 工具
3. 点击对应的提供商进行切换

#### 方式二：系统托盘切换

1. 点击系统托盘中的 CC Switch 图标
2. 从列表中选择提供商
3. 自动切换完成

### 3.4 管理 MCP 服务器

#### 添加 MCP 服务器

1. 打开 MCP 管理面板
2. 点击「添加服务器」
3. 配置服务器信息：
   * 名称
   * 命令
   * 参数
   * 环境变量

#### 同步 MCP 配置

CC Switch 支持双向同步 MCP 配置：

* **导入**：从现有配置文件导入
* **导出**：将配置导出到各 AI 工具

### 3.5 管理提示词

#### 创建提示词

1. 打开提示词管理面板
2. 点击「新建提示词」
3. 使用 Markdown 编辑器编写
4. 保存并同步到各 AI 工具

#### 同步提示词文件

支持同步的文件：

* `CLAUDE.md`（Claude Code）
* `AGENTS.md`（其他 AI 工具）
* 自定义提示词文件

## 四、高级功能

### 4.1 代理配置

#### 启用本地代理

1. 打开设置面板
2. 启用「本地代理」
3. 配置代理端口

#### 代理特性

* **热切换**：无需重启即可切换代理
* **格式转换**：自动转换不同 API 格式
* **自动故障转移**：主提供商失败时自动切换
* **断路器**：防止频繁失败请求

### 4.2 会话管理

#### 浏览历史会话

1. 打开会话管理面板
2. 按工具或日期筛选
3. 查看会话详情

#### 恢复会话

1. 选择要恢复的会话
2. 点击「恢复」
3. 自动打开对应的 AI 工具并加载上下文

### 4.3 用量追踪

#### 查看用量统计

1. 打开用量仪表盘
2. 查看：
   * 总花费
   * 请求数量
   * Token 使用量
   * 各工具使用占比

#### 成本优化建议

* 分析各提供商的性价比
* 识别高消耗的使用模式
* 推荐更经济的替代方案

### 4.4 云同步

#### 配置同步

1. 打开设置面板
2. 选择同步服务：
   * Dropbox
   * OneDrive
   * iCloud
   * WebDAV
3. 授权并配置同步

#### 同步内容

* 提供商配置
* MCP 服务器配置
* 提示词文件
* 使用偏好

### 4.5 深链接

CC Switch 支持 `ccswitch://` URL 协议，可快速导入配置：

```
# 导入提供商
ccswitch://import/provider?url=https://example.com/provider.json

# 导入 MCP 服务器
ccswitch://import/mcp?url=https://example.com/mcp.json

# 导入技能
ccswitch://import/skill?url=https://github.com/user/repo
```

## 五、数据存储

### 5.1 存储位置

| 文件 | 路径 |
|------|------|
| **数据库** | `~/.cc-switch/cc-switch.db` |
| **本地设置** | `~/.cc-switch/settings.json` |
| **备份** | `~/.cc-switch/backups/` |
| **技能文件** | `~/.cc-switch/skills/` |

### 5.2 数据安全

* 使用 SQLite 数据库存储
* 采用原子写入模式，防止配置损坏
* 支持自动备份

### 5.3 备份与恢复

#### 手动备份

```bash
# 备份整个配置目录
cp -r ~/.cc-switch ~/.cc-switch-backup-$(date +%Y%m%d)
```

#### 恢复备份

```bash
# 恢复备份
cp -r ~/.cc-switch-backup-20260622 ~/.cc-switch
```

## 六、开发指南

### 6.1 开发环境搭建

```bash
# 克隆仓库
git clone https://github.com/farion1231/cc-switch.git
cd cc-switch

# 安装依赖
pnpm install

# 启动开发模式
pnpm dev
```

### 6.2 项目结构

```
cc-switch/
├── src/              # 前端代码 (React + TypeScript)
├── src-tauri/        # 后端代码 (Rust)
├── tests/            # 前端测试
├── docs/             # 文档
└── assets/           # 截图与资源
```

### 6.3 技术栈

* **前端**：React 18, TypeScript, Vite, TailwindCSS 3.4, TanStack Query v5, shadcn/ui
* **后端**：Tauri 2.8, Rust, serde, tokio
* **测试**：Vitest, MSW, @testing-library/react

### 6.4 构建与测试

```bash
# 构建应用
pnpm build

# 运行前端单元测试
pnpm test:unit

# 运行端到端测试
pnpm test:e2e
```

## 七、常见问题

### 7.1 安装问题

**问题**：macOS 提示"无法验证开发者"

**解决**：

```bash
# 允许运行未签名应用
sudo spctl --master-disable
# 安装完成后重新启用
sudo spctl --master-enable
```

### 7.2 配置问题

**问题**：提供商配置后无法使用

**解决**：

1. 检查 API 密钥是否正确
2. 确认网络连接正常
3. 查看日志文件排查问题

### 7.3 同步问题

**问题**：云同步失败

**解决**：

1. 检查网络连接
2. 重新授权同步服务
3. 检查同步服务配额

### 7.4 性能问题

**问题**：应用启动缓慢

**解决**：

1. 清理旧的会话历史
2. 减少同时启用的提供商数量
3. 检查系统资源占用

## 参考资料

\[1] CC Switch 官网：https://www.ccswitch.io/zh/

\[2] CC Switch GitHub：https://github.com/farion1231/cc-switch

\[3] CC Switch 官方文档：https://www.ccswitch.io/zh/docs

\[4] 博客园教程：https://www.cnblogs.com/Can-daydayup/p/19972541

\[5] 知乎专栏：https://zhuanlan.zhihu.com/p/1984791246741471495
