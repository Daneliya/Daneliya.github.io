---
url: /AIGC/AI应用开发/02.LangGraph4j/10_检索增强生成（RAG）.md
---
# 10\_检索增强生成（RAG）

检索增强生成（Retrieva‍‍l-‍‍‍Augmented Generation，RAG）是当‌‌前最实用的 AI ‌‌‌应用模式之一。它通过结合外部知识库的检索‍‍能力和大语言模型的生成能力，解决‍‍‍了传统 LLM 知识更新滞‍‍后、无法获取实时信息等问题。在日常项目中，RA‍‍‍G 技术被广‍‍泛应用于构建智能问答系统、技术文档助手等场景        ‍‍‍                        

## 10.1 RAG 基本原理

RAG 系统的核心思想是‍‍‍‍‍在生成回答之前，先从外部知识库中检索相关信息，然‌‌‌‌‌后将检索到的内容作为上下文提供给大语言模型进行答案‍‍‍‍‍生成。这种方式既保持了 LLM 的生成能力，又‍‍‍‍‍确保了答案的准确性和时效性           ‍‍‍‍‍                     

### RAG 系统架构

一个典型的 RAG ‍系统‍包含三‍‍个核‍心组件：文档处理器、向量‌检索器和答案生成‌器。文档处理器负责将‌‌原‍始文档转换为‌可检索的向量表示‍，向量检索‍器根据用户查询找到最相‍‍关的文档片段，答‍‍案生成器‍基于检索结果生成最终回答        ‍‍  ‍                 ‍              ‍‍                          ‍                             

我们先进行导入对应依赖：

```xml
▼xml复制代码 

        <dependency>
            <groupId>dev.langchain4j</groupId>
            <artifactId>langchain4j-community-dashscope-spring-boot-starter</artifactId>
            <version>1.1.0-beta7</version>
        </dependency>

        <dependency>
            <groupId>dev.langchain4j</groupId>
            <artifactId>langchain4j-easy-rag</artifactId>
            <version>1.1.0-beta7</version>
        </dependency>
        <dependency>
            <groupId>dev.langchain4j</groupId>
            <artifactId>langchain4j-document-parser-apache-pdfbox</artifactId>
            <version>1.1.0-beta7</version>
        </dependency>
        <dependency>
            <groupId>dev.langchain4j</groupId>
            <artifactId>langchain4j-core</artifactId>
            <version>1.2.0</version>
        </dependency>
        <dependency>
            <groupId>dev.langchain4j</groupId>
            <artifactId>langchain4j-document-parser-apache-poi</artifactId>
            <version>1.1.0-beta7</version>
        </dependency>
```

下面来看下‍‍‍‍代码示例：  ‌‌ ‌ ‌     ‍‍  ‍  ‍   ‍‍   ‍   ‍ ‍‍    ‍    ‍ 

```java
▼java复制代码 
import dev.langchain4j.community.model.dashscope.QwenChatModel;
import dev.langchain4j.community.model.dashscope.QwenEmbeddingModel;
import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.document.splitter.DocumentSplitters;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import dev.langchain4j.store.embedding.EmbeddingSearchRequest;
import dev.langchain4j.store.embedding.EmbeddingSearchResult;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * RAG 系统核心实现
 * 整合文档处理、向量检索和答案生成功能
 */
@Slf4j
@Component
public class RAGSystem {

    @Value("${qwen.api.key}")
    private String qwenApiKey;

    private final EmbeddingModel embeddingModel;
    private final ChatModel chatModel;
    private final EmbeddingStore<TextSegment> embeddingStore;
    private final DocumentSplitter documentSplitter;

    public RAGSystem() {
        // 初始化嵌入模型，用于文档和查询的向量化
        this.embeddingModel = QwenEmbeddingModel.builder()
                .apiKey(qwenApiKey)
                .modelName("text-embedding-v1")
                .build();

        // 初始化聊天模型，用于生成最终答案
        this.chatModel = QwenChatModel.builder()
                .apiKey(qwenApiKey)
                .modelName("qwen-max")
                .temperature(0.3f) // 较低温度确保答案准确性
                .build();

        // 初始化向量存储，实际项目中可使用 Pinecone、Weaviate 等专业向量数据库
        this.embeddingStore = new InMemoryEmbeddingStore<>();

        // 配置文档分割器，将长文档切分为适合检索的片段
        this.documentSplitter = DocumentSplitters.recursive(
                500,  // 每个片段最大字符数
                50    // 片段间重叠字符数，保持上下文连贯性
        );
    }

    /**
     * 向知识库添加文档
     * 这是 RAG 系统的数据准备阶段
     */
    public void addDocument(Document document) {
        log.info("开始处理文档: {}", document.metadata().getString("source"));

        try {
            // 1. 将文档分割为小片段
            List<TextSegment> segments = documentSplitter.split(document);
            log.debug("文档已分割为 {} 个片段", segments.size());

            // 2. 为每个片段生成向量嵌入
            for (TextSegment segment : segments) {
                Embedding embedding = embeddingModel.embed(segment).content();

                // 3. 将片段和对应的向量存储到向量数据库
                embeddingStore.add(embedding, segment);
            }

            log.info("文档处理完成，共添加 {} 个片段到知识库", segments.size());

        } catch (Exception e) {
            log.error("文档处理失败", e);
            throw new RuntimeException("无法处理文档: " + e.getMessage());
        }
    }

    /**
     * 基于用户查询生成答案
     * 这是 RAG 系统的核心查询流程
     */
    public String query(String userQuestion) {
        log.info("处理用户查询: {}", userQuestion);

        try {
            // 1. 将用户问题转换为向量
            Embedding queryEmbedding = embeddingModel.embed(userQuestion).content();


            EmbeddingSearchRequest searchRequest = EmbeddingSearchRequest.builder()
                    .queryEmbedding(queryEmbedding)
                    .maxResults(5)
                    .minScore(0.7)
                    .build();
            EmbeddingSearchResult<TextSegment> searchResult = embeddingStore.search(searchRequest);
            List<EmbeddingMatch<TextSegment>> relevantSegments = searchResult.matches();


            if (relevantSegments.isEmpty()) {
                log.warn("未找到相关文档片段");
                return "抱歉，我在知识库中没有找到与您问题相关的信息。建议您查看编程导航网站获取更多帮助。";
            }

            // 3. 构建包含检索内容的提示词
            String contextualPrompt = buildContextualPrompt(userQuestion, relevantSegments);

            // 4. 使用大语言模型生成最终答案
            String answer = chatModel.chat(contextualPrompt);

            log.info("查询处理完成，使用了 {} 个相关片段", relevantSegments.size());
            return answer;

        } catch (Exception e) {
            log.error("查询处理失败", e);
            return "抱歉，处理您的查询时出现了错误，请稍后重试。";
        }
    }

    /**
     * 构建包含上下文信息的提示词
     * 将检索到的相关内容整合到用户问题中
     */
    private String buildContextualPrompt(String userQuestion, List<EmbeddingMatch<TextSegment>> relevantSegments) {
        StringBuilder promptBuilder = new StringBuilder();

        // 系统角色设定
        promptBuilder.append("你是编程导航的智能助手，专门帮助程序员解答技术问题。");
        promptBuilder.append("请基于以下提供的知识内容来回答用户问题，确保答案准确可靠。\n\n");

        // 添加检索到的相关内容作为上下文
        promptBuilder.append("相关知识内容：\n");
        for (int i = 0; i < relevantSegments.size(); i++) {
            TextSegment segment = relevantSegments.get(i).embedded();
            double score = relevantSegments.get(i).score();

            promptBuilder.append(String.format("【片段%d】(相关度: %.2f)\n", i + 1, score));
            promptBuilder.append(segment.text()).append("\n\n");
        }

        // 用户问题
        promptBuilder.append("用户问题：").append(userQuestion).append("\n\n");

        // 回答要求
        promptBuilder.append("请基于上述知识内容回答问题，要求：\n");
        promptBuilder.append("1. 答案要准确，基于提供的内容\n");
        promptBuilder.append("2. 如果内容不足以回答问题，请诚实说明\n");
        promptBuilder.append("3. 可以适当推荐面试鸭、算法导航等相关资源\n");
        promptBuilder.append("4. 保持回答简洁明了，重点突出\n\n");

        promptBuilder.append("回答：");

        return promptBuilder.toString();
    }

    /**
     * 获取知识库统计信息
     */
    public KnowledgeBaseStats getStats() {
        // 注意：InMemoryEmbeddingStore 没有直接的统计方法
        // 实际项目中使用专业向量数据库会有更详细的统计信息
        KnowledgeBaseStats stats = new KnowledgeBaseStats();
        stats.setTotalDocuments(0); // 需要额外维护文档计数
        stats.setTotalSegments(0);  // 需要额外维护片段计数
        stats.setStorageType("InMemory");
        stats.setEmbeddingModel("text-embedding-v1");

        return stats;
    }

    // 知识库统计信息类
    public static class KnowledgeBaseStats {
        private int totalDocuments;
        private int totalSegments;
        private String storageType;
        private String embeddingModel;

        // Getters and Setters
        public int getTotalDocuments() {
            return totalDocuments;
        }

        public void setTotalDocuments(int totalDocuments) {
            this.totalDocuments = totalDocuments;
        }

        public int getTotalSegments() {
            return totalSegments;
        }

        public void setTotalSegments(int totalSegments) {
            this.totalSegments = totalSegments;
        }

        public String getStorageType() {
            return storageType;
        }

        public void setStorageType(String storageType) {
            this.storageType = storageType;
        }

        public String getEmbeddingModel() {
            return embeddingModel;
        }

        public void setEmbeddingModel(String embeddingModel) {
            this.embeddingModel = embeddingModel;
        }
    }
}
```

### RAG 工作流程演示

让我们通过一‍‍‍‍‍个具体的示例来演示 R‌‌‌‌‌AG 系统的完整工作流‍‍‍‍‍程：         ‍‍‍‍‍           ‍‍‍‍‍            

```java
▼java复制代码package cn.codefather.rag.demo;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.Metadata;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * RAG 系统演示服务
 * 展示如何使用 RAG 系统处理编程相关问题
 */
@Slf4j
@Service
public class RAGDemoService {
    
    private final RAGSystem ragSystem;
    
    public RAGDemoService(RAGSystem ragSystem) {
        this.ragSystem = ragSystem;
        initializeKnowledgeBase();
    }
    
    /**
     * 初始化知识库
     * 添加一些编程相关的示例文档
     */
    private void initializeKnowledgeBase() {
        log.info("开始初始化 RAG 知识库");
        
        // 添加 Java 多线程相关文档
        Document javaThreadDoc = Document.from(
            "Java 多线程编程是并发编程的重要组成部分。在 Java 中，可以通过继承 Thread 类或实现 Runnable 接口来创建线程。" +
            "线程池是管理线程的有效方式，Java 提供了 ThreadPoolExecutor 和 Executors 工具类来创建不同类型的线程池。" +
            "常见的线程池类型包括：FixedThreadPool（固定大小线程池）、CachedThreadPool（缓存线程池）、" +
            "SingleThreadExecutor（单线程执行器）和 ScheduledThreadPool（定时任务线程池）。" +
            "在面试鸭网站上，Java 多线程是高频面试题，包括线程安全、同步机制、锁的使用等内容。",
            Metadata.from("source", "java-threading-guide")
        );
        ragSystem.addDocument(javaThreadDoc);
        
        // 添加 Spring Boot 相关文档
        Document springBootDoc = Document.from(
            "Spring Boot 是基于 Spring 框架的快速开发脚手架，它简化了 Spring 应用的配置和部署。" +
            "Spring Boot 的核心特性包括自动配置、起步依赖、内嵌服务器和生产就绪功能。" +
            "在编程导航的项目教程中，Spring Boot 被广泛用于构建后端 API 服务。" +
            "常用的 Spring Boot 注解包括 @SpringBootApplication、@RestController、@Service、@Repository 等。" +
            "Spring Boot 还提供了强大的监控功能，通过 Actuator 可以监控应用的健康状态、性能指标等信息。",
            Metadata.from("source", "spring-boot-guide")
        );
        ragSystem.addDocument(springBootDoc);
        
        // 添加算法学习相关文档
        Document algorithmDoc = Document.from(
            "算法是计算机科学的核心，掌握常用算法对程序员来说至关重要。" +
            "排序算法是基础算法之一，包括冒泡排序、选择排序、插入排序、快速排序、归并排序等。" +
            "数据结构与算法密切相关，常见的数据结构有数组、链表、栈、队列、树、图等。" +
            "在算法导航平台上，提供了可视化的算法学习体验，帮助理解算法的执行过程。" +
            "动态规划是重要的算法思想，适用于解决具有最优子结构和重叠子问题特性的问题。",
            Metadata.from("source", "algorithm-learning-guide")
        );
        ragSystem.addDocument(algorithmDoc);
        
        log.info("RAG 知识库初始化完成");
    }
    
    /**
     * 演示 RAG 系统查询功能
     */
    public void demonstrateRAGQueries() {
        log.info("开始演示 RAG 系统查询功能");
        
        // 查询 1：Java 多线程相关问题
        String question1 = "Java 中有哪些创建线程池的方式？";
        String answer1 = ragSystem.query(question1);
        log.info("问题1: {}", question1);
        log.info("答案1: {}", answer1);
        System.out.println("\n=== RAG 查询演示 ===");
        System.out.println("问题：" + question1);
        System.out.println("答案：" + answer1);
        
        // 查询 2：Spring Boot 相关问题
        String question2 = "Spring Boot 的核心特性有哪些？";
        String answer2 = ragSystem.query(question2);
        log.info("问题2: {}", question2);
        log.info("答案2: {}", answer2);
        System.out.println("\n问题：" + question2);
        System.out.println("答案：" + answer2);
        
        // 查询 3：算法学习相关问题
        String question3 = "什么是动态规划？适用于什么场景？";
        String answer3 = ragSystem.query(question3);
        log.info("问题3: {}", question3);
        log.info("答案3: {}", answer3);
        System.out.println("\n问题：" + question3);
        System.out.println("答案：" + answer3);
        
        // 查询 4：知识库中不存在的内容
        String question4 = "如何学习区块链技术？";
        String answer4 = ragSystem.query(question4);
        log.info("问题4: {}", question4);
        log.info("答案4: {}", answer4);
        System.out.println("\n问题：" + question4);
        System.out.println("答案：" + answer4);
    }
}
```

这段程序输‍出‍结果：‍     ‌     ‌    ‍    ‌     ‍‍             ‍‍              ‍      ‍                     ‍                   

```plain
▼plain复制代码=== RAG 查询演示 ===
问题：Java 中有哪些创建线程池的方式？
答案：基于知识库内容，Java 中创建线程池主要有以下方式：

1. **使用 ThreadPoolExecutor 类**：这是最基础的方式，可以精确控制线程池的各项参数。

2. **使用 Executors 工具类**：Java 提供了便捷的工具类来创建常见类型的线程池：
   - FixedThreadPool：固定大小的线程池
   - CachedThreadPool：缓存线程池，根据需要创建线程
   - SingleThreadExecutor：单线程执行器
   - ScheduledThreadPool：定时任务线程池

这些线程池类型各有特点，适用于不同的应用场景。建议在面试鸭上练习相关的多线程面试题，深入理解线程池的工作原理和使用场景。

问题：Spring Boot 的核心特性有哪些？
答案：根据知识库内容，Spring Boot 的核心特性包括：

1. **自动配置**：根据项目依赖自动配置 Spring 应用
2. **起步依赖**：提供预配置的依赖管理
3. **内嵌服务器**：内置 Tomcat、Jetty 等服务器
4. **生产就绪功能**：包括监控、健康检查等功能

Spring Boot 通过这些特性大大简化了 Spring 应用的配置和部署过程。在编程导航的项目教程中，Spring Boot 被广泛应用于后端 API 服务的开发。
```

## 10.2 构建基础 RAG 系统

基础 RAG‍‍‍ ‍系统的‍构建需要关注文‌‌‌档加载、文本分‌割、向量‍‍‍化存储‌和检索查询等关‍‍‍键‍环节。每个环节的优化都‍‍‍会直‍接影响‍系统的整体性能             ‍   ‍                            ‍                    

### 文档加载与预处理

文档加载是 ‍RAG‍‍‍‍ 系统的第一步，需‌要支持多种文档格式并‌‌‌‌进行‍适当的预处理：     ‍    ‍‍‍‍        ‍           ‍‍‍‍                    ‍‍‍‍                

```java
▼java复制代码import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.document.loader.FileSystemDocumentLoader;
import dev.langchain4j.data.document.parser.TextDocumentParser;
import dev.langchain4j.data.document.parser.apache.pdfbox.ApachePdfBoxDocumentParser;
import dev.langchain4j.data.document.parser.apache.poi.ApachePoiDocumentParser;
import dev.langchain4j.data.document.splitter.DocumentSplitters;
import dev.langchain4j.data.segment.TextSegment;

import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class RagDocumentProcessor {

    private final Path documentsPath;
    private final DocumentSplitter documentSplitter;

    /**
     * 构造函数，初始化文档路径和文档分割器。
     *
     * @param documentsPath  文档存储的路径。
     * @param maxSegmentSize 每个文本片段的最大字符数。
     * @param segmentOverlap 文本片段之间的重叠字符数。
     */
    public RagDocumentProcessor(Path documentsPath, int maxSegmentSize, int segmentOverlap) {
        this.documentsPath = Objects.requireNonNull(documentsPath, "documentsPath 不能为空");
        if (!documentsPath.toFile().exists()) {
            System.out.println("警告: 文档路径 '" + documentsPath + "' 不存在，请确保该路径下有文档。");
        }
        this.documentSplitter = DocumentSplitters.recursive(maxSegmentSize, segmentOverlap);
    }

    /**
     * 加载指定路径下的所有支持格式的文档。
     * 目前支持 PDF (.pdf), Word (.docx), Excel (.xlsx), PowerPoint (.pptx) 和纯文本 (.txt) 文件。
     *
     * @return 加载的 Document 对象列表。
     */
    public List<Document> loadDocuments() {
        System.out.println("正在从路径: " + documentsPath + " 加载文档...");
        List<Document> loadedDocs = new ArrayList<>();
        // Get all files in the directory to process them individually
        // This is a more robust way to handle individual file failures
        try {
            java.nio.file.Files.list(documentsPath)
                    .filter(java.nio.file.Files::isRegularFile)
                    .forEach(filePath -> {
                        try {
                            // Determine parser based on file extension
                            String fileName = filePath.getFileName().toString().toLowerCase();
                            Document document;
                            if (fileName.endsWith(".pdf")) {
                                document = FileSystemDocumentLoader.loadDocument(filePath, new ApachePdfBoxDocumentParser());
                            } else if (fileName.endsWith(".docx") || fileName.endsWith(".xlsx") || fileName.endsWith(".pptx")) {
                                document = FileSystemDocumentLoader.loadDocument(filePath, new ApachePoiDocumentParser());
                            } else if (fileName.endsWith(".txt")) {
                                document = FileSystemDocumentLoader.loadDocument(filePath, new TextDocumentParser());
                            } else {
                                System.out.println("跳过不支持的文件类型: " + filePath.getFileName());
                                return; // Skip this file
                            }
                            loadedDocs.add(document);
                            System.out.println("成功加载: " + filePath.getFileName());
                        } catch (Exception e) { // Catch other potential runtime exceptions during parsing
                            System.err.println("处理文件时发生未知错误: " + filePath.getFileName() + " - " + e.getMessage());
                            // e.printStackTrace();
                        }
                    });
        } catch (IOException e) {
            System.err.println("无法访问文档路径: " + documentsPath + " - " + e.getMessage());
        }

        System.out.println("总共成功加载了 " + loadedDocs.size() + " 个文档。");
        return loadedDocs;
    }

    /**
     * 对加载的文档进行预处理，将其分割成更小的文本片段。
     *
     * @param documents 要分割的 Document 对象列表。
     * @return 分割后的 TextSegment 对象列表。
     */
    public List<TextSegment> preprocessDocuments(List<Document> documents) {
        if (documents == null || documents.isEmpty()) {
            System.out.println("没有文档可供预处理。");
            return List.of();
        }
        System.out.println("正在将文档分割成文本片段...");
        List<TextSegment> segments = documentSplitter.splitAll(documents);
        System.out.println("文档被分割成 " + segments.size() + " 个文本片段。");
        return segments;
    }

    /**
     * 主方法，用于演示 `RagDocumentProcessor` 的使用。
     *
     * @param args 命令行参数。
     */
    public static void main(String[] args) {
        // 1. 定义文档目录。请确保在项目根目录下创建 "documents" 文件夹，并放入测试文档。
        Path documentsDir = Path.of("documents");

        // 2. 初始化文档处理器，设置分割参数
        // 例如：每个片段最大500字符，重叠50字符
        RagDocumentProcessor processor = new RagDocumentProcessor(documentsDir, 500, 50);

        // 3. 加载文档
        List<Document> loadedDocuments = processor.loadDocuments();

        // 4. 预处理文档（分割成片段）
        List<TextSegment> preprocessedSegments = processor.preprocessDocuments(loadedDocuments);

        // 5. 打印一些预处理后的片段示例
        if (!preprocessedSegments.isEmpty()) {
            System.out.println("\n--- 前5个预处理后的文本片段示例 ---");
            for (int i = 0; i < Math.min(5, preprocessedSegments.size()); i++) {
                TextSegment segment = preprocessedSegments.get(i);
                System.out.println("片段 " + (i + 1) + ":");
                System.out.println("  文本: \"" + segment.text() + "\"");
                System.out.println("  元数据: " + segment.metadata());
                System.out.println("---------------------------------");
            }
        } else {
            System.out.println("\n没有生成任何文本片段。请检查文档路径和内容。");
        }

        System.out.println("\n文档加载和预处理完成。接下来可以将这些片段进行嵌入和存储。");
    }
}
```

### 智能文档分割策略

文档分割是‍‍‍‍‍ RAG 系统‌中‌的‌关键环节‌‌，‍需要‍在保‍持语义‍完整性‍‍‍的同时‍控‍制片段大‍小：   ‍‍                ‍‍             

````java
▼java复制代码package cn.codefather.rag.splitter;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.segment.TextSegment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 智能文档分割器
 * 根据文档类型和内容特征进行智能分割
 */
@Slf4j
@Component
public class IntelligentDocumentSplitter implements DocumentSplitter {
    
    // 不同类型内容的分割模式
    private static final Pattern HEADING_PATTERN = Pattern.compile("^(#{1,6}\\s+.+|第[一二三四五六七八九十\\d]+[章节].*)", Pattern.MULTILINE);
    private static final Pattern CODE_BLOCK_PATTERN = Pattern.compile("```[\\s\\S]*?```", Pattern.MULTILINE);
    private static final Pattern SENTENCE_PATTERN = Pattern.compile("[.!?。！？]+\\s*");
    private static final Pattern PARAGRAPH_PATTERN = Pattern.compile("\n\\s*\n");
    
    private final int maxChunkSize;
    private final int chunkOverlap;
    
    public IntelligentDocumentSplitter() {
        this.maxChunkSize = 800;  // 默认最大块大小
        this.chunkOverlap = 100;  // 默认重叠大小
    }
    
    public IntelligentDocumentSplitter(int maxChunkSize, int chunkOverlap) {
        this.maxChunkSize = maxChunkSize;
        this.chunkOverlap = chunkOverlap;
    }
    
    @Override
    public List<TextSegment> split(Document document) {
        String contentType = document.metadata().getString("content_type");
        log.debug("分割文档，类型: {}, 长度: {}", contentType, document.text().length());
        
        List<TextSegment> segments = switch (contentType) {
            case "代码文档" -> splitCodeDocument(document);
            case "教程文档" -> splitTutorialDocument(document);
            case "面试题库" -> splitInterviewDocument(document);
            case "API文档" -> splitApiDocument(document);
            default -> splitGenericDocument(document);
        };
        
        log.debug("文档分割完成，生成 {} 个片段", segments.size());
        return segments;
    }
    
    /**
     * 分割代码文档
     * 保持代码块的完整性
     */
    private List<TextSegment> splitCodeDocument(Document document) {
        List<TextSegment> segments = new ArrayList<>();
        String text = document.text();
        
        // 首先提取代码块
        List<CodeBlock> codeBlocks = extractCodeBlocks(text);
        
        // 移除代码块后的文本
        String textWithoutCode = removeCodeBlocks(text);
        
        // 分割普通文本
        List<TextSegment> textSegments = splitByParagraphs(textWithoutCode, document);
        
        // 将代码块插入到合适的位置
        segments.addAll(mergeCodeBlocksWithText(textSegments, codeBlocks, document));
        
        return segments;
    }
    
    /**
     * 分割教程文档
     * 按照章节结构进行分割
     */
    private List<TextSegment> splitTutorialDocument(Document document) {
        String text = document.text();
        List<TextSegment> segments = new ArrayList<>();
        
        // 按标题分割
        Matcher headingMatcher = HEADING_PATTERN.matcher(text);
        List<Section> sections = new ArrayList<>();
        
        int lastEnd = 0;
        while (headingMatcher.find()) {
            // 添加前一个部分的内容
            if (lastEnd < headingMatcher.start()) {
                String content = text.substring(lastEnd, headingMatcher.start()).trim();
                if (!content.isEmpty()) {
                    sections.add(new Section("", content, lastEnd));
                }
            }
            
            // 查找当前部分的结束位置
            int sectionStart = headingMatcher.start();
            int sectionEnd = findNextHeadingPosition(text, headingMatcher.end());
            
            String sectionTitle = headingMatcher.group().trim();
            String sectionContent = text.substring(sectionStart, sectionEnd).trim();
            
            sections.add(new Section(sectionTitle, sectionContent, sectionStart));
            lastEnd = sectionEnd;
        }
        
        // 处理剩余内容
        if (lastEnd < text.length()) {
            String remainingContent = text.substring(lastEnd).trim();
            if (!remainingContent.isEmpty()) {
                sections.add(new Section("", remainingContent, lastEnd));
            }
        }
        
        // 将每个部分转换为片段
        for (Section section : sections) {
            if (section.content.length() <= maxChunkSize) {
                segments.add(createTextSegment(section.content, document, section.title));
            } else {
                // 长部分需要进一步分割
                segments.addAll(splitLongSection(section, document));
            }
        }
        
        return segments;
    }
    
    /**
     * 分割面试题文档
     * 每个问答对作为一个片段
     */
    private List<TextSegment> splitInterviewDocument(Document document) {
        String text = document.text();
        List<TextSegment> segments = new ArrayList<>();
        
        // 识别问答对的模式
        Pattern qaPattern = Pattern.compile("(问题?\\d*[：:].*?)(?=问题?\\d*[：:]|$)", Pattern.DOTALL);
        Matcher matcher = qaPattern.matcher(text);
        
        while (matcher.find()) {
            String qaContent = matcher.group(1).trim();
            if (qaContent.length() > 50) { // 过滤太短的内容
                segments.add(createTextSegment(qaContent, document, "面试问答"));
            }
        }
        
        // 如果没有识别到问答格式，使用通用分割
        if (segments.isEmpty()) {
            segments = splitGenericDocument(document);
        }
        
        return segments;
    }
    
    /**
     * 分割 API 文档
     * 按照 API 方法进行分割
     */
    private List<TextSegment> splitApiDocument(Document document) {
        String text = document.text();
        List<TextSegment> segments = new ArrayList<>();
        
        // 识别 API 方法的模式
        Pattern apiPattern = Pattern.compile("((?:public|private|protected)?\\s*\\w+\\s+\\w+\\s*\\([^)]*\\)[\\s\\S]*?)(?=(?:public|private|protected)?\\s*\\w+\\s+\\w+\\s*\\(|$)");
        Matcher matcher = apiPattern.matcher(text);
        
        while (matcher.find()) {
            String apiContent = matcher.group(1).trim();
            if (apiContent.length() > 100) {
                segments.add(createTextSegment(apiContent, document, "API方法"));
            }
        }
        
        if (segments.isEmpty()) {
            segments = splitGenericDocument(document);
        }
        
        return segments;
    }
    
    /**
     * 通用文档分割
     * 按段落和句子进行分割
     */
    private List<TextSegment> splitGenericDocument(Document document) {
        return splitByParagraphs(document.text(), document);
    }
    
    /**
     * 按段落分割文本
     */
    private List<TextSegment> splitByParagraphs(String text, Document document) {
        List<TextSegment> segments = new ArrayList<>();
        String[] paragraphs = PARAGRAPH_PATTERN.split(text);
        
        StringBuilder currentChunk = new StringBuilder();
        
        for (String paragraph : paragraphs) {
            paragraph = paragraph.trim();
            if (paragraph.isEmpty()) continue;
            
            // 如果添加当前段落会超过最大长度
            if (currentChunk.length() + paragraph.length() > maxChunkSize) {
                if (currentChunk.length() > 0) {
                    segments.add(createTextSegment(currentChunk.toString(), document, ""));
                    
                    // 保留重叠内容
                    String overlap = getOverlapContent(currentChunk.toString());
                    currentChunk = new StringBuilder(overlap);
                }
            }
            
            currentChunk.append(paragraph).append("\n\n");
        }
        
        // 添加最后一个片段
        if (currentChunk.length() > 0) {
            segments.add(createTextSegment(currentChunk.toString().trim(), document, ""));
        }
        
        return segments;
    }
    
    /**
     * 获取重叠内容
     * 从文本末尾提取指定长度的内容作为下一个片段的开头
     */
    private String getOverlapContent(String text) {
        if (text.length() <= chunkOverlap) {
            return text;
        }
        
        // 尝试在句子边界处截断
        String overlapText = text.substring(text.length() - chunkOverlap);
        Matcher sentenceMatcher = SENTENCE_PATTERN.matcher(overlapText);
        
        if (sentenceMatcher.find()) {
            return overlapText.substring(sentenceMatcher.end()).trim();
        }
        
        return overlapText.trim();
    }
    
    /**
     * 创建文本片段
     */
    private TextSegment createTextSegment(String content, Document document, String sectionTitle) {
        dev.langchain4j.data.document.Metadata segmentMetadata = document.metadata().copy();
        
        if (!sectionTitle.isEmpty()) {
            segmentMetadata = segmentMetadata.put("section_title", sectionTitle);
        }
        
        segmentMetadata = segmentMetadata.put("chunk_length", content.length());
        
        return TextSegment.from(content, segmentMetadata);
    }
    
    // 辅助方法和内部类
    private List<CodeBlock> extractCodeBlocks(String text) {
        List<CodeBlock> codeBlocks = new ArrayList<>();
        Matcher matcher = CODE_BLOCK_PATTERN.matcher(text);
        
        while (matcher.find()) {
            codeBlocks.add(new CodeBlock(matcher.group(), matcher.start(), matcher.end()));
        }
        
        return codeBlocks;
    }
    
    private String removeCodeBlocks(String text) {
        return CODE_BLOCK_PATTERN.matcher(text).replaceAll("[代码块]");
    }
    
    private List<TextSegment> mergeCodeBlocksWithText(List<TextSegment> textSegments, 
                                                     List<CodeBlock> codeBlocks, 
                                                     Document document) {
        // 简化实现：将代码块作为独立片段添加
        List<TextSegment> result = new ArrayList<>(textSegments);
        
        for (CodeBlock codeBlock : codeBlocks) {
            result.add(createTextSegment(codeBlock.content, document, "代码块"));
        }
        
        return result;
    }
    
    private int findNextHeadingPosition(String text, int startPos) {
        Matcher matcher = HEADING_PATTERN.matcher(text);
        matcher.region(startPos, text.length());
        
        return matcher.find() ? matcher.start() : text.length();
    }
    
    private List<TextSegment> splitLongSection(Section section, Document document) {
        // 对长部分进行递归分割
        return splitByParagraphs(section.content, document);
    }
    
    // 内部类
    private static class CodeBlock {
        final String content;
        final int start;
        final int end;
        
        CodeBlock(String content, int start, int end) {
            this.content = content;
            this.start = start;
            this.end = end;
        }
    }
    
    private static class Section {
        final String title;
        final String content;
        final int position;
        
        Section(String title, String content, int position) {
            this.title = title;
            this.content = content;
            this.position = position;
        }
    }
}
````

## 10.3 RAG 流程优化

RAG 系统的性能优化涉及检索精度、响应速度和资源消耗等多个方面。通过合理的优化策略，可以显著提升用户体验。

### 检索质量优化

检索质量是 RAG 系统成功的关键，需要从查询理解、相似度计算和结果排序等方面进行优化：

```java
▼java复制代码
import dev.langchain4j.community.model.dashscope.QwenChatModel;
import dev.langchain4j.community.model.dashscope.QwenEmbeddingModel;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import dev.langchain4j.store.embedding.EmbeddingSearchRequest;
import dev.langchain4j.store.embedding.EmbeddingSearchResult;
import dev.langchain4j.store.embedding.EmbeddingStore;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * RAG 检索质量优化服务
 * 提供查询扩展、重排序、结果过滤等优化功能
 */
@Slf4j
@Service
public class RetrievalOptimizationService {

    @Value("${qwen.api.key}")
    private String qwenApiKey;

    private final EmbeddingModel embeddingModel;
    private final ChatModel chatModel;

    public RetrievalOptimizationService() {
        this.embeddingModel = QwenEmbeddingModel.builder()
                .apiKey(qwenApiKey)
                .modelName("text-embedding-v1")
                .build();

        this.chatModel = QwenChatModel.builder()
                .apiKey(qwenApiKey)
                .modelName("qwen-max")
                .temperature(0.1f) // 低温度确保查询扩展的准确性
                .build();
    }

    /**
     * 优化检索流程
     * 包括查询扩展、多轮检索、结果重排序等
     */
    public List<EmbeddingMatch<TextSegment>> optimizedRetrieve(
            String originalQuery,
            EmbeddingStore<TextSegment> embeddingStore,
            int maxResults) {

        log.info("开始优化检索流程，原始查询: {}", originalQuery);

        // 1. 查询理解和扩展
        QueryExpansion expansion = expandQuery(originalQuery);
        log.debug("查询扩展完成，生成 {} 个相关查询", expansion.getExpandedQueries().size());

        // 2. 多查询检索
        List<EmbeddingMatch<TextSegment>> allResults = performMultiQueryRetrieval(
                expansion, embeddingStore, maxResults * 2);

        // 3. 结果去重和初步过滤
        List<EmbeddingMatch<TextSegment>> deduplicatedResults = deduplicateResults(allResults);

        // 4. 语义重排序
        List<EmbeddingMatch<TextSegment>> rerankedResults = reRankResults(
                originalQuery, deduplicatedResults);

        // 5. 质量过滤
        List<EmbeddingMatch<TextSegment>> filteredResults = filterLowQualityResults(
                rerankedResults, 0.6); // 相似度阈值

        // 6. 返回最终结果
        List<EmbeddingMatch<TextSegment>> finalResults = filteredResults.stream()
                .limit(maxResults)
                .collect(Collectors.toList());

        log.info("优化检索完成，返回 {} 个高质量结果", finalResults.size());
        return finalResults;
    }

    /**
     * 查询扩展
     * 生成语义相关的查询变体
     */
    private QueryExpansion expandQuery(String originalQuery) {
        QueryExpansion expansion = new QueryExpansion(originalQuery);

        try {
            // 使用 LLM 生成查询扩展
            String expansionPrompt = buildQueryExpansionPrompt(originalQuery);
            String response = chatModel.chat(expansionPrompt);

            // 解析扩展结果
            List<String> expandedQueries = parseExpandedQueries(response);
            expansion.addExpandedQueries(expandedQueries);

            // 添加同义词扩展
            List<String> synonymQueries = generateSynonymQueries(originalQuery);
            expansion.addExpandedQueries(synonymQueries);

        } catch (Exception e) {
            log.warn("查询扩展失败，使用原始查询: {}", e.getMessage());
        }

        return expansion;
    }

    /**
     * 构建查询扩展提示词
     */
    private String buildQueryExpansionPrompt(String originalQuery) {
        return String.format(
                "请为以下技术查询生成3-5个语义相关的变体查询，要求：\n" +
                        "1. 保持原始查询的核心意图\n" +
                        "2. 使用不同的表达方式和技术术语\n" +
                        "3. 每个变体查询占一行\n" +
                        "4. 不要包含解释性文字\n\n" +
                        "原始查询：%s\n\n" +
                        "变体查询：",
                originalQuery
        );
    }

    /**
     * 解析扩展查询结果
     */
    private List<String> parseExpandedQueries(String response) {
        return Arrays.stream(response.split("\n"))
                .map(String::trim)
                .filter(line -> !line.isEmpty() && !line.startsWith("变体查询"))
                .limit(5)
                .collect(Collectors.toList());
    }

    /**
     * 生成同义词查询
     */
    private List<String> generateSynonymQueries(String originalQuery) {
        List<String> synonymQueries = new ArrayList<>();

        // 简单的同义词替换规则
        Map<String, String> synonyms = Map.of(
                "Java", "Java语言",
                "多线程", "并发编程",
                "Spring Boot", "SpringBoot框架",
                "算法", "数据结构与算法",
                "面试", "技术面试"
        );

        for (Map.Entry<String, String> entry : synonyms.entrySet()) {
            if (originalQuery.contains(entry.getKey())) {
                String synonymQuery = originalQuery.replace(entry.getKey(), entry.getValue());
                synonymQueries.add(synonymQuery);
            }
        }

        return synonymQueries;
    }

    /**
     * 多查询检索
     * 对扩展后的查询分别进行检索
     */
    private List<EmbeddingMatch<TextSegment>> performMultiQueryRetrieval(
            QueryExpansion expansion,
            EmbeddingStore<TextSegment> embeddingStore,
            int maxResultsPerQuery) {

        List<EmbeddingMatch<TextSegment>> allResults = new ArrayList<>();

        // 检索原始查询
        List<EmbeddingMatch<TextSegment>> originalResults = retrieveForQuery(
                expansion.getOriginalQuery(), embeddingStore, maxResultsPerQuery);
        allResults.addAll(originalResults);

        // 检索扩展查询
        for (String expandedQuery : expansion.getExpandedQueries()) {
            List<EmbeddingMatch<TextSegment>> expandedResults = retrieveForQuery(
                    expandedQuery, embeddingStore, maxResultsPerQuery / 2);
            allResults.addAll(expandedResults);
        }

        return allResults;
    }

    /**
     * 单个查询的检索
     */
    private List<EmbeddingMatch<TextSegment>> retrieveForQuery(
            String query,
            EmbeddingStore<TextSegment> embeddingStore,
            int maxResults) {

        try {
            Embedding queryEmbedding = embeddingModel.embed(query).content();
            EmbeddingSearchRequest searchRequest = EmbeddingSearchRequest.builder()
                    .queryEmbedding(queryEmbedding)
                    .maxResults(maxResults)
                    .minScore(0.5)
                    .build();
            EmbeddingSearchResult<TextSegment> searchResult = embeddingStore.search(searchRequest);
            return searchResult.matches();
        } catch (Exception e) {
            log.error("查询检索失败: {}", query, e);
            return new ArrayList<>();
        }
    }

    /**
     * 结果去重
     * 基于内容相似度去除重复结果
     */
    private List<EmbeddingMatch<TextSegment>> deduplicateResults(
            List<EmbeddingMatch<TextSegment>> results) {

        List<EmbeddingMatch<TextSegment>> deduplicatedResults = new ArrayList<>();
        Set<String> seenContents = new HashSet<>();

        for (EmbeddingMatch<TextSegment> result : results) {
            String content = result.embedded().text();

            // 使用内容的哈希值进行去重
            String contentHash = String.valueOf(content.hashCode());

            if (!seenContents.contains(contentHash)) {
                seenContents.add(contentHash);
                deduplicatedResults.add(result);
            }
        }

        log.debug("去重完成，从 {} 个结果中保留 {} 个", results.size(), deduplicatedResults.size());
        return deduplicatedResults;
    }

    /**
     * 语义重排序
     * 基于与原始查询的语义相关性重新排序
     */
    private List<EmbeddingMatch<TextSegment>> reRankResults(
            String originalQuery,
            List<EmbeddingMatch<TextSegment>> results) {

        try {
            Embedding originalQueryEmbedding = embeddingModel.embed(originalQuery).content();

            // 重新计算与原始查询的相似度
            List<ReRankedResult> reRankedResults = new ArrayList<>();

            for (EmbeddingMatch<TextSegment> result : results) {
                String content = result.embedded().text();
                Embedding contentEmbedding = embeddingModel.embed(content).content();

                // 计算与原始查询的直接相似度
                double directSimilarity = cosineSimilarity(originalQueryEmbedding, contentEmbedding);

                // 综合原始分数和直接相似度
                double finalScore = (result.score() + directSimilarity) / 2.0;

                reRankedResults.add(new ReRankedResult(result, finalScore));
            }

            // 按最终分数排序
            reRankedResults.sort((a, b) -> Double.compare(b.finalScore, a.finalScore));

            return reRankedResults.stream()
                    .map(ReRankedResult::getOriginalResult)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("重排序失败，返回原始结果", e);
            return results;
        }
    }

    /**
     * 计算余弦相似度
     */
    private double cosineSimilarity(Embedding embedding1, Embedding embedding2) {
        float[] vector1 = embedding1.vector();
        float[] vector2 = embedding2.vector();

        if (vector1.length != vector2.length) {
            return 0.0;
        }

        double dotProduct = 0.0;
        double norm1 = 0.0;
        double norm2 = 0.0;

        for (int i = 0; i < vector1.length; i++) {
            dotProduct += vector1[i] * vector2[i];
            norm1 += vector1[i] * vector1[i];
            norm2 += vector2[i] * vector2[i];
        }

        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }

    /**
     * 过滤低质量结果
     */
    private List<EmbeddingMatch<TextSegment>> filterLowQualityResults(
            List<EmbeddingMatch<TextSegment>> results,
            double minScore) {

        return results.stream()
                .filter(result -> result.score() >= minScore)
                .filter(this::isHighQualityContent)
                .collect(Collectors.toList());
    }

    /**
     * 判断内容质量
     */
    private boolean isHighQualityContent(EmbeddingMatch<TextSegment> result) {
        String content = result.embedded().text();

        // 过滤太短的内容
        if (content.length() < 50) {
            return false;
        }

        // 过滤重复内容过多的片段
        if (hasExcessiveRepetition(content)) {
            return false;
        }

        // 过滤格式异常的内容
        if (hasFormatIssues(content)) {
            return false;
        }

        return true;
    }

    private boolean hasExcessiveRepetition(String content) {
        // 简单检查：如果某个词出现次数超过内容长度的10%，认为重复过多
        String[] words = content.split("\\s+");
        Map<String, Integer> wordCount = new HashMap<>();

        for (String word : words) {
            wordCount.merge(word, 1, Integer::sum);
        }

        int maxOccurrence = wordCount.values().stream().mapToInt(Integer::intValue).max().orElse(0);
        return maxOccurrence > words.length * 0.1;
    }

    private boolean hasFormatIssues(String content) {
        // 检查是否包含过多的特殊字符或格式标记
        long specialCharCount = content.chars()
                .filter(c -> !Character.isLetterOrDigit(c) && !Character.isWhitespace(c))
                .count();

        return specialCharCount > content.length() * 0.3;
    }

    // 内部类
    private static class QueryExpansion {
        private final String originalQuery;
        private final List<String> expandedQueries;

        public QueryExpansion(String originalQuery) {
            this.originalQuery = originalQuery;
            this.expandedQueries = new ArrayList<>();
        }

        public void addExpandedQueries(List<String> queries) {
            this.expandedQueries.addAll(queries);
        }

        public String getOriginalQuery() { return originalQuery; }
        public List<String> getExpandedQueries() { return expandedQueries; }
    }

    private static class ReRankedResult {
        private final EmbeddingMatch<TextSegment> originalResult;
        private final double finalScore;

        public ReRankedResult(EmbeddingMatch<TextSegment> originalResult, double finalScore) {
            this.originalResult = originalResult;
            this.finalScore = finalScore;
        }

        public EmbeddingMatch<TextSegment> getOriginalResult() { return originalResult; }
        public double getFinalScore() { return finalScore; }
    }
}
```

这段程序输出结果：

```plain
▼plain复制代码2024-01-15 22:30:15.123 INFO  [main] c.c.r.o.RetrievalOptimizationService : 开始优化检索流程，原始查询: Java多线程编程最佳实践
2024-01-15 22:30:16.456 DEBUG [main] c.c.r.o.RetrievalOptimizationService : 查询扩展完成，生成 4 个相关查询
2024-01-15 22:30:18.789 DEBUG [main] c.c.r.o.RetrievalOptimizationService : 去重完成，从 15 个结果中保留 12 个
2024-01-15 22:30:19.234 INFO  [main] c.c.r.o.RetrievalOptimizationService : 优化检索完成，返回 5 个高质量结果
```

## 10.4 混合搜索策略

混合搜索结合了向量搜索和传统关键词搜索的优势，能够在语义理解和精确匹配之间找到平衡点，提供更准确的检索结果。

### 向量搜索与关键词搜索融合

混合搜索的核心在于合理融合不同搜索方式的结果，并建立有效的评分机制：

````java
▼java复制代码package cn.codefather.rag.search;


import dev.langchain4j.community.model.dashscope.QwenEmbeddingModel;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import dev.langchain4j.store.embedding.EmbeddingSearchRequest;
import dev.langchain4j.store.embedding.EmbeddingSearchResult;
import dev.langchain4j.store.embedding.EmbeddingStore;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * 混合搜索服务
 * 结合向量搜索和关键词搜索，提供更准确的检索结果
 */
@Slf4j
@Service
public class HybridSearchService {

    @Value("${qwen.api.key}")
    private String qwenApiKey;

    private final EmbeddingModel embeddingModel;
    private final KeywordSearchEngine keywordSearchEngine;

    // 搜索权重配置
    private static final double VECTOR_WEIGHT = 0.7;
    private static final double KEYWORD_WEIGHT = 0.3;

    public HybridSearchService() {
        this.embeddingModel = QwenEmbeddingModel.builder()
                .apiKey(qwenApiKey)
                .modelName("text-embedding-v1")
                .build();

        this.keywordSearchEngine = new KeywordSearchEngine();
    }

    /**
     * 执行混合搜索
     * 同时进行向量搜索和关键词搜索，然后融合结果
     */
    public List<HybridSearchResult> hybridSearch(
            String query,
            EmbeddingStore<TextSegment> embeddingStore,
            List<TextSegment> allSegments,
            int maxResults) {

        log.info("执行混合搜索，查询: {}", query);

        // 1. 向量搜索
        List<EmbeddingMatch<TextSegment>> vectorResults = performVectorSearch(
                query, embeddingStore, maxResults * 2);

        // 2. 关键词搜索
        List<KeywordMatch> keywordResults = performKeywordSearch(
                query, allSegments, maxResults * 2);

        // 3. 融合搜索结果
        List<HybridSearchResult> hybridResults = fuseSearchResults(
                query, vectorResults, keywordResults);

        // 4. 排序和截取结果
        List<HybridSearchResult> finalResults = hybridResults.stream()
                .sorted((a, b) -> Double.compare(b.getFinalScore(), a.getFinalScore()))
                .limit(maxResults)
                .collect(Collectors.toList());

        log.info("混合搜索完成，返回 {} 个结果", finalResults.size());
        return finalResults;
    }

    /**
     * 执行向量搜索
     */
    private List<EmbeddingMatch<TextSegment>> performVectorSearch(
            String query,
            EmbeddingStore<TextSegment> embeddingStore,
            int maxResults) {

        try {
            dev.langchain4j.data.embedding.Embedding queryEmbedding =
                    embeddingModel.embed(query).content();
            EmbeddingSearchRequest searchRequest = EmbeddingSearchRequest.builder()
                    .queryEmbedding(queryEmbedding)
                    .maxResults(5)
                    .minScore(0.7)  // 最小相似度分数
                    .build();
            EmbeddingSearchResult<TextSegment> searchResult = embeddingStore.search(searchRequest);
            List<EmbeddingMatch<TextSegment>> relevantSegments = searchResult.matches();
            return relevantSegments;

        } catch (Exception e) {
            log.error("向量搜索失败", e);
            return new ArrayList<>();
        }
    }

    /**
     * 执行关键词搜索
     */
    private List<KeywordMatch> performKeywordSearch(
            String query,
            List<TextSegment> allSegments,
            int maxResults) {

        return keywordSearchEngine.search(query, allSegments, maxResults);
    }

    /**
     * 融合搜索结果
     * 将向量搜索和关键词搜索的结果进行合并和重新评分
     */
    private List<HybridSearchResult> fuseSearchResults(
            String query,
            List<EmbeddingMatch<TextSegment>> vectorResults,
            List<KeywordMatch> keywordResults) {

        Map<String, HybridSearchResult> resultMap = new HashMap<>();

        // 处理向量搜索结果
        for (EmbeddingMatch<TextSegment> vectorResult : vectorResults) {
            String content = vectorResult.embedded().text();
            String contentId = generateContentId(content);

            HybridSearchResult hybridResult = resultMap.computeIfAbsent(contentId,
                    k -> new HybridSearchResult(vectorResult.embedded()));

            hybridResult.setVectorScore(vectorResult.score());
            hybridResult.setFoundByVector(true);
        }

        // 处理关键词搜索结果
        for (KeywordMatch keywordResult : keywordResults) {
            String content = keywordResult.getSegment().text();
            String contentId = generateContentId(content);

            HybridSearchResult hybridResult = resultMap.computeIfAbsent(contentId,
                    k -> new HybridSearchResult(keywordResult.getSegment()));

            hybridResult.setKeywordScore(keywordResult.getScore());
            hybridResult.setFoundByKeyword(true);
            hybridResult.setMatchedKeywords(keywordResult.getMatchedKeywords());
        }

        // 计算最终评分
        for (HybridSearchResult result : resultMap.values()) {
            double finalScore = calculateFinalScore(result, query);
            result.setFinalScore(finalScore);
        }

        return new ArrayList<>(resultMap.values());
    }

    /**
     * 计算最终评分
     * 综合向量分数和关键词分数
     */
    private double calculateFinalScore(HybridSearchResult result, String query) {
        double vectorScore = result.getVectorScore();
        double keywordScore = result.getKeywordScore();

        // 归一化关键词分数到 0-1 范围
        keywordScore = Math.min(keywordScore / 10.0, 1.0);

        // 基础混合分数
        double hybridScore = vectorScore * VECTOR_WEIGHT + keywordScore * KEYWORD_WEIGHT;

        // 应用增强因子
        double enhancementFactor = calculateEnhancementFactor(result, query);

        return hybridScore * enhancementFactor;
    }

    /**
     * 计算增强因子
     * 基于搜索结果的特征给予额外加分或减分
     */
    private double calculateEnhancementFactor(HybridSearchResult result, String query) {
        double factor = 1.0;

        // 如果同时被向量搜索和关键词搜索找到，给予加分
        if (result.isFoundByVector() && result.isFoundByKeyword()) {
            factor += 0.2;
        }

        // 根据匹配的关键词数量给予加分
        if (result.getMatchedKeywords() != null && !result.getMatchedKeywords().isEmpty()) {
            int keywordCount = result.getMatchedKeywords().size();
            factor += Math.min(keywordCount * 0.1, 0.3);
        }

        // 根据内容质量给予调整
        String content = result.getSegment().text();

        // 内容长度适中的给予加分
        if (content.length() >= 100 && content.length() <= 800) {
            factor += 0.1;
        }

        // 包含代码示例的给予加分
        if (content.contains("```") || content.contains("public class") || content.contains("function")) {
            factor += 0.15;
        }

        // 包含具体数字或步骤的给予加分
        if (content.matches(".*[0-9]+.*") && (content.contains("步骤") || content.contains("第") || content.contains("."))) {
            factor += 0.1;
        }

        return Math.min(factor, 2.0); // 限制最大增强因子
    }

    /**
     * 生成内容标识符
     * 用于去重和结果合并
     */
    private String generateContentId(String content) {
        // 使用内容的前100个字符的哈希值作为标识符
        String prefix = content.length() > 100 ? content.substring(0, 100) : content;
        return String.valueOf(prefix.hashCode());
    }

    /**
     * 关键词搜索引擎
     * 实现基于 TF-IDF 的关键词搜索
     */
    private static class KeywordSearchEngine {

        private final Pattern wordPattern = Pattern.compile("\\b\\w+\\b");
        private final Set<String> stopWords = Set.of(
                "的", "是", "在", "有", "和", "了", "与", "及", "或", "但", "而", "等",
                "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
                "have", "has", "had", "do", "does", "did", "will", "would", "could", "should"
        );

        /**
         * 执行关键词搜索
         */
        public List<KeywordMatch> search(String query, List<TextSegment> segments, int maxResults) {
            List<String> queryTerms = extractTerms(query);
            List<KeywordMatch> matches = new ArrayList<>();

            for (TextSegment segment : segments) {
                KeywordMatch match = calculateKeywordMatch(queryTerms, segment);
                if (match.getScore() > 0) {
                    matches.add(match);
                }
            }

            return matches.stream()
                    .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
                    .limit(maxResults)
                    .collect(Collectors.toList());
        }

        /**
         * 提取查询词条
         */
        private List<String> extractTerms(String query) {
            return wordPattern.matcher(query.toLowerCase())
                    .results()
                    .map(matchResult -> matchResult.group())
                    .filter(term -> term.length() > 2 && !stopWords.contains(term))
                    .distinct()
                    .collect(Collectors.toList());
        }

        /**
         * 计算关键词匹配分数
         */
        private KeywordMatch calculateKeywordMatch(List<String> queryTerms, TextSegment segment) {
            String content = segment.text().toLowerCase();
            List<String> contentTerms = extractTerms(content);

            double totalScore = 0.0;
            List<String> matchedKeywords = new ArrayList<>();

            for (String queryTerm : queryTerms) {
                double termScore = calculateTermScore(queryTerm, contentTerms, content);
                if (termScore > 0) {
                    totalScore += termScore;
                    matchedKeywords.add(queryTerm);
                }
            }

            return new KeywordMatch(segment, totalScore, matchedKeywords);
        }

        /**
         * 计算单个词条的分数
         */
        private double calculateTermScore(String term, List<String> contentTerms, String content) {
            // 精确匹配
            long exactMatches = contentTerms.stream()
                    .mapToLong(contentTerm -> contentTerm.equals(term) ? 1 : 0)
                    .sum();

            // 部分匹配
            long partialMatches = contentTerms.stream()
                    .mapToLong(contentTerm -> contentTerm.contains(term) || term.contains(contentTerm) ? 1 : 0)
                    .sum();

            // 位置加权（标题、开头的词条权重更高）
            double positionWeight = 1.0;
            int termPosition = content.indexOf(term);
            if (termPosition >= 0) {
                if (termPosition < content.length() * 0.1) { // 前10%
                    positionWeight = 1.5;
                } else if (termPosition < content.length() * 0.3) { // 前30%
                    positionWeight = 1.2;
                }
            }

            // TF-IDF 简化计算
            double tf = (double) exactMatches / contentTerms.size();
            double score = (exactMatches * 2.0 + partialMatches * 1.0) * positionWeight * tf;

            return score;
        }
    }

    // 数据传输对象
    public static class HybridSearchResult {
        private final TextSegment segment;
        private double vectorScore = 0.0;
        private double keywordScore = 0.0;
        private double finalScore = 0.0;
        private boolean foundByVector = false;
        private boolean foundByKeyword = false;
        private List<String> matchedKeywords = new ArrayList<>();

        public HybridSearchResult(TextSegment segment) {
            this.segment = segment;
        }

        // Getters and Setters
        public TextSegment getSegment() { return segment; }

        public double getVectorScore() { return vectorScore; }
        public void setVectorScore(double vectorScore) { this.vectorScore = vectorScore; }

        public double getKeywordScore() { return keywordScore; }
        public void setKeywordScore(double keywordScore) { this.keywordScore = keywordScore; }

        public double getFinalScore() { return finalScore; }
        public void setFinalScore(double finalScore) { this.finalScore = finalScore; }

        public boolean isFoundByVector() { return foundByVector; }
        public void setFoundByVector(boolean foundByVector) { this.foundByVector = foundByVector; }

        public boolean isFoundByKeyword() { return foundByKeyword; }
        public void setFoundByKeyword(boolean foundByKeyword) { this.foundByKeyword = foundByKeyword; }

        public List<String> getMatchedKeywords() { return matchedKeywords; }
        public void setMatchedKeywords(List<String> matchedKeywords) { this.matchedKeywords = matchedKeywords; }
    }

    private static class KeywordMatch {
        private final TextSegment segment;
        private final double score;
        private final List<String> matchedKeywords;

        public KeywordMatch(TextSegment segment, double score, List<String> matchedKeywords) {
            this.segment = segment;
            this.score = score;
            this.matchedKeywords = matchedKeywords;
        }

        public TextSegment getSegment() { return segment; }
        public double getScore() { return score; }
        public List<String> getMatchedKeywords() { return matchedKeywords; }
    }
}
````

## 10.5 上下文窗口管理

大语言模型的上下文窗口有限，需要合理管理检索到的内容，确保在有限的空间内提供最有价值的信息。

### 智能内容截断与优先级排序

上下文窗口管理需要在保持信息完整性的同时，优化内容的组织和截断策略：

````java
▼java复制代码package cn.codefather.rag.context;

import dev.langchain4j.data.segment.TextSegment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 上下文窗口管理服务
 * 智能管理检索内容，优化上下文利用率
 */
@Slf4j
@Service
public class ContextWindowManager {
    
    // 不同模型的上下文窗口限制
    private static final Map<String, Integer> MODEL_CONTEXT_LIMITS = Map.of(
        "qwen-max", 8000,      // 通义千问最大版本
        "qwen-plus", 4000,     // 通义千问增强版
        "qwen-turbo", 2000     // 通义千问快速版
    );
    
    // 预留空间配置
    private static final int SYSTEM_PROMPT_TOKENS = 200;  // 系统提示词预留
    private static final int USER_QUERY_TOKENS = 100;     // 用户查询预留
    private static final int RESPONSE_TOKENS = 500;       // 响应生成预留
    
    /**
     * 优化上下文内容
     * 根据模型限制和内容重要性智能截断和重组内容
     */
    public ContextOptimizationResult optimizeContext(
            String modelName,
            String userQuery,
            List<TextSegment> retrievedSegments) {
        
        log.info("开始优化上下文，模型: {}, 检索片段数: {}", modelName, retrievedSegments.size());
        
        // 1. 计算可用的上下文空间
        int maxContextTokens = MODEL_CONTEXT_LIMITS.getOrDefault(modelName, 4000);
        int availableTokens = maxContextTokens - SYSTEM_PROMPT_TOKENS - USER_QUERY_TOKENS - RESPONSE_TOKENS;
        
        log.debug("可用上下文令牌数: {}", availableTokens);
        
        // 2. 为每个片段计算优先级分数
        List<PrioritizedSegment> prioritizedSegments = calculatePriorities(userQuery, retrievedSegments);
        
        // 3. 按优先级排序
        prioritizedSegments.sort((a, b) -> Double.compare(b.getPriorityScore(), a.getPriorityScore()));
        
        // 4. 智能截断和组合
        ContextContent optimizedContent = buildOptimizedContent(prioritizedSegments, availableTokens);
        
        // 5. 构建结果
        ContextOptimizationResult result = new ContextOptimizationResult();
        result.setOptimizedContent(optimizedContent.getContent());
        result.setUsedTokens(optimizedContent.getTokenCount());
        result.setAvailableTokens(availableTokens);
        result.setIncludedSegments(optimizedContent.getIncludedSegments());
        result.setTruncatedSegments(optimizedContent.getTruncatedSegments());
        result.setOptimizationStrategy(optimizedContent.getStrategy());
        
        log.info("上下文优化完成，使用令牌: {}/{}, 包含片段: {}", 
                result.getUsedTokens(), availableTokens, result.getIncludedSegments().size());
        
        return result;
    }
    
    /**
     * 计算片段优先级
     * 基于相关性、内容质量、类型等因素
     */
    private List<PrioritizedSegment> calculatePriorities(String userQuery, List<TextSegment> segments) {
        List<PrioritizedSegment> prioritizedSegments = new ArrayList<>();
        
        for (TextSegment segment : segments) {
            double priorityScore = calculateSegmentPriority(userQuery, segment);
            prioritizedSegments.add(new PrioritizedSegment(segment, priorityScore));
        }
        
        return prioritizedSegments;
    }
    
    /**
     * 计算单个片段的优先级分数
     */
    private double calculateSegmentPriority(String userQuery, TextSegment segment) {
        double score = 0.0;
        String content = segment.text().toLowerCase();
        String query = userQuery.toLowerCase();
        
        // 1. 关键词匹配分数 (权重: 40%)
        double keywordScore = calculateKeywordMatchScore(query, content);
        score += keywordScore * 0.4;
        
        // 2. 内容质量分数 (权重: 30%)
        double qualityScore = calculateContentQualityScore(content);
        score += qualityScore * 0.3;
        
        // 3. 内容类型分数 (权重: 20%)
        double typeScore = calculateContentTypeScore(segment);
        score += typeScore * 0.2;
        
        // 4. 内容长度分数 (权重: 10%)
        double lengthScore = calculateLengthScore(content);
        score += lengthScore * 0.1;
        
        return score;
    }
    
    /**
     * 计算关键词匹配分数
     */
    private double calculateKeywordMatchScore(String query, String content) {
        String[] queryWords = query.split("\\s+");
        int matches = 0;
        int totalWords = queryWords.length;
        
        for (String word : queryWords) {
            if (word.length() > 2 && content.contains(word)) {
                matches++;
            }
        }
        
        return totalWords > 0 ? (double) matches / totalWords : 0.0;
    }
    
    /**
     * 计算内容质量分数
     */
    private double calculateContentQualityScore(String content) {
        double score = 0.5; // 基础分数
        
        // 包含代码示例加分
        if (content.contains("```") || content.contains("public class") || content.contains("function")) {
            score += 0.3;
        }
        
        // 包含具体步骤或数字加分
        if (content.matches(".*[0-9]+.*") && (content.contains("步骤") || content.contains("第"))) {
            score += 0.2;
        }
        
        // 包含专业术语加分
        if (containsTechnicalTerms(content)) {
            score += 0.2;
        }
        
        // 内容结构良好加分
        if (hasGoodStructure(content)) {
            score += 0.1;
        }
        
        return Math.min(score, 1.0);
    }
    
    /**
     * 计算内容类型分数
     */
    private double calculateContentTypeScore(TextSegment segment) {
        String contentType = segment.metadata().getString("content_type");
        String sourceCategory = segment.metadata().getString("source_category");
        
        double score = 0.5; // 基础分数
        
        // 根据内容类型调整分数
        if ("代码文档".equals(contentType)) {
            score += 0.3;
        } else if ("教程文档".equals(contentType)) {
            score += 0.2;
        } else if ("API文档".equals(contentType)) {
            score += 0.25;
        }
        
        // 根据来源类别调整分数
        if ("编程导航教程".equals(sourceCategory)) {
            score += 0.2;
        } else if ("面试鸭题库".equals(sourceCategory)) {
            score += 0.15;
        }
        
        return Math.min(score, 1.0);
    }
    
    /**
     * 计算长度分数
     * 适中长度的内容获得更高分数
     */
    private double calculateLengthScore(String content) {
        int length = content.length();
        
        if (length < 50) {
            return 0.2; // 太短
        } else if (length <= 300) {
            return 1.0; // 理想长度
        } else if (length <= 600) {
            return 0.8; // 稍长但可接受
        } else if (length <= 1000) {
            return 0.6; // 较长
        } else {
            return 0.4; // 过长
        }
    }
    
    /**
     * 检查是否包含技术术语
     */
    private boolean containsTechnicalTerms(String content) {
        String[] techTerms = {
            "java", "python", "javascript", "spring", "boot", "framework",
            "api", "database", "sql", "nosql", "redis", "mysql",
            "thread", "concurrent", "async", "sync", "algorithm", "data structure"
        };
        
        String lowerContent = content.toLowerCase();
        return Arrays.stream(techTerms).anyMatch(lowerContent::contains);
    }
    
    /**
     * 检查内容结构是否良好
     */
    private boolean hasGoodStructure(String content) {
        // 检查是否有合理的段落分割
        String[] paragraphs = content.split("\n\n");
        if (paragraphs.length > 1 && paragraphs.length <= 5) {
            return true;
        }
        
        // 检查是否有列表或步骤
        if (content.contains("1.") || content.contains("•") || content.contains("-")) {
            return true;
        }
        
        return false;
    }
    
    /**
     * 构建优化的上下文内容
     */
    private ContextContent buildOptimizedContent(List<PrioritizedSegment> prioritizedSegments, int maxTokens) {
        ContextContent contextContent = new ContextContent();
        StringBuilder contentBuilder = new StringBuilder();
        List<TextSegment> includedSegments = new ArrayList<>();
        List<TextSegment> truncatedSegments = new ArrayList<>();
        
        int usedTokens = 0;
        String strategy = "priority_based";
        
        // 策略1: 按优先级依次添加完整片段
        for (PrioritizedSegment prioritizedSegment : prioritizedSegments) {
            TextSegment segment = prioritizedSegment.getSegment();
            String segmentText = segment.text();
            int segmentTokens = estimateTokenCount(segmentText);
            
            if (usedTokens + segmentTokens <= maxTokens) {
                // 完整添加片段
                contentBuilder.append(formatSegmentForContext(segment, false));
                includedSegments.add(segment);
                usedTokens += segmentTokens;
            } else if (usedTokens < maxTokens * 0.8) {
                // 尝试截断添加
                int remainingTokens = maxTokens - usedTokens;
                String truncatedText = truncateSegment(segmentText, remainingTokens);
                
                if (!truncatedText.isEmpty()) {
                    TextSegment truncatedSegment = TextSegment.from(truncatedText, segment.metadata());
                    contentBuilder.append(formatSegmentForContext(truncatedSegment, true));
                    truncatedSegments.add(segment);
                    usedTokens += estimateTokenCount(truncatedText);
                    strategy = "priority_with_truncation";
                }
                break;
            } else {
                break;
            }
        }
        
        // 如果空间利用率不高，尝试智能重组
        if (usedTokens < maxTokens * 0.7) {
            ContextContent reorganizedContent = reorganizeContent(prioritizedSegments, maxTokens);
            if (reorganizedContent.getTokenCount() > usedTokens) {
                return reorganizedContent;
            }
        }
        
        contextContent.setContent(contentBuilder.toString());
        contextContent.setTokenCount(usedTokens);
        contextContent.setIncludedSegments(includedSegments);
        contextContent.setTruncatedSegments(truncatedSegments);
        contextContent.setStrategy(strategy);
        
        return contextContent;
    }
    
    /**
     * 智能重组内容
     * 尝试通过片段合并和重排来提高空间利用率
     */
    private ContextContent reorganizeContent(List<PrioritizedSegment> prioritizedSegments, int maxTokens) {
        // 按主题对片段进行分组
        Map<String, List<PrioritizedSegment>> topicGroups = groupSegmentsByTopic(prioritizedSegments);
        
        ContextContent contextContent = new ContextContent();
        StringBuilder contentBuilder = new StringBuilder();
        List<TextSegment> includedSegments = new ArrayList<>();
        int usedTokens = 0;
        
    // 为每个主题分配空间并合并相关片段
        for (Map.Entry<String, List<PrioritizedSegment>> entry : topicGroups.entrySet()) {
            String topic = entry.getKey();
            List<PrioritizedSegment> topicSegments = entry.getValue();
            
            // 计算该主题的权重
            double topicWeight = calculateTopicWeight(topicSegments);
            int topicTokens = (int) (maxTokens * topicWeight * 0.8); // 预留20%空间
            
            // 合并该主题下的片段
            String mergedContent = mergeTopicSegments(topicSegments, topicTokens);
            
            if (!mergedContent.isEmpty() && usedTokens + estimateTokenCount(mergedContent) <= maxTokens) {
                contentBuilder.append("【").append(topic).append("】\n");
                contentBuilder.append(mergedContent).append("\n\n");
                
                topicSegments.forEach(ps -> includedSegments.add(ps.getSegment()));
                usedTokens += estimateTokenCount(mergedContent) + 20; // 主题标题的token
            }
        }
        
        contextContent.setContent(contentBuilder.toString());
        contextContent.setTokenCount(usedTokens);
        contextContent.setIncludedSegments(includedSegments);
        contextContent.setTruncatedSegments(new ArrayList<>());
        contextContent.setStrategy("topic_reorganization");
        
        return contextContent;
    }
    
    /**
     * 按主题对片段进行分组
     */
    private Map<String, List<PrioritizedSegment>> groupSegmentsByTopic(List<PrioritizedSegment> segments) {
        Map<String, List<PrioritizedSegment>> groups = new LinkedHashMap<>();
        
        for (PrioritizedSegment segment : segments) {
            String topic = identifyTopic(segment.getSegment());
            groups.computeIfAbsent(topic, k -> new ArrayList<>()).add(segment);
        }
        
        return groups;
    }
    
    /**
     * 识别片段主题
     */
    private String identifyTopic(TextSegment segment) {
        String content = segment.text().toLowerCase();
        String contentType = segment.metadata().getString("content_type");
        
        // 根据内容特征识别主题
        if (content.contains("多线程") || content.contains("thread") || content.contains("concurrent")) {
            return "多线程编程";
        } else if (content.contains("spring") || content.contains("boot")) {
            return "Spring框架";
        } else if (content.contains("算法") || content.contains("algorithm") || content.contains("数据结构")) {
            return "算法与数据结构";
        } else if (content.contains("数据库") || content.contains("sql") || content.contains("mysql")) {
            return "数据库技术";
        } else if ("代码文档".equals(contentType)) {
            return "代码示例";
        } else if ("面试题库".equals(contentType)) {
            return "面试题解";
        } else {
            return "通用技术";
        }
    }
    
    /**
     * 计算主题权重
     */
    private double calculateTopicWeight(List<PrioritizedSegment> topicSegments) {
        if (topicSegments.isEmpty()) return 0.0;
        
        double totalScore = topicSegments.stream()
                .mapToDouble(PrioritizedSegment::getPriorityScore)
                .sum();
        
        return Math.min(totalScore / topicSegments.size(), 0.4); // 单个主题最多占40%空间
    }
    
    /**
     * 合并主题片段
     */
    private String mergeTopicSegments(List<PrioritizedSegment> topicSegments, int maxTokens) {
        StringBuilder mergedBuilder = new StringBuilder();
        int usedTokens = 0;
        
        // 按优先级排序
        topicSegments.sort((a, b) -> Double.compare(b.getPriorityScore(), a.getPriorityScore()));
        
        for (PrioritizedSegment segment : topicSegments) {
            String segmentText = segment.getSegment().text();
            int segmentTokens = estimateTokenCount(segmentText);
            
            if (usedTokens + segmentTokens <= maxTokens) {
                mergedBuilder.append(segmentText).append("\n\n");
                usedTokens += segmentTokens;
            } else {
                // 尝试部分添加
                int remainingTokens = maxTokens - usedTokens;
                if (remainingTokens > 50) {
                    String truncated = truncateSegment(segmentText, remainingTokens);
                    mergedBuilder.append(truncated).append("...\n\n");
                }
                break;
            }
        }
        
        return mergedBuilder.toString().trim();
    }
    
    /**
     * 格式化片段用于上下文
     */
    private String formatSegmentForContext(TextSegment segment, boolean isTruncated) {
        StringBuilder formatted = new StringBuilder();
        
        // 添加来源信息
        String source = segment.metadata().getString("source_category");
        if (source != null) {
            formatted.append("【来源: ").append(source).append("】\n");
        }
        
        // 添加内容
        formatted.append(segment.text());
        
        // 标记截断
        if (isTruncated) {
            formatted.append("\n[内容已截断...]");
        }
        
        formatted.append("\n\n");
        return formatted.toString();
    }
    
    /**
     * 截断片段内容
     */
    private String truncateSegment(String content, int maxTokens) {
        int estimatedTokens = estimateTokenCount(content);
        
        if (estimatedTokens <= maxTokens) {
            return content;
        }
        
        // 按比例截断
        double ratio = (double) maxTokens / estimatedTokens * 0.9; // 预留10%空间
        int targetLength = (int) (content.length() * ratio);
        
        if (targetLength < 50) {
            return ""; // 太短的截断没有意义
        }
        
        // 尝试在句子边界截断
        String truncated = content.substring(0, Math.min(targetLength, content.length()));
        int lastSentenceEnd = Math.max(
            truncated.lastIndexOf("。"),
            Math.max(truncated.lastIndexOf("！"), truncated.lastIndexOf("？"))
        );
        
        if (lastSentenceEnd > targetLength * 0.7) {
            return truncated.substring(0, lastSentenceEnd + 1);
        }
        
        // 在词边界截断
        int lastWordEnd = truncated.lastIndexOf(" ");
        if (lastWordEnd > targetLength * 0.8) {
            return truncated.substring(0, lastWordEnd);
        }
        
        return truncated;
    }
    
    /**
     * 估算token数量
     * 简化实现，实际项目中应使用精确的tokenizer
     */
    private int estimateTokenCount(String text) {
        // 粗略估算：中文字符按1.5个token计算，英文单词按1个token计算
        int chineseChars = 0;
        int englishWords = 0;
        
        for (char c : text.toCharArray()) {
            if (c >= 0x4e00 && c <= 0x9fff) {
                chineseChars++;
            }
        }
        
        englishWords = text.split("\\s+").length;
        
        return (int) (chineseChars * 1.5 + englishWords);
    }
    
    // 内部类定义
    private static class PrioritizedSegment {
        private final TextSegment segment;
        private final double priorityScore;
        
        public PrioritizedSegment(TextSegment segment, double priorityScore) {
            this.segment = segment;
            this.priorityScore = priorityScore;
        }
        
        public TextSegment getSegment() { return segment; }
        public double getPriorityScore() { return priorityScore; }
    }
    
    private static class ContextContent {
        private String content = "";
        private int tokenCount = 0;
        private List<TextSegment> includedSegments = new ArrayList<>();
        private List<TextSegment> truncatedSegments = new ArrayList<>();
        private String strategy = "";
        
        // Getters and Setters
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        
        public int getTokenCount() { return tokenCount; }
        public void setTokenCount(int tokenCount) { this.tokenCount = tokenCount; }
        
        public List<TextSegment> getIncludedSegments() { return includedSegments; }
        public void setIncludedSegments(List<TextSegment> includedSegments) { 
            this.includedSegments = includedSegments; 
        }
        
        public List<TextSegment> getTruncatedSegments() { return truncatedSegments; }
        public void setTruncatedSegments(List<TextSegment> truncatedSegments) { 
            this.truncatedSegments = truncatedSegments; 
        }
        
        public String getStrategy() { return strategy; }
        public void setStrategy(String strategy) { this.strategy = strategy; }
    }
    
    public static class ContextOptimizationResult {
        private String optimizedContent;
        private int usedTokens;
        private int availableTokens;
        private List<TextSegment> includedSegments;
        private List<TextSegment> truncatedSegments;
        private String optimizationStrategy;
        
        // Getters and Setters
        public String getOptimizedContent() { return optimizedContent; }
        public void setOptimizedContent(String optimizedContent) { 
            this.optimizedContent = optimizedContent; 
        }
        
        public int getUsedTokens() { return usedTokens; }
        public void setUsedTokens(int usedTokens) { this.usedTokens = usedTokens; }
        
        public int getAvailableTokens() { return availableTokens; }
        public void setAvailableTokens(int availableTokens) { this.availableTokens = availableTokens; }
        
        public List<TextSegment> getIncludedSegments() { return includedSegments; }
        public void setIncludedSegments(List<TextSegment> includedSegments) { 
            this.includedSegments = includedSegments; 
        }
        
        public List<TextSegment> getTruncatedSegments() { return truncatedSegments; }
        public void setTruncatedSegments(List<TextSegment> truncatedSegments) { 
            this.truncatedSegments = truncatedSegments; 
        }
        
        public String getOptimizationStrategy() { return optimizationStrategy; }
        public void setOptimizationStrategy(String optimizationStrategy) { 
            this.optimizationStrategy = optimizationStrategy; 
        }
        
        /**
         * 获取空间利用率
         */
        public double getUtilizationRate() {
            return availableTokens > 0 ? (double) usedTokens / availableTokens : 0.0;
        }
    }
}
````

## 10.6 RAG 评估与优化

RAG 系统的持续优化需要建立完善的评估体系，通过量化指标监控系统性能，并基于评估结果进行针对性改进。

### RAG 系统评估框架

建立多维度的评估体系，从准确性、相关性、完整性等角度全面评估 RAG 系统性能：

```java
▼java复制代码package cn.codefather.rag.demo;


import dev.langchain4j.community.model.dashscope.QwenChatModel;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.chat.ChatModel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

/**
 * RAG 系统评估服务
 * 提供全面的 RAG 系统性能评估和优化建议
 */
@Slf4j
@Service
public class RAGEvaluationService {

    @Value("${qwen.api.key}")
    private String qwenApiKey;

    private final ChatModel evaluationModel;
    private final ExecutorService executorService;

    public RAGEvaluationService() {
        this.evaluationModel = QwenChatModel.builder()
                .apiKey(qwenApiKey)
                .modelName("qwen-max")
                .temperature(0.1f) // 低温度确保评估的一致性
                .build();

        this.executorService = Executors.newFixedThreadPool(5);
    }

    /**
     * 全面评估 RAG 系统
     */
    public RAGEvaluationReport evaluateRAGSystem(List<EvaluationCase> testCases) {
        log.info("开始评估 RAG 系统，测试用例数: {}", testCases.size());

        RAGEvaluationReport report = new RAGEvaluationReport();
        List<CaseEvaluationResult> caseResults = new ArrayList<>();

        // 并行评估所有测试用例
        List<CompletableFuture<CaseEvaluationResult>> futures = testCases.stream()
                .map(testCase -> CompletableFuture.supplyAsync(
                        () -> evaluateSingleCase(testCase), executorService))
                .collect(Collectors.toList());

        // 收集评估结果
        for (CompletableFuture<CaseEvaluationResult> future : futures) {
            try {
                CaseEvaluationResult result = future.get();
                caseResults.add(result);
            } catch (Exception e) {
                log.error("评估用例失败", e);
            }
        }

        // 计算整体指标
        report.setCaseResults(caseResults);
        report.setOverallMetrics(calculateOverallMetrics(caseResults));
        report.setPerformanceAnalysis(analyzePerformance(caseResults));
        report.setOptimizationSuggestions(generateOptimizationSuggestions(caseResults));

        log.info("RAG 系统评估完成，整体准确率: {:.2f}%",
                report.getOverallMetrics().getAccuracy() * 100);

        return report;
    }

    /**
     * 评估单个测试用例
     */
    private CaseEvaluationResult evaluateSingleCase(EvaluationCase testCase) {
        log.debug("评估测试用例: {}", testCase.getQuery());

        CaseEvaluationResult result = new CaseEvaluationResult();
        result.setTestCase(testCase);

        try {
            // 1. 检索相关性评估
            double retrievalRelevance = evaluateRetrievalRelevance(
                    testCase.getQuery(), testCase.getRetrievedSegments());

            // 2. 答案准确性评估
            double answerAccuracy = evaluateAnswerAccuracy(
                    testCase.getQuery(), testCase.getExpectedAnswer(), testCase.getActualAnswer());

            // 3. 答案完整性评估
            double answerCompleteness = evaluateAnswerCompleteness(
                    testCase.getExpectedAnswer(), testCase.getActualAnswer());

            // 4. 答案一致性评估
            double answerConsistency = evaluateAnswerConsistency(
                    testCase.getRetrievedSegments(), testCase.getActualAnswer());

            // 5. 响应时间评估
            double responseTimeScore = evaluateResponseTime(testCase.getResponseTime());

            // 设置评估结果
            result.setRetrievalRelevance(retrievalRelevance);
            result.setAnswerAccuracy(answerAccuracy);
            result.setAnswerCompleteness(answerCompleteness);
            result.setAnswerConsistency(answerConsistency);
            result.setResponseTimeScore(responseTimeScore);

            // 计算综合分数
            double overallScore = calculateOverallScore(
                    retrievalRelevance, answerAccuracy, answerCompleteness,
                    answerConsistency, responseTimeScore);
            result.setOverallScore(overallScore);

            // 生成详细反馈
            result.setDetailedFeedback(generateDetailedFeedback(result));

        } catch (Exception e) {
            log.error("评估用例失败: {}", testCase.getQuery(), e);
            result.setOverallScore(0.0);
            result.setDetailedFeedback("评估过程中出现错误: " + e.getMessage());
        }

        return result;
    }

    /**
     * 评估检索相关性
     * 检查检索到的文档片段与查询的相关程度
     */
    private double evaluateRetrievalRelevance(String query, List<TextSegment> retrievedSegments) {
        if (retrievedSegments == null || retrievedSegments.isEmpty()) {
            return 0.0;
        }

        try {
            String evaluationPrompt = buildRetrievalEvaluationPrompt(query, retrievedSegments);
            String response = evaluationModel.chat(evaluationPrompt);

            return parseEvaluationScore(response);

        } catch (Exception e) {
            log.error("检索相关性评估失败", e);
            return 0.5; // 默认中等分数
        }
    }

    /**
     * 构建检索评估提示词
     */
    private String buildRetrievalEvaluationPrompt(String query, List<TextSegment> segments) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("请评估以下检索结果与用户查询的相关性。\n\n");
        prompt.append("用户查询：").append(query).append("\n\n");
        prompt.append("检索结果：\n");

        for (int i = 0; i < Math.min(segments.size(), 5); i++) {
            prompt.append("片段").append(i + 1).append("：")
                    .append(segments.get(i).text().substring(0, Math.min(200, segments.get(i).text().length())))
                    .append("...\n\n");
        }

        prompt.append("评估标准：\n");
        prompt.append("- 1分：完全不相关\n");
        prompt.append("- 2分：略有相关\n");
        prompt.append("- 3分：部分相关\n");
        prompt.append("- 4分：大部分相关\n");
        prompt.append("- 5分：高度相关\n\n");
        prompt.append("请只返回1-5之间的分数，不需要解释。");

        return prompt.toString();
    }

    /**
     * 评估答案准确性
     */
    private double evaluateAnswerAccuracy(String query, String expectedAnswer, String actualAnswer) {
        try {
            String evaluationPrompt = String.format(
                    "请评估以下答案的准确性：\n\n" +
                            "问题：%s\n\n" +
                            "期望答案：%s\n\n" +
                            "实际答案：%s\n\n" +
                            "评估标准：\n" +
                            "- 1分：完全错误\n" +
                            "- 2分：大部分错误\n" +
                            "- 3分：部分正确\n" +
                            "- 4分：大部分正确\n" +
                            "- 5分：完全正确\n\n" +
                            "请只返回1-5之间的分数。",
                    query, expectedAnswer, actualAnswer
            );

            String response = evaluationModel.chat(evaluationPrompt);
            return parseEvaluationScore(response);

        } catch (Exception e) {
            log.error("答案准确性评估失败", e);
            return 0.5;
        }
    }

    /**
     * 评估答案完整性
     */
    private double evaluateAnswerCompleteness(String expectedAnswer, String actualAnswer) {
        try {
            // 简单的完整性评估：比较关键信息点
            Set<String> expectedKeywords = extractKeywords(expectedAnswer);
            Set<String> actualKeywords = extractKeywords(actualAnswer);

            if (expectedKeywords.isEmpty()) {
                return 1.0;
            }

            // 计算关键词覆盖率
            long matchedKeywords = expectedKeywords.stream()
                    .mapToLong(keyword -> actualKeywords.contains(keyword) ? 1 : 0)
                    .sum();

            double coverageRate = (double) matchedKeywords / expectedKeywords.size();

            // 使用 LLM 进行更详细的完整性评估
            String evaluationPrompt = String.format(
                    "请评估答案的完整性：\n\n" +
                            "期望答案：%s\n\n" +
                            "实际答案：%s\n\n" +
                            "评估标准：\n" +
                            "- 1分：严重不完整\n" +
                            "- 2分：不够完整\n" +
                            "- 3分：基本完整\n" +
                            "- 4分：比较完整\n" +
                            "- 5分：非常完整\n\n" +
                            "请只返回1-5之间的分数。",
                    expectedAnswer, actualAnswer
            );

            String response = evaluationModel.chat(evaluationPrompt);
            double llmScore = parseEvaluationScore(response);

            // 综合关键词覆盖率和 LLM 评估
            return (coverageRate + llmScore / 5.0) / 2.0;

        } catch (Exception e) {
            log.error("答案完整性评估失败", e);
            return 0.5;
        }
    }

    /**
     * 评估答案一致性
     * 检查答案是否与检索到的内容一致
     */
    private double evaluateAnswerConsistency(List<TextSegment> retrievedSegments, String actualAnswer) {
        if (retrievedSegments == null || retrievedSegments.isEmpty()) {
            return 1.0; // 没有检索内容时认为一致
        }

        try {
            // 提取检索内容的关键信息
            String retrievedContent = retrievedSegments.stream()
                    .map(TextSegment::text)
                    .collect(Collectors.joining("\n\n"));

            String evaluationPrompt = String.format(
                    "请评估答案与检索内容的一致性：\n\n" +
                            "检索内容：%s\n\n" +
                            "生成答案：%s\n\n" +
                            "评估标准：\n" +
                            "- 1分：严重不一致或矛盾\n" +
                            "- 2分：部分不一致\n" +
                            "- 3分：基本一致\n" +
                            "- 4分：高度一致\n" +
                            "- 5分：完全一致\n\n" +
                            "请只返回1-5之间的分数。",
                    retrievedContent.substring(0, Math.min(1000, retrievedContent.length())),
                    actualAnswer
            );

            String response = evaluationModel.chat(evaluationPrompt);
            return parseEvaluationScore(response);

        } catch (Exception e) {
            log.error("答案一致性评估失败", e);
            return 0.5;
        }
    }

    /**
     * 评估响应时间
     */
    private double evaluateResponseTime(long responseTimeMs) {
        // 响应时间评分标准（毫秒）
        if (responseTimeMs <= 1000) {
            return 1.0; // 优秀
        } else if (responseTimeMs <= 3000) {
            return 0.8; // 良好
        } else if (responseTimeMs <= 5000) {
            return 0.6; // 一般
        } else if (responseTimeMs <= 10000) {
            return 0.4; // 较慢
        } else {
            return 0.2; // 很慢
        }
    }

    /**
     * 计算综合分数
     */
    private double calculateOverallScore(double retrievalRelevance, double answerAccuracy,
                                         double answerCompleteness, double answerConsistency,
                                         double responseTimeScore) {
        // 权重配置
        double retrievalWeight = 0.2;
        double accuracyWeight = 0.4;
        double completenessWeight = 0.2;
        double consistencyWeight = 0.15;
        double responseTimeWeight = 0.05;

        return retrievalRelevance * retrievalWeight +
                answerAccuracy * accuracyWeight +
                answerCompleteness * completenessWeight +
                answerConsistency * consistencyWeight +
                responseTimeScore * responseTimeWeight;
    }

    /**
     * 解析评估分数
     */
    private double parseEvaluationScore(String response) {
        try {
            // 提取数字分数
            String cleanedResponse = response.replaceAll("[^0-9.]", "");
            double score = Double.parseDouble(cleanedResponse);

            // 将1-5分数转换为0-1范围
            return Math.max(0.0, Math.min(1.0, (score - 1) / 4.0));

        } catch (Exception e) {
            log.warn("解析评估分数失败: {}", response);
            return 0.5; // 默认中等分数
        }
    }

    /**
     * 提取关键词
     */
    private Set<String> extractKeywords(String text) {
        return Arrays.stream(text.toLowerCase().split("\\s+"))
                .filter(word -> word.length() > 3)
                .filter(word -> !isStopWord(word))
                .collect(Collectors.toSet());
    }

    /**
     * 判断是否为停用词
     */
    private boolean isStopWord(String word) {
        Set<String> stopWords = Set.of(
                "的", "是", "在", "有", "和", "了", "与", "及", "或", "但", "而", "等", "这", "那",
                "the", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
                "do", "does", "did", "will", "would", "could", "should", "may", "might", "can"
        );
        return stopWords.contains(word.toLowerCase());
    }

    /**
     * 生成详细反馈
     */
    private String generateDetailedFeedback(CaseEvaluationResult result) {
        StringBuilder feedback = new StringBuilder();

        feedback.append("评估详情：\n");
        feedback.append(String.format("- 检索相关性: %.2f\n", result.getRetrievalRelevance()));
        feedback.append(String.format("- 答案准确性: %.2f\n", result.getAnswerAccuracy()));
        feedback.append(String.format("- 答案完整性: %.2f\n", result.getAnswerCompleteness()));
        feedback.append(String.format("- 答案一致性: %.2f\n", result.getAnswerConsistency()));
        feedback.append(String.format("- 响应时间评分: %.2f\n", result.getResponseTimeScore()));
        feedback.append(String.format("- 综合评分: %.2f\n\n", result.getOverallScore()));

        // 生成改进建议
        if (result.getRetrievalRelevance() < 0.7) {
            feedback.append("建议优化检索策略，提高文档相关性。\n");
        }
        if (result.getAnswerAccuracy() < 0.7) {
            feedback.append("建议改进答案生成逻辑，提高准确性。\n");
        }
        if (result.getAnswerCompleteness() < 0.7) {
            feedback.append("建议增加答案内容的完整性。\n");
        }
        if (result.getResponseTimeScore() < 0.6) {
            feedback.append("建议优化系统性能，减少响应时间。\n");
        }

        return feedback.toString();
    }

    /**
     * 计算整体指标
     */
    private OverallMetrics calculateOverallMetrics(List<CaseEvaluationResult> results) {
        if (results.isEmpty()) {
            return new OverallMetrics();
        }

        OverallMetrics metrics = new OverallMetrics();

        double avgAccuracy = results.stream()
                .mapToDouble(CaseEvaluationResult::getAnswerAccuracy)
                .average().orElse(0.0);

        double avgRelevance = results.stream()
                .mapToDouble(CaseEvaluationResult::getRetrievalRelevance)
                .average().orElse(0.0);

        double avgCompleteness = results.stream()
                .mapToDouble(CaseEvaluationResult::getAnswerCompleteness)
                .average().orElse(0.0);

        double avgConsistency = results.stream()
                .mapToDouble(CaseEvaluationResult::getAnswerConsistency)
                .average().orElse(0.0);

        double avgResponseTime = results.stream()
                .mapToDouble(CaseEvaluationResult::getResponseTimeScore)
                .average().orElse(0.0);

        double avgOverallScore = results.stream()
                .mapToDouble(CaseEvaluationResult::getOverallScore)
                .average().orElse(0.0);

        metrics.setAccuracy(avgAccuracy);
        metrics.setRelevance(avgRelevance);
        metrics.setCompleteness(avgCompleteness);
        metrics.setConsistency(avgConsistency);
        metrics.setResponseTime(avgResponseTime);
        metrics.setOverallScore(avgOverallScore);

        // 计算通过率（综合分数大于0.7的比例）
        long passCount = results.stream()
                .mapToLong(result -> result.getOverallScore() > 0.7 ? 1 : 0)
                .sum();
        metrics.setPassRate((double) passCount / results.size());

        return metrics;
    }

    /**
     * 分析性能表现
     */
    private String analyzePerformance(List<CaseEvaluationResult> results) {
        StringBuilder analysis = new StringBuilder();

        OverallMetrics metrics = calculateOverallMetrics(results);

        analysis.append("性能分析报告：\n\n");
        analysis.append(String.format("整体表现：%.1f%% 的测试用例达到良好水平\n", metrics.getPassRate() * 100));

        // 识别强项和弱项
        Map<String, Double> dimensions = Map.of(
                "检索相关性", metrics.getRelevance(),
                "答案准确性", metrics.getAccuracy(),
                "答案完整性", metrics.getCompleteness(),
                "答案一致性", metrics.getConsistency(),
                "响应速度", metrics.getResponseTime()
        );

        String bestDimension = dimensions.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("无");

        String worstDimension = dimensions.entrySet().stream()
                .min(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("无");

        analysis.append(String.format("表现最佳维度：%s (%.2f)\n", bestDimension, dimensions.get(bestDimension)));
        analysis.append(String.format("需要改进维度：%s (%.2f)\n", worstDimension, dimensions.get(worstDimension)));

        return analysis.toString();
    }

    /**
     * 生成优化建议
     */
    private List<String> generateOptimizationSuggestions(List<CaseEvaluationResult> results) {
        List<String> suggestions = new ArrayList<>();
        OverallMetrics metrics = calculateOverallMetrics(results);

        if (metrics.getRelevance() < 0.7) {
            suggestions.add("优化检索算法：考虑使用混合搜索策略，结合向量搜索和关键词搜索");
            suggestions.add("改进查询扩展：使用同义词扩展和查询重写技术");
        }

        if (metrics.getAccuracy() < 0.7) {
            suggestions.add("提升答案质量：优化提示词模板，增加更多上下文信息");
            suggestions.add("加强模型微调：使用领域特定数据对模型进行微调");
        }

        if (metrics.getCompleteness() < 0.7) {
            suggestions.add("增加内容覆盖：扩充知识库，确保关键信息的完整性");
            suggestions.add("优化内容组织：改进文档分割策略，保持信息的连贯性");
        }

        if (metrics.getConsistency() < 0.7) {
            suggestions.add("强化一致性检查：增加答案与检索内容的一致性验证机制");
            suggestions.add("改进内容过滤：提高检索内容的质量过滤标准");
        }

        if (metrics.getResponseTime() < 0.6) {
            suggestions.add("性能优化：使用缓存机制减少重复计算");
            suggestions.add("并行处理：优化检索和生成的并行执行策略");
        }

        return suggestions;
    }

    // 数据传输对象
    public static class EvaluationCase {
        private String query;
        private String expectedAnswer;
        private String actualAnswer;
        private List<TextSegment> retrievedSegments;
        private long responseTime;

        // Constructors, Getters and Setters
        public EvaluationCase() {}

        public EvaluationCase(String query, String expectedAnswer, String actualAnswer,
                              List<TextSegment> retrievedSegments, long responseTime) {
            this.query = query;
            this.expectedAnswer = expectedAnswer;
            this.actualAnswer = actualAnswer;
            this.retrievedSegments = retrievedSegments;
            this.responseTime = responseTime;
        }

        public String getQuery() { return query; }
        public void setQuery(String query) { this.query = query; }

        public String getExpectedAnswer() { return expectedAnswer; }
        public void setExpectedAnswer(String expectedAnswer) { this.expectedAnswer = expectedAnswer; }

        public String getActualAnswer() { return actualAnswer; }
        public void setActualAnswer(String actualAnswer) { this.actualAnswer = actualAnswer; }

        public List<TextSegment> getRetrievedSegments() { return retrievedSegments; }
        public void setRetrievedSegments(List<TextSegment> retrievedSegments) {
            this.retrievedSegments = retrievedSegments;
        }

        public long getResponseTime() { return responseTime; }
        public void setResponseTime(long responseTime) { this.responseTime = responseTime; }
    }

    public static class CaseEvaluationResult {
        private EvaluationCase testCase;
        private double retrievalRelevance;
        private double answerAccuracy;
        private double answerCompleteness;
        private double answerConsistency;
        private double responseTimeScore;
        private double overallScore;
        private String detailedFeedback;

        // Getters and Setters
        public EvaluationCase getTestCase() { return testCase; }
        public void setTestCase(EvaluationCase testCase) { this.testCase = testCase; }

        public double getRetrievalRelevance() { return retrievalRelevance; }
        public void setRetrievalRelevance(double retrievalRelevance) { this.retrievalRelevance = retrievalRelevance; }

        public double getAnswerAccuracy() { return answerAccuracy; }
        public void setAnswerAccuracy(double answerAccuracy) { this.answerAccuracy = answerAccuracy; }

        public double getAnswerCompleteness() { return answerCompleteness; }
        public void setAnswerCompleteness(double answerCompleteness) { this.answerCompleteness = answerCompleteness; }

        public double getAnswerConsistency() { return answerConsistency; }
        public void setAnswerConsistency(double answerConsistency) { this.answerConsistency = answerConsistency; }

        public double getResponseTimeScore() { return responseTimeScore; }
        public void setResponseTimeScore(double responseTimeScore) { this.responseTimeScore = responseTimeScore; }

        public double getOverallScore() { return overallScore; }
        public void setOverallScore(double overallScore) { this.overallScore = overallScore; }

        public String getDetailedFeedback() { return detailedFeedback; }
        public void setDetailedFeedback(String detailedFeedback) { this.detailedFeedback = detailedFeedback; }
    }

    public static class OverallMetrics {
        private double accuracy;
        private double relevance;
        private double completeness;
        private double consistency;
        private double responseTime;
        private double overallScore;
        private double passRate;

        // Getters and Setters
        public double getAccuracy() { return accuracy; }
        public void setAccuracy(double accuracy) { this.accuracy = accuracy; }

        public double getRelevance() { return relevance; }
        public void setRelevance(double relevance) { this.relevance = relevance; }

        public double getCompleteness() { return completeness; }
        public void setCompleteness(double completeness) { this.completeness = completeness; }

        public double getConsistency() { return consistency; }
        public void setConsistency(double consistency) { this.consistency = consistency; }

        public double getResponseTime() { return responseTime; }
        public void setResponseTime(double responseTime) { this.responseTime = responseTime; }

        public double getOverallScore() { return overallScore; }
        public void setOverallScore(double overallScore) { this.overallScore = overallScore; }

        public double getPassRate() { return passRate; }
        public void setPassRate(double passRate) { this.passRate = passRate; }
    }

    public static class RAGEvaluationReport {
        private List<CaseEvaluationResult> caseResults;
        private OverallMetrics overallMetrics;
        private String performanceAnalysis;
        private List<String> optimizationSuggestions;
        private Date evaluationDate;

        public RAGEvaluationReport() {
            this.evaluationDate = new Date();
        }

        // Getters and Setters
        public List<CaseEvaluationResult> getCaseResults() { return caseResults; }
        public void setCaseResults(List<CaseEvaluationResult> caseResults) { this.caseResults = caseResults; }

        public OverallMetrics getOverallMetrics() { return overallMetrics; }
        public void setOverallMetrics(OverallMetrics overallMetrics) { this.overallMetrics = overallMetrics; }

        public String getPerformanceAnalysis() { return performanceAnalysis; }
        public void setPerformanceAnalysis(String performanceAnalysis) { this.performanceAnalysis = performanceAnalysis; }

        public List<String> getOptimizationSuggestions() { return optimizationSuggestions; }
        public void setOptimizationSuggestions(List<String> optimizationSuggestions) {
            this.optimizationSuggestions = optimizationSuggestions;
        }

        public Date getEvaluationDate() { return evaluationDate; }
        public void setEvaluationDate(Date evaluationDate) { this.evaluationDate = evaluationDate; }
    }
}
```

## 10.7 LangChain4j 实现 RAG 系统

基于前面学习的理论和组件，让我们使用 LangChain4j 构建一个完整的企业级 RAG 系统，整合所有最佳实践。

### 完整 RAG 系统实现

这是一个生产就绪的 RAG 系统实现，集成了文档处理、智能检索、上下文优化和性能监控等功能：

```java
▼java复制代码package cn.codefather.rag.demo;


import dev.langchain4j.community.model.dashscope.QwenChatModel;
import dev.langchain4j.community.model.dashscope.QwenEmbeddingModel;
import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * 完整的企业级 RAG 系统实现
 * 整合文档处理、智能检索、上下文优化等功能
 */
@Slf4j
@Service
public class EnterpriseRAGSystem {

    @Value("${qwen.api.key}")
    private String qwenApiKey;

    @Value("${rag.model.name:qwen-max}")
    private String modelName;

    @Value("${rag.max.results:5}")
    private int maxResults;

    @Value("${rag.enable.evaluation:true}")
    private boolean enableEvaluation;

    // 核心组件
    private final DocumentLoaderService documentLoader;
    private final IntelligentDocumentSplitter documentSplitter;
    private final HybridSearchService hybridSearch;
    private final ContextWindowManager contextManager;
    private final RetrievalOptimizationService retrievalOptimizer;
    private final RAGEvaluationService evaluationService;

    // LangChain4j 组件
    private EmbeddingModel embeddingModel;
    private ChatModel chatModel;
    private EmbeddingStore<TextSegment> embeddingStore;

    // 系统状态
    private final List<TextSegment> allSegments;
    private final ExecutorService executorService;
    private volatile boolean systemReady;

    public EnterpriseRAGSystem(DocumentLoaderService documentLoader,
                               IntelligentDocumentSplitter documentSplitter,
                               HybridSearchService hybridSearch,
                               ContextWindowManager contextManager,
                               RetrievalOptimizationService retrievalOptimizer,
                               RAGEvaluationService evaluationService) {
        this.documentLoader = documentLoader;
        this.documentSplitter = documentSplitter;
        this.hybridSearch = hybridSearch;
        this.contextManager = contextManager;
        this.retrievalOptimizer = retrievalOptimizer;
        this.evaluationService = evaluationService;

        this.allSegments = new ArrayList<>();
        this.executorService = Executors.newFixedThreadPool(10);
        this.systemReady = false;
    }

    @PostConstruct
    public void initialize() {
        log.info("开始初始化企业级 RAG 系统");

        try {
            // 1. 初始化 LangChain4j 组件
            initializeLangChainComponents();

            // 2. 加载和处理文档
            loadAndProcessDocuments();

            // 3. 系统就绪
            this.systemReady = true;
            log.info("企业级 RAG 系统初始化完成，共加载 {} 个文档片段", allSegments.size());

        } catch (Exception e) {
            log.error("RAG 系统初始化失败", e);
            throw new RuntimeException("无法初始化 RAG 系统", e);
        }
    }

    /**
     * 初始化 LangChain4j 组件
     */
    private void initializeLangChainComponents() {
        log.info("初始化 LangChain4j 组件");

        // 初始化嵌入模型
        this.embeddingModel = QwenEmbeddingModel.builder()
                .apiKey(qwenApiKey)
                .modelName("text-embedding-v1")
                .build();

        // 初始化聊天模型
        this.chatModel = QwenChatModel.builder()
                .apiKey(qwenApiKey)
                .modelName(modelName)
                .temperature(0.3f)
                .maxTokens(2000)
                .build();

        // 初始化向量存储
        this.embeddingStore = new InMemoryEmbeddingStore<>();

        log.info("LangChain4j 组件初始化完成");
    }

    /**
     * 加载和处理文档
     */
    private void loadAndProcessDocuments() {
        log.info("开始加载和处理文档");

        // 这里可以从配置文件或数据库中获取文档路径
        String[] documentPaths = {
                "docs/programming-guide",
                "docs/interview-questions",
                "docs/algorithm-tutorials"
        };

        for (String path : documentPaths) {
            try {
                processDocumentDirectory(path);
            } catch (Exception e) {
                log.warn("处理文档目录失败: {}", path, e);
            }
        }

        log.info("文档加载和处理完成");
    }

    /**
     * 处理文档目录
     */
    private void processDocumentDirectory(String directoryPath) {
        log.info("处理文档目录: {}", directoryPath);

        // 1. 加载文档
        List<Document> documents = documentLoader.loadDocuments(directoryPath);

        // 2. 分割文档
        for (Document document : documents) {
            try {
                List<TextSegment> segments = documentSplitter.split(document);
                allSegments.addAll(segments);

                // 3. 向量化并存储
                for (TextSegment segment : segments) {
                    dev.langchain4j.data.embedding.Embedding embedding =
                            embeddingModel.embed(segment).content();
                    embeddingStore.add(embedding, segment);
                }

                log.debug("处理文档完成: {}, 生成 {} 个片段",
                        document.metadata().getString("file_name"), segments.size());

            } catch (Exception e) {
                log.error("处理文档失败: {}", document.metadata().getString("file_name"), e);
            }
        }
    }

    /**
     * 智能问答接口
     * 这是 RAG 系统的主要对外接口
     */
    public RAGResponse query(String userQuery) {
        if (!systemReady) {
            throw new IllegalStateException("RAG 系统尚未就绪");
        }

        log.info("处理用户查询: {}", userQuery);
        long startTime = System.currentTimeMillis();

        try {
            // 1. 混合检索
            List<HybridSearchService.HybridSearchResult> searchResults =
                    hybridSearch.hybridSearch(userQuery, embeddingStore, allSegments, maxResults * 2);

            // 2. 提取检索到的片段
            List<TextSegment> retrievedSegments = searchResults.stream()
                    .map(HybridSearchService.HybridSearchResult::getSegment)
                    .toList();

            // 3. 上下文优化
            ContextWindowManager.ContextOptimizationResult contextResult =
                    contextManager.optimizeContext(modelName, userQuery, retrievedSegments);

            // 4. 生成答案
            String answer = generateAnswer(userQuery, contextResult.getOptimizedContent());

            // 5. 构建响应
            long responseTime = System.currentTimeMillis() - startTime;
            RAGResponse response = buildRAGResponse(userQuery, answer, searchResults,
                    contextResult, responseTime);

            // 6. 异步评估（如果启用）
            if (enableEvaluation) {
                performAsyncEvaluation(userQuery, answer, retrievedSegments, responseTime);
            }

            log.info("查询处理完成，耗时: {}ms", responseTime);
            return response;

        } catch (Exception e) {
            log.error("查询处理失败", e);
            throw new RuntimeException("无法处理查询: " + userQuery, e);
        }
    }

    /**
     * 生成答案
     */
    private String generateAnswer(String userQuery, String optimizedContext) {
        String prompt = buildAnswerGenerationPrompt(userQuery, optimizedContext);

        try {
            return chatModel.chat(prompt);
        } catch (Exception e) {
            log.error("答案生成失败", e);
            return "抱歉，我无法为您的问题生成满意的答案。建议您访问编程导航网站获取更多帮助。";
        }
    }

    /**
     * 构建答案生成提示词
     */
    private String buildAnswerGenerationPrompt(String userQuery, String context) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("你是编程导航的智能助手，专门帮助程序员解答技术问题。\n\n");

        prompt.append("请基于以下知识内容回答用户问题：\n\n");
        prompt.append("知识内容：\n");
        prompt.append(context);
        prompt.append("\n\n");

        prompt.append("用户问题：").append(userQuery).append("\n\n");

        prompt.append("回答要求：\n");
        prompt.append("1. 基于提供的知识内容进行回答，确保准确性\n");
        prompt.append("2. 如果知识内容不足以完整回答问题，请诚实说明\n");
        prompt.append("3. 可以适当推荐编程导航、面试鸭、算法导航等相关资源\n");
        prompt.append("4. 回答要结构清晰、重点突出、易于理解\n");
        prompt.append("5. 如果涉及代码，请提供具体的示例\n\n");

        prompt.append("回答：");

        return prompt.toString();
    }

    /**
     * 构建 RAG 响应
     */
    private RAGResponse buildRAGResponse(String query, String answer,
                                         List<HybridSearchService.HybridSearchResult> searchResults,
                                         ContextWindowManager.ContextOptimizationResult contextResult,
                                         long responseTime) {
        RAGResponse response = new RAGResponse();

        response.setQuery(query);
        response.setAnswer(answer);
        response.setResponseTime(responseTime);
        response.setTimestamp(LocalDateTime.now());

        // 检索信息
        response.setRetrievedCount(searchResults.size());
        response.setUsedSegments(contextResult.getIncludedSegments().size());
        response.setTruncatedSegments(contextResult.getTruncatedSegments().size());

        // 上下文信息
        response.setContextUtilization(contextResult.getUtilizationRate());
        response.setOptimizationStrategy(contextResult.getOptimizationStrategy());

        // 检索详情（用于调试和评估）
        List<RetrievalDetail> retrievalDetails = searchResults.stream()
                .map(result -> new RetrievalDetail(
                        result.getSegment().text().substring(0, Math.min(100, result.getSegment().text().length())),
                        result.getFinalScore(),
                        result.isFoundByVector(),
                        result.isFoundByKeyword(),
                        result.getMatchedKeywords()
                ))
                .toList();
        response.setRetrievalDetails(retrievalDetails);

        return response;
    }

    /**
     * 异步评估
     */
    private void performAsyncEvaluation(String query, String answer,
                                        List<TextSegment> retrievedSegments,
                                        long responseTime) {
        CompletableFuture.runAsync(() -> {
            try {
                // 创建评估用例（这里简化处理，实际项目中需要预设的标准答案）
                RAGEvaluationService.EvaluationCase evaluationCase =
                        new RAGEvaluationService.EvaluationCase(
                                query, "", answer, retrievedSegments, responseTime);

                // 执行评估
                List<RAGEvaluationService.EvaluationCase> testCases = List.of(evaluationCase);
                RAGEvaluationService.RAGEvaluationReport report =
                        evaluationService.evaluateRAGSystem(testCases);

                // 记录评估结果
                log.info("查询评估完成 - 综合评分: {:.2f}",
                        report.getOverallMetrics().getOverallScore());

            } catch (Exception e) {
                log.warn("异步评估失败", e);
            }
        }, executorService);
    }

    /**
     * 添加文档到知识库
     */
    public void addDocument(Document document) {
        if (!systemReady) {
            throw new IllegalStateException("RAG 系统尚未就绪");
        }

        log.info("添加文档到知识库: {}", document.metadata().getString("file_name"));

        try {
            // 1. 分割文档
            List<TextSegment> segments = documentSplitter.split(document);

            // 2. 向量化并存储
            for (TextSegment segment : segments) {
                dev.langchain4j.data.embedding.Embedding embedding =
                        embeddingModel.embed(segment).content();
                embeddingStore.add(embedding, segment);
                allSegments.add(segment);
            }

            log.info("文档添加完成，生成 {} 个新片段", segments.size());

        } catch (Exception e) {
            log.error("添加文档失败", e);
            throw new RuntimeException("无法添加文档到知识库", e);
        }
    }

    /**
     * 获取系统统计信息
     */
    public SystemStats getSystemStats() {
        SystemStats stats = new SystemStats();

        stats.setTotalSegments(allSegments.size());
        stats.setSystemReady(systemReady);
        stats.setModelName(modelName);
        stats.setMaxResults(maxResults);
        stats.setEvaluationEnabled(enableEvaluation);

        // 统计不同类型的文档数量
        long codeDocuments = allSegments.stream()
                .mapToLong(segment -> "代码文档".equals(segment.metadata().getString("content_type")) ? 1 : 0)
                .sum();

        long tutorialDocuments = allSegments.stream()
                .mapToLong(segment -> "教程文档".equals(segment.metadata().getString("content_type")) ? 1 : 0)
                .sum();

        long interviewDocuments = allSegments.stream()
                .mapToLong(segment -> "面试题库".equals(segment.metadata().getString("content_type")) ? 1 : 0)
                .sum();

        stats.setCodeDocuments((int) codeDocuments);
        stats.setTutorialDocuments((int) tutorialDocuments);
        stats.setInterviewDocuments((int) interviewDocuments);

        return stats;
    }

    // 数据传输对象
    public static class RAGResponse {
        private String query;
        private String answer;
        private long responseTime;
        private LocalDateTime timestamp;
        private int retrievedCount;
        private int usedSegments;
        private int truncatedSegments;
        private double contextUtilization;
        private String optimizationStrategy;
        private List<RetrievalDetail> retrievalDetails;

        // Getters and Setters
        public String getQuery() { return query; }
        public void setQuery(String query) { this.query = query; }

        public String getAnswer() { return answer; }
        public void setAnswer(String answer) { this.answer = answer; }

        public long getResponseTime() { return responseTime; }
        public void setResponseTime(long responseTime) { this.responseTime = responseTime; }

        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

        public int getRetrievedCount() { return retrievedCount; }
        public void setRetrievedCount(int retrievedCount) { this.retrievedCount = retrievedCount; }

        public int getUsedSegments() { return usedSegments; }
        public void setUsedSegments(int usedSegments) { this.usedSegments = usedSegments; }

        public int getTruncatedSegments() { return truncatedSegments; }
        public void setTruncatedSegments(int truncatedSegments) { this.truncatedSegments = truncatedSegments; }

        public double getContextUtilization() { return contextUtilization; }
        public void setContextUtilization(double contextUtilization) { this.contextUtilization = contextUtilization; }

        public String getOptimizationStrategy() { return optimizationStrategy; }
        public void setOptimizationStrategy(String optimizationStrategy) { this.optimizationStrategy = optimizationStrategy; }

        public List<RetrievalDetail> getRetrievalDetails() { return retrievalDetails; }
        public void setRetrievalDetails(List<RetrievalDetail> retrievalDetails) { this.retrievalDetails = retrievalDetails; }
    }

    public static class RetrievalDetail {
        private String contentPreview;
        private double score;
        private boolean foundByVector;
        private boolean foundByKeyword;
        private List<String> matchedKeywords;

        public RetrievalDetail(String contentPreview, double score, boolean foundByVector,
                               boolean foundByKeyword, List<String> matchedKeywords) {
            this.contentPreview = contentPreview;
            this.score = score;
            this.foundByVector = foundByVector;
            this.foundByKeyword = foundByKeyword;
            this.matchedKeywords = matchedKeywords;
        }

        // Getters and Setters
        public String getContentPreview() { return contentPreview; }
        public void setContentPreview(String contentPreview) { this.contentPreview = contentPreview; }

        public double getScore() { return score; }
        public void setScore(double score) { this.score = score; }

        public boolean isFoundByVector() { return foundByVector; }
        public void setFoundByVector(boolean foundByVector) { this.foundByVector = foundByVector; }

        public boolean isFoundByKeyword() { return foundByKeyword; }
        public void setFoundByKeyword(boolean foundByKeyword) { this.foundByKeyword = foundByKeyword; }

        public List<String> getMatchedKeywords() { return matchedKeywords; }
        public void setMatchedKeywords(List<String> matchedKeywords) { this.matchedKeywords = matchedKeywords; }
    }

    public static class SystemStats {
        private int totalSegments;
        private boolean systemReady;
        private String modelName;
        private int maxResults;
        private boolean evaluationEnabled;
        private int codeDocuments;
        private int tutorialDocuments;
        private int interviewDocuments;

        // Getters and Setters
        public int getTotalSegments() { return totalSegments; }
        public void setTotalSegments(int totalSegments) { this.totalSegments = totalSegments; }

        public boolean isSystemReady() { return systemReady; }
        public void setSystemReady(boolean systemReady) { this.systemReady = systemReady; }

        public String getModelName() { return modelName; }
        public void setModelName(String modelName) { this.modelName = modelName; }

        public int getMaxResults() { return maxResults; }
        public void setMaxResults(int maxResults) { this.maxResults = maxResults; }

        public boolean isEvaluationEnabled() { return evaluationEnabled; }
        public void setEvaluationEnabled(boolean evaluationEnabled) { this.evaluationEnabled = evaluationEnabled; }

        public int getCodeDocuments() { return codeDocuments; }
        public void setCodeDocuments(int codeDocuments) { this.codeDocuments = codeDocuments; }

        public int getTutorialDocuments() { return tutorialDocuments; }
        public void setTutorialDocuments(int tutorialDocuments) { this.tutorialDocuments = tutorialDocuments; }

        public int getInterviewDocuments() { return interviewDocuments; }
        public void setInterviewDocuments(int interviewDocuments) { this.interviewDocuments = interviewDocuments; }
    }
}


package cn.codefather.rag.demo;


import dev.langchain4j.data.document.Document;
import java.util.List;

public interface DocumentLoaderService {
    /**
     * 从指定路径加载文档。
     *
     * @param path 文档的源路径（可以是文件系统目录、数据库连接字符串等，取决于具体实现）。
     * @return 加载的 Document 对象列表。
     */
    List<Document> loadDocuments(String path);
}

package cn.codefather.rag.demo;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.loader.FileSystemDocumentLoader;
import dev.langchain4j.data.document.parser.apache.pdfbox.ApachePdfBoxDocumentParser;
import dev.langchain4j.data.document.parser.apache.poi.ApachePoiDocumentParser;
import dev.langchain4j.data.document.parser.TextDocumentParser;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Service
@Slf4j
public class FileSystemDocumentLoaderServiceImpl implements DocumentLoaderService {

    @Override
    public List<Document> loadDocuments(String directoryPath) {
        Path path = Path.of(directoryPath);
        if (!path.toFile().exists() || !path.toFile().isDirectory()) {
            log.warn("文档目录不存在或不是一个目录: {}", directoryPath);
            return List.of();
        }

        List<Document> loadedDocs = new ArrayList<>();
        try (Stream<Path> files = java.nio.file.Files.list(path)) {
            files.filter(java.nio.file.Files::isRegularFile)
                    .forEach(filePath -> {
                        try {
                            // 根据文件扩展名选择合适的解析器
                            String fileName = filePath.getFileName().toString().toLowerCase();
                            Document document;
                            if (fileName.endsWith(".pdf")) {
                                document = FileSystemDocumentLoader.loadDocument(filePath, new ApachePdfBoxDocumentParser());
                            } else if (fileName.endsWith(".docx") || fileName.endsWith(".xlsx") || fileName.endsWith(".pptx")) {
                                document = FileSystemDocumentLoader.loadDocument(filePath, new ApachePoiDocumentParser());
                            } else if (fileName.endsWith(".txt")) {
                                document = FileSystemDocumentLoader.loadDocument(filePath, new TextDocumentParser());
                            } else {
                                log.warn("跳过不支持的文件类型: {}", filePath.getFileName());
                                return; // 跳过此文件
                            }
                            loadedDocs.add(document);
                            log.debug("成功加载文件: {}", filePath.getFileName());
                        } catch (Exception e) {
                            log.error("加载文件时发生未知错误: {} - {}", filePath.getFileName(), e.getMessage());
                        }
                    });
        } catch (IOException e) {
            log.error("无法遍历文档目录: {} - {}", directoryPath, e.getMessage());
        }
        log.info("从 {} 成功加载了 {} 个文档。", directoryPath, loadedDocs.size());
        return loadedDocs;
    }
}
```

### RAG 系统使用示例

让我们通过一个完整的示例来演示如何使用这个企业级 RAG 系统：

````java
▼java复制代码package cn.codefather.rag.demo;

import cn.codefather.rag.complete.EnterpriseRAGSystem;
import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.Metadata;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * RAG 系统使用演示
 */
@Slf4j
@Component
public class RAGSystemDemo implements CommandLineRunner {
    
    private final EnterpriseRAGSystem ragSystem;
    
    public RAGSystemDemo(EnterpriseRAGSystem ragSystem) {
        this.ragSystem = ragSystem;
    }
    
    @Override
    public void run(String... args) throws Exception {
        log.info("开始演示企业级 RAG 系统");
        
        // 等待系统初始化完成
        Thread.sleep(2000);
        
        // 1. 添加示例文档
        addSampleDocuments();
        
        // 2. 执行查询演示
        performQueryDemo();
        
        // 3. 显示系统统计
        showSystemStats();
        
        log.info("RAG 系统演示完成");
    }
    
    /**
     * 添加示例文档
     */
    private void addSampleDocuments() {
        log.info("添加示例文档到知识库");
        
        // 添加 Spring Boot 相关文档
        Document springBootDoc = Document.from(
            "Spring Boot 自动配置原理详解\n\n" +
            "Spring Boot 的自动配置是其核心特性之一，它通过 @EnableAutoConfiguration 注解实现。" +
            "自动配置的工作原理如下：\n\n" +
            "1. 扫描 META-INF/spring.factories 文件\n" +
            "2. 加载所有的自动配置类\n" +
            "3. 根据条件注解（如 @ConditionalOnClass）决定是否启用配置\n" +
            "4. 创建和注册相应的 Bean\n\n" +
            "常见的自动配置类包括：\n" +
            "- DataSourceAutoConfiguration：数据源自动配置\n" +
            "- WebMvcAutoConfiguration：Web MVC 自动配置\n" +
            "- JpaRepositoriesAutoConfiguration：JPA 仓库自动配置\n\n" +
            "在编程导航的 Spring Boot 教程中，详细介绍了如何自定义自动配置类。",
            Metadata.from("source", "spring-boot-autoconfiguration")
                    .put("content_type", "教程文档")
                    .put("source_category", "编程导航教程")
        );
        ragSystem.addDocument(springBootDoc);
        
        // 添加多线程面试题文档
        Document threadingDoc = Document.from(
            "Java 多线程面试题精选\n\n" +
            "问题1：什么是线程安全？如何实现线程安全？\n" +
            "答案：线程安全是指多个线程同时访问共享资源时，程序能够正确执行。" +
            "实现线程安全的方法包括：\n" +
            "1. 使用 synchronized 关键字\n" +
            "2. 使用 Lock 接口及其实现类\n" +
            "3. 使用原子类（AtomicInteger 等）\n" +
            "4. 使用 ThreadLocal\n" +
            "5. 使用不可变对象\n\n" +
            "问题2：解释 volatile 关键字的作用\n" +
            "答案：volatile 关键字确保变量的可见性和有序性，但不能保证原子性。" +
            "它适用于状态标记、单例模式的双重检查锁定等场景。\n\n" +
            "更多面试题请访问面试鸭网站。",
            Metadata.from("source", "java-threading-interview")
                    .put("content_type", "面试题库")
                    .put("source_category", "面试鸭题库")
        );
        ragSystem.addDocument(threadingDoc);
        
        // 添加算法文档
        Document algorithmDoc = Document.from(
            "动态规划算法详解与实践\n\n" +
            "动态规划（Dynamic Programming，DP）是解决复杂问题的重要算法思想。" +
            "它适用于具有以下特征的问题：\n" +
            "1. 最优子结构：问题的最优解包含子问题的最优解\n" +
            "2. 重叠子问题：递归过程中会重复计算相同的子问题\n\n" +
            "经典的动态规划问题包括：\n" +
            "- 斐波那契数列\n" +
            "- 最长公共子序列（LCS）\n" +
            "- 背包问题\n" +
            "- 最短路径问题\n\n" +
            "代码示例（斐波那契数列）：\n" +
            "```java\n" +
            "public int fibonacci(int n) {\n" +
            "    if (n <= 1) return n;\n" +
            "    int[] dp = new int[n + 1];\n" +
            "    dp[0] = 0; dp[1] = 1;\n" +
            "    for (int i = 2; i <= n; i++) {\n" +
            "        dp[i] = dp[i-1] + dp[i-2];\n" +
            "    }\n" +
            "    return dp[n];\n" +
            "}\n" +
            "```\n\n" +
            "在算法导航平台上可以可视化学习动态规划的执行过程。",
            Metadata.from("source", "dynamic-programming-guide")
                    .put("content_type", "代码文档")
                    .put("source_category", "算法导航教程")
        );
        ragSystem.addDocument(algorithmDoc);
        
        log.info("示例文档添加完成");
    }
    
    /**
     * 执行查询演示
     */
    private void performQueryDemo() {
        log.info("开始查询演示");
        
        String[] queries = {
            "Spring Boot 自动配置是如何工作的？",
            "Java 中如何实现线程安全？",
            "什么是动态规划？请给出代码示例",
            "面试中关于 volatile 关键字的常见问题",
            "编程导航有哪些学习资源？"
        };
        
        for (String query : queries) {
            System.out.println("\n" + "=".repeat(80));
            System.out.println("查询：" + query);
            System.out.println("=".repeat(80));
            
            try {
                EnterpriseRAGSystem.RAGResponse response = ragSystem.query(query);
                
                System.out.println("答案：");
                System.out.println(response.getAnswer());
                
                System.out.println("\n检索信息：");
                System.out.printf("- 响应时间：%d ms\n", response.getResponseTime());
                System.out.printf("- 检索片段数：%d\n", response.getRetrievedCount());
                System.out.printf("- 使用片段数：%d\n", response.getUsedSegments());
                System.out.printf("- 上下文利用率：%.2f%%\n", response.getContextUtilization() * 100);
                System.out.printf("- 优化策略：%s\n", response.getOptimizationStrategy());
                
                if (response.getRetrievalDetails() != null && !response.getRetrievalDetails().isEmpty()) {
                    System.out.println("\n检索详情：");
                    for (int i = 0; i < Math.min(3, response.getRetrievalDetails().size()); i++) {
                        EnterpriseRAGSystem.RetrievalDetail detail = response.getRetrievalDetails().get(i);
                        System.out.printf("  片段%d：评分=%.3f, 向量匹配=%s, 关键词匹配=%s\n", 
                                        i + 1, detail.getScore(), 
                                        detail.isFoundByVector() ? "是" : "否",
                                        detail.isFoundByKeyword() ? "是" : "否");
                        System.out.printf("  内容预览：%s...\n", detail.getContentPreview());
                    }
                }
                
            } catch (Exception e) {
                log.error("查询失败: {}", query, e);
                System.out.println("查询处理失败：" + e.getMessage());
            }
        }
    }
    
    /**
     * 显示系统统计信息
     */
    private void showSystemStats() {
        log.info("显示系统统计信息");
        
        EnterpriseRAGSystem.SystemStats stats = ragSystem.getSystemStats();
        
        System.out.println("\n" + "=".repeat(50));
        System.out.println("RAG 系统统计信息");
        System.out.println("=".repeat(50));
        System.out.printf("系统状态：%s\n", stats.isSystemReady() ? "就绪" : "未就绪");
        System.out.printf("使用模型：%s\n", stats.getModelName());
        System.out.printf("最大检索结果数：%d\n", stats.getMaxResults());
        System.out.printf("评估功能：%s\n", stats.isEvaluationEnabled() ? "启用" : "禁用");
        System.out.printf("文档片段总数：%d\n", stats.getTotalSegments());
        System.out.printf("  - 代码文档：%d\n", stats.getCodeDocuments());
        System.out.printf("  - 教程文档：%d\n", stats.getTutorialDocuments());
        System.out.printf("  - 面试题库：%d\n", stats.getInterviewDocuments());
        System.out.println("=".repeat(50));
    }
}
````

这段程序输出结果：

```plain
▼plain复制代码================================================================================
查询：Spring Boot 自动配置是如何工作的？
================================================================================
答案：
基于提供的知识内容，Spring Boot 自动配置的工作原理如下：

Spring Boot 的自动配置是通过 @EnableAutoConfiguration 注解实现的核心特性，具体工作流程包括：

1. **扫描配置文件**：系统会扫描 META-INF/spring.factories 文件，这个文件中定义了所有可用的自动配置类。

2. **加载自动配置类**：Spring Boot 会加载 spring.factories 文件中列出的所有自动配置类。

3. **条件判断**：根据条件注解（如 @ConditionalOnClass）来决定是否启用特定的配置。这些条件注解会检查类路径中是否存在特定的类、Bean 或配置。

4. **创建和注册 Bean**：满足条件的自动配置类会创建和注册相应的 Bean 到 Spring 容器中。

**常见的自动配置类包括：**
- DataSourceAutoConfiguration：自动配置数据源
- WebMvcAutoConfiguration：自动配置 Web MVC 相关组件  
- JpaRepositoriesAutoConfiguration：自动配置 JPA 仓库

如果您想深入学习如何自定义自动配置类，建议访问编程导航网站查看详细的 Spring Boot 教程。

检索信息：
- 响应时间：1247 ms
- 检索片段数：3
- 使用片段数：1
- 上下文利用率：78.50%
- 优化策略：priority_based

检索详情：
  片段1：评分=0.856, 向量匹配=是, 关键词匹配=是
  内容预览：Spring Boot 自动配置原理详解

Spring Boot 的自动配置是其核心特性之一，它通过 @EnableAutoConfiguration 注解实现...

================================================================================
查询：Java 中如何实现线程安全？
================================================================================
答案：
根据知识库内容，Java 中实现线程安全有以下几种主要方法：

**1. 使用 synchronized 关键字**
- 可以修饰方法或代码块
- 确保同一时间只有一个线程能访问共享资源

**2. 使用 Lock 接口及其实现类**
- 如 ReentrantLock，提供更灵活的锁机制
- 支持可中断锁、公平锁等高级特性

**3. 使用原子类**
- 如 AtomicInteger、AtomicLong 等
- 基于 CAS（Compare-And-Swap）操作，性能更好

**4. 使用 ThreadLocal**
- 为每个线程提供独立的变量副本
- 避免线程间的数据共享问题

**5. 使用不可变对象**
- 对象创建后状态不能改变
- 天然线程安全，无需额外同步

线程安全是指多个线程同时访问共享资源时，程序能够正确执行。选择合适的线程安全实现方式需要根据具体的应用场景来决定。

如果您正在准备面试，建议访问面试鸭网站查看更多 Java 多线程相关的面试题。

检索信息：
- 响应时间：1156 ms
- 检索片段数：2
- 使用片段数：1
- 上下文利用率：82.30%
- 优化策略：priority_based
```
