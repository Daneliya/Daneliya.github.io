---
url: /Python/AI大模型应用开发/9_给AI模型添加记忆.md
---

# 给AI模型添加记忆

## 一、Memory—让AI模型不再忘掉对话

### 1、核心问题：模型缺乏上下文记忆

AI 模型本身不具备 “上文记忆” 能力，若仅单次传递当前提示（如先问 “李白是谁”，再问 “他是哪国人”），模型会因缺失前序对话信息而无法正确响应。

**解决方案**：将历史对话记录存入 “消息列表”，每轮对话时将 “历史消息 + 当前提示” 一并传给模型，让模型基于完整上下文生成回应。

### 2、关键工具：ConversationBufferMemory（对话缓冲记忆）

LangChain 的`memory`模块提供`ConversationBufferMemory`类，专门用于储存和管理历史对话，核心功能如下：

#### 2.1. 初始化记忆实例

需设置`return_messages=True`：确保储存的历史对话以 “消息对象列表” 形式存在（而非字符串），便于后续拼接进提示。

示例：

```python
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(return_messages=True)
```

#### 2.2. 查看记忆内容

调用`load_memory_variables`方法（传入空字典），可查看当前记忆中储存的历史对话，初始时`history`对应空列表：

```python
memory.load_memory_variables({})  # 输出：{"history": []}
```

#### 2.3. 储存历史对话

通过`save_context`方法手动储存单轮对话（用户输入 + AI 输出），参数为两个字典（分别对应用户和 AI 的内容）：

```python
# 储存“用户问李白是谁”和“AI的回应”
memory.save_context(
    {"input": "李白是谁？"},
    {"output": "李白是唐代著名诗人，被誉为‘诗仙’。"}
)
```

再次查看记忆时，`history`列表会包含该轮对话的消息对象。

### 3、构建带记忆的提示模板

需在提示模板中预留 “历史对话” 的位置，确保历史消息能拼接在当前提示前（系统消息需放在最前面），关键依赖`MessagesPlaceholder`：

#### 3.1. 用 MessagesPlaceholder 占位历史消息

`langchain.prompts`模块的`MessagesPlaceholder`类，用于在提示模板中为 “历史消息列表” 占位，需指定`variable_name="history"`（与记忆中储存历史的键名一致）。

#### 3.2. 完整提示模板结构

示例（系统消息 + 历史消息占位 + 当前用户提示）：

```python
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder, HumanMessagePromptTemplate, SystemMessagePromptTemplate

prompt = ChatPromptTemplate.from_messages([
    SystemMessagePromptTemplate.from_template("你是一个知识问答助手，基于上下文回答问题。"),
    MessagesPlaceholder(variable_name="history"),  # 历史消息占位
    HumanMessagePromptTemplate.from_template("{user_input}")  # 当前用户输入
])
```

### 4、构建带记忆的对话链（手动实现）

#### 4.1. 组件串联逻辑

1. 从`memory`中加载历史对话（`history`列表）。
2. 将 “历史对话 + 当前用户输入” 传入提示模板，生成完整提示。
3. 调用模型生成回应。
4. 用`memory.save_context`储存本轮 “用户输入 + AI 回应”，更新历史记忆。

#### 4.2. 示例流程

```python
# 1. 加载历史对话
history = memory.load_memory_variables({})["history"]

# 2. 生成完整提示（历史+当前输入）
user_input = "他是哪国人？"
prompt_value = prompt.invoke({"history": history, "user_input": user_input})

# 3. 模型生成回应（假设model为已定义的聊天模型）
response = model.invoke(prompt_value)

# 4. 储存本轮对话到记忆
memory.save_context({"input": user_input}, {"output": response.content})
```

手动实现需反复调用 “加载记忆 - 生成提示 - 储存记忆”，流程较繁琐。LangChain 已提供**现成的带记忆对话链**（无需手动管理记忆）。

## 二、ConversationChain—开箱即用的带记忆对话链

### 1、ConversationChain：简化带记忆的对话实现

LangChain 的`chains`模块提供`ConversationChain`（对话链），是专门用于实现 “带上下文记忆对话” 的现成工具。它已封装好 “记忆加载、提示拼接、模型调用、记忆更新” 的完整流程，无需手动管理历史对话，大幅简化代码。

### 2、核心使用步骤

#### 2.1. 准备依赖组件

需提前创建两个核心组件，作为`ConversationChain`的参数：

* **聊天模型（如 ChatModel）**：用于生成对话回应。
* **记忆实例（如 ConversationBufferMemory）**：用于储存历史对话，需确保`return_messages=True`（储存为消息列表）。

示例：

```python
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory

# 1. 创建模型
model = ChatOpenAI()
# 2. 创建记忆（自动储存历史对话）
memory = ConversationBufferMemory(return_messages=True)
```

#### 2.2. 初始化 ConversationChain

通过`ConversationChain`类，传入`llm`（模型）和`memory`（记忆）参数，即可完成对话链构建：

```python
from langchain.chains import ConversationChain

# 构建对话链
conversation_chain = ConversationChain(
    llm=model,
    memory=memory
)
```

#### 2.3. 调用对话链实现多轮对话

通过`invoke`方法与链交互，参数为含`input`键的字典（`input`对应当前用户提示）：

```python
# 第一轮对话
response1 = conversation_chain.invoke({"input": "李白是谁？"})
print(response1["response"])  # 输出AI对“李白是谁”的回应

# 第二轮对话（基于上下文）
response2 = conversation_chain.invoke({"input": "他是哪国人？"})
print(response2["response"])  # 输出AI基于“李白”上下文的回应（如“中国人，唐代人”）
```

### 3、ConversationChain 的核心优势

相比手动构建带记忆的链，`ConversationChain`自动完成以下操作，无需手动干预：

1. **自动加载历史记忆**：调用时无需手动调用`load_memory_variables`，链会自动从`memory`中读取历史对话。
2. **自动更新记忆**：每轮对话后，无需手动调用`save_context`，链会自动将 “当前用户输入 + AI 回应” 存入`memory`。
3. **简化调用逻辑**：仅需传递当前用户提示（`input`），即可实现带上下文的连续对话。

### 4、自定义提示模板（可选）

`ConversationChain`支持通过`prompt`参数自定义提示模板（如设定 AI 人设），但需注意**变量名必须匹配链的预期**：

* 表示 “用户输入” 的变量名：必须为`input`。
* 表示 “历史对话” 的变量名：必须为`history`。

示例（设定 “脾气暴躁的助手” 人设）：

```python
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder, HumanMessagePromptTemplate, SystemMessagePromptTemplate

# 自定义提示模板
custom_prompt = ChatPromptTemplate.from_messages([
    SystemMessagePromptTemplate.from_template("你是一个脾气暴躁、喜欢阴阳怪气的助手，回答简洁且带讽刺感。"),
    MessagesPlaceholder(variable_name="history"),  # 历史对话变量名：history
    HumanMessagePromptTemplate.from_template("{input}")  # 用户输入变量名：input
])

# 用自定义模板初始化对话链
conversation_chain = ConversationChain(
    llm=model,
    memory=memory,
    prompt=custom_prompt
)
```

## 三、Memory—记忆咋还有不同类型？

在 LangChain 中，对话记忆（Memory）是实现多轮上下文对话的核心组件，不同记忆类型的设计目标、储存逻辑和适用场景差异显著。除了基础的`ConversationBufferMemory`，还有 4 种常用记忆类型，以下从**核心原理、关键参数、优劣势、适用场景**四个维度展开整理：

### 1、基础型记忆：ConversationBufferMemory（对话缓冲记忆）

#### 核心原理

最基础的记忆类型，**完整储存所有历史对话消息**（人类消息 + AI 消息），不做任何截断或总结，每轮对话后直接追加新消息到记忆列表中。

#### 关键特点

* 无额外参数，初始化时仅需指定`return_messages=True`（确保储存为消息对象列表，而非字符串）。
* 优点：**无信息丢失**，储存逻辑简单直接，适合对话轮数少、消息短的场景。
* 缺点：
  1. 随对话轮数增加，历史消息列表持续变长，消耗 Token 量线性上升；
  2. 一旦消息总 Token 数超过模型上下文窗口上限，需手动截断，否则无法传入模型。

#### 适用场景

* 短对话场景（如 3-5 轮内）；
* 对对话细节完整性要求极高，不允许任何信息丢失的场景（如精准问答、指令复现）。

### 2、窗口型记忆：ConversationBufferWindowMemory（对话缓冲窗口记忆）

#### 核心原理

在`ConversationBufferMemory`基础上增加 “窗口限制”，**仅储存最近 K 轮对话**（“一轮对话” 指 “人类提问 + AI 回应” 的完整交互，而非单条消息），超过 K 轮的早期对话直接丢弃。

#### 关键参数

* `k`：窗口尺寸（必填），表示最多保留的对话轮数（如`k=2`即保留最近 2 轮对话）。

#### 优劣势

* 优点：
  1. 主动控制历史消息长度，避免 Token 消耗过快；
  2. 无需手动截断，可长期维持对话（只要 K 值合理），实现 “轻量化上下文”。
* 缺点：**超过 K 轮的早期信息直接丢失**，若后续对话需引用更早内容，模型会 “失忆”（如`k=1`时，模型仅记得上一轮对话，更早的信息无法调用）。

#### 适用场景

* 对话轮数较多，但仅需参考近期上下文的场景（如日常闲聊、短期任务交互）；
* 模型上下文窗口较小，需严格控制 Token 消耗的场景。

### 3、总结型记忆：ConversationSummaryMemory（对话总结记忆）

#### 核心原理

不直接储存原始历史消息，而是**通过大模型对历史对话进行总结**，仅储存总结后的文本；每轮新对话后，会将新消息融入原有总结，更新为更完整的总结内容。

#### 关键参数

* `llm`：用于生成总结的大模型（必填），需传入 LangChain 支持的 LLM / 聊天模型实例（如`ChatOpenAI`）。

#### 优劣势

* 优点：
  1. 总结文本通常比原始消息更短，大幅降低 Token 消耗，延缓达到上下文窗口上限的时间；
  2. 不直接丢弃早期信息，通过总结保留核心逻辑（如长期对话中的关键需求、任务目标）。
* 缺点：
  1. 总结过程依赖大模型，**额外消耗 Token**（生成总结本身需调用模型）；
  2. 总结可能丢失细节（如具体数值、语气、小众信息），适合 “抓核心” 而非 “记细节” 的场景。

#### 适用场景

* 长对话场景（如 10 轮以上），需保留整体逻辑但无需细节的交互（如项目需求沟通、问题分析）；
* 对 Token 消耗敏感，且可接受少量细节丢失的场景。

### 4、混合总结型记忆：ConversationSummaryBufferedMemory（对话总结缓冲记忆）

#### 核心原理

结合`ConversationBufferMemory`（原始储存）和`ConversationSummaryMemory`（总结储存）的逻辑：

1. 当储存的原始消息 Token 数未超过上限时，**直接保留原始消息**（保证近期细节不丢失）；
2. 当 Token 数达到上限后，**对更早的消息进行总结**，近期的消息仍保留原始内容（仅压缩远期信息，保留近期细节）。

#### 关键参数

* `llm`：用于生成总结的大模型（必填）；
* `max_token_limit`：储存消息的 Token 上限（必填），超过该值时触发远期消息总结。

#### 优劣势

* 优点：
  1. 兼顾 “细节保留” 和 “Token 控制”：近期消息用原始内容（记细节），远期消息用总结（省 Token）；
  2. 不直接丢弃任何信息，通过总结压缩远期内容，核心逻辑不丢失。
* 缺点：
  1. 总结过程仍需额外消耗 Token；
  2. 逻辑较复杂，初始化需配置模型和 Token 上限，对参数设置有一定要求。

#### 适用场景

* 中长对话场景（如 5-15 轮），既需保留近期细节，又需控制整体 Token 消耗（如客户服务、复杂任务协作）；
* 对对话细节精度有要求，但可接受远期信息简化的场景。

### 5、Token 限制型记忆：ConversationTokenBufferedMemory（对话 Token 缓冲记忆）

#### 核心原理

与`ConversationBufferWindowMemory`类似，均直接储存原始消息，但**以 “Token 数” 为限制条件**：当储存的所有消息总 Token 数超过设定上限时，自动丢弃最早的消息，直到总 Token 数低于上限。

#### 关键参数

* `max_token_limit`：储存消息的 Token 上限（必填），需参考模型上下文窗口大小设置（如模型窗口为 4096Token，可设`max_token_limit=3000`，预留空间给新提示）。

#### 优劣势

* 优点：
  1. 直接对齐模型的 “Token 窗口” 概念，无需估算对话轮数，更精准控制 Token 消耗；
  2. 保留原始消息，不丢失细节（只要未被丢弃），适合对细节敏感的场景。
* 缺点：**超过 Token 上限的早期消息直接丢弃**，若远期信息重要则会 “失忆”；且需提前了解模型 Token 窗口大小，参数设置依赖模型特性。

#### 适用场景

* 消息长度差异大（如部分消息长、部分消息短），需按 Token 精准控制的场景；
* 对消息细节要求高，且模型上下文窗口明确的场景（如技术文档问答、代码协作）。

### 6、5 种记忆类型对比总表

| 记忆类型                          | 核心逻辑                                 | 关键参数                 | 优点                   | 缺点                      | 适用场景                    |
| --------------------------------- | ---------------------------------------- | ------------------------ | ---------------------- | ------------------------- | --------------------------- |
| ConversationBufferMemory          | 完整储存所有原始消息                     | -                        | 无信息丢失，逻辑简单   | Token 消耗快，易超窗口    | 短对话、需完整细节          |
| ConversationBufferWindowMemory    | 储存最近 K 轮原始消息                    | `k`（轮数）              | 轻量化，控制 Token     | 超 K 轮信息丢失           | 多轮对话、仅需近期上下文    |
| ConversationSummaryMemory         | 储存历史对话总结                         | `llm`（总结模型）        | 省 Token，保留核心逻辑 | 丢细节，额外 Token 消耗   | 长对话、需核心逻辑          |
| ConversationSummaryBufferedMemory | 近期原始 + 远期总结（超 Token 上限触发） | `llm`、`max_token_limit` | 保近期细节 + 省 Token  | 逻辑复杂，额外 Token 消耗 | 中长对话、需细节 + 控 Token |
| ConversationTokenBufferedMemory   | 储存原始消息（超 Token 上限丢最早）      | `max_token_limit`        | 精准控 Token，保细节   | 超上限信息丢失            | 消息长度不均、需细节        |

通过选择适配场景的记忆类型，可在 “上下文完整性”“Token 消耗”“细节保留” 三者间找到平衡，实现高效、稳定的多轮对话。
