---
url: /AIGC/02.WebUI/0_WebUI介绍.md
---

# WebUI介绍

WebUI是一款基于AI模型（如Stable Diffusion）的用户界面工具，允许你轻松生成图片、设计艺术作品、甚至实现多样化的创意应用。（重点！它是开源的，免费的！！！）

> 项目主页：<https://github.com/webui-dev/webui>

## Stable Diffusion WebUI安装

### 第一种方式：自主安装部署

目前，市面上基于Stable Diffusion制作的实用程序中，最受欢迎的是一个由一位越南开发者[Automatic1111](https://github.com/AUTOMATIC1111)制作的[Stable Diffusion WebUI（SD Web UI）](https://github.com/AUTOMATIC1111/stable-diffusion-webui)，提供了非常可视化的参数调节与对海量扩展应用的支持。

#### Windows安装方式

* **第一步：** 下载前置软件应用：**Python、Git、对应显卡驱动**，按视频指引完成前置安装；

  **Python官网下载（3.10.6版本）：**

  <https://www.python.org/downloads>

  **Git官网下载（最新版）：**

  <https://git-scm.com/download>

  **显卡驱动（按自己的显卡下载并更新到最新版）：**

  英伟达显卡驱动：<https://www.nvidia.cn/geforce/geforce-experience>

  AMD显卡驱动：<https://www.amd.com/zh-hans/support>

* **第二步：从代码仓库Git Clone（克隆）WebUI的本体包**；

  找一个比较空的文件夹，选中上方文件路径栏，删除原有内容，输入“cmd“后回车，**打开命令提示符**（命令行）。

  **输入如下代码地址敲回车**，从官方地址或者镜像地址克隆项目到你的电脑上：

  官方GitHub地址：

  ```jsx
  git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
  ```

  如果连不上，使用镜像地址：

  ```jsx
  git clone https://gitee.com/nenly/stable-diffusion-webui.git
  ```

* **第三步**：下载一个大模型（Checkpoint），手动放置在根目录下的模型文件夹内；

  大模型格式为.ckpt或.safetensor，放置地址为上面的文件夹（根目录）内的/models/stable-diffusion文件夹内；

* **第四步：**双击运行**webui-user.bat**文件，自动下载部分依赖并等待安装完成；

  安装预计**总占用空间3~4G**左右，一般在30分钟内可完成。

* **第五步：** 等待安装完成，看到 **“Running on Local URL”** 一类的字样后，复制其后的链接在浏览器中打开，即可进入WebUI；

  默认链接是<http://127.0.0.1:7860/>，如不显示，可以尝试输入这个地址到浏览器中打开

* **第六步（可选）**：安装汉化文件、部分基础扩展和进阶扩展：

  ⛔ **建议安装：** 中文本地化补丁（汉化），图库浏览器，Tag Autocompletion（提示词补全）；

* 以后每次运行程序：按第四步中所示方式，双击运行webui-user.bat文件即可。

### 第二种方式：使用整合包

**“整合包”** 一般指开发者对Automatic1111制作的Stable Diffusion WebUI进行打包并使其程序化的一种方式。使用整合包，一般可以省去一些自主配置环境依赖、下载必要模型的功夫。如果你打算使用整合包，以下是一些我推荐的整合包：
