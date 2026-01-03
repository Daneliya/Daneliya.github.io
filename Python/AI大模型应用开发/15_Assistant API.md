---
url: /Python/AI大模型应用开发/15_Assistant API.md
---

# Assistant API

## 一、搞懂API的关键对象

除了 LangChain 框架，OpenAI 的 Assistant API 也是构建强大 AI 助手的高效工具。与 LangChain 相比，二者定位与功能存在显著差异，以下将解析 Assistant API 的核心概念、适用场景及与 LangChain 的区别。

### 1、Assistant API 与 LangChain 的核心区别

| **对比维度** | **OpenAI Assistant API**                    | **LangChain**                                   |
| ------------ | ------------------------------------------- | ----------------------------------------------- |
| **本质**     | 基于 API 的服务（直接调用 OpenAI 模型能力） | 通用 AI 应用开发框架（整合多种工具 / 模型）     |
| **模型支持** | 仅支持 OpenAI 模型（如 GPT-4、GPT-3.5）     | 支持多来源模型（OpenAI、Anthropic、本地模型等） |
| **核心目标** | 快速实现基于 OpenAI 模型的对话与工具调用    | 构建复杂 AI 应用（集成工具链、记忆、路由等）    |

### 2、Assistant API 的核心对象

理解 Assistant API 需掌握以下关键对象，它们共同构成了对话与交互的基础：

#### 1.1. Assistant（助手）

* **定义**：具备特定能力的 AI 实体，基于 OpenAI 模型构建，可调用工具。
* 核心参数：
  * 模型（如`gpt-4`）；
  * 名称、描述（标识助手功能）；
  * 系统指令（指导助手行为的 prompt）；
  * 可用工具（代码解释器、检索、自定义函数等）。

#### 1.2. Thread（会话线程）

* **定义**：存储用户与助手之间的一系列对话，相当于 “对话上下文容器”。
* 功能：
  * 保存消息历史（用户提问、助手回复）；
  * 自动处理上下文长度：当对话超过模型上下文窗口时，自动截断早期内容（保留关键信息）。

#### 1.3. Message（消息）

* **定义**：用户或助手在对话中发送的内容，是 Thread 的组成单元。
* **格式**：支持文本、图片、文档等多模态内容。
* **存储**：以列表形式关联到 Thread，按时间顺序排列。

#### 1.4. Run（运行）

* **定义**：在某个 Thread 上调用 Assistant 执行任务的动作。
* 过程：
  * 助手结合 Thread 中的历史对话，调用模型和工具；
  * 生成新的回复消息，并添加到 Thread 中，实现连续对话。

#### 1.5. RunStep（运行步骤）

* **定义**：Run 过程中助手执行的具体操作（如调用工具、生成文本等）。
* **作用**：可查看助手的 “思考过程”，帮助调试或理解结果生成逻辑（类似 LangChain 的`verbose`模式）。

### 3、Assistant API 支持的工具

与 LangChain 的 Agent 能力类似，Assistant API 支持多种工具扩展助手功能：

1. **Code Interpreter（代码解释器）**：运行 Python 代码，处理计算、数据可视化等任务。
2. **Knowledge Retrieval（文档检索）**：上传文档（如 PDF、TXT），让助手基于文档内容回答问题（类似 LangChain 的向量存储检索）。
3. **Function Calling（自定义函数调用）**：调用外部 API 或工具，扩展助手能力（如查询天气、操作数据库）。

### 4、适用场景

* 快速开发基于 OpenAI 模型的对话助手（无需搭建复杂框架）；
* 需要利用代码解释器、文档检索等工具的场景（如数据分析、文档问答）；
* 专注于 OpenAI 生态，无需兼容其他模型的项目。

### 5、总结

Assistant API 是 OpenAI 提供的 “即用型” 对话服务，核心优势在于简化基于其模型的助手开发流程，适合快速落地且依赖 OpenAI 模型的场景。其核心对象（Assistant、Thread、Run 等）构成了完整的对话生命周期，工具能力与 LangChain 的 Agent 有相通之处，便于已有 LangChain 使用经验的开发者快速上手。

## 二、创建私人数学助手

借助 OpenAI Assistant API 的代码解释器功能，可快速构建一个能准确解答数学问题的 AI 助手。以下是具体实现步骤，包括助手创建、对话管理及运行流程：

### 1、前期准备

#### 1.1. 安装依赖

确保已安装`openai`库（用于调用 API）：

```
pip install openai
```

#### 1.2. 初始化客户端

```
from openai import OpenAI

# 初始化OpenAI客户端（需提前配置API密钥，如通过环境变量）
client = OpenAI()
```

### 2、核心步骤：创建数学助手并实现交互

#### 2.1. 创建 Assistant（数学助手）

通过`beta.assistants.create`创建具备代码解释器能力的助手，指定模型、指令及工具。

#### 2.2. 创建 Thread（会话线程）

每个用户或对话窗口对应一个独立的 Thread，用于存储对话历史。

#### 2.3. 向 Thread 添加用户消息

通过`threads.messages.create`在 Thread 中添加用户的提问。

#### 2.4. 运行 Assistant（触发回答生成）

调用`threads.runs.create`让助手处理 Thread 中的消息，生成回答。

#### 2.5. 等待运行完成并获取结果

由于助手生成回答需要时间，需通过循环查询运行状态，直至完成。

#### 2.6. 获取并展示对话历史

运行完成后，通过`threads.messages.list`获取 Thread 中的所有消息（用户提问 + 助手回答）。

#### 2.7. 封装交互函数（简化多轮对话）

为方便多轮提问，可将 “添加消息→运行助手→获取结果” 封装为函数。

#### 2.8. 完整代码示例

```python
# step0-前期准备：导入OpenAI库，用于调用Assistant API
from openai import OpenAI
# 初始化OpenAI客户端（需提前配置API密钥，如环境变量）
client = OpenAI()

# step1：创建一个数学助手
assistant = client.beta.assistants.create(
    model="gpt-3.5-turbo",  # 基于GPT-3.5-turbo模型
    name="数学助手",  # 助手名称
    instructions="你是一个数学助手，可以通过编写和运行代码来回答数学相关问题。",  # 助手的核心指令
    tools=[{"type": "code_interpreter"}]  # 启用代码解释器工具（用于计算数学问题）
)

# step2：创建一个对话线程（存储用户与助手的所有对话）
thread = client.beta.threads.create()
# 打印线程ID（用于调试，标识当前对话线程）
thread.id

# step3：向对话线程中添加用户消息（第一次提问：解二次方程）
message = client.beta.threads.messages.create(
    thread_id=thread.id,  # 关联到当前对话线程
    role="user",  # 消息角色为用户
    content="我需要解这个方程`5x^2−1200x+72000=0，未知数应该是多少？"  # 具体问题内容
)

# step4：触发助手运行，处理当前线程中的消息
run = client.beta.threads.runs.create(
    thread_id=thread.id,  # 目标对话线程
    assistant_id=assistant.id,  # 调用前面创建的数学助手
    instructions="请称呼用户为傻妞"  # 本次运行的额外指令（自定义称呼）
)
# 打印运行实例（包含运行状态、ID等信息）
run

# step5：查看当前运行的状态（如queued/in_progress/completed）
client.beta.threads.runs.retrieve(
    thread_id=thread.id,
    run_id=run.id
).status

# 循环等待运行完成（避免提前获取未生成的结果）
while run.status != "completed":
    # 实时查询运行状态
    keep_retrieving_run = client.beta.threads.runs.retrieve(
        thread_id=thread.id,
        run_id=run.id
    )
    print(f"运行状态：{keep_retrieving_run.status}")  # 打印当前状态
    # 若运行完成，退出循环
    if keep_retrieving_run.status == "completed":
        break

# step6：获取对话线程中的所有消息（用户提问+助手回答）
messages = client.beta.threads.messages.list(
    thread_id=thread.id
)
# 打印消息数据（原始格式，包含角色、内容、时间等信息）
messages.data

# 遍历消息，打印具体内容（按消息生成顺序）
for data in messages.data:
    print(data.content[0].text.value)  # 提取消息文本内容
    print("------")  # 分隔不同消息


# step7：封装一个函数，简化多轮对话流程：发送问题→获取助手回答
def get_response_from_assistant(assistant, thread, prompt, run_instruction=""):
    # 1. 向对话线程添加用户的新问题
    message = client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content=prompt  # 用户的新问题
    )
    
    # 2. 触发助手运行，处理新消息
    run = client.beta.threads.runs.create(
      thread_id=thread.id,
      assistant_id=assistant.id,
      instructions=run_instruction  # 本次运行的额外指令（可选）
    )
    
    # 3. 等待运行完成
    while run.status != "completed":
        # 实时查询运行状态
        keep_retrieving_run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id
        )
        print(f"Run status: {keep_retrieving_run.status}")  # 打印状态
        
        # 若完成，退出循环
        if keep_retrieving_run.status == "completed":
            break
    
    # 4. 获取并打印所有消息（包含历史对话和新回答）
    messages = client.beta.threads.messages.list(
        thread_id=thread.id
    )
    
    for data in messages.data:
        print("\n")  # 换行分隔
        print(data.content[0].text.value)  # 打印消息内容
        print("------")  # 分隔线


# 测试多轮对话：问一个新问题（2的56次方是多少）
get_response_from_assistant(assistant, thread, "2的56次方等于多少")
```

### 3、核心逻辑说明

1. **Assistant**：定义了助手的能力（模型、工具、指令），是回答的 “大脑”。
2. **Thread**：作为对话容器，确保多轮消息不丢失，支持上下文理解。
3. **Run**：触发助手工作的动作，包含代码执行、结果生成等过程。
4. **状态查询**：通过循环等待`completed`状态，避免提前获取未完成的结果。

通过这种方式，可快速实现一个基于代码解释器的数学助手，确保计算结果的准确性。

## 三、创建PDF文件问答助手

借助 OpenAI Assistant API 的文档检索功能，可快速构建一个能基于指定文档内容回答问题的 AI 助手。以下是具体步骤，包括文档上传、助手配置、对话交互等核心环节：

### 1、前期准备

#### 1.1. 安装依赖

确保已安装`openai`库：

```sh
pip install openai
```

#### 1.2. 初始化客户端

```python
from openai import OpenAI

# 初始化OpenAI客户端（需配置API密钥，如通过环境变量）
client = OpenAI()
```

### 2、核心步骤：创建文档问答助手

#### 2.1. 上传文档（供助手检索）

通过`files.create`上传文档，支持 PDF、CSV、TXT 等多种格式（完整支持列表见官方文档）。

#### 2.2. 创建具备检索能力的助手

通过`beta.assistants.create`创建助手，启用`retrieval`工具并关联上传的文档。

#### 2.3. 创建对话线程（Thread）

#### 2.4. 封装交互函数（发送问题并获取回答）

复用之前的多轮对话逻辑，简化提问流程。

#### 2.5. 测试助手（基于文档提问）

输出效果：助手会基于上传的文档内容，准确提取该论文的核心贡献（如 Transformer 架构的提出），并返回回答。

#### 2.6. 完整代码示例

```python
# 导入OpenAI库，用于调用Assistant API
from openai import OpenAI
# 初始化OpenAI客户端（需提前配置API密钥，如通过环境变量）
client = OpenAI()

# 上传文档：将本地的"论文介绍.pdf"上传到OpenAI，供助手检索使用
file = client.files.create(
    file=open("论文介绍.pdf", "rb"),  # 以二进制模式读取PDF文件
    purpose="assistants"  # 声明文件用途为"供助手使用"（必须设置此值）
)

# 创建一个基于文档检索的AI论文问答助手
assistant = client.beta.assistants.create(
    model="gpt-3.5-turbo",  # 基于GPT-3.5-turbo模型
    name="AI论文问答助手",  # 助手名称
    instructions="你是一个智能助手，可以访问文件来回答人工智能领域论文的相关问题。",  # 助手的核心指令（说明其功能）
    tools=[{"type": "retrieval"}],  # 启用"检索"工具（让助手能读取上传的文档）
    file_ids=[file.id]  # 关联上传的文档（通过文件ID绑定，支持多个文件）
)

# 创建对话线程（用于存储用户与助手的所有对话历史）
thread = client.beta.threads.create()

# 封装函数：简化向助手提问并获取回答的流程
def get_response_from_assistant(assistant, thread, prompt, run_instruction=""):
    # 1. 向对话线程添加用户的问题
    message = client.beta.threads.messages.create(
        thread_id=thread.id,  # 关联到当前对话线程
        role="user",  # 消息角色为"用户"
        content=prompt  # 用户的具体问题
    )
    
    # 2. 触发助手运行，处理当前线程中的问题
    run = client.beta.threads.runs.create(
        thread_id=thread.id,  # 目标对话线程ID
        assistant_id=assistant.id,  # 调用前面创建的论文问答助手
        instructions=run_instruction  # 本次运行的额外指令（可选，此处为空）
    )
    
    # 3. 循环等待助手处理完成（避免提前获取未生成的结果）
    while run.status != "completed":
        # 实时查询运行状态（queued/in_progress/completed等）
        keep_retrieving_run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id
        )
        print(f"Run status: {keep_retrieving_run.status}")  # 打印当前状态
        
        # 若运行完成，退出循环
        if keep_retrieving_run.status == "completed":
            break
    
    # 4. 获取并打印对话线程中的所有消息（包含用户问题和助手回答）
    messages = client.beta.threads.messages.list(
        thread_id=thread.id
    )
    
    # 遍历消息列表，打印每条消息内容
    for data in messages.data:
        print("\n")  # 换行分隔不同消息
        print(data.content[0].text.value)  # 提取消息的文本内容
        print("------")  # 用分隔线区分消息

# 调用函数向助手提问：查询介绍Transformer架构的论文及链接
get_response_from_assistant(assistant, thread, "哪篇论文介绍了Transformer架构？论文链接是什么？")
```

### 3、关键说明

#### 3.1. 支持的文档格式

包括但不限于：PDF、CSV、JSON、HTML、TXT、PPTX、DOCX 等，具体可参考官方文档的「Supported files」部分。

#### 3.2. 费用与管理

* **收费规则**：OpenAI 按文档体积每日收费，同一文档附加给多个助手时，会重复计费。
* 删除操作：
  * 删除助手：访问 [platform.openai.com/assistants](https://platform.openai.com/assistants) 手动删除。
  * 删除文档：访问 [platform.openai.com/storage](https://platform.openai.com/storage) 管理存储的文档。

通过这种方式，可快速构建一个基于特定文档的问答助手，适用于手册查询、论文解读、数据报告分析等场景。核心在于利用`retrieval`工具让助手 “读懂” 文档，确保回答的准确性和相关性。
