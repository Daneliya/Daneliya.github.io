---
url: /AIGC/AI应用开发/06.AI面试题/2_RAG面试题详解.md
---

# RAG 面试题详解

## 一、RAG 概述

RAG（Retrieval-Augmented Generation，检索增强生成）是当前大模型应用中最核心的技术之一，通过检索外部知识库来增强大模型的生成能力，解决幻觉问题并提高答案准确性。

### 核心知识点

| 知识点 | 说明 |
|--------|------|
| **检索（Retrieval）** | 从向量数据库中检索相关文档 |
| **增强（Augmented）** | 将检索结果作为上下文注入 Prompt |
| **生成（Generation）** | LLM 基于上下文生成答案 |

## 二、面试题列表

### 2.1 RAG 必要性评估

**面试题**：滴滴面试官："你做RAG，是真的需要，还是你根本没算过成本？"

**考察点**：如何判断业务是否真正需要RAG？如何评估RAG的投入产出比？

**详细解答**：

**判断是否需要RAG的标准**：

1. **知识更新频率**：如果知识频繁更新（如产品文档、政策法规），RAG 比微调更合适
2. **知识规模**：知识库规模大（>10万条），微调成本高，RAG 更经济
3. **准确性要求**：需要引用来源、可追溯的答案，RAG 优于纯生成
4. **成本预算**：RAG 初期投入低，按需检索，成本可控

**RAG 成本构成**：

| 成本项 | 说明 |
|--------|------|
| 向量数据库 | Milvus/Pinecone 等服务费用 |
| Embedding 模型 | 文本向量化成本 |
| 存储成本 | 文档存储和索引维护 |
| 检索成本 | 每次查询的计算资源 |
| LLM 调用成本 | 生成答案的 Token 消耗 |

**投入产出比评估**：

* 对比纯 LLM 方案：RAG 减少幻觉，提高准确率
* 对比微调方案：RAG 更新成本低，无需重新训练
* 对比人工方案：RAG 可 7x24 小时服务，边际成本低

***

### 2.2 RAG 技术选型

**面试题**：腾讯大模型二面：RAG系统做完了，向量数据库怎么选、Embedding怎么选、chunk大小怎么选？

**考察点**：RAG 技术选型三要素

**详细解答**：

#### 向量数据库选型

| 数据库 | 特点 | 适用场景 |
|--------|------|----------|
| **Milvus** | 开源、高性能、分布式 | 大规模生产环境 |
| **Pinecone** | 全托管、易用 | 快速原型、小规模 |
| **Weaviate** | 开源、支持混合检索 | 需要混合检索场景 |
| **Chroma** | 轻量级、嵌入式 | 本地开发、小项目 |
| **Qdrant** | Rust 实现、高性能 | 高性能要求场景 |

**选型考虑因素**：

* 数据规模：百万级以下可用 Chroma，亿级用 Milvus
* 部署方式：云服务 vs 自部署
* 混合检索：是否需要向量+关键词混合检索
* 成本预算：开源 vs 商业服务

#### Embedding 模型选型

| 模型 | 维度 | 特点 |
|------|------|------|
| **OpenAI text-embedding-3-large** | 3072 | 效果好、成本较高 |
| **BGE-large-zh** | 1024 | 中文效果好、开源 |
| **GTE-large** | 1024 | 通用效果好、开源 |
| **Cohere embed-v3** | 1024 | 多语言支持好 |

**选型标准**：

1. 语言支持：中文场景优先选 BGE/GTE
2. 维度大小：维度越高表达能力越强，但存储和计算成本也越高
3. 模型大小：大模型效果好但推理慢
4. 基准测试：在 MTEB 等基准上的表现

#### Chunk 大小选择

| 策略 | 优点 | 缺点 |
|------|------|------|
| **固定长度（256-512）** | 实现简单 | 可能切断语义 |
| **语义分块** | 保持语义完整性 | 实现复杂 |
| **递归分块** | 平衡简单和语义 | 需要调整参数 |
| **文档结构分块** | 保留结构信息 | 依赖文档格式 |

**推荐策略**：

* 通用场景：512 Token，重叠 50 Token
* 长文档：1024 Token，重叠 100 Token
* QA 对：按问答对分块

***

### 2.3 Embedding 模型与 Rerank

**面试题**：阿里大模型二面：Embedding模型怎么选？Rerank为什么不直接用GPT-4？

**考察点**：Embedding 模型选型标准；为何 Rerank 用轻量模型而非 GPT-4

**详细解答**：

#### Embedding 模型选型标准

1. **效果评估**：在目标任务上的检索准确率
2. **维度大小**：影响存储成本和检索速度
3. **推理速度**：影响索引构建和查询延迟
4. **开源 vs 闭源**：成本和可控性权衡

#### Rerank 不用 GPT-4 的原因

| 维度 | GPT-4 | 专用 Rerank 模型 |
|------|-------|------------------|
| **成本** | 高（$30/1M tokens） | 低（$1/1M tokens） |
| **延迟** | 高（秒级） | 低（毫秒级） |
| **专用性** | 通用能力 | 专为重排序优化 |
| **调用频率** | 不适合高频 | 适合高频调用 |

**推荐 Rerank 模型**：

* **BGE-Reranker**：开源、中文效果好
* **Cohere Rerank**：商业服务、效果稳定
* **Cross-Encoder**：基于 BERT 的交叉编码器

***

### 2.4 Chunk 策略优化

**面试题**：阿里大模型三面：RAG的chunk用固定512切分，召回率67%，面试官追问三个为什么

**考察点**：固定 chunk 策略为何召回率低？如何优化分块策略？

**详细解答**：

#### 固定 512 切分召回率低的原因

1. **语义切断**：固定长度可能在句子中间切断，破坏语义完整性
2. **上下文丢失**：相关信息被分到不同 chunk，检索时无法同时召回
3. **粒度问题**：512 可能过大（包含无关信息）或过小（丢失上下文）

#### 优化策略

**1. 语义分块**

```python
# 按段落或章节分块
chunks = split_by_paragraph(document)
# 或使用 NLP 模型检测语义边界
chunks = semantic_split(document, model)
```

**2. 递归分块**

```python
# 先按大块分，再细分
chunks = recursive_split(
    document,
    chunk_size=512,
    separators=["\n\n", "\n", "。", "，"]
)
```

**3. 重叠分块**

```python
# 添加重叠区域
chunks = split_with_overlap(
    document,
    chunk_size=512,
    overlap=50
)
```

**4. 混合策略**

* 标题+正文作为一个 chunk
* QA 对作为一个 chunk
* 表格单独作为一个 chunk

***

### 2.5 Rerank 重排序

**面试题**：京东面试官连环问："你RAG召回了20条，有15条是垃圾，Rerank怎么做的？"

**考察点**：初步检索结果质量差时，如何通过 Rerank 提升上下文质量

**详细解答**：

#### Rerank 的作用

初步向量检索（Top-K）可能存在：

* 语义相似但不相关的文档
* 相关文档排名靠后

Rerank 通过更精细的模型对候选文档重新排序，提升相关文档排名。

#### Rerank 流程

```
用户查询 → 向量检索(Top-20) → Rerank精排 → 取Top-5 → LLM生成
```

#### Rerank 模型原理

**Cross-Encoder 方式**：

* 将 query 和 document 拼接输入模型
* 模型输出相关性分数
* 比 Bi-Encoder 效果更好，但更慢

**实现示例**：

```python
from sentence_transformers import CrossEncoder

reranker = CrossEncoder('BAAI/bge-reranker-large')
scores = reranker.predict([(query, doc) for doc in candidates])
reranked = sorted(zip(candidates, scores), key=lambda x: x[1], reverse=True)
```

***

### 2.6 RAG 幻觉问题

**面试题**：京东面试官问："你的RAG系统检索结果很准，但最终答案还是有幻觉，Prompt怎么写的？"

**考察点**：检索准确但生成仍有幻觉时，如何优化 Prompt

**详细解答**：

#### 检索准确但仍有幻觉的原因

1. **Prompt 未约束**：没有明确要求基于上下文回答
2. **模型倾向**：模型倾向于使用自身知识补充
3. **上下文过长**：关键信息被稀释

#### Prompt 优化策略

**1. 明确约束指令**

```
请严格基于以下参考资料回答问题。如果参考资料中没有相关信息，请明确说明"根据已有资料无法回答"，不要编造答案。

参考资料：
{context}

问题：{query}
```

**2. 结构化提示**

```
## 回答规则
1. 仅使用参考资料中的信息
2. 引用具体来源（如"根据第3段..."）
3. 不确定时说明不确定性

## 参考资料
{context}

## 用户问题
{query}
```

**3. 添加引用要求**

```
请回答问题，并在答案中标注信息来源（如[1][2]）。

参考资料：
[1] {doc1}
[2] {doc2}

问题：{query}
```

***

### 2.7 RAG 幻觉定位

**面试题**：淘天大模型三面：RAG生成答案不准，你如何定位和解决幻觉问题？

**考察点**：RAG 幻觉的系统定位方法

**详细解答**：

#### 系统定位方法

**第一步：检查检索质量**

* 检索到的文档是否真正相关？
* 相关文档是否被召回？
* 排名是否靠前？

**第二步：检查 Prompt 设计**

* 是否明确要求基于上下文回答？
* 上下文格式是否清晰？
* 是否有干扰信息？

**第三步：检查生成模型**

* 模型是否倾向于忽略上下文？
* 温度参数是否过高？
* 模型能力是否足够？

#### 排查工具

```python
# 检索质量检查
def check_retrieval(query, retrieved_docs):
    for doc in retrieved_docs:
        print(f"Score: {doc.score}")
        print(f"Content: {doc.content[:200]}")
        print("---")

# Prompt 检查
def check_prompt(prompt):
    print("System Prompt:", prompt.system)
    print("Context Length:", len(prompt.context))
    print("Has Constraint:", "基于上下文" in prompt.system)
```

***

### 2.8 RAG 系统评估

**面试题**：蚂蚁大模型三面：RAG系统怎么评估？测试集构建、检索指标、生成指标全拆解

**考察点**：RAG 系统评估体系

**详细解答**：

#### 测试集构建

| 类型 | 说明 | 数量建议 |
|------|------|----------|
| **简单问题** | 答案直接在文档中 | 50+ |
| **复杂问题** | 需要多文档综合 | 30+ |
| **否定问题** | 文档中无答案 | 20+ |
| **边缘问题** | 边界情况测试 | 20+ |

#### 检索指标

| 指标 | 公式 | 说明 |
|------|------|------|
| **Recall@K** | 前K个结果中包含正确文档的比例 | 衡量召回能力 |
| **Precision@K** | 前K个结果中相关文档的比例 | 衡量精确度 |
| **NDCG@K** | 考虑排名位置的评分 | 衡量排序质量 |
| **MRR** | 第一个正确结果的倒数排名 | 衡量首条准确性 |

#### 生成指标

| 指标 | 说明 | 评估方式 |
|------|------|----------|
| **Faithfulness** | 答案是否基于上下文 | LLM 评估 |
| **Relevance** | 答案是否回答了问题 | LLM 评估 |
| **Completeness** | 答案是否完整 | 人工评估 |
| **Correctness** | 答案是否正确 | 人工评估 |

#### 评估框架

* **RAGAS**：自动化 RAG 评估框架
* **TruLens**：提供可视化评估
* **LangSmith**：LangChain 官方评估工具

***

### 2.9 RAG 性能优化

**面试题**：京东大模型二面：你的RAG系统首字响应要5秒，怎么优化？

**考察点**：RAG 系统延迟优化策略

**详细解答**：

#### 各环节优化策略

| 环节 | 优化方法 | 预期收益 |
|------|----------|----------|
| **检索加速** | HNSW 参数调优、结果缓存、并行检索 | 50-80% |
| **Rerank 加速** | 轻量模型、减少候选数 | 30-50% |
| **生成加速** | 流式输出、投机解码 | 20-40% |
| **架构优化** | 异步流水线、预取 | 30-60% |

#### 具体优化措施

**1. 检索层优化**

```python
# HNSW 参数调优
index = faiss.IndexHNSWFlat(dim, M=32, efConstruction=200)
index.hnsw.efSearch = 100  # 搜索时的精度参数

# 结果缓存
from functools import lru_cache

@lru_cache(maxsize=1000)
def cached_search(query_embedding):
    return vector_db.search(query_embedding)
```

**2. 异步流水线**

```python
import asyncio

async def rag_pipeline(query):
    # 并行执行检索和 Rerank 模型加载
    retrieval_task = asyncio.create_task(retrieve(query))
    rerank_task = asyncio.create_task(load_reranker())
    
    candidates = await retrieval_task
    reranker = await rerank_task
    
    # Rerank
    results = reranker.rerank(query, candidates)
    return results
```

**3. 流式输出**

```python
async def stream_generate(context, query):
    async for chunk in llm.stream(context, query):
        yield chunk
```

***

### 2.10 复杂文档解析

**面试题**：字节大模型二面：PDF表格解析准确率只有32%，你们的RAG系统怎么保证答案质量？

**考察点**：复杂格式文档解析准确率低时，如何保证 RAG 输出质量

**详细解答**：

#### 解析策略

**1. 版面分析**

```python
# 使用版面检测模型
from layout_detector import LayoutDetector

detector = LayoutDetector()
layout = detector.detect(pdf_page)

# 分区域处理
for region in layout:
    if region.type == "table":
        process_table(region)
    elif region.type == "text":
        process_text(region)
    elif region.type == "image":
        process_image(region)
```

**2. 表格专用处理**

```python
# 表格结构提取
from table_extractor import TableExtractor

extractor = TableExtractor()
table_data = extractor.extract(table_image)
# 保留行列关系
structured = extractor.to_structured(table_data)
```

**3. 多模态理解**

```python
# 使用多模态模型理解图片
from multimodal import VisionLLM

model = VisionLLM()
image_desc = model.understand(image)
```

#### 质量保证措施

1. **多路解析**：同一文档用多种工具解析，取最优结果
2. **人工校验**：关键文档人工抽样校验
3. **元数据标注**：标注解析置信度，低置信度文档单独处理

***

### 2.11 混合格式文档解析

**面试题**：阿里大模型二面：PDF、表格、图片混排文档，你的RAG系统是怎么解析的？

**考察点**：混合格式文档的 RAG 解析流程

**详细解答**：

#### 解析流程

```
PDF文档 → 版面分析 → 分区域提取 → 统一索引 → RAG检索
    ↓
┌─────────┬─────────┬─────────┐
│  文本区  │  表格区  │  图片区  │
└─────────┴─────────┴─────────┘
    ↓         ↓         ↓
  段落分块   结构化    OCR/描述
    ↓         ↓         ↓
  Embedding  元数据    向量化
    ↓         ↓         ↓
┌─────────────────────────────┐
│        统一向量数据库         │
└─────────────────────────────┘
```

#### 处理策略

**文本区域**：

* 按段落或语义分块
* 保留标题层级信息
* 标准 Embedding 处理

**表格区域**：

* 专用 OCR 提取结构
* 保留行列关系
* 转换为结构化描述

**图片区域**：

* 多模态模型生成描述
* OCR 提取文字内容
* 图片单独索引

#### 元数据保留

```python
metadata = {
    "page": 5,
    "section": "第三章",
    "type": "table",
    "confidence": 0.85,
    "source": "report.pdf"
}
```

***

### 2.12 RAG 检索与生成脱节

**面试题**：京东面试官："检索到了正确的文档，大模型还是在胡说"

**考察点**：RAG 生成阶段核心问题

**详细解答**：

#### 问题原因

1. **上下文注入方式不当**：关键信息被放在不显眼位置
2. **信息过载**：过多上下文导致关键信息被稀释
3. **模型偏好**：模型倾向于使用预训练知识而非上下文

#### 解决方案

**1. 优化上下文排序**

```python
# 将最相关的内容放在最前面
sorted_docs = sorted(docs, key=lambda x: x.score, reverse=True)
context = "\n\n".join([doc.content for doc in sorted_docs[:5]])
```

**2. 精简上下文**

```python
# 只保留最相关的部分
relevant_chunks = extract_relevant_chunks(query, docs, max_tokens=2000)
```

**3. 强化 Prompt 约束**

```
重要提示：请仅基于以下参考资料回答，不要使用任何其他知识。
如果参考资料不足以回答问题，请明确说明。

参考资料：
{context}
```

***

### 2.13 RAG 方法论

**面试题**：面试官问：为什么你的RAG能做得比别人好？

**考察点**：方法论总结

**详细解答**：

#### 回答框架

**1. 讲思考而非背答案**

* 解释你为什么选择这个方案
* 分析过哪些替代方案
* 权衡过哪些利弊

**2. 解释取舍而非列概念**

* chunk 大小的选择依据
* 向量数据库的选型理由
* Rerank 策略的优化过程

**3. 讲落地逻辑而非堆理论**

* 实际遇到的问题
* 如何定位和解决
* 最终效果如何

#### 示例回答

> "我在做 RAG 系统时，首先分析了业务场景：知识库有 10 万条文档，更新频率是每天，用户需要准确的答案并能追溯来源。
>
> 基于这个分析，我选择了 RAG 而非微调，因为：
>
> 1. 知识更新频繁，微调成本太高
> 2. 需要引用来源，RAG 天然支持
> 3. 初期投入低，可以快速验证
>
> 在技术选型上，我对比了 Milvus 和 Pinecone，最终选择 Milvus 因为：
>
> 1. 开源可控，不依赖第三方
> 2. 支持分布式，可扩展性好
> 3. 社区活跃，问题容易解决
>
> 在优化过程中，我发现固定 512 分块召回率只有 67%，通过：
>
> 1. 改用语义分块，召回率提升到 82%
> 2. 添加 Rerank，准确率提升 15%
> 3. 优化 Prompt，幻觉率降低 40%
>
> 最终系统准确率达到 92%，首字响应 2 秒内。"

## 三、参考资料

\[1] 吴师兄学大模型公众号：微信公众号「吴师兄学大模型」

\[2] 吴师兄大模型面试题网站：https://www.wushixiongai.com/

\[3] 知乎专栏：https://www.zhihu.com/column/c\_1039097450233057280
