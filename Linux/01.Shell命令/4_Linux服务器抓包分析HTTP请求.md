---
url: /Linux/01.Shell命令/4_Linux服务器抓包分析HTTP请求.md
---

# Linux服务器抓包分析HTTP请求

说到抓包分析，最简单的方法当然是在客户端直接安装Wireshark或Fiddler，这些工具的使用率很高且有很多成熟的教程。但在服务端如何做呢？可以使用tcpdump抓包，并使用Wireshark来分析HTTP请求的简单有效方法。

### 一、服务端抓包

使用 tcpdump 抓包，首先，在服务器上安装 tcpdump，以 Ubuntu 为例运行以下命令

```
apt install -y tcpdump
```

然后，使用 tcpdump 进行抓包

```
tcpdump -tttt -X -vv -s0 -w 80.cap 'tcp port 80'
```

以下是各个参数的说明：

### 二、使用 wireshark 分析

打开 [Wireshark 下载地址](https://www.wireshark.org/download.html)，选择对应的版本下载安装。

我们从服务器上下载这个80.cap文件到自己电脑上，使用 Wireshark 打开，会看到捕获的TCP流量数据。

接下来，可以按照以下步骤进行HTTP请求的分析：

1. 使用Wireshark的过滤功能，只显示HTTP请求。在过滤框中输入`http`，这样Wireshark将只显示与HTTP协议相关的数据包。
2. 在Wireshark的数据包列表中，可以点击选择一个HTTP请求数据包，然后在右侧的详细信息窗口中查看更多的细节。可以展开各个协议分层并查看具体的字段信息，比如源IP和目标IP，源端口和目标端口，HTTP方法和URL路径等。
3. 如果想查看请求的内容，可以在详细信息窗口中找到HTTP协议分层，并展开`Hypertext Transfer Protocol`字段。在这里，将看到请求头和请求体的详细信息，包括请求方法、请求头部、Cookie、请求参数等。
4. 如果想进一步分析响应内容，可以选择一条HTTP响应数据包，然后在详细信息窗口中查看响应的具体信息。可以展开HTTP协议分层的`Hypertext Transfer Protocol with Privacy`字段，其中包含了响应的状态码、响应头部信息以及响应的正文内容。
5. Wireshark还提供了一些强大的统计功能，可帮助分析HTTP请求的性能指标。可以使用`Statistics`菜单中的各项功能，如"HTTP"、"Endpoints"、"Conversations"等，来查看请求和响应的统计数据，如请求数量、包大小、传输时间等。

通过使用Wireshark分析HTTP请求，能够深入了解请求的细节，包括头部信息、参数、Cookie等。这对于调试和性能优化非常有帮助。另外，Wireshark还支持导出分析结果以及生成报告，方便与团队或上级分享分析结果。

### 参考资料

https://cloud.tencent.com/developer/article/2301789

https://zhuanlan.zhihu.com/p/53857010

https://zhuanlan.zhihu.com/p/34839086
