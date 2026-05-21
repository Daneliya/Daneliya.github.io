---
url: /AIGC/AI绘画/01.StableDiffusion/5_Flux Kontext.md
---

# Flux Kontext 本地教程

## 一、Flux Kontext 核心介绍

FLUX.1 Kontext 是**Black Forest Labs**推出的新一代多模态图像编辑模型套件，核心定位是**基于文本 + 图像上下文的精准图像编辑**，区别于传统文生图模型，它能理解图像原有内容并进行针对性修改，而非重新生成。

其中**FLUX.1 Kontext\[Dev]** 是开源版本（120 亿参数），供研究和非商用使用，也是本地部署的核心版本，另有 Pro/Max 商业版（仅支持 API 调用，编辑效果更优、提示词要求更低）。

### 核心特性

1. **多步编辑一致性**：多次修改图像后，人物特征、物体形态、画面风格仍能保持稳定，无明显视觉偏差；
2. **精准局部修改**：仅对提示词指定的元素编辑，不影响图像其他区域（如仅修改汽车颜色，背景、光影不变）；
3. **风格 / 角色参考**：无需微调，直接参考原图的风格 / 角色生成新场景，支持图像文字编辑、构图 / 相机角度精准控制；
4. **高效推理**：基于引导蒸馏训练，本地部署时结合 FP8/FP4 量化优化，显存占用更低、生成速度更快。

### 授权说明

Dev 版本默认**非商用**，若需商业使用，需前往 Black Forest Labs 官网购买商用授权。

## 二、必备环境与前置要求

### 1. 基础软件

* AI 生图操作界面：**ComfyUI**（必须更新至**最新版 / 夜间版**，稳定版可能缺失核心节点，桌面版更新会有延迟）；
* 系统：Windows/Linux（推荐 Linux，显存利用率更高），需安装 Python 3.12+、PyTorch 2.7.0+、CUDA 12.4+（NVIDIA 显卡必备，RTX 40/50 系列支持 FP8/FP4 量化优化，效果最佳）。

### 2. 硬件要求

* 显卡：最低 RTX 3090/4090（24GB 显存），推荐 RTX 4090D/50 系列（支持 FP8 加速，12GB 显存即可运行量化版）；
* 内存：32GB 及以上，硬盘预留 50GB + 空间（存放模型文件）。

## 三、ComfyUI 安装与更新

若已安装 ComfyUI，直接**更新至最新版**；未安装则按以下步骤操作（以 Linux 为例，Windows 可参考官网教程）：

```sh
# 克隆ComfyUI仓库
git clone https://github.com/comfyanonymous/ComfyUI
cd ComfyUI
# 安装依赖
pip install -r requirements.txt
# 启动ComfyUI（监听6006端口，浏览器访问http://0.0.0.0:6006）
python main.py --listen --port 6006
```

### 关键更新步骤

1. 打开 ComfyUI，点击右上角**Manager** → **Update ALL**，等待所有依赖 / 节点更新完成；
2. 点击**RESTART**重启 ComfyUI，刷新页面后确认无节点缺失提示。

## 四、FLUX.1 Kontext \[Dev] 模型下载与存放

Dev 版本无需单独安装，仅需下载模型文件并放到指定目录，**核心模型与 Flux 系列通用，仅需额外下载 Kontext Diffusion 模型**。

### 1. 模型下载地址（核心）

* 官方开源版：[flux1-kontext-dev.safetensors](https://huggingface.co/black-forest-labs/FLUX.1-Kontext-dev)（Hugging Face）；
* 量化优化版（推荐）：flux1-dev-kontext\_fp8\_scaled.safetensors（ComfyOrg 提供，FP8 量化，显存占用减半）；
* 低显存版：FLUX.1-Kontext-dev-GGUF（社区版，适合 24GB 以下显存显卡）。

### 2. 完整模型清单与存放路径

所有模型需按以下目录存放，**Text Encoder/VAE 与 Flux 系列通用，若已安装可直接复用**：

```sh
📂 ComfyUI/
├── 📂 models/
│   ├── 📂 diffusion_models/  # 核心Kontext模型
│   │   └── flux1-dev-kontext_fp8_scaled.safetensors（或官方原版）
│   ├── 📂 unet/  # 仅GGUF版本需要
│   │   └── flux1-kontext-dev-Q4_K_M.gguf
│   ├── 📂 vae/  # 通用VAE
│   │   └── ae.safetensors
│   └── 📂 text_encoders/  # 通用文本编码器
│       ├── clip_l.safetensors
│       └── t5xxl_fp16.safetensors（或t5xxl_fp8_e4m3fn_scaled.safetensors）
```

## 五、ComfyUI 本地使用步骤（原生工作流）

ComfyUI 已内置**FLUX.1 Kontext \[Dev] 原生工作流模板**，无需手动搭建，按以下步骤操作即可：

### 1. 加载工作流

打开 ComfyUI → 左侧**Workflow Templates** → 搜索**Flux.1 Kontext Dev** → 点击加载模板（无模板则说明 ComfyUI 未更新到位，重新执行更新步骤）。

### 2. 模型节点加载

依次确认各节点的模型文件已正确加载，无红色报错：

* **Load Diffusion Model**：选择下载的`flux1-dev-kontext_fp8_scaled.safetensors`；
* **DualCLIP Load**：加载`clip_l.safetensors` + `t5xxl_fp16.safetensors`；
* **Load VAE**：加载`ae.safetensors`。

### 3. 输入图像与提示词设置

* **Load Image**：点击节点上传需要编辑的原图（支持 PNG/JPG 格式）；

* CLIP Text Encode：输入英文编辑提示词（Dev 版本暂不支持中文，提示词需精准，如`change the white car to yellow`）；

  ✅ 提示词优化参考：[官方 Prompt 指南](https://docs.bfl.ai/guides/prompting_guide_kontext_i2i)。

### 4. 运行与输出

* 点击右上角**Queue**（或快捷键`Ctrl+Enter`）开始运行；
* 运行完成后，在**Preview Image**节点查看编辑结果，点击**Save Image**保存到本地。

## 六、进阶优化：显存与速度提升

1. **启用 FP8 量化**：RTX 40/50 系列显卡自动支持，模型选择 FP8 版本，显存占用从 24GB 降至 12GB，速度提升 2 倍 +；
2. **显存不足处理**：ComfyUI 会自动将闲置模型卸载到 CPU（`offload device: cpu`），也可选择 GGUF 低精度版本；
3. **NVIDIA NIM 加速**：安装 ComfyUI NIM 节点，通过 NVIDIA NIM 微服务加载预优化模型，推理速度再提升 50%+（需 NVIDIA RTX 显卡）。

## 七、常见问题解决

1. **节点缺失**：ComfyUI 未更新至夜间版，或部分节点启动时导入失败，重启 ComfyUI 并重新更新；
2. **模型加载失败**：文件路径错误（需严格按上述目录存放），或模型文件未下载完整（重新下载并校验 MD5）；
3. **无编辑效果**：Dev 版本提示词要求高，需优化提示词（更精准描述修改区域 / 内容），或提高指导系数（guidance\_scale=2.5~5.0）；
4. **CUDA 报错**：未安装对应版本的 CUDA/Torch，执行以下命令重装：

```sh
pip uninstall torch torchvision torchaudio -y
pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu128
```

## 参考资料

https://www.bilibili.com/video/BV1c1GHzLE7x
