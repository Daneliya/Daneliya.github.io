---
url: /AIGC/AI应用开发/02.LangGraph4j/1_LangGraph4j入门.md
---

# 一、LangChain 入门

## 1.1 什么是 LangChain？为什么要学习它？

LangChain 是一个用于开发由语言模型驱动的应用程序的框架。它诞生于大语言模型（LLM）应用开发日益复杂的背景下，旨在简化开发流程，提高开发效率。简单来说，LangChain 就像是连接大语言模型与各种数据源、应用系统的"粘合剂"，让开发者能够轻松构建强大的 AI 应用。

大语言模型本身非常强大，但在实际应用中往往面临几个关键问题：如何让模型访问特定数据？如何让模型执行具体操作？如何构建复杂的应用逻辑？LangChain 正是为解决这些问题而生。

为什么要学习 LangChain？主要有以下几个原因：

1. **简化 AI 应用开发**：LangChain 提供了丰富的组件和工具，大大降低了 AI 应用的开发门槛。
2. **提高开发效率**：预制的模块和链接方式让你不必"重新发明轮子"，可以快速组装出复杂功能。
3. **扩展 LLM 能力**：通过 LangChain，可以让语言模型连接外部数据、工具和服务，极大扩展了其能力范围。
4. **构建复杂应用**：从简单的聊天机器人到复杂的智能代理，LangChain 都提供了成熟的解决方案。
5. **市场需求旺盛**：随着 AI 应用的兴起，熟悉 LangChain 等框架的开发者需求激增。

下面是一个简单的 LangChain 示例，展示如何调用语言模型进行基本对话：

首先需要安装下`langchain_community`,`dashscope`

```sh
pip install langchain_community
pip install dashscope --upgrade
```

代码

```bash
import os

from langchain_community.chat_models import ChatTongyi
from langchain_core.prompts import PromptTemplate

# 设置通义千问的 API Key
os.environ["DASHSCOPE_API_KEY"] = "sk-xxxxxx"  # 替换为你的真实 API Key

# 1. 定义 Prompt 模板
prompt = PromptTemplate.from_template(
    "你是一个知识渊博的助手，请用简洁的方式回答问题：{question}"
)

# 2. 加载通义千问模型
llm = ChatTongyi(
    model_name="qwen3.6-plus",
    temperature=0.7,
)

# 3. 构建 chain：Prompt + LLM，符合 Runnable 架构
chain = prompt | llm

# 4. 调用推理（新版：使用 invoke）
response = chain.invoke({"question": "你好，我是精灵王鸭吉吉，请介绍一下LangChain。"})

# 5. 输出结果
print(response.content)
```

这段程序输出结果：

```markdown
你好，精灵王鸭吉吉！LangChain 是一个用于构建基于语言模型的应用程序的开源框架，它简化了将大型语言模型（如 GPT）与外部数据、工具和流程集成的过程。通过 LangChain，开发者可以轻松实现以下功能：

- **数据连接**：将语言模型与数据库、API、文件等数据源连接。
- **链式处理**：将多个任务组合成链式流程，提升处理效率。
- **代理系统**：创建能够自主决策和执行任务的智能代理。
- **可扩展性**：支持自定义模块，便于灵活开发。

简而言之，LangChain 是让语言模型“更聪明”、“更实用”的工具。
```

这个简单的例子展示了 LangChain 的基本用法，但它的能力远不止于此。随着我们深入学习，你将看到它如何处理复杂的多步骤任务、连接外部数据源和实现智能代理等高级功能。HrGXUqFhjK7wNHkLfEF5cglTdzhFLxXIforC6kfYOak=

## 1.2 LangChain 的发展历程

LangChain 的诞生和发展与大语言模型技术的突飞猛进密不可分。让我们来看看它的发展历程：

**2022 年 10 月**：Harrison Chase 创建了 LangChain 项目，最初只是一个简单的工具集，旨在简化与 OpenAI 的 GPT 模型的交互。

**2023 年初**：随着 ChatGPT 的爆火，开发者对 LLM 应用开发的需求激增。LangChain 迅速获得关注，并开始添加更多功能，如记忆组件、文档处理和向量存储集成等。

**2023 年 4 月**：LangChain 完成了 1000 万美元的种子轮融资，由 Sequoia Capital 领投。这标志着投资者对 LLM 开发工具的认可。

**2023 年中**：LangChain 进入快速迭代阶段，引入了代理（Agents）和工具使用（Tool Use）等核心功能，极大扩展了框架的能力边界。

**2023 年下半年**：LangChain 发布了 JavaScript/TypeScript 版本，扩大了生态系统。同时，社区开始开发 LangChain4j（Java 版本）。

**2024 年初**：LangChain 2.0 发布，带来了全新的架构和更灵活的组件设计，同时简化了 API，提高了性能。

**2024 年至今**：LangChain 继续完善生态系统，增强与各种 LLM 提供商、向量数据库和企业系统的集成能力，逐渐成为 AI 应用开发的标准框架之一。

LangChain 的发展速度令人瞩目，从一个简单的工具集发展成为一个全面的 AI 应用开发框架，这反映了 AI 技术和市场的快速变化。值得注意的是，它的成功也带动了一系列类似框架的出现，如 Microsoft 的 Semantic Kernel、LlamaIndex 等，共同推动了 AI 应用开发生态的繁荣。

## 1.3 LangChain 与其他 AI 框架的对比

在选择 AI 开发框架时，了解各框架的优缺点对于项目成功至关重要。下面我们将 LangChain 与几个主流的 AI 框架进行对比：

### LangChain vs. LlamaIndex（原 GPT Index）

LlamaIndex 专注于数据索引和检索功能，是构建 RAG（检索增强生成）应用的强大工具。

* **相同点**：两者都支持与各种 LLM 集成，都提供了文档处理和向量检索功能。
* **不同点**：LlamaIndex 在数据索引和查询优化方面更专业，而 LangChain 提供了更全面的应用开发组件，特别是在代理和工作流方面。
* **使用建议**：两者可以很好地配合使用，LlamaIndex 处理数据索引，LangChain 负责整体应用逻辑。

### LangChain vs. Semantic Kernel

Semantic Kernel 是微软开发的 AI 应用框架，强调与微软生态系统的集成。

* **相同点**：都支持链式调用、记忆和工具使用等功能。
* **不同点**：Semantic Kernel 与微软 Azure 服务集成更紧密，支持更多的企业级功能；LangChain 则拥有更大的社区和更广泛的集成支持。
* **使用建议**：如果你的项目主要基于微软技术栈，可以考虑 Semantic Kernel；否则 LangChain 可能提供更灵活的选择。

### LangChain vs. Haystack

Haystack 专注于问答系统和信息检索应用的开发。                                

* **相同点**：都支持文档处理、向量存储和 LLM 集成。
* **不同点**：Haystack 在问答系统、文档检索和管道设计方面有更深入的功能；LangChain 则在通用 AI 应用开发上更全面。
* **使用建议**：如果主要构建文档问答系统，Haystack 可能是更专业的选择；而构建多功能 AI 应用，LangChain 更适合。

### LangChain vs. Autogen

Autogen 是微软研究院开发的多智能体协作框架，专注于智能体之间的对话和协作。

* **相同点**：都支持智能体（Agent）开发。
* **不同点**：Autogen 在多智能体协作和对话方面提供了更专业的功能；LangChain 则提供了更全面的应用开发组件。
* **使用建议**：如果需要构建多智能体系统，可以考虑 Autogen；而 LangChain 适合更广泛的 AI 应用场景。

下面是一个简单的代码比较，展示 LangChain 和 LlamaIndex 在文档查询方面的不同实现方式：

**LangChain 实现：**

```python
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain_community.chat_models import ChatTongyi
from langchain_huggingface import HuggingFaceEmbeddings

import os
os.environ["DASHSCOPE_API_KEY"] = "sk-xxxxx"  # 替换为你的真实 API Key

# 加载文档
loader = TextLoader("项目介绍.txt", encoding="utf-8")
documents = loader.load()

# 分割文档
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
texts = text_splitter.split_documents(documents)

# 使用 huggingface 的 embedding
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

# 创建向量数据库
db = Chroma.from_documents(texts, embeddings)

# 使用通义千问 LLM
llm = ChatTongyi(model_name="qwen-max")

# 构建问答链
qa = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=db.as_retriever()
)

query = "面试鸭网站提供什么服务？"
result = qa.run(query)
print(result)
```

**LlamaIndex 实现：**

安装依赖：

```python
▼python复制代码pip install llama-index-embeddings-langchain
pip install llama-index-llms-langchain
pip install -U llama-index
▼python复制代码from llama_index.core import SimpleDirectoryReader, VectorStoreIndex, Settings
from llama_index.llms.langchain import LangChainLLM
from langchain_community.chat_models import ChatTongyi
from llama_index.embeddings.langchain import LangchainEmbedding
from langchain_huggingface import HuggingFaceEmbeddings
import os

# 设置通义千问 API Key
os.environ["DASHSCOPE_API_KEY"] = "sk-xxxxx"  # 替换为你的真实 API Key


# ① 设置全局配置（替代 ServiceContext）
Settings.llm = LangChainLLM(
    llm=ChatTongyi(model_name="qwen-max")
)
Settings.embed_model = LangchainEmbedding(
    HuggingFaceEmbeddings(model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
)

# ② 加载文档
documents = SimpleDirectoryReader(input_files=["项目介绍.txt"]).load_data()

# ③ 构建索引（会自动读取 Settings 中的 llm 和 embedding）
index = VectorStoreIndex.from_documents(documents)

# ④ 查询
query_engine = index.as_query_engine()
response = query_engine.query("面试鸭网站提供什么服务？")

print(response)
```

从代码对比可以看出，两个框架在实现相似功能时有不同的 API 设计和抽象层次，但核心思路相似。选择哪个框架通常取决于项目需求、团队熟悉度和具体应用场景。

## 1.4 LangChain 的核心优势

LangChain 之所以在众多 AI 开发框架中脱颖而出，源于其独特的核心优势：

### 1. 模块化设计

LangChain 采用高度模块化的设计，将复杂的 AI 应用拆分为可重用的组件。这种设计理念使开发者能够像搭积木一样构建应用，只需关注自己需要的部分。7QiJ3WkhTRjV8VSaIHYq0+Wzni+Hi3xtR8CR8/IP1VI=

核心模块包括：

* **LLMs/Chat Models**：语言模型和聊天模型的抽象层
* **Prompts**：提示模板管理
* **Indexes**：文档加载和索引
* **Memory**：对话状态管理
* **Chains**：将多个组件连接成处理流程
* **Agents**：自主决策和工具使用的智能体

这种模块化架构使得开发者可以灵活选择和组合所需组件，而不必被迫接受整个框架的所有部分。TRQG02HuvSbBCdyta/9OfF/iMg4d5URNJyKR3KkD/fE=

### 2. 抽象与标准化

LangChain 为不同的 LLM 提供商、向量数据库和工具创建了统一的抽象层。这意味着你可以轻松切换底层模型或服务，而无需大幅修改代码。

例如，如果你想从通义千问的 Qwen 切换到 Anthropic 的 Claude 或本地部署的 Llama 模型，只需更改几行配置代码，而不必重写整个应用逻辑。yc4QRp8ovNJ57GPA7bri+mKydKIKzxDFmOrjcxZEUcM=

### 3. 内置工具生态系统

LangChain 提供了丰富的工具集成，让语言模型能够与外部世界交互：

* 网络搜索工具
* 数据库查询接口
* API 调用封装
* 代码执行环境
* 文件操作工具

这些工具极大扩展了 LLM 的能力边界，使其不再局限于训练数据中的知识，而能够访问实时信息和执行具体操作。

### 4. 灵活的工作流构建

通过 Chains（链）和 Agents（智能体）机制，LangChain 支持构建复杂的多步骤工作流：Iy8qa2Wkgy1zjaDf5wVYJsxIyeHLdZx9B8sLhGVCeeI=

* **顺序链**：按预定顺序执行一系列操作
* **路由链**：根据输入内容动态选择处理路径
* **ReAct 智能体**：结合推理和行动的自主决策系统
* **多智能体协作**：支持多个专业智能体协同工作

这种灵活性使得开发者可以构建从简单对话到复杂问题解决的各类应用。

### 5. 活跃的社区与生态

LangChain 拥有活跃的开发者社区和不断扩展的生态系统：

* GitHub 上的频繁更新和贡献
* 详细的文档和教程
* 丰富的示例和模板
* 第三方扩展和插件

这种活跃的生态系统确保了框架的持续改进和问题的快速解决。                                7QiJ3WkhTRjV8VSaIHYq0+Wzni+Hi3xtR8CR8/IP1VI=

下面是一个展示 LangChain 优势的代码示例，它结合了模块化设计和工具使用：

```python
▼python复制代码from langchain.agents import initialize_agent, Tool
from langchain.agents import AgentType
from langchain.tools import DuckDuckGoSearchRun
from langchain.utilities import WikipediaAPIWrapper
from langchain_community.chat_models import ChatTongyi
import os

# 设置 DashScope API Key（通义千问）
os.environ["DASHSCOPE_API_KEY"] = "sk-xxxx"  # 替换为你的真实 API Key

# 初始化搜索工具
search = DuckDuckGoSearchRun()
wikipedia = WikipediaAPIWrapper()

# 定义工具集
tools = [
    Tool(
        name="搜索引擎",
        func=search.run,
        description="当你需要查询最新信息时使用这个工具"
    ),
    Tool(
        name="维基百科",
        func=wikipedia.run,
        description="当你需要查询百科知识时使用这个工具"
    )
]

# 初始化通义千问模型（替代 OpenAI）
llm = ChatTongyi(model_name="qwen-max", temperature=0)

# 创建智能体
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

# 执行查询
response = agent.run("面试鸭网站是什么？程序员鱼皮开发了哪些产品？")
print(response)
```

这个例子展示了 LangChain 如何让 LLM 自主决定使用哪些工具来回答问题，体现了框架的智能代理能力和工具集成优势。3SdhPNReyfSez0Q4gOc0v6ykW2hqke4CnFnKQxaIhL8=

## 1.5 LangChain 的应用场景

LangChain 的灵活性和强大功能使其适用于各种 AI 应用场景。以下是一些典型的应用案例：                                

### 1. 智能文档问答系统

LangChain 的 RAG（检索增强生成）能力使其特别适合构建智能文档问答系统。企业可以将内部文档、知识库或技术资料导入系统，让员工或客户通过自然语言查询获取准确信息。

**应用案例**：企业知识库助手、产品文档查询系统、法律文件分析工具

**核心组件**：DocumentLoaders、TextSplitters、VectorStores、RetrievalQA chainsyc4QRp8ovNJ57GPA7bri+mKydKIKzxDFmOrjcxZEUcM=

```python
▼python复制代码from langchain_community.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQAWithSourcesChain
from langchain_community.chat_models import ChatTongyi
from langchain_huggingface import HuggingFaceEmbeddings
import os


# 设置通义千问 API Key
os.environ["DASHSCOPE_API_KEY"] = "sk-xxxxx"  # 替换为你的真实 API Key


# 加载文档
loader = DirectoryLoader("./data/", glob="**/*.md")
documents = loader.load()

# 文档分割
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
texts = text_splitter.split_documents(documents)

# 创建向量数据库，使用 HuggingFace Embeddings 替代 OpenAI Embeddings
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)
vectorstore = FAISS.from_documents(texts, embeddings)

# 创建问答链，LLM 使用通义千问 qwen-max
llm = ChatTongyi(model_name="qwen-max", temperature=0)
chain = RetrievalQAWithSourcesChain.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever()
)

# 运行查询
query = "如何使用面试鸭网站准备技术面试？"
result = chain({"question": query})

print(f"回答: {result['answer']}")
print(f"来源: {result['sources']}")
```

### 2. 个人助理与自动化代理

LangChain 的 Agent 框架使其成为构建智能助理和自动化代理的理想选择。这些代理可以理解用户意图，使用各种工具完成任务，并做出连贯的响应。wkzLNuBRh6R+lZgXeGCYFHBSq3Izz4e/cck+rYjQNkc=

**应用案例**：日程管理助手、研究助理、数据分析师、编程助手

**核心组件**：Agents、Tools、Memory、Chains

```python
▼python复制代码from langchain.agents import initialize_agent, Tool
from langchain.agents import AgentType
from langchain.memory import ConversationBufferMemory
from langchain_community.chat_models import ChatTongyi
from langchain.utilities import SerpAPIWrapper, PythonREPL
import os

# 设置通义千问 API Key
os.environ["DASHSCOPE_API_KEY"] = "sk-xxxxx"

# 初始化工具
search = SerpAPIWrapper()
python_repl = PythonREPL()

tools = [
    Tool(
        name="搜索引擎",
        func=search.run,
        description="用于查询最新信息"
    ),
    Tool(
        name="Python执行器",
        func=python_repl.run,
        description="可以执行Python代码进行数据分析"
    )
]

# 设置记忆组件
memory = ConversationBufferMemory(memory_key="chat_history")

# 初始化通义千问 LLM 替代 OpenAI
llm = ChatTongyi(model_name="qwen-max", temperature=0)

# 创建智能体
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
    memory=memory,
    verbose=True
)

# 运行智能体
response = agent.run("我想分析编程导航网站的用户增长数据，可以帮我写一个简单的Python脚本吗？")
print(response)
```

### 3. 对话式应用与聊天机器人

LangChain 的对话管理功能使其成为构建高级聊天机器人和对话系统的强大工具。这些系统可以维护上下文，记住历史对话，并提供连贯的响应。

**应用案例**：客服机器人、教育辅导系统、心理健康助手Iy8qa2Wkgy1zjaDf5wVYJsxIyeHLdZx9B8sLhGVCeeI=

**核心组件**：ChatModels、ConversationChain、Memory、PromptTemplates

```python
▼python复制代码from langchain.chains import ConversationChain
from langchain.memory import ConversationSummaryMemory
from langchain_community.chat_models import ChatTongyi
from langchain.prompts import (
    ChatPromptTemplate,
    MessagesPlaceholder,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
import os

# 设置通义千问 API Key
os.environ["DASHSCOPE_API_KEY"] = "your-dashscope-api-key"

# 创建聊天模型
chat = ChatTongyi(model_name="qwen-max", temperature=0.7)

# 设置提示模板
prompt = ChatPromptTemplate.from_messages([
    SystemMessagePromptTemplate.from_template(
        "你是老鱼简历的AI助手，专门帮助用户优化简历和准备面试。"
    ),
    MessagesPlaceholder(variable_name="history"),
    HumanMessagePromptTemplate.from_template("{input}")
])

# 设置记忆组件（带摘要功能，适合长对话）
memory = ConversationSummaryMemory(llm=chat, return_messages=True)

# 创建对话链
conversation = ConversationChain(
    memory=memory,
    prompt=prompt,
    llm=chat,
    verbose=True
)

# 模拟对话
print(conversation.predict(input="你好，我想优化我的后端开发简历"))
print(conversation.predict(input="我有3年Java经验，使用过Spring Boot和MySQL"))
print(conversation.predict(input="我应该重点突出哪些技能？"))
```

### 4. 内容生成与创意写作

LangChain 可以构建复杂的内容生成系统，通过结构化提示和外部信息增强 LLM 的创作能力。

**应用案例**：营销文案生成、产品描述撰写、文章创作助手

**核心组件**：LLMChain、PromptTemplates、SequentialChainIy8qa2Wkgy1zjaDf5wVYJsxIyeHLdZx9B8sLhGVCeeI=

```python
▼python复制代码from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain, SequentialChain
from langchain_community.chat_models import ChatTongyi
import os

# 设置通义千问 API Key
os.environ["DASHSCOPE_API_KEY"] = "sk-xxxxxxx"  # 替换为你的真实 API Key


# 初始化通义千问模型
llm = ChatTongyi(model_name="qwen-max", temperature=0.7)

# 创建标题生成链
title_template = PromptTemplate(
    input_variables=["topic"],
    template="为一篇关于{topic}的技术博客文章生成一个吸引人的标题，这篇文章将发布在编程导航网站上。"
)
title_chain = LLMChain(llm=llm, prompt=title_template, output_key="title")

# 创建大纲生成链
outline_template = PromptTemplate(
    input_variables=["title"],
    template="为标题为'{title}'的技术博客文章创建一个详细的大纲，包含引言、主要章节和结论。"
)
outline_chain = LLMChain(llm=llm, prompt=outline_template, output_key="outline")

# 创建内容生成链
content_template = PromptTemplate(
    input_variables=["title", "outline"],
    template="根据标题'{title}'和以下大纲:\n{outline}\n\n编写一篇详细的技术博客文章，文章要专业、信息丰富且易于理解。"
)
content_chain = LLMChain(llm=llm, prompt=content_template, output_key="content")

# 组合成顺序链
overall_chain = SequentialChain(
    chains=[title_chain, outline_chain, content_chain],
    input_variables=["topic"],
    output_variables=["title", "outline", "content"],
    verbose=True
)

# 生成内容
result = overall_chain({"topic": "使用LangChain构建RAG应用"})
print(f"标题: {result['title']}\n")
print(f"大纲: {result['outline']}\n")
print(f"内容: {result['content']}")
```

除了上述场景外，LangChain 还广泛应用于代码生成与分析、多模态应用、教育辅助系统等领域。随着框架的不断发展和完善，其应用场景将持续扩展。

## 1.6 LangChain 技术生态概览

LangChain 不是孤立存在的，而是建立在丰富的技术生态系统之上。了解这个生态系统对于充分利用 LangChain 的能力至关重要。

### 核心组件生态

LangChain 的核心生态系统由以下几部分组成：85OwC9dA70cYmJ5h6K5cNTXdNAq0qMRNbG9wTf+m4FU=

**1. 模型提供商集成**

LangChain 支持众多 LLM 提供商的集成，使开发者可以灵活选择适合自己需求的模型：

* OpenAI (GPT-3.5, GPT-4)
* Anthropic (Claude)
* Google (PaLM, Gemini)
* Meta (Llama 2)
* Hugging Face 模型
* 本地部署模型 (如通过 Ollama)

**2. 向量数据库与存储**

为了支持检索增强生成 (RAG) 应用，LangChain 集成了各种向量数据库：

* Pinecone
* Chroma
* FAISS
* Weaviate
* Milvus
* Qdrant
* Redis
* 传统数据库的向量扩展 (如 PostgreSQL+pgvector)

**3. 工具与服务集成**

LangChain 提供了丰富的工具集成，扩展 LLM 的能力：

* 搜索引擎 (Google, Bing, DuckDuckGo)
* API 服务 (Zapier, IFTTT)
* 代码执行环境 (Python, JavaScript)
* 文档处理工具
* 数据分析工具

**4. 部署与托管服务**

LangChain 应用可以通过多种方式部署：

* LangServe: LangChain 官方的部署工具
* LangSmith: 用于监控和调试 LangChain 应用
* 云服务提供商 (AWS, GCP, Azure)
* 容器化部署 (Docker, Kubernetes)
* 无服务器函数 (AWS Lambda, Cloud Functions)

### 扩展生态系统

围绕 LangChain 核心框架，形成了丰富的扩展生态：

**1. 社区贡献的组件**yc4QRp8ovNJ57GPA7bri+mKydKIKzxDFmOrjcxZEUcM=

* 自定义代理实现
* 专业领域模板
* 工具包和集成

**2. 配套工具**

* LangChain Templates: 预构建的应用模板库
* LangServe: 快速部署 LangChain 应用
* LangSmith: 监控、评估和调试 LangChain 应用

**3. 学习资源**

* 官方文档与教程
* 社区博客与案例研究
* 开源示例项目
* 视频教程和课程

下面是一个展示 LangChain 生态系统集成的示例，它结合了多个组件构建一个简单的应用：cLGytfopnrFuxnn3sz+3dYGbZsmkbigItBfA6ZV7hZU=

```python
▼python复制代码import os
from langchain.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import Pinecone
from langchain_community.chat_models import ChatTongyi
from langchain.chains import RetrievalQA
from langchain.agents import load_tools, initialize_agent, AgentType, Tool
import pinecone

# 设置API密钥
os.environ["DASHSCOPE_API_KEY"] = "your-dashscope-api-key"
os.environ["SERPAPI_API_KEY"] = "your-serpapi-api-key"
os.environ["PINECONE_API_KEY"] = "your-pinecone-api-key"
os.environ["PINECONE_ENVIRONMENT"] = "your-pinecone-environment"

# 初始化 Pinecone
pinecone.init(api_key=os.environ["PINECONE_API_KEY"], environment=os.environ["PINECONE_ENVIRONMENT"])
index_name = "codefather-kb"

# 创建或连接索引
if index_name not in pinecone.list_indexes():
    pinecone.create_index(name=index_name, dimension=1536)
index = pinecone.Index(index_name)

# 初始化嵌入模型（这里依然使用 OpenAIEmbeddings）
embeddings = OpenAIEmbeddings()

# 使用 Pinecone 向量存储
vectorstore = Pinecone(index, embeddings.embed_query, "text")

# 初始化通义千问聊天模型
llm = ChatTongyi(model_name="qwen-max", temperature=0)

# 加载工具（SerpAPI和llm-math）
tools = load_tools(["serpapi", "llm-math"], llm=llm)

# 添加知识库检索工具
retriever = vectorstore.as_retriever()
tools.append(
    Tool(
        name="面试鸭知识库",
        func=lambda query: retriever.get_relevant_documents(query),
        description="有关面试鸭网站的信息和技术面试准备的知识"
    )
)

# 初始化智能体
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

# 运行示例
response = agent.run("编程导航有哪些产品，它们各自的功能是什么？")
print(response)
```

这个示例展示了 LangChain 生态系统的强大之处，它无缝集成了多个组件：OpenAI 的嵌入模型、Pinecone 向量数据库、Anthropic 的语言模型和各种工具。这种灵活的集成能力是 LangChain 的核心优势之一。

## 1.7 Python 版与 Java 版(LangChain4j)简介

LangChain 最初是为 Python 开发的，但随着其流行度增加，社区开始将其移植到其他编程语言。其中，LangChain4j 是面向 Java 生态系统的实现，提供了与 Python 版本类似的功能，但针对 Java 开发者进行了优化。

### Python 版 LangChain

Python 版 LangChain 是最成熟和功能最完整的版本，拥有最大的社区支持和最丰富的生态系统。7QiJ3WkhTRjV8VSaIHYq0+Wzni+Hi3xtR8CR8/IP1VI=

**主要特点**：

* 完整的组件套件，包括所有核心功能
* 丰富的集成支持，覆盖几乎所有主流 LLM 和服务
* 活跃的开发和更新周期
* 详尽的文档和示例
* 大量的社区贡献和扩展

**适用场景**：3SdhPNReyfSez0Q4gOc0v6ykW2hqke4CnFnKQxaIhL8=

* 数据科学和机器学习项目
* 快速原型开发
* 学术研究
* 需要灵活性的项目

Python 版本的典型使用示例：                                                                

```python
▼python复制代码from langchain_community.chat_models import ChatTongyi
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import os

# 设置通义千问 API Key
os.environ["DASHSCOPE_API_KEY"] = "your-dashscope-api-key"

# 创建提示模板
prompt = PromptTemplate(
    input_variables=["product"],
    template="为编程导航的产品 {product} 写一个简短的营销描述。"
)

# 初始化通义千问模型
llm = ChatTongyi(model_name="qwen-max", temperature=0.7)

# 创建链
chain = LLMChain(llm=llm, prompt=prompt)

# 运行链
result = chain.run("面试鸭")
print(result)
```

### Java 版 LangChain4j

LangChain4j 是 LangChain 的 Java 实现，旨在为 Java 开发者提供类似的功能和体验。虽然相对较新，但正在迅速发展，并被越来越多的企业级项目采用。

**主要特点**：Iy8qa2Wkgy1zjaDf5wVYJsxIyeHLdZx9B8sLhGVCeeI=

* 与 Java 生态系统无缝集成
* 支持 Spring Boot 和其他 Java 框架
* 企业级应用的设计考虑
* 类型安全和编译时检查
* 面向接口编程的设计模式

**适用场景**：

* 企业级应用
* 与现有 Java 系统集成
* 需要类型安全的项目
* 微服务架构

LangChain4j 的典型使用示例：

首先引入依赖：

```xml
▼xml复制代码<!-- https://mvnrepository.com/artifact/dev.langchain4j/langchain4j-community-dashscope -->
<dependency>
  <groupId>dev.langchain4j</groupId>
  <artifactId>langchain4j-community-dashscope</artifactId>
  <version>1.0.0-beta2</version>
</dependency>
```

参考 [官方文档](https://docs.langchain4j.dev/get-started) 来编写示例对话代码，创建了一个 ChatModel 并调用，是不是和 Spring AI 很像？

```java
▼java复制代码public class LangChainAiInvoke {

    public static void main(String[] args) {
        ChatLanguageModel qwenModel = QwenChatModel.builder()
                .apiKey(TestApiKey.API_KEY)
                .modelName("qwen-max")
                .build();
        String answer = qwenModel.chat("我是程序员鱼皮，这是编程导航 codefather.cn 的原创项目教程");
        System.out.println(answer);
    }
}
```

### 两个版本的对比

nqebE0GbQps0Ats4MKJjbVHQiAAW+ffJdMrCsN5dgzs=7QiJ3WkhTRjV8VSaIHYq0+Wzni+Hi3xtR8CR8/IP1VI=cLGytfopnrFuxnn3sz+3dYGbZsmkbigItBfA6ZV7hZU=Iy8qa2Wkgy1zjaDf5wVYJsxIyeHLdZx9B8sLhGVCeeI=TRQG02HuvSbBCdyta/9OfF/iMg4d5URNJyKR3KkD/fE=cLGytfopnrFuxnn3sz+3dYGbZsmkbigItBfA6ZV7hZU=TRQG02HuvSbBCdyta/9OfF/iMg4d5URNJyKR3KkD/fE=7QiJ3WkhTRjV8VSaIHYq0+Wzni+Hi3xtR8CR8/IP1VI=3SdhPNReyfSez0Q4gOc0v6ykW2hqke4CnFnKQxaIhL8=yc4QRp8ovNJ57GPA7bri+mKydKIKzxDFmOrjcxZEUcM=85OwC9dA70cYmJ5h6K5cNTXdNAq0qMRNbG9wTf+m4FU=3SdhPNReyfSez0Q4gOc0v6ykW2hqke4CnFnKQxaIhL8=7QiJ3WkhTRjV8VSaIHYq0+Wzni+Hi3xtR8CR8/IP1VI=7QiJ3WkhTRjV8VSaIHYq0+Wzni+Hi3xtR8CR8/IP1VI=

| 特性       | Python 版 LangChain            | Java 版 LangChain4jyc4QRp8ovNJ57GPA7bri+mKydKIKzxDFmOrjcxZEUcM= |
| ---------- | ------------------------------ | ------------------------------------------------------------ |
| 成熟度     | 高，最早发布，功能最完善       | 中等，仍在快速发展中yc4QRp8ovNJ57GPA7bri+mKydKIKzxDFmOrjcxZEUcM= |
| 社区支持   | 庞大且活跃                     | 较小但增长迅速cLGytfopnrFuxnn3sz+3dYGbZsmkbigItBfA6ZV7hZU=   |
| 文档完整性 | 非常详尽                       | 基本完整但不如Python版丰富Iy8qa2Wkgy1zjaDf5wVYJsxIyeHLdZx9B8sLhGVCeeI= |
| 集成范围   | 支持几乎所有主流模型和服务     | 支持主要模型和服务，但覆盖面较小wkzLNuBRh6R+lZgXeGCYFHBSq3Izz4e/cck+rYjQNkc= |
| 性能特点   | 原型开发快速，灵活性高         | 企业级性能优化，类型安全Iy8qa2Wkgy1zjaDf5wVYJsxIyeHLdZx9B8sLhGVCeeI= |
| 适用开发者 | Python开发者，数据科学家       | Java开发者，企业应用开发者85OwC9dA70cYmJ5h6K5cNTXdNAq0qMRNbG9wTf+m4FU= |
| 部署环境   | 各类环境，尤其适合数据科学环境 | 企业级环境，Spring生态系统nqebE0GbQps0Ats4MKJjbVHQiAAW+ffJdMrCsN5dgzs= |
| 代码风格   | 动态类型，注重灵活性           | 静态类型，注重类型安全和接口设计cLGytfopnrFuxnn3sz+3dYGbZsmkbigItBfA6ZV7hZU= |

### 如何选择适合你的版本

选择使用 Python 版 LangChain 还是 Java 版 LangChain4j 主要取决于以下因素：3SdhPNReyfSez0Q4gOc0v6ykW2hqke4CnFnKQxaIhL8=

1. **开发团队技能**：如果团队主要是 Python 开发者，选择 Python 版；如果是 Java 开发者，选择 LangChain4j。
2. **项目类型**：数据科学项目、研究或快速原型适合 Python 版；企业应用、微服务架构适合 LangChain4j。
3. **集成需求**：如果需要与现有 Java 系统集成，LangChain4j 是更好的选择；如果需要最广泛的模型和服务支持，Python 版更合适。
4. **部署环境**：在 Spring 生态系统或 Java 企业环境中，LangChain4j 提供更自然的集成。
5. **功能需求**：如果需要最新的功能和最广泛的组件支持，Python 版是更安全的选择。

两个版本各有优势，在实际项目中，有时甚至会同时使用两个版本，例如用 Python 版进行原型开发和实验，然后用 LangChain4j 构建生产系统。                                

## 练习题

### 练习 1：LangChain 基础概念

思考题：解释 LangChain 中的"链"（Chain）和"智能体"（Agent）概念的区别，并给出一个实际应用场景，说明何时选择使用链，何时选择使用智能体。

**参考答案**：85OwC9dA70cYmJ5h6K5cNTXdNAq0qMRNbG9wTf+m4FU=

链（Chain）和智能体（Agent）的主要区别在于决策能力和自主性：

链是预先定义好的处理流程，按照固定顺序执行一系列操作。它们适合处理结构化、可预测的任务，如文档问答、信息提取等。链的每一步都是明确的，不会动态选择执行路径。

智能体则具有更高的自主性，能够基于输入和当前状态动态决定下一步行动。智能体可以选择使用哪些工具、何时使用工具，以及如何解释工具的输出。它们适合处理需要推理和多步骤决策的复杂任务。HrGXUqFhjK7wNHkLfEF5cglTdzhFLxXIforC6kfYOak=

应用场景示例：                                

* 使用链的场景：构建一个产品文档问答系统，流程固定（接收问题→检索相关文档→生成回答），每次查询都遵循同样的处理步骤。
* 使用智能体的场景：构建一个研究助手，需要根据用户问题动态决定是搜索网络、查询数据库、执行代码分析数据，还是直接回答。智能体能够基于问题类型和内容自主选择最佳行动路径。

### 练习 2：Python 版 LangChain 简单应用

编程题：使用 Python 版 LangChain 创建一个简单的问答系统，能够回答关于编程导航网站的基本问题。要求：

1. 使用通义千问或其他支持的语言模型
2. 实现基本的对话记忆功能，能够记住之前的对话内容
3. 自定义系统提示，让模型了解编程导航的基本信息

**参考代码**：7QiJ3WkhTRjV8VSaIHYq0+Wzni+Hi3xtR8CR8/IP1VI=

```python
▼python复制代码from langchain_core.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from langchain_community.chat_models import ChatTongyi
import os

# 设置通义千问 API Key（DashScope）
os.environ["DASHSCOPE_API_KEY"] = "your-dashscope-api-key"

# 初始化记忆组件
memory = ConversationBufferMemory()

# 定义提示模板
template = """
你是编程导航网站(https://www.codefather.cn/)的AI助手。
编程导航是程序员鱼皮创建的一站式编程学习交流社区，提供免费的编程学习路线、入门教程、原创项目教程、程序员bug修复手册和保姆级写简历技巧。
网站还包括面试鸭、老鱼简历、算法导航等产品，致力于帮助用户学好编程、做出项目、拿到满意的Offer。

当前对话历史:
{history}

人类: {input}
AI助手:"""

prompt = PromptTemplate(
    input_variables=["history", "input"],
    template=template
)

# 初始化通义千问模型
llm = ChatTongyi(model_name="qwen-max", temperature=0.7)

# 创建对话链
conversation = ConversationChain(
    llm=llm,
    memory=memory,
    prompt=prompt,
    verbose=True
)

# 测试对话
print(conversation.predict(input="你好，编程导航网站提供哪些服务？"))
print(conversation.predict(input="面试鸭是什么？"))
print(conversation.predict(input="我想学习Java，有什么资源推荐吗？"))
```

### 练习 3：LangChain 与 LangChain4j 对比实践

思考题：假设你正在为一个企业客户开发一个客服智能助手系统，需要集成到现有的 Java 企业应用中。分析使用 Python 版 LangChain 和 Java 版 LangChain4j 各自的优缺点，并提出一个可行的架构方案，说明如何选择和整合这两个框架。Iy8qa2Wkgy1zjaDf5wVYJsxIyeHLdZx9B8sLhGVCeeI=

**参考答案**：

分析：

Python 版 LangChain 优势：                                HrGXUqFhjK7wNHkLfEF5cglTdzhFLxXIforC6kfYOak=

* 功能更完整，支持更多模型和集成
* 社区资源丰富，问题解决方案多
* 原型开发速度快，适合快速迭代

Java 版 LangChain4j 优势：                                

* 与现有 Java 企业应用无缝集成
* 类型安全，编译时错误检查
* 更符合 Java 开发者的编程习惯
* 与 Spring 生态系统兼容性好

架构方案：

可以采用混合架构，充分利用两个框架的优势：

1. 核心客服引擎：使用 LangChain4j 开发，作为 Java 应用的一部分，负责：
   * 对话管理和状态追踪
   * 与企业系统集成（用户数据、订单系统等）
   * 基本问答和流程处理
2. 高级 AI 服务：使用 Python 版 LangChain 开发独立的微服务，通过 API 提供：
   * 复杂的智能体功能
   * 先进的检索增强生成
   * 实验性功能和原型测试
3. 集成方式：
   * 使用 REST API 或消息队列连接两个系统
   * Java 端处理业务逻辑和基本对话
   * 复杂查询委托给 Python 服务处理

这种架构允许企业保持核心系统的稳定性和安全性，同时能够利用 Python 生态系统的灵活性和创新性。随着 LangChain4j 功能的增强，可以逐步将更多功能迁移到 Java 端。
