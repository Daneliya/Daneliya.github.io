---
url: /常用框架/EasyExcel/0_EasyExcel概述.md
---

# EasyExcel概述

> 官方文档：https://easyexcel.opensource.alibaba.com

### 什么是Alibaba-EasyExcel

EasyExcel是阿里巴巴开源的一个excel处理框架，**以使用简单、节省内存著称**。EasyExcel能大大减少占用内存的主要原因是在解析Excel时没有将文件数据一次性全部加载到内存中，而是从磁盘上一行行读取数据，逐个解析。

### EasyExcel与其它框架的区别

Apache poi、jxl等处理Excel的框架，他们都存在一个严重的问题就是非常的耗内存。如果你的系统并发量不大的话可能还行，但是一旦并发上来后一定会OOM或者JVM频繁的full gc。而EasyExcel采用一行一行的解析模式，并将一行的解析结果以观察者的模式通知处理（AnalysisEventListener）。

### 参考资料

https://zhuanlan.zhihu.com/p/471712987

https://blog.csdn.net/chire\_jr/article/details/106492700

https://max.book118.com/html/2023/0510/8133104073005065.shtm

https://www.lsjlt.com/news/178303.html

https://blog.csdn.net/weixin\_43949154/article/details/122071510
