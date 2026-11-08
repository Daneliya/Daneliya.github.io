---
url: /AIGC/AI应用开发/02.LangGraph4j/3_AI大模型基础知识.md
---

# AI大模型基础知识

AI 大模型是当今人工‍‍‍‍‍智能领域的重大突破，它们以惊人的能力改变着‌‌‌‌‌我们与计算机交互的方式。本章将带你深入了解‍‍‍‍‍这些模型的基础知识，从概念到分类，从能力到‍‍‍‍‍选型，再到实际应用中的 API 管理，全面‍‍‍‍‍构建你对 AI 大模型的认知基础。

## 3.1 AI 大模型概念

AI 大模型，特‍‍‍‍‍别是大语言模型（LLMs），是‌‌‌‌‌近年来人工智能领域最引人注目的‍‍‍‍技术‍突破。它们通过海量数据训练‍‍‍‍‍，具备了理解、生成和推理能力，‍‍‍‍‍正在各个行业掀起革命性变革。yc4QRp8ovNJ57GPA7bri+mKydKIKzxDFmOrjcxZEUcM=

什么是 AI 大模型？从技术角度看‍‍‍‍‍，大模型是指具有数十亿到数万亿参数的深度学习模型。例如，GPT-4‌‌‌‌‌ 的参数量估计超过 1.76 万亿，通过对海量文本、图像等数据的训‍‍‍‍‍练，这些模型能够理解和生成类人内容。大模型最令人震撼的特点是"涌现‍‍‍‍‍能力"（emergent abilities）——随着规模增长而自‍‍‍‍‍然出现的，在训练过程中未被明确编程的能力。

大模型的工作原理主要基于 Tr‍‍‍‍‍ansformer 架构，这是一种专为处理序列数据设计的神‌‌‌‌‌经网络结构。简单来说，大模型的工作流程包括预训练（在海量数‍‍‍‍‍据上进行自监督学习）、提示输入（用户提供文本作为提示）、上‍‍‍‍‍下文理解（分析提示中的信息）、推理生成（产生回应）以及微调‍‍‍‍‍与强化（通过人类反馈或特定领域数据进行调整）。

下面是一个‍‍‍‍‍使用 La‌n‌g‌C‌h‌a‍in‍ 与‍通义‍‍千问‍‍的模型‍进‍行基‍本‍交互‍的‍例子：HrGXUqFhjK7wNHkLfEF5cglTdzhFLxXIforC6kfYOak=

```python
▼python复制代码from langchain_core.prompts import ChatPromptTemplate
from langchain_community.chat_models import ChatTongyi
import os

# 设置通义千问 API Key
os.environ["DASHSCOPE_API_KEY"] = "sk-xxx"  # 替换为你的真实 API Key


# 初始化通义千问模型
model = ChatTongyi(model="qwen-turbo")  # 可选模型："qwen-turbo", "qwen-plus", "qwen-max", "qwen-max-longcontext"

# 创建提示模板
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是编程导航网站的 AI 助手，专注于帮助用户解决编程问题。"),
    ("human", "{input}")
])

# 构建链并调用
chain = prompt | model
response = chain.invoke({"input": "请推荐几个面试鸭网站上适合 Python 初学者的面试题。"})

print(response.content)
```

AI 大模型的发展历程充满了重要里程碑‍‍‍‍‍。2017 年，Transformer 架构的发表奠定了大模型的基础；2018 ‌‌‌‌‌年，BERT 和 GPT-1 展示了预训练模型的潜力；2020 年，参数量达到‍‍‍‍‍ 1750 亿的 GPT-3 展现出惊人的通用能力；2022-2023 年，C‍‍‍‍‍hatGPT 和 GPT-4 的发布将对话式 AI 带入大众视野；同期，开源模‍‍‍‍‍型如 Llama 系列和 Mistral 也逐渐崛起。

大模型的应用已经深入到多个领域：‍‍‍在内‍‍容创作方面，它们能够生成文案、代码、创意文章和图像；在知识‌‌‌管理方面，它们可以‌‌提取信息、生成摘要；在对话系统方面，它们作为‍‍‍客服机器人、个人助手和教育辅导工‍‍具；在代码开发方面，它们能够生‍‍‍成和解释代码；在数据分析方面，它们能够理解数据‍‍并生成报告；在多‍‍‍模态应用方面，它们可以进行图像识别和跨模态理解。      ‍‍                          3SdhPNReyfSez0Q4gOc0v6ykW2hqke4CnFnKQxaIhL8=

主流的大模型架构主要包‍‍‍‍‍括：自回归模型（如 GPT 系列）、编码器‌‌‌‌‌-解码器模型（如 T5）、掩码语言模型（如‍‍‍‍‍ BERT）和多模态模型（如 GPT-‍‍‍‍‍4V）。每种架构都有其特定的优势和适用场景，开‍‍‍‍‍发者需要根据具体应用需求进行选择。

## 3.2 常见大模型分类与对比

AI 大模型的‍‍‍‍‍种类繁多，了解它们的分类和‌‌‌‌‌差异有助于我们在实际应用中‍‍‍‍‍做出明智的选择。大模型可以‍‍‍‍‍从多个维度进行分类，包括模‍‍‍‍‍态、开源性、规模和用途等。3SdhPNReyfSez0Q4gOc0v6ykW2hqke4CnFnKQxaIhL8=

按照模态分类，大模型可以分为单模态‍‍‍‍‍模型和多模态模型。单模态模型专注于处理单一类型的数据，如纯文本、图‌‌‌‌‌像或音频。例如，早期的 GPT-3 只能处理文本，DALL-E 专‍‍‍‍‍注于图像生成，Whisper 则专注于语音识别。多模态模型则能够理‍‍‍‍‍解和处理多种数据类型，如 GPT-4V 能同时处理文本和图像，GP‍‍‍‍‍T-4o 则能处理文本、图像、音频和视频。

多模态能力‍‍‍‍‍极大扩展了 ‌‌A‌I‌ ‌的应用‍‍‍场景。下‍面是‍‍‍一个使‍用多模‍态‍‍模型‍分‍析图像的‍示例：

```python
▼python复制代码from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
import base64
import requests
from PIL import Image
from io import BytesIO

# 获取编程导航网站的图标
response = requests.get("https://www.codefather.cn/favicon.ico")
image = Image.open(BytesIO(response.content))

# 保存并转换为 base64
image_path = "编程导航图标.png"
image.save(image_path)

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# 编码图像
base64_image = encode_image(image_path)

# 初始化支持视觉的模型
model = ChatOpenAI(model="gpt-4-vision-preview")

# 创建包含图像的消息
message = HumanMessage(
    content=[
        {"type": "text", "text": "这个图标代表什么网站？能描述一下它的设计元素吗？"},
        {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{base64_image}"}}
    ]
)

# 获取模型响应
response = model.invoke([message])
print(response.content)
```

按开源性分类，大模型可以分为闭源模型和开源模型‍‍‍‍‍。闭源模型如 GPT-4、Claude 和 Gemini 等，不公开其训练数据、架构细节和权重，‌‌‌‌‌用户只能通过 API 访问。它们通常性能更强大，提供稳定的接口，但使用需要付费。开源模型如 L‍‍‍‍‍LaMA 系列、Mistral 和 Falcon 等，公开发布其模型权重和部分训练方法，允许自‍‍‍‍‍由下载和部署。它们可以自定义修改，无需支付 API 费用，但性能通常略逊于同等规模的闭源模型 ‍‍‍‍‍                               

按规模分类，大模型可以分为超大规‍‍‍‍‍模模型（参数量超过 1000 亿，如 GPT-4）、大规模模型（‌‌‌‌‌参数量在 100-1000 亿之间，如 LLaMA 3 70B）‍‍‍‍‍和中小规模模型（参数量在 1-100 亿之间，如 Mistral ‍‍‍‍‍7B）。规模越大，能力通常越强，但资源需求也越高       ‍‍‍‍‍                         

按用途分类，大模型可‍以分为‍‍‍‍通用模型（如 GPT-4、Clau‌de 3）和领域专用‌‌‌‌模型（如代码模型 C‍odeLlama、医疗模型 Med‍‍‍‍-Pa‍LM 2 等）。通用模型能处理广泛的任务‍，而专‍‍‍‍用模型在特定领域有更优异的表现             ‍‍‍‍                   7QiJ3WkhTRjV8VSaIHYq0+Wzni+Hi3xtR8CR8/IP1VI=

下面是当前‍‍‍主流大模型的简要‌‌对‌比：     ‍‍  ‍      ‍‍   ‍     ‍‍    ‍       

GPT 系列（OpenA‍‍‍‍‍I）的最新版本是 GPT-4o（多模态）和 GP‌‌‌‌‌T-4（文本+图像）。它们的优势是综合能力强大，‍‍‍‍‍上下文理解准确，API 成熟稳定；劣势是价格较高‍‍‍‍‍，有数据隐私考量，使用限制较多。它们适用于需要高‍‍‍‍‍质量、多功能 AI 能力的商业应用。

Claude 系列（Anth‍ro‍pic‍‍‍）的最新版本是 Claude 3（Opus、‌Sonnet、H‌aiku 三个版本‌‌‌）。它们的优势是长上‍下文支持，道德伦理考量强，擅‍长文档理解；劣势是某些技术‍任务不‍‍‍如 GPT 系列，创意内容生成相‍对保守                      ‍‍‍          它们适用‍于需要安全性高、文档处理能力强的企业应用      ‍‍‍‍                          wkzLNuBRh6R+lZgXeGCYFHBSq3Izz4e/cck+rYjQNkc=

Gemini 系列（Goog‍‍‍‍‍le）的最新版本是 Gemini Ultra/Pro/‌‌‌‌‌Nano。它们的优势是多模态能力强，与 Google ‍‍‍‍‍服务生态集成；劣势是 API 可用性有地区限制，某些方‍‍‍‍‍面不如 GPT-4 稳定。它们适用于需要强大多模态理解‍‍‍‍‍或与 Google 服务集成的应用。

Llama 系列（Met‍‍‍‍‍a）的最新版本是 Llama 3（70B 和 8‌‌‌‌‌B 参数版本）。它们的优势是开源可自部署，社区支‍‍‍‍‍持强，无 API 调用费用；劣势是性能略逊于顶级‍‍‍‍‍闭源模型，自部署需要技术资源。它们适用于本地部署‍‍‍‍‍需求，数据隐私敏感场景，预算受限项目。

Mistral 系列‍‍‍‍‍的最新版本是 Mistral Large‌‌‌‌‌、Medium、Small。它们的优势是‍‍‍‍‍小参数量下性能优异，推理速度快，开源可商‍‍‍‍‍用；劣势是规模和能力不及顶级模型。它们适‍‍‍‍‍用于资源受限环境，需要快速响应的应用。TRQG02HuvSbBCdyta/9OfF/iMg4d5URNJyKR3KkD/fE=

## 3.3 大模型能力边界

了解 AI 大‍‍‍‍‍模型的能力边界对于开发者至‌‌‌‌关重‌要。只有清楚认识到它们‍‍‍‍‍能做什么和不能做什么，才能‍‍‍‍‍设计出现实可行的 AI 应‍‍‍‍‍用，避免过度承诺或误用。

大模型具备几个核心能力领域。在语言理解与生成‍‍‍‍‍方面，它们能够理解复杂指令，生成连贯文本，适应不同写作风格，进行文本摘要和改写。在知识‌‌‌‌‌检索与整合方面，它们能回答基于训练数据的一般性问题，解释概念，整合相关信息。在推理与问‍‍‍‍‍题解决方面，它们具备基础逻辑推理能力，能解决步骤明确的问题，分析简单因果关系。在代码理‍‍‍‍‍解与生成方面，它们能理解多种编程语言，生成功能完整的程序，解释代码功能和逻辑，识别‍‍‍‍‍简单错误。多模态模型还能描述图像内容，理解图表和可视化数据。TRQG02HuvSbBCdyta/9OfF/iMg4d5URNJyKR3KkD/fE=

然而，大模型也存在明显的局限性。最突‍‍‍‍‍出的是知识时效性限制——大模型的知识受限于训练数据的截止日期，无法了解之‌‌‌‌‌后的事件和发展。还有事实准确性问题——大模型可能生成看似合理但实际不准确‍‍‍‍‍的内容，包括虚构的引用或数据。推理能力也有限，特别是在复杂多步骤推理、概‍‍‍‍‍率统计推理和专业领域推理方面。此外，未经特殊设计的大模型无法直接访问互联‍‍‍‍‍网、执行计算、访问文件系统或与外部 API 交互。

"幻觉"（Hallucin‍‍at‍‍‍ion）是大模型最受诟病的问题之一，指模型生成‌‌看似合理但实际不‌‌‌准确或完全虚构的内容。幻觉可以分为‍‍事实性幻觉（提供不准确的事实‍‍‍信息）、概念性幻觉（创‍‍造不存在的概念）、引用幻觉（编造不存在的‍‍‍引用）和过‍‍度自信幻觉（对不确定信息过度自信）         ‍‍‍                       

幻觉产生的原因包括训练‍‍‍‍‍数据中的错误信息、模型对知识的理解不完整、提‌‌‌‌‌示词模糊或指令不清晰、模型倾向提供"有用"而‍‍‍‍‍非"不知道"的回答等。应对幻觉的策略包括提供‍‍‍‍‍参考资料（使用检索增强生成技术）、明确指令、‍‍‍‍‍事实验证、模型组合验证和优化提示工程。85OwC9dA70cYmJ5h6K5cNTXdNAq0qMRNbG9wTf+m4FU=

以下是一个减少幻觉的提示工程示例：

```python
▼python复制代码from langchain_core.prompts import ChatPromptTemplate
from langchain_community.chat_models import ChatTongyi
import os

# 设置通义千问 API 密钥
os.environ["DASHSCOPE_API_KEY"] = "sk-xxx"  # 替换为你的真实 API Key


# 初始化通义千问模型
model = ChatTongyi(model="qwen-plus")

# 创建减少幻觉的提示模板
anti_hallucination_prompt = ChatPromptTemplate.from_messages([
    ("system", """你是面试鸭网站的技术专家，具有以下行为准则：
    1. 只回答你有把握的问题
    2. 当不确定时，明确说明你不知道或知识有限
    3. 区分事实和个人观点
    4. 不编造引用、论文或数据
    5. 不尝试回答你训练数据之外的最新事件
    在回答前，评估你对问题的确定性，并相应调整回答方式。"""),
    ("human", "{query}")
])

# 构建安全链
safe_chain = anti_hallucination_prompt | model

# 测试可能引发幻觉的问题
hallucination_prone_questions = [
    "编程导航网站是哪一年创建的？创始人鱼皮获得了哪些投资？",
    "面试鸭网站在2023年的日活跃用户数是多少？",
    "解释量子计算如何改变编程语言设计"
]

for query in hallucination_prone_questions:
    print(f"问题: {query}")
    response = safe_chain.invoke({"query": query})
    print(f"回答: {response.content}\n")
```

大模型在不同任务上的表现差异明显‍‍‍‍‍。它们在文本生成、基础问答、语言翻译、内容分类、简单代码生‌成和格式转换等任务‌‌‌‌上表现优秀；在中等复杂度推理、数学计算、专‍业领域问答、复杂代码生成和多步‍‍‍‍骤指令遵循等任务上表现中等；在‍实时信息获取、高级数学证明、要求严格事实准‍‍‍‍确性的任务、需要专‍业工具的任务和高时效性内容等方面表现较弱       ‍‍‍‍                         cLGytfopnrFuxnn3sz+3dYGbZsmkbigItBfA6ZV7hZU=

了解了大模型的能力边界后，如何在‍‍‍‍‍这些限制下有效工作？一是设计合理的工作流，将复杂任务分解为模型能‌‌‌‌‌力范围内的子任务，设置人工验证环节，对不适合模型的任务使用传统方‍‍‍‍‍法；二是增强模型能力，使用检索增强生成扩展知识，集成工具使用能力‍‍‍‍‍，实现多智能体协作；三是优化提示工程，提供清晰结构化的指令，包含‍‍‍‍‍示例和期望输出格式，明确指出任务的限制和边界。

## 3.4 如何选择适合的 AI 大模型

选择合适的 A‍‍‍‍‍I 大模型是构建成功 AI ‌‌‌‌‌应用的关键一步。随着市场上大‍‍‍‍‍模型数量的激增，如何在众多选‍‍‍‍‍项中找到最适合自己项目的那一‍‍‍‍‍个，成为了开发者面临的重要问题。nqebE0GbQps0Ats4MKJjbVHQiAAW+ffJdMrCsN5dgzs=

选择大模型需要考虑多个关键维度‍‍‍‍‍。首先是性能与质量，这是最基础的考量因素，包括模型在理解能力‌‌‌‌‌、生成质量、推理准确性和专业领域表现等方面的能力。其次是功能‍‍‍‍‍维度，如多模态能力（是否需要处理图像、音频等）、上下文窗口大‍‍‍‍‍小（处理长文档的能力）、工具使用能力（调用外部工具解决问题）‍‍‍‍‍以及微调适应性（是否需要针对特定领域进行定制）。

成本效益也是重要考量因素‍‍‍‍‍，包括 API 调用成本（按 token 计费‌‌‌‌‌的费率）、计算资源成本（自部署模型的硬件需求）‍‍‍‍‍、开发和维护成本以及人力资源投入。此外，合规与‍‍‍‍‍安全性不容忽视，如数据隐私保护、内容审核机制、‍‍‍‍‍地区合规性要求以及版权和知识产权问题。

对不同应用‍场景的大模型选择建‌议：       ‍         ‍         ‍       TRQG02HuvSbBCdyta/9OfF/iMg4d5URNJyKR3KkD/fE=

对于内容创作应用，如博客生成、营销文案或创意写作，推荐 通义千问、‍‍‍‍‍GPT-4o 或 Claude 4，它们在生成流畅、创意性强的内容方面表现出色；对于代码开发辅助，如代码生成、调试或解释，推荐 C‌‌‌‌‌odeLlama、Claude Code 或 Gemini Pro Code 等专门针对代码优化的模型；对于客户服务，如智能客服、‍‍‍‍‍问答系统，推荐 Claude 4 或 Mistral Large，它们在长篇对话和文档理解方面表现良好；对于数据分析，如报告生成、‍‍‍‍‍数据解释，推荐具有工具使用能力的模型，如 GPT-4o 搭配函数调用功能；对于企业内部应用，如文档处理、知识管理，推荐可私有部署的‍‍‍‍‍开源模型如 Llama 3 70B，或提供企业级安全保障的 Claude 4。

在企业级应用场景中，除了‍‍‍性能‍‍和成本，还需要考虑更多因素。企业选型时，应‌‌‌关注模型的稳定性和‌‌支持（模型提供商的技术支持和‍‍‍长期稳定性）、安全合规保障（数据‍‍处理合规性、审‍‍‍计追踪机制）、集成便捷性（与现有系统的整合难度‍‍‍‍‍）以及可扩展性（随业务增长的扩展能力）           ‍‍                     

对于个人开发者或小型团队，可以‍‍‍采‍‍用混合策略：对于核心功能使用付费 API（如 通义千问、‌‌‌GPT-4o）‌‌，保证质量；对于非核心或高频调用功能使用本地‍‍‍部署的开源模型（如 Lla‍‍ma 3 8B），控制成本；利用‍‍‍检索增强生成（RAG）技术弥补小模型的‍‍知识缺口；设置清晰的‍‍‍升级路径，随着项目发展适时更换更高级模型。    ‍‍                            wkzLNuBRh6R+lZgXeGCYFHBSq3Izz4e/cck+rYjQNkc=

选择合适的大模型不‍‍‍‍‍是一劳永逸的，而是需要持续评估和调整的‌‌‌过‌‌程。随着应用需求的变化、新模型的‍‍‍‍‍发布和现有模型的更新，定期重新评估选‍‍‍‍‍型决策至关重要。保持灵活性，构建模块‍‍‍‍‍化架构，以便在必要时轻松切换模型。

## 3.5 API 密钥申请与管理

随着 AI 大‍‍‍‍‍模型在开发中的广泛应用，AP‌‌‌‌‌I 密钥的安全管理变得越来越‍‍‍‍‍重要。一个好的密钥管理既能保‍‍‍‍‍障应用的稳定运行，又能防止安‍‍‍‍‍全漏洞和不必要的成本开销。7QiJ3WkhTRjV8VSaIHYq0+Wzni+Hi3xtR8CR8/IP1VI=

首先，我们‍‍‍‍‍需要了解如何‌申‌请‌主‌流大‌模‍型的‍ A‍PI ‍‍密‍钥‍。以通‍义‍千问‍为‍例：   ‍                ‍             

**通义千问（DashScope）API密钥申请流程**：

1. 访问阿里云人工智能平台或通义千问官网，注册并登录账号
2. 完成实名认证及企业资质认证（根据需求）
3. 进入控制台的“API密钥管理”页面
4. 创建新的API密钥，保存好密钥信息（密钥只显示一次）
5. 可设置访问权限和调用频率限制，确保安全

其他平台如 An‍‍‍‍‍thropic（Claude）‌‌‌‌‌、Google（Gemini）‍‍‍‍‍、OpenAI（ChatGPT‍‍‍‍‍）等也有类似流程，但可能需要额‍‍‍‍‍外的企业资质认证或实名认证。

下面是一个使用环境变量安全存储和访问 API 密钥的示例：

```python
▼python复制代码import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.chat_models import ChatTongyi  # 通义千问模型

# 加载 .env 文件中的环境变量
load_dotenv()

# 从环境变量安全获取API密钥
openai_api_key = os.getenv("OPENAI_API_KEY")
anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
google_api_key = os.getenv("GOOGLE_API_KEY")
tongyi_api_key = os.getenv("DASHSCOPE_API_KEY")  # 通义千问 API Key

# 初始化模型（如果对应的密钥存在）
models = {}

if openai_api_key:
    models["openai"] = ChatOpenAI(
        api_key=openai_api_key,
        model="gpt-3.5-turbo"
    )
    print("OpenAI 模型已初始化")

if anthropic_api_key:
    models["anthropic"] = ChatAnthropic(
        api_key=anthropic_api_key,
        model="claude-3-sonnet-20240229"
    )
    print("Anthropic Claude 模型已初始化")

if google_api_key:
    models["google"] = ChatGoogleGenerativeAI(
        api_key=google_api_key,
        model="gemini-pro"
    )
    print("Google Gemini 模型已初始化")

if tongyi_api_key:
    models["tongyi"] = ChatTongyi(
        model="qwen-plus",
        api_key=tongyi_api_key
    )
    print("通义千问模型已初始化")

# 检查是否有可用模型
if not models:
    print("警告：没有找到有效的API密钥，请检查环境变量配置")
else:
    print(f"成功初始化 {len(models)} 个AI模型")

    # 使用示例：调用通义千问模型
    if "tongyi" in models:
        response = models["tongyi"].invoke("编程导航网站提供哪些服务？")
        print(f"\n通义千问回答：\n{response.content[:150]}...")
```

API 密‍‍‍‍钥‍的安全管理是很重要‌‌‌‌的。以下是一些‌建议：‍‍‍‍          ‍‍‍‍‍          ‍‍‍‍     ‍                    ‍                   

1. 使用环境变量或配置文件存储密钥，避免硬编码在源代码中
2. 采用密钥轮换策略，定期更新密钥
3. 实施最小权限原则，为不同环境（开发、测试、生产）使用不同密钥
4. 设置使用限制和预算告警，避免超额消费
5. 使用密钥管理服务（如 AWS Secrets Manager、HashiCorp Vault）集中管理密钥
6. 在日志中屏蔽敏感信息，避免密钥泄露
7. 使用 HTTPS 加密传输，保护 API 调用过程中的数据安全

对于团队协作的场景，可以采用以下密钥共享和权限控制策略：3SdhPNReyfSez0Q4gOc0v6ykW2hqke4CnFnKQxaIhL8=

1. 使用密钥管理平台集中管理和分发密钥
2. 为不同团队成员分配不同密钥或权限
3. 实施审计日志，跟踪密钥使用情况
4. 建立明确的密钥申请和撤销流程
