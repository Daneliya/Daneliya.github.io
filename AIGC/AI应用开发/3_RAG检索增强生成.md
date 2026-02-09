---
url: /AIGC/AI应用开发/3_RAG检索增强生成.md
---

# RAG 检索增强生成

## 一、前言

首先 AI 原本就拥有一些通用的知识，对于不会的知识，还可以利用互联网搜索。但是这些都是从网络获取的、公开的知识。对于企业来说，数据是命脉，也是自己独特的价值，随着业务的发展，企业肯定会积累一波自己的知识库，如果让 AI 能够利用这些知识库进行问答，效果可能会更好，而且更加个性化。

如果不给 AI 提供特的知识库，AI 可能会面临这些问题：

1. 知识有限：AI 不知道你的最新课程和内容
2. 编故事：当 AI 不知道答案时，它可能会 “自圆其说” 编造内容
3. 无法个性化：不了解你的特色服务和回答风格
4. 不会推销：不知道该在什么时候推荐你的付费课程和服务

那么如何让 AI 利用自己的知识库进行问答呢？这就需要用到 AI 主流的技术 —— RAG。

## 二、RAG 概念

### 什么是 RAG？

RAG（Retrieval-Augmented Generation，检索增强生成）是一种结合信息检索技术和 AI 内容生成的混合架构，可以解决大模型的知识时效性限制和幻觉问题。

简单来说，RAG 就像给 AI 配了一个 “小抄本”，让 AI 回答问题前先查一查特定的知识库来获取知识，确保回答是基于真实资料而不是凭空想象。

从技术角度看，RAG 在大语言模型生成回答之前，会先从外部知识库中检索相关信息，然后将这些检索到的内容作为额外上下文提供给模型，引导其生成更准确、更相关的回答。

通过 RAG 技术改造后，AI 就能：

* 准确回答关于特定内容的问题
* 在合适的时机推荐相关课程和服务
* 用特定的语气和用户交流
* 提供更新、更准确的建议

可以简单了解下 RAG 和传统 AI 模型的区别：

| 特性       | 传统大语言模型         | RAG增强模型              |
| ---------- | ---------------------- | ------------------------ |
| 知识时效性 | 受训练数据截止日期限制 | 可接入最新知识库         |
| 领域专业性 | 泛化知识，专业深度有限 | 可接入专业领域知识       |
| 响应准确性 | 可能产生 “幻觉”        | 基于检索的事实依据       |
| 可控性     | 依赖原始训练           | 可通过知识库定制输出     |
| 资源消耗   | 较高（需要大模型参数） | 模型可更小，结合外部知识 |

![RAG](/assets/RAG.8fpanJBh.gif)

### RAG 工作流程

RAG 技术实现主要包含以下 4 个核心步骤：

* 文档收集和切割
* 向量转换和存储
* 文档过滤和检索
* 查询增强和关联

#### 1、文档收集和切割

文档收集：从各种来源（网页、PDF、数据库等）收集原始文档

文档预处理：清洗、标准化文本格式

文档切割：将长文档分割成适当大小的片段（俗称 chunks）

* 基于固定大小（如 512 个 token）
* 基于语义边界（如段落、章节）
* 基于递归分割策略（如递归字符 n-gram 切割）

![img](/assets/mY1SjfXTshOxqMLt.ByE1RoKf.webp)

#### 2、向量转换和存储

向量转换：使用 Embedding 模型将文本块转换为高维向量表示，可以捕获到文本的语义特征                                

向量存储：将生成的向量和对应文本存入向量数据库，支持高效的相似性搜索cLGytfopnrFuxnn3sz+3dYGbZsmkbigItBfA6ZV7hZU=

![img](/assets/eYpl07AKdNneRjuL.DUVgP4OE.webp)

#### 3、文档过滤和检索

查询处理：将用户问题也转换为向量表示

过滤机制：基于元数据、关键词或自定义规则进行过滤

相似度搜索：在向量数据库中查找与问题向量最相似的文档块，常用的相似度搜索算法有余弦相似度、欧氏距离等

上下文组装：将检索到的多个文档块组装成连贯上下文

![img](/assets/bagqTEknnhZSss0F.C9hFGIbj.webp)

#### 4、查询增强和关联

提示词组装：将检索到的相关文档与用户问题组合成增强提示                                nqebE0GbQps0Ats4MKJjbVHQiAAW+ffJdMrCsN5dgzs=

上下文融合：大模型基于增强提示生成回答

源引用：在回答中添加信息来源引用

后处理：格式化、摘要或其他处理以优化最终输出

![img](/assets/tsQzX65NIpj7bMQb.Mzz1BIux.webp)

#### 完整工作流程

分别理解上述 4 个步骤后，我们可以将它们组合起来，形成完整的 RAG 检索增强生成工作流程：

![img](/assets/oIbFEJ2kIr2ws57u.B352AEC1.webp)

上述工作流程中涉及了很多技术名词，让我们分别进行解释。

### RAG 相关技术

#### Embedding 和 Embedding 模型

Embedding 嵌入是将高维离散数据（如文字、图片）转换为低维连续向量的过程。这些向量能在数学空间中表示原始数据的语义特征，使计算机能够理解数据间的相似性。

Embedding 模型是执行这种转换算法的[机器学习](https://www.mianshiya.com/bank/1821834636175642625)模型，如 Word2Vec（文本）、ResNet（图像）等。不同的 Embedding 模型产生的向量表示和维度数不同，一般维度越高表达能力更强，可以捕获更丰富的语义信息和更细微的差别，但同样占用更多存储空间

举个例子，“鱼皮” 和 “鱼肉” 的 Embedding 向量在空间中较接近，而 “鱼皮” 和 “帅哥” 则相距较远，反映了语义关系。

![img](/assets/xTxeR971ObxC5qKk.B_TrLF4W.webp)

#### 向量数据库

向量数据库是专门存储和检索向量数据的数据库系统。通过高效索引算法实现快速相似性搜索，支持 K 近邻查询等操作。

![img](/assets/vDsq55DUDXuyi9Qc.tptM6WyG.webp)

注意，并不是只有向量数据库才能存储向量数据，只不过与传统数据库不同，向量数据库优化了高维向量的存储和检索。

AI 的流行带火了一波向量数据库和向量存储，比如 Milvus、Pinecone 等。此外，一些传统数据库也可以通过安装插件实现向量存储和检索，比如 PGVector、[Redis](https://www.mianshiya.com/bank/1791375592078610434) Stack 的 RediSearch 等。

用一张图来了解向量数据库的分类：

![img](/assets/2JeMTLWlu581TasX.DZK_S8dx.webp)

#### 召回

召回是信息检索中的第一阶段，目标是从大规模数据集中快速筛选出可能相关的候选项子集。**强调速度和广度，而非精确度。**

举个例子，我们要从搜索引擎查询 “编程导航-程序员一站式编程学习交流社区” 时，召回阶段会从数十亿网页中快速筛选出数千个含有 “编程”、“导航”、“程序员” 等相关内容的页面，为后续粗略排序和精细排序提供候选集。

#### 精排和 Rank 模型

精排（精确排序）是搜索 / 推荐系统的最后阶段，使用计算复杂度更高的算法，考虑更多特征和业务规则，对少量候选项进行更复杂、精细的排序。

比如，短视频推荐先通过召回获取数万个可能相关视频，再通过粗排缩减至数百条，最后精排阶段会考虑用户最近的互动、视频热度、内容多样性等复杂因素，确定最终展示的 10 个视频及顺序。

![img](/assets/3mqXRgFV7fgWnXrR.D0-uWQ0V.webp)

Rank 模型（排序模型）负责对召回阶段筛选出的候选集进行精确排序，考虑多种特征评估相关性。

现代 Rank 模型通常基于[深度学习](https://www.mianshiya.com/bank/1821834656568348674)，如 BERT、LambdaMART 等，综合考虑查询与候选项的相关性、用户历史行为等因素。举个例子，电商推荐系统会根据商品特征、用户偏好、点击率等给每个候选商品打分并排序。

![img](/assets/nawyImkjvI2SSgBV.u8SXVzxY.webp)

#### 混合检索策略

混合检索策略结合多种检索方法的优势，提高搜索效果。常见组合包括关键词检索、语义检索、知识图谱等。

比如在 AI 大模型开发平台 Dify 中，就为用户提供了 “基于全文检索的关键词搜索 + 基于向量检索的语义检索” 的混合检索策略，用户还可以自己设置不同检索方式的权重。

![img](/assets/II5SKLmq3PBVUBzJ.gCxASXbq.webp)

💡 RAG 的工作流程和相关技术是面试时的重点，更多细节大家可以在 [面试鸭最新的 AI 大模型题库](https://www.mianshiya.com/bank/1906189461556076546) 中学习：

![img](/assets/NCXVG8ioWsdV1QOf.Bs7d9or5.webp)

了解了 RAG 概念后，我们来学习如何利用编程开发实现 RAG。想要在程序中让 AI 使用知识库，首先建议利用一个 AI 开发框架，比如 Spring AI；然后可以通过 2 种模式进行开发 —— 基于本地知识库或云知识库服务实现 RAG。下面分别讲解这 2 种模式。

## 三、RAG 实战：Spring AI + 本地知识库

Spring AI 框架为我们实现 RAG 提供了全流程的支持，参考 [Spring AI](https://docs.spring.io/spring-ai/reference/api/retrieval-augmented-generation.html) 和 [Spring AI Alibaba](https://java2ai.com/docs/1.0.0-M6.1/tutorials/rag/) 的官方文档。

由于是第一个 RAG 程序，我们参考标准的 RAG 开发步骤并进行一定的简化，来实现基于本地知识库的 AI 恋爱知识问答应用。

标准的 RAG 开发步骤：

1. 文档收集和切割
2. 向量转换和存储
3. 切片过滤和检索
4. 查询增强和关联

简化后的 RAG 开发步骤：                                

1. 文档准备
2. 文档读取
3. 向量转换和存储
4. 查询增强

### 1、文档准备

首先准备用于给 AI 知识库提供知识的文档，推荐 Markdown 格式，尽量结构化。

💡 大家在学习 RAG 的过程中，可以利用 AI 来生成文档，提供一段示例 Prompt：

```markdown
帮我生成 3 篇 Markdown 文章，主题是【恋爱常见问题和回答】，3 篇文章的问题分别针对单身、恋爱、已婚的状态，内容形式为 1 问 1 答，每个问题标题使用 4 级标题，每篇内容需要有至少 5 个问题，要求每个问题中推荐一个相关的课程，课程链接都是 https://luckilyxxl.top
```

生成 3 篇《恋爱常见问题和回答》文档，保存到资源目录下即可：

* 📎恋爱常见问题和回答 - 单身篇
* 📎恋爱常见问题和回答 - 已婚篇
* 📎恋爱常见问题和回答 - 恋爱篇

![img](/assets/EA2rRRx4W8BJ6UDW.CAXz85WV.webp)

### 2、文档读取

首先，我们要对自己准备好的知识库文档进行处理，然后保存到向量数据库中。这个过程俗称 ETL（抽取、转换、加载），Spring AI 提供了对 ETL 的支持，参考 [官方文档](https://docs.spring.io/spring-ai/reference/api/etl-pipeline.html#_markdown)。

ETL 的 3 大核心组件，按照顺序执行：

* DocumentReader：读取文档，得到文档列表
* DocumentTransformer：转换文档，得到处理后的文档列表
* DocumentWriter：将文档列表保存到存储中（可以是向量数据库，也可以是其他存储）

![img](/assets/dyTCTOQSoVRoLRS7.DD8fD2ko.webp)

刚开始学习 RAG，我们不需要关注太多 ETL 的细节、也不用对文档进行特殊处理，下面我们就先用 Spring AI 读取准备好的 Markdown 文档，为写入到向量数据库做准备。

1）引入依赖

Spring AI 提供了很多种 DocumentReaders，用于加载不同类型的文件。

![img](/assets/vtIP781rWXGQcBIo.GI2w8I4R.webp)

我们可以使用 [MarkdownDocumentReader](https://docs.spring.io/spring-ai/reference/api/etl-pipeline.html#_markdown) 来读取 Markdown 文档。需要先引入依赖，可以在 [Maven 中央仓库](https://mvnrepository.com/artifact/org.springframework.ai/spring-ai-markdown-document-reader) 找到（官方都没有提）。

```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-markdown-document-reader</artifactId>
    <version>1.0.0-M6</version>
</dependency>
```

2）在根目录下新建 `rag` 包，编写文档加载器类 LoveAppDocumentLoader，负责读取所有 Markdown 文档并转换为 Document 列表。代码如下：

```java
@Component
@Slf4j
class LoveAppDocumentLoader {

    private final ResourcePatternResolver resourcePatternResolver;

    LoveAppDocumentLoader(ResourcePatternResolver resourcePatternResolver) {
        this.resourcePatternResolver = resourcePatternResolver;
    }

    public List<Document> loadMarkdowns() {
        List<Document> allDocuments = new ArrayList<>();
        try {
            // 这里可以修改为你要加载的多个 Markdown 文件的路径模式
            Resource[] resources = resourcePatternResolver.getResources("classpath:document/*.md");
            for (Resource resource : resources) {
                String fileName = resource.getFilename();
                MarkdownDocumentReaderConfig config = MarkdownDocumentReaderConfig.builder()
                        .withHorizontalRuleCreateDocument(true)
                        .withIncludeCodeBlock(false)
                        .withIncludeBlockquote(false)
                        .withAdditionalMetadata("filename", fileName)
                        .build();
                MarkdownDocumentReader reader = new MarkdownDocumentReader(resource, config);
                allDocuments.addAll(reader.get());
            }
        } catch (IOException e) {
            log.error("Markdown 文档加载失败", e);
        }
        return allDocuments;
    }
}
```

上述代码中，我们通过 MarkdownDocumentReaderConfig 文档加载配置来指定读取文档的细节，比如是否读取代码块、引用块等。特别需要注意的是，我们还指定了额外的元信息配置，提取文档的文件名（fileName）作为文档的元信息，可以便于后续知识库实现更精确的检索。

![img](/assets/BkSPXZ2Sw3TkHU3U.CRe9uWEP.webp)

### 3、向量转换和存储

为了实现方便，我们先使用 Spring AI 内置的、基于内存读写的向量数据库 SimpleVectorStore 来保存文档。

SimpleVectorStore 实现了 VectorStore 接口，而 VectorStore 接口集成了 DocumentWriter，所以具备文档写入能力。如图：

![img](/assets/FDlr0Q8zRudaheMR.CmtpTVOJ.webp)

简单了解下源码，在将文档写入到数据库前，会先调用 Embedding 大模型将文档转换为向量，实际保存到数据库中的是向量类型的数据。

![img](/assets/CV5pFfJtjDfjfaOx.0m4zWEVo.webp)

在 `rag` 包下新建 LoveAppVectorStoreConfig 类，实现初始化向量数据库并且保存文档的方法。代码如下：

```java
@Configuration
public class LoveAppVectorStoreConfig {

    @Resource
    private LoveAppDocumentLoader loveAppDocumentLoader;
    
    @Bean
    VectorStore loveAppVectorStore(EmbeddingModel dashscopeEmbeddingModel) {
        SimpleVectorStore simpleVectorStore = SimpleVectorStore.builder(dashscopeEmbeddingModel)
                .build();
        // 加载文档
        List<Document> documents = loveAppDocumentLoader.loadMarkdowns();
        simpleVectorStore.add(documents);
        return simpleVectorStore;
    }
}
```

### 4、查询增强

Spring AI 通过 Advisor 特性提供了开箱即用的 RAG 功能。主要是 QuestionAnswerAdvisor 问答拦截器和 RetrievalAugmentationAdvisor 检索增强拦截器，前者更简单易用、后者更灵活强大。

查询增强的原理其实很简单。向量数据库存储着 AI 模型本身不知道的数据，当用户问题发送给 AI 模型时，QuestionAnswerAdvisor 会查询向量数据库，获取与用户问题相关的文档。然后从向量数据库返回的响应会被附加到用户文本中，为 AI 模型提供上下文，帮助其生成回答。

查看 QuestionAnswerAdvisor 源码，可以看到让 AI 基于知识库进行问答的 Prompt：

![img](/assets/ISWkkmfXWn81zjvv.DImjnPle.webp)

根据 [官方文档](https://docs.spring.io/spring-ai/reference/api/retrieval-augmented-generation.html)，需要先引入依赖（但鱼皮操作过程中发现，不引入也可以正常使用）：

```xml
<dependency>
   <groupId>org.springframework.ai</groupId>
   <artifactId>spring-ai-advisors-vector-store</artifactId>
</dependency>
```

此处我们就选用更简单易用的 QuestionAnswerAdvisor 问答拦截器，在 `LoveApp` 中新增和 RAG 知识库进行对话的方法。代码如下：

```java
@Resource
private VectorStore loveAppVectorStore;

public String doChatWithRag(String message, String chatId) {
    ChatResponse chatResponse = chatClient
            .prompt()
            .user(message)
            .advisors(spec -> spec.param(CHAT_MEMORY_CONVERSATION_ID_KEY, chatId)
                    .param(CHAT_MEMORY_RETRIEVE_SIZE_KEY, 10))
            // 开启日志，便于观察效果
            .advisors(new MyLoggerAdvisor())
            // 应用知识库问答
            .advisors(new QuestionAnswerAdvisor(loveAppVectorStore))
            .call()
            .chatResponse();
    String content = chatResponse.getResult().getOutput().getText();
    log.info("content: {}", content);
    return content;
}
```

### 测试

编写单元测试代码，故意提问一个文档内有回答的问题：

```java
@Test
void doChatWithRag() {
    String chatId = UUID.randomUUID().toString();
    String message = "我已经结婚了，但是婚后关系不太亲密，怎么办？";
    String answer =  loveApp.doChatWithRag(message, chatId);
    Assertions.assertNotNull(answer);
}
```

运行程序，通过 Debug 发现，加载的文档被自动按照小标题拆分，并且补充了 metadata 元信息：

![img](/assets/yNRlEZQLfVDsW8sl.BkL4UUdr.webp)

查看请求，发现根据用户的问题检索到了 4 个文档切片，每个切片有对应的分数和元信息：

![img](/assets/qUFJmwV2GmMBpV0u.C858RfWF.webp)

![img](/assets/rNeajWpyABQRhWm9.6Vokpssu.webp)

查看请求，发现用户的提示词被修改了，让 AI 检索知识库：                                

![img](/assets/vCtrbIAwGwah17eq.BSDPXq31.webp)

查看响应结果，AI 的回复成功包含了知识库里的内容：

![img](/assets/JyMef0WvrrfUAbuj.Vei84dWa.webp)
