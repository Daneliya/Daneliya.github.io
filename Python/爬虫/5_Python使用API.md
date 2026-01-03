---
url: /Python/爬虫/5_Python使用API.md
---

# Python使用API

当爬虫因网页结构变化失效、或面临合规风险时，**API（Application Programming Interface，应用程序编程接口）** 是更可靠的数据获取方案。它是官方定义的 “软件对话说明书”，能让程序直接、高效地获取结构化数据。以下是 API 的核心知识、使用方法及与爬虫的对比：

## 一、API 是什么？

API 本质是**两个软件之间的通讯规则**，定义了 “如何通过请求获取服务端数据”。通俗来说，它就像餐厅的 “菜单”—— 用户（程序）按菜单（API 规则）点单（发送请求），厨房（服务端）按规则上菜（返回数据）。

例如：某论坛提供 API，程序可通过 API 直接获取 “最热主题”“用户信息”，无需爬取网页 HTML 再解析。

## 二、使用 API 的核心要素

要通过 API 获取数据，需明确 4 个关键信息（均来自官方 API 文档）：

### 1. API 端点（Endpoint）

* **定义**：发送请求的目标 URL，不同功能对应不同端点。
* 示例：
  * 论坛 “获取最热主题” 的端点：`https://api.v2ex.com/topics/hot.json`
  * 论坛 “获取最新主题” 的端点：`https://api.v2ex.com/topics/latest.json`

### 2. 请求方法（HTTP Method）

API 基于 HTTP 协议，常用方法与功能对应：

| 方法     | 功能                   | 示例场景             |
| -------- | ---------------------- | -------------------- |
| `GET`    | **获取数据**（最常用） | 查热门主题、用户信息 |
| `POST`   | **提交数据**           | 发布新主题、用户登录 |
| `PUT`    | **更新数据**           | 修改已发布的主题内容 |
| `DELETE` | **删除数据**           | 删除某条评论         |

### 3. 查询参数与请求体

* **查询参数**：URL 中通过`?key=value`传递的额外信息（常用于`GET`请求）。
  示例：`https://api.v2ex.com/users/show.json?username=test`（通过`username=test`指定查询用户）。
* **请求体（Body）**：包含更多数据的载体（常用于`POST`/`PUT`请求），如提交表单时的 “用户名 + 密码”。
  注：`GET`请求的请求体通常为空（数据通过查询参数传递）。

### 4. 响应格式

API 返回的数据多为**结构化格式**，便于程序直接解析：

* **JSON**（最常用）：文本格式，可直接转为 Python 的字典 / 列表；
* **XML**：标签式格式，需专用库解析（如`xml.etree.ElementTree`）。

示例 JSON 响应（论坛热门主题）：

```json
[
  {"id": 123, "title": "Python学习推荐", "content": "分享几个学习资源..."},
  {"id": 456, "title": "API vs 爬虫", "content": "哪个更适合数据获取？..."}
]
```

### 额外注意：认证与授权

部分 API 需 “身份验证”（如 API 密钥、Token），仅授权用户可访问。例如：

* 请求头中携带密钥：`headers={"Authorization": "Bearer your_token"}`
* 官方文档会明确认证方式（如 API Key、OAuth2.0）。

## 三、用 Python 调用 API 的实战步骤

API 基于 HTTP 协议，可直接用`requests`库发送请求，步骤如下：

### 1. 准备工作

* 查看官方 API 文档，确认端点、请求方法、参数；

* 导入所需库（`requests`用于发请求，`json`用于解析响应）：

  ```python
  import requests
  import json
  ```

### 2. 发送 API 请求（以`GET`为例）

以 “获取 V2EX 热门主题” 为例：

```python
# 1. API端点（从文档获取）
url = "https://www.v2ex.com/api/topics/hot.json"

# 2. 发送GET请求（若需查询参数，可加params参数）
response = requests.get(url)

# 3. 判断请求是否成功（2xx状态码表示成功）
if response.status_code >= 200 and response.status_code < 300:
    print("请求成功！")
    # 4. 解析JSON响应（response.text是JSON字符串）
    data = json.loads(response.text)  # 转为Python列表/字典
else:
    print(f"请求失败，状态码：{response.status_code}")
```

### 3. 提取目标数据

解析后的`data`是列表 / 字典，直接用 Python 语法提取信息：

```python
# 提取第3个热门主题的标题和内容（索引从0开始，索引2对应第3个）
third_topic = data[2]
print("第3个热门主题标题：", third_topic["title"])
print("第3个热门主题内容：", third_topic["content"])
```

## 四、API vs 爬虫：核心优势

相比爬虫，API 是更优的选择，核心优势如下：

| 对比维度         | API                                       | 爬虫                                              |
| ---------------- | ----------------------------------------- | ------------------------------------------------- |
| **可靠性**       | 官方提供，不受网页外观更新影响            | 网页结构变化（如标签改 class）则失效              |
| **数据解析难度** | 结构化格式（JSON/XML），直接转列表 / 字典 | 需从 HTML 中定位标签（如 Beautiful Soup），易出错 |
| **合规性**       | 官方允许，合法合规                        | 可能违反网站使用条款（如反爬规则）                |
| **数据完整性**   | 可能提供网页未显示的隐藏数据              | 仅能获取网页可见内容                              |
| **效率**         | 请求直接返回目标数据，速度快              | 需下载完整 HTML，解析步骤多                       |

## 五、为什么还要学爬虫？

API 虽好，但并非万能：

1. **并非所有网站都提供 API**：多数中小型网站或小众服务无官方 API；
2. **API 可能有限制**：即使有 API，部分关键数据（如付费内容）可能不开放；
3. **API 可能有调用门槛**：部分 API 需申请密钥、限制调用频率（如每日 1000 次）。

因此，**API 是首选，但爬虫仍是必要补充**—— 当 API 不可用时，爬虫是获取数据的备选方案。

通过 API 获取数据，能规避爬虫的诸多痛点，是企业和开发者的主流选择。掌握 API 调用，可大幅提升数据获取的效率与可靠性。
