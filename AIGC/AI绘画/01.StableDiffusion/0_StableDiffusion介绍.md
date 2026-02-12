---
url: /AIGC/AI绘画/01.StableDiffusion/0_StableDiffusion介绍.md
---

# StableDiffusion介绍

## 介绍

> 项目网址：<https://stablediffusionweb.com/zh-cn>

项目主页

![image-20240227222534659](/assets/image-20240227222534659.3Hg_KQ-P.png)

### 关于Stable Diffusion

**Stable Diffusion（简称SD）** 是2022年发布的一个深度学习文本到图像生成模型，由慕尼黑大学的CompVis研究团体首先提出，并与初创公司Stability AI、Runway合作开发，同时得到了EleutherAI和LAION的支持。

它可以实现的功能有很多，可以根据文本的描述生成指定内容的图片（图生图），也可以用于已有图片内容的转绘（图生图），还可以用作图像的局部重绘、外补扩充、高清修复，甚至是视频的“动画化”生成。

SD的源代码是**开源**发布在网上的，这意味着任何人都可以**免费、不限量**地使用它进行AI绘画生成操作。有开发者使用它的源代码制作了易于用户使用的图形化界面（GUI），于是便有了今天我们大多数人手里可以使用的**Stable Diffusion WebUI（SD Web UI）**。

### 配置需求：我的电脑跑得动SD吗？

目前，Stable Diffusion可以在一台搭载有民用级显卡的电脑上运行。它的配置要求不高但具有一定针对性，最主要的要求是**显卡性能与显存大小**。以下是配置参考：

#### **最低配置**

| 操作系统 | 无硬性要求              |
| -------- | ----------------------- |
| CPU      | 无硬性要求              |
| 显卡     | RTX 2060 及同等性能显卡 |
| 显存     | 6GB                     |
| 内存     | 8GB                     |
| 硬盘空间 | 20GB的可用硬盘空间      |

在此配置条件下，约1-2分钟一张图，可绘制分辨率512 \* 512像素。

#### 推荐**配置**

| 操作系统 | Windows 10/11 64 位       |
| -------- | ------------------------- |
| CPU      | 支持 64 位的多核处理器    |
| 显卡     | RTX 3060Ti 及同等性能显卡 |
| 显存     | 8GB                       |
| 内存     | 16GB                      |
| 硬盘空间 | 100~150GB的可用硬盘空间   |

在此配置条件下，约10-30秒一张图，可绘制分辨率1024 \* 1024像素。

**Q：Mac能用Stable Diffusion吗？显卡用N卡好还是A卡好？**

**A：问就是都能用，但目前，Nvidia（英伟达、N卡）显卡是AIGC应用公认的最优解。**

* 使用其他显卡/系统的电脑也可以运行Stable Diffusion，但同等性能下的速度、效率较N卡均有一定差距。

**Q：我想买一台新电脑来跑图，应该怎么选？**

**A：非要这么问的话，购置一台N卡台式机是最佳的选择。**

* **请将大部分预算花在显卡上**，并购置足量硬盘（最好是固态）来放置可能会比较占地方的模型文件，其他硬件（CPU、内存等）不存在严格限制。
* 单就显卡而言，同等预算下，**可以优先照顾显存**，因为它影响的东西比性能多。

## 原理介绍

Jay Alammar大佬讲解：<https://jalammar.github.io/illustrated-stable-diffusion>

Jay Alammar大佬中文讲解：<https://zhuanlan.zhihu.com/p/618862789>

电子羊资料包：<https://vc4k1knlxj.feishu.cn/docx/RgLJdwEnRokZRTxCK33cqRhPnzd>

Nenly同学笔记：<https://nenly.notion.site/7d86299aa00f4ddbb8ef4496cdb54278>
