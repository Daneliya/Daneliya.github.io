---
url: /Python/爬虫/2_Python发送HTTP请求.md
---

# Python发送HTTP请求

## 一、什么是HTTP请求和响应

HTTP（Hypertext Transfer Protocol，超文本传输协议）是客户端与服务器之间的请求 - 响应协议，是爬虫获取网页内容的底层原理。以下详细解析 HTTP 的请求、响应结构及核心概念：

### 1、HTTP 请求：客户端向服务器发送的 “指令”

HTTP 请求是客户端（如浏览器、爬虫）向服务器获取数据或提交信息的 “命令”，由**请求行**、**请求头**、**请求体**三部分组成。

#### 1.1. 常见请求方法

* **GET**：主要用于**获取数据**（如访问网页、查询信息），是爬虫最常用的方法。
* **POST**：主要用于**提交数据**（如注册表单、登录信息），数据存放在请求体中。

#### 1.2. 请求的组成部分

##### （1）请求行

包含**请求方法**、**资源路径**、**协议版本**，格式如下：
`方法类型 资源路径 协议版本`

* **资源路径**：指定服务器上的目标资源（如`/movie/top250`），可包含查询参数（`?key=value&key2=value2`），用于传递额外信息（如分页：`?start=75`表示从第 75 条数据开始）。
* **协议版本**：如`HTTP/1.1`（当前主流版本）。

示例：
`GET /movie/top250?start=75 HTTP/1.1`

##### （2）请求头

包含客户端向服务器传递的附加信息，常见字段：

* `Host`：主机域名（如`movie.douban.com`），结合资源路径构成完整 URL。
* `User-Agent`：客户端标识（如浏览器类型、版本，爬虫需模拟浏览器标识以避免被拦截）。
* `Accept`：客户端可接收的响应数据类型（如`text/html,application/json`，`*/*`表示任意类型）。

##### （3）请求体

客户端向服务器提交的额外数据（如表单内容），**GET 方法的请求体通常为空**，POST 方法会在此处携带数据。

### 2、HTTP 响应：服务器给客户端的 “回复”

服务器接收请求后，会返回 HTTP 响应，包含**状态行**、**响应头**、**响应体**三部分。

#### 2.1. 响应的组成部分

##### （1）状态行

包含**协议版本**、**状态码**、**状态消息**，格式如下：
`协议版本 状态码 状态消息`

* 状态码：表示请求处理结果，分为 5 类：
  * `2xx`（成功）：如`200 OK`（请求成功）。
  * `3xx`（重定向）：如`302 Found`（资源临时迁移）。
  * `4xx`（客户端错误）：如`404 Not Found`（资源不存在）、`403 Forbidden`（拒绝访问）。
  * `5xx`（服务器错误）：如`500 Internal Server Error`（服务器故障）。

##### （2）响应头

服务器向客户端传递的附加信息，常见字段：

* `Date`：响应生成的时间。
* `Content-Type`：响应体的数据类型及编码（如`text/html; charset=utf-8`表示 HTML 内容，编码为 UTF-8）。

##### （3）响应体

服务器返回的核心数据，爬虫的目标内容通常在此处：

* 若`Content-Type`为`text/html`，响应体是 HTML 代码（包含网页结构和内容）。
* 若为`application/json`，响应体是 JSON 格式数据（常见于 API 接口）。

### 3、总结

HTTP 请求与响应是爬虫获取数据的基础：

* 爬虫通过发送**GET 请求**向服务器索取网页内容；
* 服务器通过**响应体**返回 HTML 等数据，爬虫解析后提取目标信息。

## 二、如何用Python发送请求

requests 库是 Python 中发送 HTTP 请求的常用工具，能简洁高效地实现网页内容获取。以下是其安装方法、基础用法及实用技巧：

### 1、安装 requests 库

requests 是第三方库，需先安装：

**Windows**：在终端输入

```sh
pip install requests
```

**macOS/Linux**：通常使用

```sh
pip3 install requests
```

**验证安装**：
若终端显示`Successfully installed requests`，或`Requirements already satisfied`（已安装），则安装成功。
若提示 “找不到 pip”，需先按[官方指引](https://pip.pypa.io/en/stable/installation/)安装 pip 工具。

### 2、基础用法：发送 GET 请求获取网页内容

#### 2.1. 引入库并发送请求

```python
import requests

# 发送GET请求（需传入完整URL，包含http/https协议）
url = "http://books.toscrape.com"  # 练习爬虫的测试网站
response = requests.get(url)
```

#### 2.2. 处理响应结果

##### （1）判断请求是否成功

* **状态码（status\_code）**：

  ```python
  print(response.status_code)  # 200表示成功，404表示资源不存在
  ```

* **简化判断（ok 属性）**：

  ```python
  if response.ok:
      print("请求成功")
  else:
      print("请求失败")
  ```

##### （2）获取响应体内容

响应体（网页原始代码）通过`text`属性获取（以字符串形式返回）：

```python
if response.ok:
    html_content = response.text  # 存储网页HTML代码
    print(html_content)  # 打印原始内容（后续将解析这些内容）
```

### 3、进阶技巧：自定义请求头（headers）

requests 会自动生成默认请求头，但部分网站会通过`User-Agent`识别请求来源（区分浏览器与爬虫）。如需伪装成浏览器，可自定义请求头：

#### 示例：设置 User-Agent

```python
import requests

url = "http://books.toscrape.com"

# 自定义请求头：模拟Chrome浏览器
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

# 发送带自定义头的请求
response = requests.get(url, headers=headers)

if response.ok:
    print("伪装浏览器请求成功")
```

**作用**：避免网站因识别到爬虫而拒绝请求（反爬机制的基础应对方法）。

## 三、练习用Python拿到豆瓣源码

通过 requests 库发送 GET 请求获取豆瓣电影 Top250 的网页源码，是爬虫实战的典型案例。以下是具体步骤及解决反爬问题的方法：

### 1、准备工作：安装与引入 requests 库

1. **安装 requests**：在编辑器终端执行以下命令（Windows 用`pip`，macOS/Linux 用`pip3`）：

   ```sh
   pip install requests
   ```

   若显示`Successfully installed requests`，则安装成功。

2. **引入库**：新建 Python 文件（如`scrape_douban.py`），开头导入 requests：

   ```python
   import requests
   ```

### 2、发送请求：初始尝试与问题

#### 2.1. 发送基础 GET 请求

目标 URL：豆瓣电影 Top250 首页（`https://movie.douban.com/top250`）

```python
url = "https://movie.douban.com/top250"
response = requests.get(url)  # 发送GET请求

# 查看状态码
print("状态码：", response.status_code)
```

#### 2.2. 遇到反爬：418 状态码

运行后可能返回状态码`418`（“我是一个茶壶”），这是豆瓣的反爬机制 —— 通过识别请求来源（非浏览器）拒绝服务。

### 3、解决反爬：伪装成浏览器请求

通过自定义请求头（`headers`）中的`User-Agent`，将爬虫伪装成浏览器：

#### 3.1. 获取浏览器的 User-Agent

* 打开任意网页，右键→“检查”→进入 “Network” 面板；
* 刷新网页，点击任意请求→展开 “Request Headers”→复制`User-Agent`的值（如浏览器类型、版本信息）。
  示例：
  `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36`

#### 3.2. 自定义请求头发送请求

```python
url = "https://movie.douban.com/top250"

# 自定义请求头，模拟浏览器
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
}

# 传入headers参数
response = requests.get(url, headers=headers)

# 验证请求是否成功
if response.ok:
    print("请求成功！")
    # 获取网页源码（HTML）
    html_content = response.text
    print(html_content)  # 打印源码（后续将解析）
else:
    print("请求失败，状态码：", response.status_code)
```

### 4、关键说明

* **状态码判断**：`response.ok`为`True`表示请求成功（状态码 200-299），无需手动判断具体数值。
* **响应体内容**：`response.text`以字符串形式返回网页源码（HTML），是后续解析数据的基础。
* **反爬应对**：`User-Agent`是最基础的反爬绕过方法，复杂网站可能需要更多策略（如 Cookie、IP 代理等）。
