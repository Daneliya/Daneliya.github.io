---
url: /Python/AI大模型应用开发/2_OpenAI大模型API基础.md
---

# OpenAI大模型API基础

## 一、如何用代码与AI对话？模型API

要真正动手构建属于自己的 AI 应用，就不能停留在通过网页与 AI 交互的层面。虽然网页端可以获取 AI 的回答，但这种方式存在明显局限：

1. **数据提取困难**：从网页上“扒”下 AI 的回答用于后续处理非常麻烦，不利于自动化。
2. 控制能力有限：无法灵活调整 AI 回复的关键参数，例如：
   * 回复长度（如限制为 512 个 token）
   * 创造性（temperature）
   * 频率惩罚（frequency penalty）
   * 提示模板的使用效率低

相比之下，**通过代码调用 AI 模型**具有显著优势：

* **精细控制**：可以精确设置请求参数，获得更可靠、可预测的输出。
* **批量处理**：能对大量数据进行自动化处理，例如一次性总结多个文档。
* **系统集成**：可将 AI 能力嵌入到自己的系统或工作流中，实现定制化功能，如自动回复邮件、生成报告等。

### 1、如何用代码与 AI 大模型对话？

最常见的方式是通过 **API（Application Programming Interface，应用程序编程接口）** 调用。

* **API 的作用**：定义了客户端与服务端之间的通信规则，相当于“如何与服务对话的说明书”。
* **底层协议**：大多数 AI API 基于 **HTTP（Hypertext Transfer Protocol，超文本传输协议）**，采用客户端发送请求、服务器返回响应的模式。

工作流程如下：

1. **客户端**（你的代码）将提示（prompt）封装在请求中，发送给 AI 服务提供商（如 OpenAI、百度等）的服务器。
2. **服务器**运行大模型生成回复，并通过 HTTP 响应返回结果。
3. **客户端**接收响应，提取 AI 的回答，用于后续处理。

> 注：HTTP 请求和响应包含许多技术细节（如 headers、status code 等），初学者不必完全理解。

### 2、实际开发中的便利性

为了降低使用门槛，主流 AI 服务商（如 OpenAI、百度）都提供了 **官方封装的 Python 库**：

* 你无需手动构建复杂的 HTTP 请求。
* 只需调用库中的函数或方法，传入相应参数即可完成请求。
* 例如：指定使用哪个模型、输入消息内容、设置 temperature 等。

这些库的使用方法都有详细文档说明，包括：

* 调用哪个方法
* 参数如何设置
* 输入数据结构（如消息列表）
* 响应数据的格式和解析方式

虽然不同平台（如 GPT、文心一言）的 Python 库和代码略有差异，但核心逻辑一致：**发送提示 → 获取回复**，掌握一个即可触类旁通。

### 3、调用前的关键步骤：获取 API 密钥

在调用任何主流 AI 大模型 API 之前，必须先获取 **API Key（API 密钥）**。

* 作用：
  * 身份验证：服务方识别请求来源
  * 使用追踪：记录调用次数和频率
  * 计费依据：按使用量收费
* 因此，API Key 是调用 AI 服务的前提。

## 二、创建OpenAI API密钥，然后藏起来

在通过代码调用 AI 大模型之前，必须获取 API 密钥。没有 API 密钥，无法使用 OpenAI 等平台的模型和服务。本课程以 OpenAI 的 GPT 模型为例进行说明。

***

### 1、创建 OpenAI API 密钥

1. **访问官网**
   前往 OpenAI 官网的 API 密钥管理页面（https://platform.openai.com/api-keys）。
2. **注册或登录**
   如果还没有账号，需先注册并完成验证。
3. **创建密钥**
   * 点击 **"Create new secret key"** 按钮。
   * 可为密钥命名（如用于不同项目），便于识别；不命名则系统自动生成默认名称。
4. **复制并保存密钥**
   * 创建后，系统会显示完整的 API 密钥。
   * **注意：该密钥仅显示一次！关闭后无法再次查看完整内容。**
   * 务必点击复制按钮，将密钥保存到安全位置（如密码管理器或本地文件）。
5. **密钥泄露处理**
   * API 密钥与账户绑定，一旦泄露，他人使用将产生费用由你承担。
   * 若怀疑密钥已泄露，请立即在后台将其删除（Revoke），使其失效，然后重新创建新密钥。

***

### 2、安全使用 API 密钥：避免硬编码

直接将密钥写入代码（硬编码）存在严重安全风险：

* 任何人看到代码即可获取密钥。
* 若代码上传至 GitHub 等公共平台，密钥将公开暴露。

**推荐做法：使用环境变量存储密钥**

这样代码中不包含密钥明文，即使共享代码也不会泄露。

***

### 3、设置环境变量（按操作系统）

#### **Windows 系统**

1. 右键“此电脑”或“我的电脑” → 选择“属性”。
2. 点击“高级系统设置” → 在“高级”选项卡下点击“环境变量”。
3. 在“用户变量”或“系统变量”中点击“新建”。
4. 输入：
   * **变量名**：`OPENAI_API_KEY`（注意拼写和大小写）
   * **变量值**：粘贴你的 API 密钥
5. 依次点击“确定”保存。

#### **macOS 系统**

1. 打开终端，确认 Shell 类型：

   bash深色版本

   ```
   echo $0
   ```

   常见为 `bash` 或 `zsh`。

2. 编辑对应配置文件：

   * Bash：`~/.bash_profile` 或 `~/.bashrc`
   * Zsh：`~/.zshrc`

3. 使用 `nano` 编辑器打开文件（以 Zsh 为例）：

   bash深色版本

   ```
   nano ~/.zshrc
   ```

4. 在文件末尾添加一行：

   bash深色版本

   ```
   export OPENAI_API_KEY="your-api-key-here"
   ```

   将 `your-api-key-here` 替换为实际密钥，注意不要遗漏引号。

5. 保存并退出：

   * 按 `Ctrl + X`
   * 按 `Y` 确认保存
   * 按 `Enter` 确认文件名

6. 使更改立即生效：

   bash深色版本

   ```
   source ~/.zshrc
   ```

***

### 4、使用

设置完成后，代码中可通过读取环境变量的方式获取密钥，例如在 Python 中使用：

python深色版本

```
import os
api_key = os.getenv("OPENAI_API_KEY")
```

这样既保证了安全性，也便于在不同环境中部署。

## 三、发送你对AI大模型的第一个请求

安装和使用OpenAI Python库

### 1、安装OpenAI库

* 通过pip命令安装OpenAI库
  * 打开终端或CMD，输入`pip install openai`（对于macOS可能需要使用`pip3 install openai`）。
  * 或者在Jupyter Notebook中新建一个notebook，并运行`!pip install openai`。感叹号前缀使得该命令在系统shell中执行，效果等同于在终端或CMD中运行。
* 导入并初始化OpenAI库
  * 安装完成后，在Jupyter Notebook中使用`from openai import OpenAI`语句导入OpenAI库。
  * 创建一个`client = OpenAI()`实例，通常不需要手动输入API密钥，因为可以从环境变量中自动获取。

### 2、配置API密钥

* 从环境变量读取API密钥

  * 如果已经将API密钥存储在环境变量中，则可以直接使用，无需再次输入。

* 手动设置API密钥

  * 如果没有存储API密钥或想使用新的密钥，可以通过传递`api_key`参数给OpenAI构造函数来指定密钥值。

    ```python
    client = OpenAI(api_key='密钥')
    ```

### 3、发送请求与接收回复

* 调用chat.completion.create方法
  * 使用`openai.ChatCompletion.create()`方法发起对话请求，需指定`model`参数（如`gpt-3.5-turbo`, `gpt-4`, `gpt-4-turbo`等）。
  * 根据选择的模型版本不同，性能和价格也会有所差异。
* 构建messages列表
  * `messages`参数是一个包含一条或多条消息的列表，每条消息由字典表示。
  * 字典中必须包含`role`键，用于标识消息来源（用户为`user`，AI助手为`assistant`，系统消息为`system`）。
  * 可以包含用户的提示和AI的回答，第一条消息可以是系统消息，用于设定背景或角色。

代码示例

```python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "user", "content": "四大文明古国分别有哪些"}
  ]
)
response
# 输出结果
ChatCompletion(id='chatcmpl-8iAPcTm1oItRiinW199PZ1aTPMM0F', choices=[Choice(finish_reason='stop', index=0, logprobs=None, message=ChatCompletionMessage(content='四大文明古国指的是古代埃及、巴比伦、印度和中国。这四个古国拥有悠久的历史和独特的文明。以下是这些古国的一些特点：\n\n1. 埃及：埃及文明起源于公元前3100年的法老王朝时期。埃及是世界上最早的文明之一，拥有众多的古代建筑和文化遗产，如金字塔、狮身人面像等。埃及人崇拜众神，并相信死后的来世。\n\n2. 巴比伦：巴比伦是古代美索不达米亚地区的一座重要城市。巴比伦文明起源于公元前18世纪的阿卡德帝国时期，盛行于公元前7世纪的新巴比伦帝国时期。巴比伦文明的最大贡献之一是制定了世界上最早的法典——汉谟拉比法典。\n\n3. 印度：印度文明起源于公元前2500年左右的哈拉帕文明，也叫印度河谷文明。印度文明的特点之一是宗教多元化，印度教、佛教、耆那教等宗教都在这里兴起。此外，印度还有许多伟大的文化和科学成就，如印度的数学、医学和文学等。\n\n4. 中国：中国文明起源于公元前21世纪的夏代，是世界上最古老的连续文明之一。中国文明的特点之一是中华传统文化，包括儒家思想、道家思想和佛教等。此外，中国还有众多的发明和科技成就，如造纸术、指南针、火药和活字印刷术等。', role='assistant', function_call=None, tool_calls=None))], created=1705537148, model='gpt-3.5-turbo-0613', object='chat.completion', system_fingerprint=None, usage=CompletionUsage(completion_tokens=566, prompt_tokens=20, total_tokens=586))
```

多Role示例

```python
response = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "system", "content": "你是一个乐于助人、语气友善的AI聊天助手"},
    {"role": "user", "content": "你是谁"},
    {"role": "assistant", "content": "我是ChatGPT，由OpenAI开发的一款大型语言模型。"},
    {"role": "user", "content": "四大文明古国分别有哪些"}
  ]
)
response
# 输出结果
ChatCompletion(id='chatcmpl-8iAPmOhzCO2DuFGb3D23JBmFSnNPp', choices=[Choice(finish_reason='stop', index=0, logprobs=None, message=ChatCompletionMessage(content='四大文明古国是指中国、印度、古巴比伦和古埃及。以下是它们的简要介绍：\n\n1. 中国：中国是世界上最古老的文明之一，拥有5000多年的历史。它以其丰富的历史和文化遗产而闻名，包括伟大的长城、秦始皇陵、故宫和中国传统的哲学、文学、艺术和科学。\n\n2. 印度：印度是世界上最古老的宗教之一——印度教的发源地，也是佛教和耆那教的重要发展地。印度拥有丰富的文化遗产，包括泰姬陵、拉贾斯坦邦的古城、印度古典舞蹈和印度瑜伽等。\n\n3. 古巴比伦：古巴比伦位于现在的伊拉克地区，是迦勒底王朝的中心，公元前18至6世纪期间一度是世界上最强大的帝国之一。古巴比伦文明以其先进的法律、政治组织和建筑技术而闻名，其中最著名的是巴比伦的宏伟城市和垂直的花岗岩宏伟塔楼——巴比伦塔。\n\n4. 古埃及：古埃及位于尼罗河流域，拥有悠久的历史和独特的文化。古埃及文明以其庞大的金字塔、神庙和法老王墓葬而闻名，埃及的艺术、文学、数学和天文学也有很高的发展水平。同时，古埃及还有一套独特的象形文字系统——象形文字。\n\n这些古国对人类文明的发展和演进作出了重大贡献，他们的文化和遗产也延续至今。', role='assistant', function_call=None, tool_calls=None))], created=1705537158, model='gpt-3.5-turbo-0613', object='chat.completion', system_fingerprint=None, usage=CompletionUsage(completion_tokens=600, prompt_tokens=81, total_tokens=681))
```

### 4、解析AI返回的消息

* 处理API响应

  * 调用API后，返回的对象是一个`ChatCompletion`类实例，其中AI的回复位于`choices[0].message.content`属性中。
  * 提取并打印出AI的回答内容。

示例代码片段

```python
print(response.choices[0].message.content)
# 输出结果
四大文明古国是指中国、印度、古巴比伦和古埃及。以下是它们的简要介绍：
1. 中国：中国是世界上最古老的文明之一，拥有5000多年的历史。它以其丰富的历史和文化遗产而闻名，包括伟大的长城、秦始皇陵、故宫和中国传统的哲学、文学、艺术和科学。
2. 印度：印度是世界上最古老的宗教之一——印度教的发源地，也是佛教和耆那教的重要发展地。印度拥有丰富的文化遗产，包括泰姬陵、拉贾斯坦邦的古城、印度古典舞蹈和印度瑜伽等。
3. 古巴比伦：古巴比伦位于现在的伊拉克地区，是迦勒底王朝的中心，公元前18至6世纪期间一度是世界上最强大的帝国之一。古巴比伦文明以其先进的法律、政治组织和建筑技术而闻名，其中最著名的是巴比伦的宏伟城市和垂直的花岗岩宏伟塔楼——巴比伦塔。
4. 古埃及：古埃及位于尼罗河流域，拥有悠久的历史和独特的文化。古埃及文明以其庞大的金字塔、神庙和法老王墓葬而闻名，埃及的艺术、文学、数学和天文学也有很高的发展水平。同时，古埃及还有一套独特的象形文字系统——象形文字。
这些古国对人类文明的发展和演进作出了重大贡献，他们的文化和遗产也延续至今。
```

## 四、AI模型咋收费？必了解的token计数

### 1、理解Token

* Token作为文本的基本单位
  * Token是文本处理的基本单位，短单词可能是一个Token，长单词或中文字符则可能被拆分为多个Token。
  * 中文字符通常占用更多的Token数量，某些不常见字可能会被映射成多个Token。
* 查看Token化效果
  * 可以使用OpenAI提供的交互式分词器（<https://platform.openai.com/tokenizer>）来查看任意文本如何被映射为不同的Token。

### 2、Token计费机制

* 基于Token数量的计费
  * 大部分大模型API的计费基于Token的数量，包括用户提示和AI回应的总Token数。
  * 一个Token通常对应约四个英文字符，每100个Token约等于75个单词。
* 具体计费示例
  * GPT-3.5 Turbo: 输入每1000Token 0.1人民币，输出每1000Token 0.2人民币。
  * GPT-4: 输入每1000Token 3美分，输出每1000Token 6美分。

### 3、使用TickToken库估算Token数量

* 安装TickToken库
  * 在Jupyter Notebook中运行`!pip install tiktoken`，或在CMD/终端中运行`pip install tiktoken`（macOS可能需要`pip3 install tiktoken`）。
* 使用TickToken库估算Token数
  * 导入`tiktoken`库并使用`Encoding for Model`方法获取对应模型的编码器。
  * 调用编码器的`encode`方法传入文本内容，返回一个Token ID列表，列表长度即为Token数量。

```python
# 导入库
import tiktoken
# 获取对应模型的编码器
encoding = tiktoken.encoding_for_model("gpt-3.5-turbo")
encoding
# 结果返回编码器
<Encoding 'cl100k_base'>
# 调用编码器中的方法
encoding.encode("黄河之水天上来")
# 返回token id列表结果，每个id对应一个token
[30868, 226, 31106, 111, 55030, 53610, 36827, 17905, 37507]
# 求列表长度
len(encoding.encode("黄河之水天上来"))
# 返回token长度
9
```

### 4、控制API请求中的Token消耗

* 限制AI回应的Token数量
  * 可以通过设置API请求参数来控制AI回应的最大Token数，避免过长回复导致成本增加。
* 上下文窗口的限制
  * AI模型的上下文窗口（Context Window）是有限的，超过该限制的文本会被截断。例如：
    * GPT-3.5 Turbo: 上下文窗口为4096 Token（另有16K版本支持16000 Token）。
    * GPT-4: 上下文窗口为8192 Token（另有32K版本支持32000 Token）。

### 5、优化提示与回应长度

* 简洁提问的重要性
  * 学习如何简洁地构建提示，减少不必要的Token消耗，从而降低成本。
* 应对上下文窗口限制的方法
  * 针对上下文窗口带来的限制，可以采用分段处理、精简提示等策略来优化对话效果。

## 五、定制AI的回复？常用参数详解

* Max Tokens：控制生成长度与成本
* Temperature：调整响应的随机性与创造性
* Top\_p（Nucleus Sampling）：调整响应的随机性与创造性

### 1、Max Tokens参数

* 理解Max Tokens的作用
  * `max_tokens` 参数用于控制AI回复所消耗的Token最大值。
  * 通过限制回复长度，可以有效控制每次API请求的成本上限。
* 使用Max Tokens的注意事项
  * 模型不会根据该参数调整内容篇幅，而是在达到指定Token数时直接截断。
  * 如果设置过小，可能导致回答不完整（如句子中断）。
  * 建议结合提示词（如“请在500字以内回答”）来确保回答完整性。

```python
response = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
    {
      "role": "user",
      "content": "四大文明古国分别有哪些"
    }
  ],
  max_tokens=100
)
print(response.choices[0].message.content)
# 输出结果
四大文明古国指的是古代埃及、美索不达米亚、印度河流域和黄河流域四个地区。它们分别是：
1. 埃及文明：位于尼罗河流域，是人类历史上最早的文明之一。埃及文明以母系社
```

### 2、Temperature参数

* Temperature的基本概念
  * 取值范围为0到2，默认值为1。
  * 控制AI回答的随机性和创造性。
* 不同Temperature值的影响
  * **低值（接近0）**：输出更确定、可预测，多次请求结果相似。
  * **高值（接近2）**：输出更具随机性和创造性，可能产生出人意料的回答，但也可能偏离逻辑或生成无意义内容。
* Temperature的工作原理
  * 改变Token的概率分布：
    * 温度低时，概率分布更集中，高概率词被优先选择。
    * 温度高时，概率分布更平坦，低概率词也有更高机会被选中。
  * 类比物理中的温度：温度越高，粒子运动越随机。

```python
response = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
    {
      "role": "user",
      "content": "四大文明古国分别有哪些"
    }
  ],
  max_tokens=100,
  temperature=2
)
print(response.choices[0].message.content)
# 输出结果
四大文明古国分别是：古代埃及文明、幼发拉底河流域文明古印度同时票角utenberg SouthωEurope Mary理streamsJapan modeling forecast TclwaDavis sidl Kenn nobern
```

### 3、Top\_p参数（Nucleus Sampling）

* Top\_p的基本概念
  * 取值范围为0到1。
  * 不改变概率分布，而是从累积概率最高的词中选择一个子集进行采样。
* Top\_p的工作方式
  * 例如，`top_p=0.4` 表示只考虑累积概率≥40%的最可能词组。
  * `top_p=1` 表示不限制，所有词都可选。
* Temperature与Top\_p的使用建议
  * 两者都能控制输出的多样性，但机制不同。
  * OpenAI官方建议：**不要同时调整这两个参数**，只修改其中一个即可。

```python
response = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
    {
      "role": "user",
      "content": "四大文明古国分别有哪些"
    }
  ],
  max_tokens=300,
  top_p=0.4
)
print(response.choices[0].message.content)
# 输出结果
四大文明古国是指古埃及、古巴比伦、古印度和古中国。
```

### 4、参数选择策略

* 何时使用低Temperature
  * 需要稳定、一致输出的任务，如问答系统、事实性回复。
* 何时使用高Temperature或Top\_p
  * 创意写作、头脑风暴、故事生成等需要多样性的场景。
* 成本与质量的平衡
  * 结合`max_tokens`和提示词设计，既能控制成本，又能获得高质量输出。

## 六、定制AI的回复？更多常用参数详解

### 1、Frequency Penalty（频率惩罚）

* Frequency Penalty的基本概念
  * 取值范围为-2到2，默认值为0。
  * 用于惩罚在已生成文本中频繁出现的词汇，降低其再次被选中的概率。
* 工作原理与效果
  * 值为正时，模型会倾向于避免重复使用高频率词，增加文本多样性。
  * 值为0时，不对重复词进行任何惩罚，模型按原始概率分布选择下一个词。
  * 值过高可能导致不自然的表达（如标点符号频繁切换）。
* 实际应用建议
  * 适用于需要丰富多变输出的场景，如创意写作、故事生成。
  * 一般建议设置在0到1之间，避免过度惩罚导致语义混乱。

frequency\_penalty为负数

```python
response = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
    {
      "role": "user",
      "content": "生成一个购物清单，包含至少20个物品，每个物品之间用逗号进行分隔，例如：苹果，香蕉，牛奶"
    }
  ],
  max_tokens=300,
  frequency_penalty=-2
)
print(response.choices[0].message.content)
# 输出结果
苹果，香蕉，牛奶，面包，鸡蛋，洗发水，牛肉，蛋糕，薯片，咖啡，牛，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，，
```

frequency\_penalty为正数

```python
response = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
    {
      "role": "user",
      "content": "生成一个购物清单，包含至少20个物品，每个物品之间用逗号进行分隔，例如：苹果，香蕉，牛奶"
    }
  ],
  max_tokens=300,
  frequency_penalty=-2
)
print(response.choices[0].message.content)
# 输出结果
苹果，香蕉，牛奶，面包，鸡蛋，咖啡豆，洗发水，
肥皂, 面巾纸, 茶叶, 巧克力, 红酒,
玉米片, 米饭, 电视机,
手表 ,手机 ,笔记本电脑 ,
运动裤 ，T恤衫
```

### 2、Presence Penalty（存在惩罚）

* Presence Penalty的基本概念
  * 取值范围同样为-2到2，默认值为0。
  * 与Frequency Penalty类似，但机制不同。
* 与Frequency Penalty的区别
  * **Frequency Penalty**：根据词的出现**频率**进行惩罚，出现越多次，惩罚越重。
  * **Presence Penalty**：只关心词是否**出现过**，一旦出现就降低其后续概率，不考虑具体次数。
* 结合使用策略
  * 提高`presence_penalty`可减少整体重复内容，鼓励引入新词。
  * 提高`frequency_penalty`可防止某些高频词反复出现。
  * 两者可结合使用以精细控制文本的多样性和连贯性。

### 3、实用工具推荐：OpenAI API Playground

> <https://platform.openai.com/playround>

API Playground的功能与优势

* 无需编码的参数实验平台
  * 提供可视化界面，支持调整模型、temperature、max\_tokens、top\_p、frequency\_penalty、presence\_penalty等所有关键参数。
  * 实时查看AI响应，快速测试不同配置的效果。
* 重要注意事项
  * 所有操作均通过API执行，**会消耗账户的Token配额**，并非免费试玩工具。
* View Code功能——开发者的福音
  * 点击右上角“View Code”按钮，可自动生成当前设置对应的API调用代码。
  * 支持直接复制代码片段，无缝集成到Python或其他编程环境中，极大提升开发效率。
