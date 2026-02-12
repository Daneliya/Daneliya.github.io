---
url: /daily/开源项目/使用教程/douyin-downloader.md
---

# douyin-downloader 使用教程

## 一、安装

### 克隆项目

```sh
git clone https://github.com/jiji262/douyin-downloader.git
cd douyin-downloader
```

### 安装依赖

```sh
pip install -r requirements.txt
```

### 配置 Cookie

```sh
# 方式1：自动获取（推荐）
python cookie_extractor.py

# 方式2：手动获取
python get_cookies_manual.py
```

## 二、设置配置文件

### 编辑配置文件

```sh
cp config.example.yml config.yml
# 编辑 config.yml 文件
```

### 配置示例

```yaml
# 下载链接
link:
  - https://v.douyin.com/xxxxx/                    # 单个视频
  - https://www.douyin.com/user/xxxxx              # 用户主页
  - https://www.douyin.com/collection/xxxxx        # 合集

# 保存路径
path: ./Downloaded/

# Cookie配置（必填）
cookies:
  msToken: YOUR_MS_TOKEN_HERE
  ttwid: YOUR_TTWID_HERE
  odin_tt: YOUR_ODIN_TT_HERE
  passport_csrf_token: YOUR_PASSPORT_CSRF_TOKEN_HERE
  sid_guard: YOUR_SID_GUARD_HERE

# 下载选项
music: True    # 下载音乐
cover: True    # 下载封面
avatar: True   # 下载头像
json: True     # 保存JSON数据

# 下载模式
mode:
  - post       # 下载发布的作品
  # - like     # 下载喜欢的作品
  # - mix      # 下载合集

# 下载数量（0表示全部）
number:
  post: 0      # 发布作品数量
  like: 0      # 喜欢作品数量
  allmix: 0    # 合集数量
  mix: 0       # 单个合集内作品数量

# 其他设置
thread: 5      # 下载线程数
database: True # 使用数据库记录
```

## 报错

### JSON解析失败

参考：https://github.com/jiji262/douyin-downloader/issues/121

```markdown
改两个地方
apiproxy/douyin/download.py line:145
with open(path, "w", encoding='utf-8') as f: json.dump(data, f, ensure_ascii=False, indent=2)

requirment.txt line:5
brotli>=1.0.9            # 支持 br 压缩解码（抖音接口常用）
```
