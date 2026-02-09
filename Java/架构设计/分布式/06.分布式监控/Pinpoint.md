---
url: /Java/架构设计/分布式/06.分布式监控/Pinpoint.md
---

# Pinpoint

## 概述

### 1. 什么是Pinpoint？

Pinpoint是一个开源的应用性能监控工具，专为分布式应用程序而设计。它的目标是帮助开发人员和运维团队深入了解分布式系统中的事务流程和性能表现。Pinpoint跟踪并可视化事务的执行过程，以便用户能够识别问题并改进应用程序性能。

### 2. 为什么需要Pinpoint？

在分布式系统中，一个应用通常由多个不同的组件组成，这些组件之间相互通信，有时还需要与外部服务进行API调用。如何监控这些组件之间的交互以及每个组件的性能变得非常关键。而Pinpoint的出现弥补了这一监控领域的不足，为开发人员和运维人员提供了一个强大的工具，帮助他们理解和改进分布式应用的性能。

### 3. Pinpoint的主要特性

Pinpoint具有许多强大的特性，以下是一些主要功能：

#### 3.1 服务器地图（ServerMap）

Pinpoint通过ServerMap可视化展示组件之间的互联关系，帮助用户理解分布式系统的拓扑结构。用户可以单击节点以查看有关组件的详细信息，如当前状态和事务计数。这有助于快速识别问题所在。

#### 3.2 实时活跃线程图表（Realtime Active Thread Chart）

Pinpoint能够实时监控应用程序内部的活跃线程。这有助于用户了解应用程序的并发情况，识别潜在的性能瓶颈。

#### 3.3 请求/响应分布图表（Request/Response Scatter Chart）

Pinpoint可以可视化展示请求计数和响应模式的变化趋势。这有助于识别潜在的问题，并提供了更详细的信息以进行进一步的分析。

#### 3.4 调用堆栈（CallStack）

Pinpoint提供了代码级别的可视化，允许用户深入了解分布式环境中的每个事务。这有助于识别瓶颈和故障点，从而加速故障排除过程。

#### 3.5 检查器（Inspector）

Pinpoint的Inspector功能允许用户查看有关应用程序的附加信息，如CPU使用率、内存和垃圾收集情况、每秒事务数（TPS）以及JVM参数。这些信息对于性能优化和故障排除非常有帮助。

### 4. 如何使用Pinpoint？

使用Pinpoint来监控分布式应用程序的性能是一个多步骤的过程。

#### 4.1 安装Pinpoint代理

首先，您需要在应用程序的各个组件上安装Pinpoint代理。这些代理将负责收集性能数据并将其发送到Pinpoint服务器。

#### 4.2 配置Pinpoint服务器

您需要设置Pinpoint服务器以接收和存储从代理发送的性能数据。Pinpoint服务器将数据可视化并提供给用户。

#### 4.3 监控和分析

一旦Pinpoint代理和服务器都设置好了，您就可以开始监控分布式应用程序的性能。使用Pinpoint的各种功能来跟踪事务、识别性能问题并进行进一步的分析。

#### 4.4 优化性能

根据Pinpoint提供的数据和分析结果，您可以采取必要的措施来优化应用程序的性能。这可能包括代码优化、资源调整或架构改进。

### 5. Pinpoint的优势

Pinpoint作为一款开源工具，具有以下优势：

#### 5.1 高度可定制性

Pinpoint是开源的，因此用户可以根据自己的需求进行定制。您可以创建自定义插件、规则和仪表板，以满足特定的监控需求。

#### 5.2 社区支持

Pinpoint拥有活跃的开发和用户社区，用户可以在社区中获取支持、分享经验并获取更新和扩展。

#### 5.3 商业友好的开源许可

Pinpoint采用商业友好的开源许可，使其非常适合用于商业环境中。

### 6. 快速安装

看了下最新的安装步骤，竟然有了windwos的安装部署，可以快速安装试用

可以访问如下路径：

**https://pinpoint-apm.gitbook.io/pinpoint/getting-started/quickstart/quickstart.win.en**

github可以访问的直接到如下链接去下载就可以，目前支持windows

**https://github.com/1Remote/1Remote/releases**

github如果无法访问的话，可以后台直接私信

### 7. 总结

Pinpoint是一款强大的分布式应用性能监控工具，旨在帮助开发人员和运维团队深入了解分布式系统中的事务流程和性能表现。它提供了一系列功能，包括服务器地图、实时活跃线程图表、请求/响应分布图表、调用堆栈和检查器，使用户能够识别问题并优化应用程序性能。作为一款开源工具，Pinpoint具有高度可定制性、社区支持和商业友好的开源许可，适用于各种分布式应用监控场景。无论是开发人员还是运维团队，Pinpoint都是一个强大的工具，可帮助他们提升分布式应用的性能和可用性，提供卓越的用户体验。

参考资料

\[1]. [大侠之运维 12.9k star，最强链路监控系统推荐，推荐](https://mp.weixin.qq.com/s/q1fFmwL1HqDNlY87FNLAfw)

\[2]. http://www.rainbond.net/docs/micro-service/tracking/pinpoint/

\[3]. https://blog.csdn.net/zhou920786312/article/details/131891599

\[4]. https://blog.csdn.net/weixin\_43931358/article/details/107671436

\[5]. https://blog.csdn.net/naoju8155/article/details/125857402

\[6]. https://blog.csdn.net/omaidb/article/details/117453528
