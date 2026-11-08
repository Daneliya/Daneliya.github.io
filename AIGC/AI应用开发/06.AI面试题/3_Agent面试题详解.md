---
url: /AIGC/AI应用开发/06.AI面试题/3_Agent面试题详解.md
---

# Agent 面试题详解

## 一、Agent 概述

Agent（智能体）是当前大模型应用的重要方向，通过赋予 LLM 规划、记忆、工具使用等能力，使其能够自主完成复杂任务。

### 核心公式

```
Agent = LLM + 规划(Planning) + 记忆(Memory) + 工具使用(Tool Use) + 行动(Action)
```

## 二、面试题列表

### 2.1 LLM vs Agent

**面试题**：阿里一面：LLM和Agent有什么区别？Agent到底多了什么？

**考察点**：LLM vs Agent 的本质区别

**详细解答**：

| 维度 | LLM | Agent |
|------|-----|-------|
| **核心能力** | 文本生成 | 自主决策+执行 |
| **记忆** | 仅上下文窗口 | 短期+长期记忆系统 |
| **工具使用** | 无 | 可调用 API/数据库/搜索等外部工具 |
| **规划** | 无 | 可分解任务，制定多步计划 |
| **交互** | 被动响应 | 主动执行、多轮交互 |

**Agent 的核心能力**：

1. **规划（Planning）**
   * 任务分解：将复杂任务拆分为子任务
   * 制定计划：确定执行顺序和依赖关系
   * 动态调整：根据执行结果调整计划

2. **记忆（Memory）**
   * 短期记忆：当前对话上下文
   * 长期记忆：历史对话、用户偏好、知识库
   * 工作记忆：中间计算结果

3. **工具使用（Tool Use）**
   * API 调用：搜索引擎、数据库、第三方服务
   * 代码执行：Python、JavaScript 等
   * 文件操作：读写文件、处理文档

4. **行动（Action）**
   * 执行具体操作
   * 获取执行结果
   * 反馈给 LLM 进行下一步决策

***

### 2.2 Agent 工具调用 vs 普通函数调用

**面试题**：美团二面：Agent的工具调用和普通函数调用有什么区别？

**考察点**：Agent 工具调用与传统函数调用的本质差异

**详细解答**：

| 维度 | 普通函数调用 | Agent 工具调用 |
|------|--------------|----------------|
| **调用方式** | 代码显式调用 | LLM 自主决策何时调用 |
| **参数生成** | 程序员硬编码 | LLM 根据上下文动态生成 |
| **结果处理** | 固定逻辑 | LLM 解析结果并决定下一步 |
| **灵活性** | 固定流程 | 动态适应不同场景 |

**核心差异**：Agent 的工具调用是**语义驱动**而非**代码驱动**。

**示例对比**：

```python
# 普通函数调用
def search_web(query):
    results = search_engine.search(query)
    return results

# 调用
results = search_web("今天的天气")
```

```python
# Agent 工具调用
tools = [
    {
        "name": "search_web",
        "description": "搜索互联网获取信息",
        "parameters": {
            "query": {"type": "string", "description": "搜索关键词"}
        }
    }
]

# LLM 自主决策
response = llm.chat(
    messages=[{"role": "user", "content": "今天的天气怎么样？"}],
    tools=tools
)

# LLM 决定调用哪个工具、传什么参数
if response.tool_calls:
    tool_call = response.tool_calls[0]
    result = execute_tool(tool_call.name, tool_call.arguments)
```

**Agent 工具调用流程**：

1. 用户提出问题
2. LLM 理解意图，决定需要调用工具
3. LLM 生成工具调用参数
4. 执行工具调用
5. LLM 解析工具返回结果
6. LLM 决定是否需要继续调用其他工具
7. 最终生成答案

***

### 2.3 ReAct 框架

**面试题**：字节一面：说说ReAct框架，Thought-Action-Observation各是什么？

**考察点**：ReAct 框架的三组件详解

**详细解答**：

ReAct = Reasoning + Acting，三个核心组件循环：

```
Thought → Action → Observation → Thought → Action → Observation → ...
```

| 组件 | 含义 | 作用 |
|------|------|------|
| **Thought（思考）** | LLM 分析当前状态，决定下一步做什么 | 推理与规划 |
| **Action（行动）** | 执行具体操作（调用工具/API/搜索） | 与环境交互 |
| **Observation（观察）** | 获取行动结果作为反馈 | 更新状态，指导下一步 |

**示例流程**：

```
用户：帮我查一下北京今天的天气，然后推荐一个适合的活动

Thought 1: 用户想知道北京今天的天气，我需要先查询天气信息
Action 1: search_web("北京今天天气")
Observation 1: 北京今天晴，气温 25-32°C，空气质量良好

Thought 2: 天气很好，适合户外活动，我需要推荐一个适合的活动
Action 2: search_web("北京户外活动推荐")
Observation 2: 推荐去颐和园、故宫、长城等景点

Thought 3: 我已经获取了足够信息，可以给用户一个完整的回答
Answer: 北京今天天气晴朗，气温 25-32°C，空气质量良好，非常适合户外活动。推荐您去颐和园或故宫游览。
```

**与传统 LLM 的区别**：

* 传统 LLM：一次性生成答案
* ReAct Agent：通过"思考→行动→观察"循环，逐步推理并利用外部工具完成任务

**ReAct 的优势**：

1. **可解释性**：Thought 过程清晰可见
2. **可靠性**：通过观察验证行动结果
3. **灵活性**：可根据中间结果动态调整

***

### 2.4 Agent 长期记忆

**面试题**：面试官追问："你的Agent说有长期记忆，用户上周问的问题这周还记得，这个记忆存在哪？怎么检索？"

**考察点**：Agent 长期记忆的存储方案与检索策略

**详细解答**：

#### 存储方案

**1. 向量数据库存储**

```python
# 存储对话历史
from pymilvus import Collection

def store_memory(user_id, conversation):
    # 将对话向量化
    embedding = embed(conversation)
    # 存储到向量数据库
    collection.insert({
        "user_id": user_id,
        "embedding": embedding,
        "content": conversation,
        "timestamp": datetime.now()
    })
```

**2. 知识图谱存储**

```python
# 存储结构化关系
from neo4j import GraphDatabase

def store_knowledge(user_id, entity, relation, value):
    driver.session().run(
        "MERGE (u:User {id: $user_id}) "
        "MERGE (e:Entity {name: $entity}) "
        "MERGE (u)-[:{relation}]->(e)",
        user_id=user_id, entity=entity, relation=relation
    )
```

**3. 用户画像存储**

```python
# 存储用户偏好
user_profile = {
    "user_id": "123",
    "preferences": {
        "programming_language": "Python",
        "framework": "FastAPI",
        "coding_style": "clean code"
    },
    "history_topics": ["RAG", "Agent", "微调"]
}
```

#### 检索策略

**1. 相似度检索**

```python
def retrieve_memory(user_id, query, top_k=5):
    query_embedding = embed(query)
    results = collection.search(
        data=[query_embedding],
        anns_field="embedding",
        param={"metric_type": "COSINE", "params": {"nprobe": 10}},
        limit=top_k,
        expr=f"user_id == '{user_id}'"
    )
    return results
```

**2. 时间衰减**

```python
def time_weighted_score(similarity, timestamp, decay_rate=0.1):
    days_ago = (datetime.now() - timestamp).days
    weight = math.exp(-decay_rate * days_ago)
    return similarity * weight
```

**3. 混合检索**

```python
def hybrid_retrieve(user_id, query):
    # 语义检索
    semantic_results = semantic_search(user_id, query)
    # 关键词检索
    keyword_results = keyword_search(user_id, query)
    # 融合排序
    return merge_results(semantic_results, keyword_results)
```

***

### 2.5 AI 编程助手的长期记忆

**面试题**：鹅厂面试官皱眉："你用Claude Code这么久，它怎么记住你偏好的？"

**考察点**：AI 编程助手的长期记忆机制

**详细解答**：

#### 记忆存储方式

**1. 配置文件**

```markdown
# CLAUDE.md
## 我的偏好
- 使用 TypeScript 而非 JavaScript
- 偏好函数式编程风格
- 使用 Prettier 格式化代码
- 测试框架使用 Jest

## 项目信息
- 项目名称：my-project
- 技术栈：React + TypeScript + FastAPI
- 数据库：PostgreSQL
```

**2. 对话历史**

* 存储在本地数据库
* 可按项目或时间检索
* 支持搜索和过滤

**3. 上下文工程**

```python
# 构建包含记忆的 Prompt
def build_prompt(user_message, memory):
    system_prompt = f"""
    用户偏好：{memory.preferences}
    项目信息：{memory.project_info}
    历史对话摘要：{memory.conversation_summary}
    """
    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message}
    ]
```

#### 记忆检索机制

**1. 相似度检索**

* 将当前对话向量化
* 检索相似的历史对话
* 注入到上下文中

**2. 关键词匹配**

* 提取关键实体（函数名、类名、文件名）
* 检索相关的代码片段和对话

**3. 时间优先**

* 优先检索最近的对话
* 考虑时间衰减因素

## 三、参考资料

\[1] 吴师兄学大模型公众号：微信公众号「吴师兄学大模型」

\[2] 吴师兄大模型面试题网站：https://www.wushixiongai.com/

\[3] 知乎专栏：https://www.zhihu.com/column/c\_1039097450233057280
