---
url: /Python/AI大模型应用开发/6_AI模型与输入输出.md
---

# AI模型与输入输出

## 一、Model—玩转Open AI聊天模型

### 1、模型（Model）：AI应用的核心

模型是AI应用的核心，负责提供语言的理解和生成能力。LangChain的设计允许开发者集成多种不同的大语言模型（LLM），提供了极大的灵活性。

LangChain主要将模型分为两大类：

1. **LLM (Language Model - 语言模型)**
   * **功能**：本质上是**文本补全**模型。它接收一段文本，预测并生成接下来最可能的文本。
   * **接口**：通常接收一个**字符串**作为输入，并返回一个**字符串**作为输出。
2. **ChatModel (聊天模型)**
   * **功能**：是在对话数据上进行过专门**调优**的模型，更擅长处理多轮对话和理解对话历史。
   * **接口**：接收一个**消息列表**（Message List）作为输入，并返回一个**消息**（Message）作为输出。
   * **优势**：当前，ChatModel 通常是比基础 LLM 更先进和更实用的选择，因为它在对话任务上表现更好，能显著提升用户体验。

> **注意**：我们熟悉的 GPT-3.5-turbo、GPT-4 等都属于 **ChatModel**。

### 2、使用LangChain调用OpenAI聊天模型

以OpenAI的聊天模型为例，通过LangChain获取模型回复。

#### 第一步：安装依赖

首先，需要安装LangChain与OpenAI集成的专用库。

```sh
pip install langchain-openai
```

#### 第二步：导入并创建模型实例

1. **导入模块**： 从 `langchain_openai` 库中导入 `ChatOpenAI` 类。

   ```python
   from langchain_openai import ChatOpenAI
   ```

2. **创建实例**： 创建一个 `ChatOpenAI` 的实例。

   ```python
   # 假设你的OpenAI API密钥已设置在环境变量中
   llm = ChatOpenAI(model="gpt-3.5-turbo")  # 指定模型，如 gpt-3.5-turbo, gpt-4
   ```

#### 第三步：配置模型参数

在创建实例时，可以配置多种参数来控制模型的行为：

* 常用参数（可直接作为构造函数参数）：

  * `temperature`：控制输出的随机性。值越高，输出越随机、有创意；值越低，输出越确定、保守。
  * `max_tokens`：限制模型生成的最大token数量。

* 其他参数（可通过model\_kwargs字典传入）：

  * 例如 `frequency_penalty`（频率惩罚）、`presence_penalty`（存在惩罚）等不那么常用的参数。

  ```python
  llm = ChatOpenAI(
      model="gpt-3.5-turbo",
      temperature=0.7,
      max_tokens=100,
      model_kwargs={"frequency_penalty": 0.5}  # 其他参数
  )
  ```

> **提示**：如果未将API密钥存入环境变量，可以在创建实例时通过 `api_key` 参数直接传入。

### 3、构建消息列表（Message List）

由于 `ChatModel` 接收消息列表作为输入，我们需要了解消息的结构。

#### 消息类型

消息列表中的消息主要有三种类型：

1. **`SystemMessage`**：系统消息。用于向AI提供指令、设定角色或行为准则。例如：“你是一个乐于助人的助手。”
2. **`HumanMessage`**：人类消息。代表用户输入的对话内容。
3. **`AIMessage`**：AI消息。代表AI之前的回复，用于构建对话历史。

#### 创建和组合消息

1. **导入消息类**：

   ```python
   from langchain_core.messages import SystemMessage, HumanMessage
   ```

2. **创建消息实例**：

   ```python
   system_message = SystemMessage(content="你是一个翻译专家，擅长将英文翻译成中文。")
   human_message = HumanMessage(content="Hello, how are you?")
   ```

3. **组合成消息列表**：

   ```python
   messages = [system_message, human_message]
   ```

### 4、调用模型并获取回复

最后，调用模型的 `invoke` 方法（或 `__call__` 方法）来获取回复。

```python
# 调用模型
response = llm.invoke(messages)  # 或者 llm(messages)

# 打印回复
# response 是一个 AIMessage 对象
print(response.content)  # 输出: 你好，你怎么样？
```

### 5、LangChain支持的其他模型

LangChain的 `langchain-community` 库支持集成来自不同服务商的多种聊天模型。官方文档中列出了丰富的选择，例如：

* **百度**：千帆平台提供的 `ERNIE-Bot` 系列模型。
* **腾讯**：`混元` (HunYuan) 模型。
* **阿里**：`通义千问` (Qwen) 系列模型。

开发者可以申请相应服务的API密钥，并通过类似的方式集成这些国产大模型，实现模型的灵活切换。

### 6、Model使用示例

```python
from langchain_openai import ChatOpenAI
```

```python
model = ChatOpenAI(model="gpt-3.5-turbo")
# model = ChatOpenAI(model="gpt-3.5-turbo", temperature=1.2, max_tokens=500, model_kwargs={"frequency_penalty":1.1})
```

```python
from langchain.schema.messages import HumanMessage, SystemMessage
```

```python
messages = [
    SystemMessage(content="请你作为我的物理课助教，用通俗易懂且间接的语言帮我解释物理概念。"),
    HumanMessage(content="什么是波粒二象性？"),
]
```

```python
response = model.invoke(messages)
```

```python
response
```

```python
AIMessage(content='嗨！波粒二象性是一个非常有趣的物理概念。它指的是，微观粒子（比如电子、光子等）既可以表现出波动性，也可以表现出粒子性。\n\n让我们以光子为例来说明。光子是光的基本粒子，而光又是一种电磁波。当我们将光通过一个狭缝时，它会呈现出波动的特性，产生干涉和衍射现象，就像波一样。但当我们观察光子通过一个光敏探测器时，我们会发现它们的行为更像是粒子，因为它们只在一个点上被探测到。\n\n这就是波粒二象性的精髓所在：微观粒子既可以像波一样传播，又可以像粒子一样被探测到。这种二象性挑战了我们对物质本质的传统观念，但也为我们理解微观世界的奇妙规律提供了新的思路。')
```

```python
print(response.content)
```

```python
嗨！波粒二象性是一个非常有趣的物理概念。它指的是，微观粒子（比如电子、光子等）既可以表现出波动性，也可以表现出粒子性。

让我们以光子为例来说明。光子是光的基本粒子，而光又是一种电磁波。当我们将光通过一个狭缝时，它会呈现出波动的特性，产生干涉和衍射现象，就像波一样。但当我们观察光子通过一个光敏探测器时，我们会发现它们的行为更像是粒子，因为它们只在一个点上被探测到。

这就是波粒二象性的精髓所在：微观粒子既可以像波一样传播，又可以像粒子一样被探测到。这种二象性挑战了我们对物质本质的传统观念，但也为我们理解微观世界的奇妙规律提供了新的思路。
```

## 二、Prompt Template—让模型的输入超级灵活

### 1、提示模板的核心优势

与手动构建提示相比，代码化的提示模板可通过插入变量实现动态调整，能灵活适配不同示例或数据需求，显著提升效率和灵活性。

### 2、聊天模型的提示模板类型

LangChain 的`prompt`模块下，针对不同角色的消息提供了专用模板：

1. **SystemMessagePromptTemplate**：用于系统消息（设定模型行为、背景等）
2. **HumanMessagePromptTemplate**：用于人类消息（用户输入内容）
3. **AIMessagePromptTemplate**：用于 AI 消息（模型回复内容）

### 3、提示模板的创建与变量处理

1. **创建方式**：
   所有模板均通过`from_template`方法创建，传入包含变量的字符串（变量用`{}`包围）。
   示例：`SystemMessagePromptTemplate.from_template("将{input_language}翻译成{output_language}")`
2. **变量识别**：
   花括号包围的内容会被自动识别为变量（如`input_language`、`output_language`），无需额外声明，可通过模板的`input_variables`属性查看变量列表。

### 4、变量填充与消息生成

1. **填充变量**：
   用`format`方法传入变量值，模板会返回对应角色的消息对象：
   * 系统消息模板→`SystemMessage`
   * 人类消息模板→`HumanMessage`
   * AI 消息模板→`AIMessage`
2. **获取模型回应**：
   将填充后的消息对象放入列表，作为参数传入聊天模型的`invoke`方法即可。

### 5、简化方案：ChatPromptTemplate

若需统一管理多角色消息，可使用`ChatPromptTemplate`：

1. **创建方式**：通过`from_messages`方法接收消息模板列表，每个元素为（角色标识，内容字符串）的元组，角色标识可设为`"system"`、`"human"`、`"ai"`。
2. **变量填充**：调用`invoke`方法传入字典（键为变量名，值为变量内容），一次性填充所有角色消息中的变量。
3. **结果使用**：返回`ChatPromptValue`对象，包含填充后的完整消息列表，直接传入模型的`invoke`方法即可获取回应。

### 6、提示模板的核心价值

对于批量处理不同需求（如多语言翻译、不同风格生成等），无需逐个硬编码提示，只需通过循环为同一模板传入不同变量值，即可高效生成多样化结果，大幅提升开发效率。

### 7、Prompt Template使用示例

```python
from langchain.prompts import (
    SystemMessagePromptTemplate,
    AIMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
```

```python
# 提示模板一
system_template_text="你是一位专业的翻译，能够将{input_language}翻译成{output_language}，并且输出文本会根据用户要求的任何语言风格进行调整。请只输出翻译后的文本，不要有任何其它内容。"
system_prompt_template = SystemMessagePromptTemplate.from_template(system_template_text)
```

```python
system_prompt_template
```

```python
SystemMessagePromptTemplate(prompt=PromptTemplate(input_variables=['input_language', 'output_language'], template='你是一位专业的翻译，能够将{input_language}翻译成{output_language}，并且输出文本会根据用户要求的任何语言风格进行调整。请只输出翻译后的文本，不要有任何其它内容。'))
```

```python
system_prompt_template.input_variables
```

```python
['input_language', 'output_language']
```

```python
# 提示模板二
human_template_text="文本：{text}\n语言风格：{style}"
human_prompt_template = HumanMessagePromptTemplate.from_template(human_template_text)
```

```python
human_prompt_template.input_variables
```

```python
['style', 'text']
```

```python
system_prompt = system_prompt_template.format(input_language="英语", output_language="汉语")
system_prompt
```

```python
SystemMessage(content='你是一位专业的翻译，能够将英语翻译成汉语，并且输出文本会根据用户要求的任何语言风格进行调整。请只输出翻译后的文本，不要有任何其它内容。')
```

```python
human_prompt = human_prompt_template.format(text="I'm so hungry I could eat a horse", style="文言文")
human_prompt
```

```python
HumanMessage(content="文本：I'm so hungry I could eat a horse\n语言风格：文言文")
```

```python
from langchain_openai import ChatOpenAI
```

```python
model = ChatOpenAI(model="gpt-3.5-turbo")
response = model.invoke([
    system_prompt,
    human_prompt
])
```

```python
print(response.content)
```

```python
吾飢甚，能食千里馬。
```

## 三、Few Shot Templates—高效往提示里塞示范

### 1、少样本学习（Few-Shot Learning）

在提示词工程中，**少样本提示（Few-Shot Prompting）** 是一种让AI快速适应新任务的高效方法。

* **核心思想**：将几个包含输入（问题）和期望输出（答案）的对话示例（demonstrations）作为上下文，与新的用户提示一起发送给模型。
* **优势**：无需对模型进行任何训练，成本低、灵活性高。

### 2、少样本提示的挑战与优化

#### 2.1、挑战

虽然少样本提示非常有效，但当示例数量较多时，手动编写每个示例的完整消息列表会变得繁琐且容易出错。观察示例可以发现，它们的**格式高度相似**，主要区别仅在于具体的输入和输出值。

#### 2.2、解决方案：使用模板

既然示例结构相似，我们就可以利用**提示模板（Prompt Template）** 来动态生成这些示例，从而大大提高效率。

### 3、`FewShotChatMessagePromptTemplate`：少样本提示的利器

LangChain的 `langchain_core.prompts` 模块提供了一个专门用于构建少样本提示的类：`FewShotChatMessagePromptTemplate`。

### 1. 核心参数

* **`example_prompt`**：一个**提示模板**，用于定义**单个示例**的结构。这个模板可以包含动态变量（用花括号 `{}` 包围），例如 `{input}` 和 `{output}`。
* **`examples`**：一个**示例列表**，列表中的每个元素都是一个**字典**。字典的**键**对应 `example_prompt` 模板中的变量名，字典的**值**则是该变量在具体示例中应填充的实际内容。

### 2. 使用步骤

1. **创建 `example_prompt` 模板** 定义一个包含 `HumanMessage` 和 `AIMessage` 的模板，用于表示一个完整的问答对。

   ```python
   from langchain_core.prompts import ChatPromptTemplate, FewShotChatMessagePromptTemplate

   # 定义单个示例的模板
   example_prompt = ChatPromptTemplate.from_messages([
       ("human", "{input}"),
       ("ai", "{output}")
   ])
   ```

2. **准备 `examples` 数据** 创建一个包含多个具体示例值的列表。

   ```python
   examples = [
       {"input": "我今年25岁，来自北京。", "output": "年龄：25岁，所在地：北京市"},
       {"input": "我30岁了，住在杭州。", "output": "年龄：30岁，所在地：浙江省杭州市"}
   ]
   ```

3. **构建少样本提示模板** 将 `example_prompt` 和 `examples` 传入 `FewShotChatMessagePromptTemplate` 的构造函数。

   ```python
   few_shot_prompt = FewShotChatMessagePromptTemplate(
       example_prompt=example_prompt,
       examples=examples
   )
   ```

4. **组合完整提示模板** 将少样本提示模板与最终的用户提示模板组合成一个完整的 `ChatPromptTemplate`。`ChatPromptTemplate.from_messages` 方法支持将其他提示模板作为列表元素。

   ```python
   final_prompt = ChatPromptTemplate.from_messages([
       ("system", "你是一个信息提取助手。请按照示例格式提取年龄和所在地信息。"),
       few_shot_prompt,  # 少样本示例会在这里被动态插入
       ("human", "{input}")  # 用户的新输入
   ])
   ```

5. **填充变量并调用模型** 使用 `invoke` 方法，传入包含新用户输入的字典来填充最终的提示。

   ```python
   # 假设 llm 是已创建的聊天模型实例
   chain = final_prompt | llm
   response = chain.invoke({"input": "我今年28岁，来自成都。"})
   print(response.content)  # 输出: 年龄：28岁，所在地：四川省成都市
   ```

### 4、总结与优势

* **`FewShotChatMessagePromptTemplate`** 极大地简化了少样本提示的构建过程。
* 核心优势：
  * **效率高**：只需定义一次模板和提供示例数据，即可自动生成所有示例消息。
  * **易维护**：增加新的示例时，只需向 `examples` 列表中添加新的字典，无需重写整个消息结构。
  * **减少错误**：避免了手动编写大量重复格式消息时可能出现的格式错误。
* **适用场景**：当你需要向模型提供多个结构相似的示例来指导其行为时，使用此模板是最佳实践。

## 四、Output Parser—从模型输出里提取列表

### 1、输出解析器的作用

在代码与 AI 模型交互时，需对模型输出进行后续处理（如提取信息、展示等），但 AI 输出格式存在不确定性。LangChain 的输出解析器主要解决两方面问题：

1. **规范输出格式**：向模型下达指令，要求其按指定格式输出内容。
2. **解析输出内容**：自动处理模型的回应，提取所需信息（如转换为特定数据结构）。

### 2、逗号分隔列表输出解析器（CommaSeparatedListOutputParser）

以提取颜色色号为例，该解析器适用于将输出转换为 Python 列表，具体使用步骤如下：

#### 1. 创建解析器实例

通过`langchain.output_parsers`模块中的`CommaSeparatedListOutputParser`类创建实例，用于后续生成指令和解析结果。

#### 2. 获取格式指令

解析器的`get_format_instructions()`方法会返回规范模型输出的文字指令，例如：

> "你的回应应该是一串以逗号分隔的值，例如 foo, bar, baz"

该指令需嵌入系统提示中，确保模型按要求输出。

#### 3. 构建提示模板并调用模型

* 结合系统提示（包含解析器指令）和用户提示（如 “生成 5 个符合要求的颜色色号”），使用`ChatPromptTemplate`创建提示模板。
* 调用模板的`invoke`方法传入变量值，生成最终提示并传给模型，模型会返回逗号分隔的字符串（如 “#FF0000, #00FF00, #0000FF”）。

#### 4. 解析模型输出

直接调用解析器的`invoke`方法，传入模型的回应，即可自动将逗号分隔的字符串转换为 Python 列表（如`["#FF0000", "#00FF00", "#0000FF"]`），无需手动处理文本。

## 五、Output Parser —从模型输出里提取JSON

### 1、JSON 输出解析的优势与应用场景

JSON 是一种结构化强、易解析的格式，可轻松转换为字典、列表或类实例，适用于需要提取特定字段信息的场景（如从书籍介绍中提取书名、作者、题材等）。

* 核心需求：确保 AI 输出的 JSON 中，字段名、值的类型与预期完全匹配（避免因字段名错误或类型不符导致解析失败）。

### 2、PydanticOutputParser 的作用

LangChain 的`PydanticOutputParser`是处理 JSON 输出的关键工具，依托 Pydantic 库（用于数据解析和验证）实现两大功能：

1. 向 AI 下达指令，要求其输出符合指定数据模式的 JSON。
2. 自动解析 AI 返回的 JSON 字符串，转换为对应的类实例，方便提取信息。

### 3、使用步骤详解

#### 3.1、准备工作：安装并导入依赖

* 安装 Pydantic 库（若未安装）。
* 从pydantic导入核心组件：
  * `BaseModel`：用于定义数据模式（类似 “数据说明书”）。
  * `Field`：为字段提供描述信息和验证条件。

#### 3.2、定义数据模式（类）

创建继承自`BaseModel`的类（如`BookInfo`），明确所需字段的名称、类型及描述：

* **字段类型**：通过类型提示指定（如`bookname: str`、`author: str`表示字符串；`genres: List[str]`表示字符串列表）。

* **字段描述**：使用`Field`函数补充说明（如`Field(description="书籍的标题")`），该描述会传递给 AI，帮助其理解字段含义。

  示例：

  ```python
  from pydantic import BaseModel, Field
  from typing import List

  class BookInfo(BaseModel):
      bookname: str = Field(description="书籍的标题")
      author: str = Field(description="书籍的作者")
      genres: List[str] = Field(description="书籍的题材类别列表")
  ```

#### 3.3、创建 PydanticOutputParser 实例

将定义的数据模式类传入`PydanticOutputParser`，生成解析器：

```python
from langchain.output_parsers import PydanticOutputParser

parser = PydanticOutputParser(pydantic_object=BookInfo)
```

#### 3.4、生成格式指令并嵌入提示

* 调用解析器的`get_format_instructions()`方法，获取规范 AI 输出的指令（包含数据模式要求）。
* 将指令嵌入提示模板（如`ChatPromptTemplate`），确保 AI 按格式输出 JSON。

#### 3.5、调用模型并解析输出

* 模型返回符合要求的 JSON 字符串（字段名、类型与`BookInfo`一致）。

* 调用解析器的invoke方法，传入模型回应，自动将 JSON 字符串转换为BookInfo类实例：

  ```python
  book_data = parser.invoke(model_response)
  ```

* 直接通过实例提取信息（如`book_data.bookname`、`book_data.genres`）。

### 4、核心价值

通过 Pydantic 的类型验证和 LangChain 解析器的协作，既能保证 AI 输出的结构化，又能简化后续信息提取流程，尤其适合需要批量处理结构化数据的场景（如网站信息展示、数据入库等）。

## 六、Chain—串起提示模板-模型-输出解析器

### 1、核心组件的共性：`invoke`方法

LangChain 中的多个核心组件（如提示模板、聊天模型、输出解析器）均实现了`Runnable`接口，因此都具备`invoke`方法，这是 LangChain 表达式语言（LCEL）中统一的调用方式。不同组件的`invoke`方法功能如下：

* **提示模板（如`ChatPromptTemplate`）**：接收含变量值的字典，返回填充后的提示值（`PromptValue`）。
* **聊天模型（如`ChatModel`）**：接收提示值或消息列表，返回模型生成的聊天信息。
* **输出解析器（如`PydanticOutputParser`）**：接收模型的聊天信息，返回解析后的结构化结果。

### 2、组件的串联关系

各组件的`invoke`方法存在 “输入 - 输出” 的上下游依赖：

* 提示模板的输出（提示值）是聊天模型的输入。
* 聊天模型的输出（生成内容）是输出解析器的输入。

因此，可通过连续调用`invoke`方法实现完整流程，例如：

`提示模板.invoke(变量) → 聊天模型.invoke(提示值) → 解析器.invoke(模型输出)`

```
字典（Dictionary） -> 输入 -> 提示模板（Prompt Template） -> 输出 -> 提示值（Prompt Value） -> 输入 -> 聊天模型（Chat Model） -> 输出 -> 聊天消息（Chat Message） -> 输入 -> 输出解析器（Output Parser） -> 输出 -> 解析结果（类型取决于解析器）
```

代码示例

```
```

### 3、链（Chain）与 LangChain 表达式语言（LCEL）

```
(prompt | model | output_parser).invoke()
```

1. **链的定义**：将多个组件按 “上游输出作为下游输入” 的逻辑组合成的流程，称为 “链”。
2. **LCEL 的管道语法**：通过`|`（管道操作符）直观表示组件间的串联关系，例如：
   `prompt | model | parser`
   含义：提示模板的输出传给模型，模型的输出再传给解析器。
3. **链的调用**：对整个链调用`invoke`方法时，只需传入第一个组件所需的参数（因后续组件的输入由上游提供），即可得到最终结果。

### 4、链的灵活性

链的组合方式非常灵活，可根据需求调整组件：

* 中间的聊天模型可替换为其他语言模型（如`LLM`）。
* 提示模板或输出解析器并非必需，可根据场景省略。

通过链，能轻松构建复杂的 AI 交互流程，且组件间的依赖关系清晰易懂。

### 5、Chain使用示例

```
from langchain_openai import ChatOpenAI
from langchain.output_parsers import CommaSeparatedListOutputParser
from langchain.prompts import ChatPromptTemplate
```

```
prompt = ChatPromptTemplate.from_messages([
    ("system", "{parser_instructions}"),
    ("human", "列出5个{subject}色系的十六进制颜色码。")
])
```

```
output_parser = CommaSeparatedListOutputParser()
parser_instructions = output_parser.get_format_instructions()
```
