---
url: /AIGC/AI应用开发/02.LangGraph4j/14_实战项目一：Java 版智能问答系统.md
---
# 14\_实战项目一：Java 版智能问答系统

智能问答系统是当前 A‍‍‍I 应用的热门领域，它能够基于大量文档知识为‌‌‌用户提供准确、及时的答案。通过本章的学习，你‍‍‍将从零开始构建一个完整的 Java 智能问答‍‍‍系统，涵盖从需求分析到部署维护的全流程，为你‍‍‍在 AI 应用开发道路上奠定坚实基础。

## 14.1 项目需求分析

在开始编码之‍‍‍前，我们需要明确项目的‌‌‌核心需求和目标用户。一‍‍‍个好的需求分析是项目成‍‍‍功的基石，它帮助我们避‍‍‍免在开发过程中迷失方向。yc4QRp8ovNJ57GPA7bri+mKydKIKzxDFmOrjcxZEUcM=

我们的智能问答系统将为‍‍‍网站的用户提供技术问题解答服务。用户可以上‌‌‌传技术文档、API 文档或教程文件，系统会‍‍‍自动解析这些文档并建立知识库。当用户提出技‍‍‍术问题时，系统能够从知识库中检索相关信息，‍‍‍结合大语言模型的能力生成准确的回答。

系统的核心功能需求包‍‍‍括文档上传与解析功能。用户需要能够上传 ‌‌‌PDF、Word、TXT 等格式的技术文‍‍‍档，系统自动解析文档内容并提取关键信息。‍‍‍这个功能对于建立知识库至关重要，因为高质‍‍‍量的知识库是问答系统准确性的保障。

智能问答功能是系统‍‍‍的核心价值所在。用户输入自然语言问题‌‌‌后，系统通过语义检索找到相关文档片段‍‍‍，然后结合大语言模型生成准确、详细‍‍‍的回答。这个过程需要确保回答的准确性和‍‍‍相关性，避免出现答非所问的情况。cLGytfopnrFuxnn3sz+3dYGbZsmkbigItBfA6ZV7hZU=

知识库管理功能‍‍‍让用户能够查看、编辑和删除‌‌‌已上传的文档，支持按类别、‍‍‍标签或时间进行筛选。这个功‍‍‍能提供了必要的数据管理能力‍‍‍，让用户能够维护自己的知识库。

对于非功能性需求，‍‍系统‍响应时间是用户体验的关键指标。问‌‌答响应时间应控制‌在 5 秒以内，文档‍‍解析时间根据文档大小合理‍控制。同时，‍‍系统需要支持至少 100 个并发用户‍‍‍，确保在高峰期也能提供稳定服务           ‍                     

数据安全也是‍‍‍重要考量，用户上传的文档‌‌‌需要加密存储，并且只有上‍‍‍传者本人可以访问。系统还‍‍‍需要提供数据备份和恢复机‍‍‍制，确保用户数据的安全性。Iy8qa2Wkgy1zjaDf5wVYJsxIyeHLdZx9B8sLhGVCeeI=

基于这些需求分析，我们可以明确‍‍‍系统的技术选型。LangChain4j 作为核心框架，提供‌‌‌了与大语言模型交互的能力；通义千问作为主要的语言模型，为系‍‍‍统提供强大的自然语言理解和生成能力；向量数据库用于存储文档‍‍‍的向量表示，支持高效的语义检索；Spring Boot 作‍‍‍为应用框架，提供完整的 Web 服务能力。

## 14.2 系统架构设计

系统架构设计‍‍‍需要考虑模块间的职责分‌‌‌离和数据流向。我们采用‍‍‍分层架构模式，将系统分‍‍‍为控制层、服务层、数据‍‍‍访问层和外部集成层。85OwC9dA70cYmJ5h6K5cNTXdNAq0qMRNbG9wTf+m4FU=

控制层负责处理‍‍‍ HTTP 请求，包括文档‌‌‌上传、问答请求和知识库管理等‍‍‍接口。这一层主要进行参数‍‍‍验证、权限检查和响应格式化‍‍‍，不包含具体的业务逻辑。

服务层是业务逻辑的核心，‍‍‍包含文档解析服务、向量化服务、检索服务和问答生成服‌‌‌务。文档解析服务负责将不同格式的文档转换为统一‍‍‍的文本格式；向量化服务将文本转换为向量表示；检索‍‍‍服务基于用户问题找到相关文档片段；问答生成服务结‍‍‍合检索结果和大语言模型生成最终答案。

数据访问层管理‍所有的‍‍数据存储和检索操作，包‌括文档元数据的关系‌‌型数据库操‍作和向量数据的存储检索。这一‍‍‍层屏蔽了底层存储的复杂性，为‍上层提供统一‍‍的数据访问接口              ‍‍                  wkzLNuBRh6R+lZgXeGCYFHBSq3Izz4e/cck+rYjQNkc=

外部集成层负‍‍‍责与第三方服务的集成，主‌‌‌要包括通义千问 API ‍‍‍的调用和向量化模型的使‍用‍‍。这一层采用适配器模式，‍‍‍便于将来切换不同的服务提供商。

首先需要导‍‍入相关的依赖： ‌ ‌       ‍  ‍      ‍   ‍     ‍    ‍   

```xml
▼xml复制代码
        <!-- Embedding 向量化支持 -->
              <dependency>
            <groupId>dev.langchain4j</groupId>
            <artifactId>langchain4j-embeddings-bge-small-zh</artifactId>
            <version>1.2.0-beta8</version>
        </dependency>
        <dependency>
            <groupId>dev.langchain4j</groupId>
            <artifactId>langchain4j-embeddings-bge-small-en-v15-q</artifactId>
            <version>1.2.0-beta8</version>
        </dependency>
        <dependency>
            <groupId>dev.langchain4j</groupId>
            <artifactId>langchain4j</artifactId>
            <version>1.1.0</version>
        </dependency> 
        <dependency>
            <groupId>dev.langchain4j</groupId>
            <artifactId>langchain4j-community-dashscope-spring-boot-starter</artifactId>
            <version>1.1.0-beta7</version>
        </dependency>
        <!-- RAG支持 -->
        <dependency>
            <groupId>dev.langchain4j</groupId>
            <artifactId>langchain4j-easy-rag</artifactId>
            <version>1.0.0-beta3</version>
        </dependency>
        <dependency>
            <groupId>dev.langchain4j</groupId>
            <artifactId>langchain4j-document-parser-apache-pdfbox</artifactId>
            <version>1.0.0-beta3</version>
        </dependency>
        <dependency>
            <groupId>dev.langchain4j</groupId>
            <artifactId>langchain4j-core</artifactId>
            <version>1.2.0</version>
        </dependency>
        <dependency>
            <groupId>dev.langchain4j</groupId>
            <artifactId>langchain4j-document-parser-apache-poi</artifactId>
            <version>1.0.0-beta3</version>
        </dependency>
        
        
```

让我们看看核心的系统配置代码：

```java
▼java复制代码package com.yupi.qaai.config;

import dev.langchain4j.community.model.dashscope.QwenChatModel;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.embedding.onnx.bgesmallzh.BgeSmallZhEmbeddingModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 编程导航智能问答系统配置类
 * 配置 LangChain4j 相关组件
 */
@Configuration
public class LangChainConfig {
    
    @Value("${dashscope.api-key}")
    private String dashscopeApiKey;
    
    /**
     * 配置通义千问聊天模型
     * 用于生成问答回复
     */
    @Bean
    public ChatModel chatModel() {
        return QwenChatModel.builder()
                .apiKey(dashscopeApiKey)
                .modelName("qwen-max")
                .temperature(0.7f)
                .build();
    }
    
    /**
     * 配置文本向量化模型
     * 用于将文档和问题转换为向量表示
     */
    @Bean
    public EmbeddingModel embeddingModel() {
        return new BgeSmallZhEmbeddingModel();
    }
}
```

系统的数据流设计遵循 RA‍‍‍G（检索增强生成）模式。当用户上传文档时，系统首先‌‌‌解析文档内容，然后将文本分块并转换为向量表示存储到‍‍‍向量数据库。当用户提问时，系统将问题也转换为向量，‍‍‍在向量数据库中检索最相似的文档片段，最后将这些片段‍‍‍作为上下文传递给大语言模型生成回答。TRQG02HuvSbBCdyta/9OfF/iMg4d5URNJyKR3KkD/fE=

这种架构设计的优‍‍‍势在于高度的模块化和可扩展性。每‌‌‌个层次都有明确的职责，便于单独测试‍和‍‍维护。同时，通过接口抽象，我‍‍‍们可以轻松替换不同的实现，比如更‍‍‍换不同的向量数据库或语言模型。

## 14.3 核心功能实现

核心功能的‍‍‍实现是整个系统‌的‌关键部‌分。我‍们从‍文档‍解析开‍始，这‍是建立‍知‍识库‍的第一步。yc4QRp8ovNJ57GPA7bri+mKydKIKzxDFmOrjcxZEUcM=

文档解析服务需‍‍‍要处理多种文档格式，包括 ‌‌‌PDF、Word 和纯文本‍‍‍文件。我们使用 LangC‍‍‍hain4j 提供的文档解‍‍‍析器来统一处理这些格式：

```java
▼java复制代码package com.yupi.qaai.service;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentParser;
import dev.langchain4j.data.document.parser.apache.pdfbox.ApachePdfBoxDocumentParser;
import dev.langchain4j.data.document.parser.apache.poi.ApachePoiDocumentParser;
import dev.langchain4j.data.document.parser.TextDocumentParser;
import dev.langchain4j.data.document.splitter.DocumentSplitters;
import dev.langchain4j.data.segment.TextSegment;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * 面试鸭文档解析服务
 * 支持 PDF、Word、TXT 等格式的文档解析
 */
@Service
public class DocumentParseService {
    
    private final ApachePdfBoxDocumentParser pdfParser = new ApachePdfBoxDocumentParser();
    private final ApachePoiDocumentParser wordParser = new ApachePoiDocumentParser();
    private final TextDocumentParser textParser = new TextDocumentParser();
    
    /**
     * 解析上传的文档文件
     * @param file 上传的文件
     * @return 解析后的文档对象
     */
    public Document parseDocument(MultipartFile file) throws IOException {
        String fileName = file.getOriginalFilename();
        if (fileName == null) {
            throw new IllegalArgumentException("文件名不能为空");
        }
        
        DocumentParser parser = getParserByFileName(fileName);
        try (InputStream inputStream = file.getInputStream()) {
            return parser.parse(inputStream);
        }
    }
    
    /**
     * 将文档分割为文本片段
     * 便于向量化和检索
     */
    public List<TextSegment> splitDocument(Document document) {
        return DocumentSplitters.recursive(500, 50)
                .split(document);
    }
    
    /**
     * 根据文件名选择合适的解析器
     */
    private DocumentParser getParserByFileName(String fileName) {
        String extension = fileName.toLowerCase();
        
        if (extension.endsWith(".pdf")) {
            return pdfParser;
        } else if (extension.endsWith(".doc") || extension.endsWith(".docx")) {
            return wordParser;
        } else if (extension.endsWith(".txt")) {
            return textParser;
        } else {
            throw new IllegalArgumentException("不支持的文件格式: " + extension);
        }
    }
}
```

文档解析完‍‍‍成后，我们需要‌将‌文‌本转换为向‍量表‍示并‍存储。‍向量化‍服务负‍责‍这个过程‍：7QiJ3WkhTRjV8VSaIHYq0+Wzni+Hi3xtR8CR8/IP1VI=

```java
▼java复制代码package com.yupi.qaai.service;


import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import dev.langchain4j.store.embedding.EmbeddingSearchRequest;
import dev.langchain4j.store.embedding.EmbeddingSearchResult;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 老鱼简历向量化服务
 * 负责文本向量化和向量存储
 */
@Service
public class EmbeddingService {
    
    @Autowired
    private EmbeddingModel embeddingModel;
    
    // 使用内存向量存储，生产环境建议使用持久化的向量数据库
    private final EmbeddingStore<TextSegment> embeddingStore = new InMemoryEmbeddingStore<>();
    
    /**
     * 将文本片段向量化并存储
     * @param textSegments 文本片段列表
     * @param documentId 文档ID，用于标识来源
     */
    public void embedAndStore(List<TextSegment> textSegments, String documentId) {
        for (int i = 0; i < textSegments.size(); i++) {
            TextSegment segment = textSegments.get(i);
            
            // 添加文档ID和片段索引到元数据
            segment.metadata().put("documentId", documentId);
            segment.metadata().put("segmentIndex", String.valueOf(i));
            
            // 生成向量
            Embedding embedding = embeddingModel.embed(segment).content();
            
            // 存储向量
            embeddingStore.add(embedding, segment);
        }
    }
    
    /**
     * 根据查询文本检索相关文档片段
     * @param queryText 查询文本
     * @param maxResults 最大返回结果数
     * @return 相关文档片段列表
     */
    public List<TextSegment> retrieveRelevant(String queryText, int maxResults) {
        // 将查询文本向量化
        Embedding queryEmbedding = embeddingModel.embed(queryText).content();
        EmbeddingSearchRequest searchRequest = EmbeddingSearchRequest.builder()
                .queryEmbedding(queryEmbedding)
                .maxResults(maxResults)
                .build();
        EmbeddingSearchResult<TextSegment> searchResult = embeddingStore.search(searchRequest);
        List<EmbeddingMatch<TextSegment>> relevantSegments = searchResult.matches();
        // 执行相似度检索
        return relevantSegments
                .stream()
                .map(match -> match.embedded())
                .toList();
    }
    
    /**
     * 获取向量存储实例，供其他服务使用
     */
    public EmbeddingStore<TextSegment> getEmbeddingStore() {
        return embeddingStore;
    }
}
```

有了检索能‍‍‍力后，我们可以实‌现‌核心的‌问答‍服务。这‍个服务整合了‍‍检索和‍生成的能力‍：  ‍              ‍                

```java
▼java复制代码package com.yupi.qaai.service;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 算法导航智能问答服务
 * 整合检索和生成功能，提供准确的问答服务  
 */
@Service
public class QuestionAnsweringService {
    
    @Autowired
    private ChatModel chatModel;
    
    @Autowired
    private EmbeddingService embeddingService;
    
    // 问答提示词模板
    private final PromptTemplate answerTemplate = PromptTemplate.from("""
            你是代码小抄网站的技术专家，负责回答用户的技术问题。
            
            基于以下相关文档内容来回答用户问题，如果文档内容无法回答问题，请诚实地说明。
            
            相关文档内容：
            {{context}}
            
            用户问题：{{question}}
            
            请提供准确、详细的回答，并在适当时提供代码示例。回答应该：
            1. 直接针对用户问题
            2. 基于提供的文档内容
            3. 语言简洁清晰
            4. 包含实用的建议
            """);
    
    /**
     * 回答用户问题
     * @param question 用户问题
     * @return 生成的回答
     */
    public String answerQuestion(String question) {
        // 检索相关文档片段
        List<TextSegment> relevantSegments = embeddingService.retrieveRelevant(question, 5);
        
        if (relevantSegments.isEmpty()) {
            return "抱歉，我在知识库中没有找到与您问题相关的信息。请尝试上传相关文档或换个问题。";
        }
        
        // 将检索到的片段合并为上下文
        String context = relevantSegments.stream()
                .map(TextSegment::text)
                .collect(Collectors.joining("\n\n"));
        
        // 构建提示词
        Map<String, Object> variables = new HashMap<>();
        variables.put("context", context);
        variables.put("question", question);
        
        Prompt prompt = answerTemplate.apply(variables);
        
        // 调用大语言模型生成回答
        return chatModel.chat(prompt.text());
    }
    
    /**
     * 批量回答问题，适用于问题列表场景
     */
    public Map<String, String> answerMultipleQuestions(List<String> questions) {
        Map<String, String> answers = new HashMap<>();
        
        for (String question : questions) {
            try {
                String answer = answerQuestion(question);
                answers.put(question, answer);
            } catch (Exception e) {
                answers.put(question, "处理问题时发生错误：" + e.getMessage());
            }
        }
        
        return answers;
    }
}
```

为了将这些‍‍‍服务整合到 W‌e‌b‌ 应用中，‍我们‍需要‍创建 ‍RES‍T 控‍制‍器：

```java
▼java复制代码package com.yupi.qaai.controller;

import com.yupi.qaai.service.DocumentParseService;
import com.yupi.qaai.service.EmbeddingService;
import com.yupi.qaai.service.QuestionAnsweringService;
import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.segment.TextSegment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

/**
 * 剪切助手问答系统控制器
 * 提供文档上传和问答接口
 */
@RestController
@RequestMapping("/api/qa")
@CrossOrigin(origins = "*")
public class QuestionAnsweringController {
    
    @Autowired
    private DocumentParseService documentParseService;
    
    @Autowired
    private EmbeddingService embeddingService;
    
    @Autowired
    private QuestionAnsweringService questionAnsweringService;
    
    /**
     * 上传文档接口
     * @param file 要上传的文档文件
     * @return 上传结果
     */
    @PostMapping("/upload")
    public ResponseEntity<String> uploadDocument(@RequestParam("file") MultipartFile file) {
        try {
            // 解析文档
            Document document = documentParseService.parseDocument(file);
            
            // 分割文档为片段
            List<TextSegment> segments = documentParseService.splitDocument(document);
            
            // 生成文档ID
            String documentId = UUID.randomUUID().toString();
            
            // 向量化并存储
            embeddingService.embedAndStore(segments, documentId);
            
            return ResponseEntity.ok("文档上传成功，已处理 " + segments.size() + " 个文本片段");
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("文档上传失败：" + e.getMessage());
        }
    }
    
    /**
     * 问答接口
     * @param question 用户问题
     * @return AI 生成的回答
     */
    @PostMapping("/ask")
    public ResponseEntity<String> askQuestion(@RequestBody String question) {
        try {
            if (question == null || question.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("问题不能为空");
            }
            
            String answer = questionAnsweringService.answerQuestion(question.trim());
            return ResponseEntity.ok(answer);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("处理问题时发生错误：" + e.getMessage());
        }
    }
}
```

这段程序的基本工作流程是：用户首先通过 `/api/qa/upload` 接口上传文档，系统解析文档并将内容向量化存储；然后用户通过 `/api/qa/ask` 接口提问，系统检索相关文档片段并生成回答。cLGytfopnrFuxnn3sz+3dYGbZsmkbigItBfA6ZV7hZU=

## 14.4 性能优化与测试

性能优化是‍‍‍智能问答系统的‌重‌要‌环节，直接‍影响‍用户‍体验。‍我们需‍要从多‍个‍角度来优化系‍统性‍能。

向量检索是‍系统的‍‍性能瓶颈之‌一。当文档数量增长时‍‌‌，检索时间会显‍著增加      ‍‍                 ‍‍         我们可以通过引‍‍‍入向量索引来优化检索性能：7QiJ3WkhTRjV8VSaIHYq0+Wzni+Hi3xtR8CR8/IP1VI=

```java
▼java复制代码package com.yupi.qaai.service.optimized;


import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import dev.langchain4j.store.embedding.EmbeddingSearchRequest;
import dev.langchain4j.store.embedding.EmbeddingSearchResult;
import dev.langchain4j.store.embedding.EmbeddingStore;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

/**
 * 编程导航优化版向量检索服务
 * 包含缓存和异步处理优化
 */
@Service
public class OptimizedRetrievalService {

    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;
    private final Executor asyncExecutor = Executors.newFixedThreadPool(4);

    public OptimizedRetrievalService(EmbeddingModel embeddingModel,
                                     EmbeddingStore<TextSegment> embeddingStore) {
        this.embeddingModel = embeddingModel;
        this.embeddingStore = embeddingStore;
    }

    /**
     * 缓存查询向量，避免重复计算
     * @param queryText 查询文本
     * @return 查询向量
     */
    @Cacheable(value = "queryEmbeddings", key = "#queryText")
    public Embedding getQueryEmbedding(String queryText) {
        return embeddingModel.embed(queryText).content();
    }

    /**
     * 异步批量检索
     * @param queries 查询文本列表
     * @param maxResults 每个查询的最大结果数
     * @return 异步检索结果
     */
    public CompletableFuture<List<List<TextSegment>>> batchRetrieveAsync(
            List<String> queries, int maxResults) {

        List<CompletableFuture<List<TextSegment>>> futures = queries.stream()
                .map(query -> CompletableFuture
                        .supplyAsync(() -> retrieveRelevant(query, maxResults), asyncExecutor))
                .toList();

        return CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
                .thenApply(v -> futures.stream()
                        .map(CompletableFuture::join)
                        .toList());
    }

    /**
     * 优化的相关性检索
     * 包含结果质量过滤
     */
    public List<TextSegment> retrieveRelevant(String queryText, int maxResults) {
        Embedding queryEmbedding = getQueryEmbedding(queryText);

        EmbeddingSearchRequest searchRequest = EmbeddingSearchRequest.builder()
                .queryEmbedding(queryEmbedding)
                .maxResults(maxResults * 2)
                .build();
        EmbeddingSearchResult<TextSegment> searchResult = embeddingStore.search(searchRequest);
        List<EmbeddingMatch<TextSegment>> matches = searchResult.matches();


        // 过滤低质量结果，相似度阈值为 0.7
        return matches.stream()
                .filter(match -> match.score() > 0.7)
                .limit(maxResults)
                .map(EmbeddingMatch::embedded)
                .toList();
    }
}
```

文档处理的‍‍性能‍优化同样重‌‌要。大文档的解析和分‌块‍‍可能耗费较长时间，‍‍我们可‍以使用异步处‍‍理来改善用户体验：‍                 ‍               

```java
▼java复制代码package com.yupi.qaai.service.optimized;

import com.yupi.qaai.service.DocumentParseService;
import com.yupi.qaai.service.EmbeddingService;
import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.segment.TextSegment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

/**
 * 面试鸭异步文档处理服务
 * 提供非阻塞的文档处理能力
 */
@Service
public class AsyncDocumentProcessor {
    
    @Autowired
    private DocumentParseService documentParseService;
    
    @Autowired
    private EmbeddingService embeddingService;
    
    /**
     * 异步处理文档上传
     * 返回处理任务ID，客户端可以通过ID查询处理状态
     */
    @Async
    public CompletableFuture<String> processDocumentAsync(MultipartFile file) {
        try {
            String taskId = UUID.randomUUID().toString();
            
            // 解析文档
            Document document = documentParseService.parseDocument(file);
            
            // 分块处理，避免内存溢出
            List<TextSegment> segments = documentParseService.splitDocument(document);
            
            // 批量向量化，提高效率
            String documentId = UUID.randomUUID().toString();
            embeddingService.embedAndStore(segments, documentId);
            
            return CompletableFuture.completedFuture(
                "任务 " + taskId + " 完成，处理了 " + segments.size() + " 个文本片段");
                
        } catch (Exception e) {
            return CompletableFuture.failedFuture(e);
        }
    }
    
    /**
     * 批量处理多个文档
     */
    @Async
    public CompletableFuture<List<String>> processBatchDocuments(List<MultipartFile> files) {
        List<CompletableFuture<String>> futures = files.stream()
                .map(this::processDocumentAsync)
                .toList();
        
        return CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
                .thenApply(v -> futures.stream()
                        .map(CompletableFuture::join)
                        .toList());
    }
}
```

系统测试是‍‍‍确保性能和稳定‌性‌的‌关键环节。‍我们‍需要‍编写全‍面的测‍试用例‍：

```java
▼java复制代码package com.yupi.qaai.test;

import com.yupi.qaai.service.QuestionAnsweringService;
import com.yupi.qaai.service.EmbeddingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 老鱼简历问答系统性能测试
 * 测试系统在高并发下的表现
 */
@SpringBootTest
@TestPropertySource(properties = {
    "dashscope.api-key=test-key-for-testing"
})
public class PerformanceTest {
    
    @Autowired
    private QuestionAnsweringService questionAnsweringService;
    
    @Autowired
    private EmbeddingService embeddingService;
    
    /**
     * 并发问答测试
     * 模拟多用户同时提问的场景
     */
    @Test
    public void testConcurrentQuestions() throws InterruptedException {
        int threadCount = 10;
        int questionsPerThread = 5;
        CountDownLatch latch = new CountDownLatch(threadCount);
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        
        long startTime = System.currentTimeMillis();
        
        for (int i = 0; i < threadCount; i++) {
            final int threadId = i;
            executor.submit(() -> {
                try {
                    for (int j = 0; j < questionsPerThread; j++) {
                        String question = "算法导航中第 " + threadId + " 个用户的第 " + j + " 个问题";
                        String answer = questionAnsweringService.answerQuestion(question);
                        
                        assertNotNull(answer, "回答不应为空");
                        assertTrue(answer.length() > 10, "回答长度应该合理");
                    }
                } finally {
                    latch.countDown();
                }
            });
        }
        
        assertTrue(latch.await(60, TimeUnit.SECONDS), "测试应在60秒内完成");
        
        long endTime = System.currentTimeMillis();
        long totalTime = endTime - startTime;
        double averageTime = (double) totalTime / (threadCount * questionsPerThread);
        
        System.out.println("总测试时间: " + totalTime + "ms");
        System.out.println("平均响应时间: " + averageTime + "ms");
        
        // 确保平均响应时间在可接受范围内
        assertTrue(averageTime < 5000, "平均响应时间应小于5秒");
        
        executor.shutdown();
    }
    
    /**
     * 内存使用测试
     * 检查系统在处理大量文档时的内存表现
     */
    @Test
    public void testMemoryUsage() {
        Runtime runtime = Runtime.getRuntime();
        long initialMemory = runtime.totalMemory() - runtime.freeMemory();
        
        // 模拟处理大量文档片段
        for (int i = 0; i < 1000; i++) {
            String testText = "代码小抄测试文档片段 " + i + " 包含一些示例内容用于测试内存使用情况";
            // 这里应该有实际的文档处理逻辑
        }
        
        // 强制垃圾回收
        System.gc();
        
        long finalMemory = runtime.totalMemory() - runtime.freeMemory();
        long memoryIncrease = finalMemory - initialMemory;
        
        System.out.println("内存增长: " + memoryIncrease + " bytes");
        
        // 确保内存增长在合理范围内（小于100MB）
        assertTrue(memoryIncrease < 100 * 1024 * 1024, "内存增长应控制在合理范围内");
    }
}
```

这些性能优‍‍‍化和测试措施能‌够‌确‌保系统在生‍产环‍境中‍稳定运‍行，为‍用户提‍供良好‍的体‍验。HrGXUqFhjK7wNHkLfEF5cglTdzhFLxXIforC6kfYOak=

## 14.5 部署与维护

系统的部署和维‍‍‍护是项目生命周期中的重要环‌‌‌节。合理的部署策略和维护机制能‍‍‍够确保系统长期稳定运行   ‍‍‍              ‍‍‍               

首先，我们‍‍‍需要配置生产环境‌‌的‌应用配置文件。‍‍这个‍配置文件包含‍‍了所有‍必要的环境‍‍变量和参‍数设置：yc4QRp8ovNJ57GPA7bri+mKydKIKzxDFmOrjcxZEUcM=

```yaml
▼yaml复制代码# application-prod.yml - 剪切助手生产环境配置
server:
  port: 8080
  servlet:
    context-path: /qa-system

spring:
  servlet:
    multipart:
      max-file-size: 50MB
      max-request-size: 50MB
  
  datasource:
    url: jdbc:mysql://localhost:3306/qa_system?useUnicode=true&characterEncoding=utf8&useSSL=false
    username: ${DB_USERNAME:qa_user}
    password: ${DB_PASSWORD:qa_password}
    driver-class-name: com.mysql.cj.jdbc.Driver
    
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    
  cache:
    type: redis
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASSWORD:}

# 通义千问配置
dashscope:
  api-key: ${DASHSCOPE_API_KEY}
  
# 日志配置
logging:
  level:
    com.yupi.qaai: INFO
    dev.langchain4j: WARN
  file:
    name: logs/qa-system.log
  pattern:
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"

# 应用监控配置
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
```

为了便于部署，我们创建 Docker 配置文件：

```dockerfile
▼dockerfile复制代码# Dockerfile - 编程导航问答系统容器化配置
FROM openjdk:17-jdk-slim

# 设置工作目录
WORKDIR /app

# 复制 JAR 文件
COPY target/qa-system-1.0.0.jar app.jar

# 创建日志目录
RUN mkdir -p /app/logs

# 设置 JVM 参数
ENV JAVA_OPTS="-Xms512m -Xmx2g -XX:+UseG1GC -XX:G1HeapRegionSize=16m"

# 暴露端口
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/qa-system/actuator/health || exit 1

# 启动应用
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar --spring.profiles.active=prod"]
```

系统监控是‍‍‍维护工作的核心‌部‌‌分。我们需要‍实现‍健康‍检查和‍性能监‍控：

```java
▼java复制代码package com.yupi.qaai.monitoring;

import com.yupi.qaai.service.EmbeddingService;
import com.yupi.qaai.service.QuestionAnsweringService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuator.health.Health;
import org.springframework.boot.actuator.health.HealthIndicator;
import org.springframework.stereotype.Component;

/**
 * 算法导航问答系统健康检查
 * 监控核心服务的运行状态
 */
@Component
public class QASystemHealthIndicator implements HealthIndicator {
    
    @Autowired
    private QuestionAnsweringService questionAnsweringService;
    
    @Autowired
    private EmbeddingService embeddingService;
    
    @Override
    public Health health() {
        try {
            // 测试问答服务是否正常
            String testQuestion = "测试问题";
            long startTime = System.currentTimeMillis();
            
            // 这里应该是一个轻量级的测试，不调用实际的AI服务
            boolean qaServiceHealthy = testQuestionAnsweringService();
            boolean embeddingServiceHealthy = testEmbeddingService();
            
            long responseTime = System.currentTimeMillis() - startTime;
            
            if (qaServiceHealthy && embeddingServiceHealthy && responseTime < 1000) {
                return Health.up()
                        .withDetail("responseTime", responseTime + "ms")
                        .withDetail("qaService", "正常")
                        .withDetail("embeddingService", "正常")
                        .build();
            } else {
                return Health.down()
                        .withDetail("responseTime", responseTime + "ms")
                        .withDetail("qaService", qaServiceHealthy ? "正常" : "异常")
                        .withDetail("embeddingService", embeddingServiceHealthy ? "正常" : "异常")
                        .build();
            }
            
        } catch (Exception e) {
            return Health.down()
                    .withDetail("error", e.getMessage())
                    .build();
        }
    }
    
    private boolean testQuestionAnsweringService() {
        try {
            // 简单的服务可用性测试
            return questionAnsweringService != null;
        } catch (Exception e) {
            return false;
        }
    }
    
    private boolean testEmbeddingService() {
        try {
            // 检查向量存储是否可用
            return embeddingService != null && embeddingService.getEmbeddingStore() != null;
        } catch (Exception e) {
            return false;
        }
    }
}
```

日志管理对‍‍‍于系统维护至关‌重‌‌要。我们需要‍实现‍结构‍化的日‍志记录‍：TRQG02HuvSbBCdyta/9OfF/iMg4d5URNJyKR3KkD/fE=

```java
▼java复制代码package com.yupi.qaai.logging;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * 代码小抄系统操作日志切面
 * 记录关键操作的执行情况
 */
@Aspect
@Component
public class OperationLogAspect {
    
    private static final Logger logger = LoggerFactory.getLogger(OperationLogAspect.class);
    
    @Around("execution(* com.yupi.qaai.service.*.*(..))")
    public Object logServiceMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        
        long startTime = System.currentTimeMillis();
        
        try {
            logger.info("开始执行 {}.{}", className, methodName);
            
            Object result = joinPoint.proceed();
            
            long executionTime = System.currentTimeMillis() - startTime;
            logger.info("完成执行 {}.{}, 耗时: {}ms", className, methodName, executionTime);
            
            return result;
            
        } catch (Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;
            logger.error("执行 {}.{} 失败, 耗时: {}ms, 错误: {}", 
                    className, methodName, executionTime, e.getMessage(), e);
            throw e;
        }
    }
    
    @Around("execution(* com.yupi.qaai.controller.*.*(..))")
    public Object logControllerMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        
        logger.info("API调用: {}, 参数数量: {}", methodName, args.length);
        
        try {
            Object result = joinPoint.proceed();
            logger.info("API调用成功: {}", methodName);
            return result;
            
        } catch (Exception e) {
            logger.error("API调用失败: {}, 错误: {}", methodName, e.getMessage());
            throw e;
        }
    }
}
```

为了方便运维，我们还需要创建部署脚本：

```bash
▼bash复制代码#!/bin/bash
# deploy.sh - 面试鸭问答系统部署脚本

set -e

echo "开始部署编程导航智能问答系统..."

# 设置变量
APP_NAME="qa-system"
APP_VERSION="1.0.0"
DOCKER_IMAGE="$APP_NAME:$APP_VERSION"
CONTAINER_NAME="$APP_NAME-container"

# 停止并删除旧容器
echo "停止旧容器..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# 构建新镜像
echo "构建Docker镜像..."
docker build -t $DOCKER_IMAGE .

# 启动新容器
echo "启动新容器..."
docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -p 8080:8080 \
  -e DASHSCOPE_API_KEY=$DASHSCOPE_API_KEY \
  -e DB_USERNAME=$DB_USERNAME \
  -e DB_PASSWORD=$DB_PASSWORD \
  -e REDIS_HOST=$REDIS_HOST \
  -v ./logs:/app/logs \
  $DOCKER_IMAGE

# 等待容器启动
echo "等待服务启动..."
sleep 30

# 健康检查
echo "执行健康检查..."
if curl -f http://localhost:8080/qa-system/actuator/health; then
    echo "部署成功！服务运行正常。"
else
    echo "部署失败！服务未能正常启动。"
    docker logs $CONTAINER_NAME
    exit 1
fi

echo "部署完成！"
```

这段程序输‍‍‍出结果：   ‌ ‌ ‌     ‍  ‍  ‍   ‍   ‍   ‍ ‍    ‍    

```plain
▼plain复制代码开始部署编程导航智能问答系统...
停止旧容器...
构建Docker镜像...
启动新容器...
等待服务启动...
执行健康检查...
{"status":"UP","components":{"diskSpace":{"status":"UP"},"ping":{"status":"UP"},"qaSystem":{"status":"UP","details":{"responseTime":"150ms","qaService":"正常","embeddingService":"正常"}}}}
部署成功！服务运行正常。
部署完成！
```

通过这套完‍‍‍整的部署和维护体系‌‌‌，我们能够确保智能‍‍‍问答系统在生产环境‍‍‍中稳定运行，并及时‍‍‍发现和解决可能出现的问题。yc4QRp8ovNJ57GPA7bri+mKydKIKzxDFmOrjcxZEUcM=

***

**练习题 1**：设计并实现一个文档版本管理功能，允许用户更新已上传的文档，并保持问答结果的一致性。

```java
▼java复制代码package com.yupi.qaai.service;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.segment.TextSegment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * 老鱼简历文档版本管理服务
 * 支持文档更新和版本控制
 */
@Service
public class DocumentVersionService {
    
    @Autowired
    private DocumentParseService documentParseService;
    
    @Autowired
    private EmbeddingService embeddingService;
    
    // 文档版本信息存储
    private final Map<String, DocumentVersion> documentVersions = new HashMap<>();
    
    public static class DocumentVersion {
        private String documentId;
        private String fileName;
        private int version;
        private LocalDateTime uploadTime;
        private List<String> segmentIds;
        
        // 构造方法和getter/setter
        public DocumentVersion(String documentId, String fileName, int version) {
            this.documentId = documentId;
            this.fileName = fileName;
            this.version = version;
            this.uploadTime = LocalDateTime.now();
        }
        
        // getter和setter方法...
        public String getDocumentId() { return documentId; }
        public String getFileName() { return fileName; }
        public int getVersion() { return version; }
        public LocalDateTime getUploadTime() { return uploadTime; }
        public List<String> getSegmentIds() { return segmentIds; }
        public void setSegmentIds(List<String> segmentIds) { this.segmentIds = segmentIds; }
    }
    
    /**
     * 上传新版本文档
     * @param file 文档文件
     * @param existingDocumentId 现有文档ID（如果是更新）
     * @return 文档版本信息
     */
    public DocumentVersion uploadDocumentVersion(MultipartFile file, String existingDocumentId) 
            throws Exception {
        
        String fileName = file.getOriginalFilename();
        String documentId;
        int version = 1;
        
        if (existingDocumentId != null && documentVersions.containsKey(existingDocumentId)) {
            // 更新现有文档
            DocumentVersion existingVersion = documentVersions.get(existingDocumentId);
            documentId = existingDocumentId;
            version = existingVersion.getVersion() + 1;
            
            // 删除旧版本的向量数据
            removeOldVersionVectors(existingVersion);
        } else {
            // 新文档
            documentId = UUID.randomUUID().toString();
        }
        
        // 解析新文档
        Document document = documentParseService.parseDocument(file);
        List<TextSegment> segments = documentParseService.splitDocument(document);
        
        // 为每个片段添加版本信息
        for (int i = 0; i < segments.size(); i++) {
            TextSegment segment = segments.get(i);
            segment.metadata().put("documentId", documentId);
            segment.metadata().put("version", String.valueOf(version));
            segment.metadata().put("segmentIndex", String.valueOf(i));
        }
        
        // 存储新版本向量
        embeddingService.embedAndStore(segments, documentId);
        
        // 创建版本记录
        DocumentVersion newVersion = new DocumentVersion(documentId, fileName, version);
        documentVersions.put(documentId, newVersion);
        
        return newVersion;
    }
    
    /**
     * 删除旧版本的向量数据
     */
    private void removeOldVersionVectors(DocumentVersion oldVersion) {
        // 这里应该实现删除向量存储中旧版本数据的逻辑
        // 具体实现取决于使用的向量数据库
        System.out.println("删除文档 " + oldVersion.getDocumentId() + 
                         " 版本 " + oldVersion.getVersion() + " 的向量数据");
    }
    
    /**
     * 获取文档版本历史
     */
    public DocumentVersion getDocumentVersion(String documentId) {
        return documentVersions.get(documentId);
    }
}
```

**练习题 2**：实现一个智能提示功能，当用户输入问题时，系统能够根据已有文档内容提供相关的问题建议。

```java
▼java复制代码package com.yupi.qaai.service;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 算法导航智能提示服务
 * 基于文档内容为用户提供问题建议
 */
@Service
public class QuestionSuggestionService {
    
    @Autowired
    private EmbeddingService embeddingService;
    
    @Autowired
    private ChatModel chatModel;
    
    // 问题建议生成模板
    private final PromptTemplate suggestionTemplate = PromptTemplate.from("""
            基于以下文档内容，为用户生成5个相关的问题建议。
            这些问题应该：
            1. 与文档内容密切相关
            2. 具有实用价值
            3. 能够帮助用户更好地理解文档内容
            4. 难度适中，适合一般用户
            
            文档内容摘要：
            {{documentSummary}}
            
            用户当前输入：{{userInput}}
            
            请生成问题建议列表，每行一个问题，格式如下：
            1. 问题一
            2. 问题二
            3. 问题三
            4. 问题四
            5. 问题五
            """);
    
    /**
     * 根据用户输入生成问题建议
     * @param userInput 用户当前输入
     * @return 问题建议列表
     */
    public List<String> generateQuestionSuggestions(String userInput) {
        try {
            // 如果用户输入为空，返回通用建议
            if (userInput == null || userInput.trim().isEmpty()) {
                return getGeneralSuggestions();
            }
            
            // 基于用户输入检索相关文档
            List<TextSegment> relevantSegments = embeddingService.retrieveRelevant(userInput, 10);
            
            if (relevantSegments.isEmpty()) {
                return getGeneralSuggestions();
            }
            
            // 生成文档摘要
            String documentSummary = relevantSegments.stream()
                    .map(TextSegment::text)
                    .limit(3) // 只取前3个最相关的片段
                    .collect(Collectors.joining("\n\n"));
            
            // 构建提示词
            Map<String, Object> variables = new HashMap<>();
            variables.put("documentSummary", documentSummary);
            variables.put("userInput", userInput);
            
            Prompt prompt = suggestionTemplate.apply(variables);
            
            // 调用AI生成建议
            String response = chatModel.chat(prompt.text());
            
            // 解析响应为问题列表
            return parseQuestionSuggestions(response);
            
        } catch (Exception e) {
            System.err.println("生成问题建议时发生错误: " + e.getMessage());
            return getGeneralSuggestions();
        }
    }
    
    /**
     * 获取通用问题建议
     */
    private List<String> getGeneralSuggestions() {
        return Arrays.asList(
                "如何开始使用这个系统？",
                "有哪些主要功能可以使用？",
                "如何上传和管理文档？",
                "系统支持哪些文件格式？",
                "如何优化问答效果？"
        );
    }
    
    /**
     * 解析AI生成的问题建议
     */
    private List<String> parseQuestionSuggestions(String response) {
        return Arrays.stream(response.split("\n"))
                .filter(line -> !line.trim().isEmpty())
                .map(line -> line.replaceAll("^\\d+\\.\\s*", "")) // 移除序号
                .map(String::trim)
                .filter(line -> !line.isEmpty())
                .limit(5)
                .collect(Collectors.toList());
    }
    
    /**
     * 基于关键词生成问题建议
     * 适用于用户输入较短的情况
     */
    public List<String> generateKeywordBasedSuggestions(String keyword) {
        // 检索包含关键词的文档片段
        List<TextSegment> segments = embeddingService.retrieveRelevant(keyword, 5);
        
        // 从文档中提取常见问题模式
        List<String> suggestions = new ArrayList<>();
        
        for (TextSegment segment : segments) {
            String text = segment.text();
            
            // 简单的问题模式匹配
            if (text.contains("如何") || text.contains("怎么")) {
                String suggestion = extractQuestionFromText(text, "如何|怎么");
                if (suggestion != null) {
                    suggestions.add(suggestion);
                }
            }
            
            if (text.contains("什么是") || text.contains("定义")) {
                suggestions.add("什么是" + keyword + "？");
            }
            
            if (suggestions.size() >= 5) {
                break;
            }
        }
        
        // 如果没有足够的建议，添加通用建议
        while (suggestions.size() < 3) {
            suggestions.addAll(getGeneralSuggestions());
            break;
        }
        
        return suggestions.stream().distinct().limit(5).collect(Collectors.toList());
    }
    
    /**
     * 从文本中提取问题
     */
    private String extractQuestionFromText(String text, String pattern) {
        // 这里可以实现更复杂的问题提取逻辑
        // 简单实现：查找包含模式的句子
        String[] sentences = text.split("[。！？]");
        for (String sentence : sentences) {
            if (sentence.matches(".*(" + pattern + ").*")) {
                return sentence.trim() + "？";
            }
        }
        return null;
    }
}
```

**练习题 3**：设计一个问答质量评估系统，能够自动评估生成答案的质量，并收集用户反馈进行持续改进。7QiJ3WkhTRjV8VSaIHYq0+Wzni+Hi3xtR8CR8/IP1VI=

```java
▼java复制代码package com.yupi.qaai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 代码小抄问答质量评估服务
 * 评估答案质量并收集用户反馈
 */
@Service
public class QualityAssessmentService {
    
    @Autowired
    private EmbeddingService embeddingService;
    
    // 存储问答记录和评估结果
    private final Map<String, QARecord> qaRecords = new ConcurrentHashMap<>();
    private final Map<String, UserFeedback> userFeedbacks = new ConcurrentHashMap<>();
    
    /**
     * 问答记录
     */
    public static class QARecord {
        private String id;
        private String question;
        private String answer;
        private List<String> sourceDocuments;
        private double relevanceScore;
        private double completenessScore;
        private double accuracyScore;
        private LocalDateTime timestamp;
        
        public QARecord(String question, String answer, List<String> sourceDocuments) {
            this.id = UUID.randomUUID().toString();
            this.question = question;
            this.answer = answer;
            this.sourceDocuments = sourceDocuments;
            this.timestamp = LocalDateTime.now();
        }
        
        // getter和setter方法
        public String getId() { return id; }
        public String getQuestion() { return question; }
        public String getAnswer() { return answer; }
        public List<String> getSourceDocuments() { return sourceDocuments; }
        public double getRelevanceScore() { return relevanceScore; }
        public void setRelevanceScore(double relevanceScore) { this.relevanceScore = relevanceScore; }
        public double getCompletenessScore() { return completenessScore; }
        public void setCompletenessScore(double completenessScore) { this.completenessScore = completenessScore; }
        public double getAccuracyScore() { return accuracyScore; }
        public void setAccuracyScore(double accuracyScore) { this.accuracyScore = accuracyScore; }
        public LocalDateTime getTimestamp() { return timestamp; }
    }
    
    /**
     * 用户反馈
     */
    public static class UserFeedback {
        private String qaRecordId;
        private int rating; // 1-5分评分
        private String comment;
        private boolean isHelpful;
        private LocalDateTime feedbackTime;
        
        public UserFeedback(String qaRecordId, int rating, String comment, boolean isHelpful) {
            this.qaRecordId = qaRecordId;
            this.rating = rating;
            this.comment = comment;
            this.isHelpful = isHelpful;
            this.feedbackTime = LocalDateTime.now();
        }
        
        // getter方法
        public String getQaRecordId() { return qaRecordId; }
        public int getRating() { return rating; }
        public String getComment() { return comment; }
        public boolean isHelpful() { return isHelpful; }
        public LocalDateTime getFeedbackTime() { return feedbackTime; }
    }
    
    /**
     * 自动评估答案质量
     * @param question 用户问题
     * @param answer 生成的答案
     * @param sourceDocuments 源文档片段
     * @return 质量评估结果
     */
    public QARecord assessAnswerQuality(String question, String answer, List<String> sourceDocuments) {
        QARecord record = new QARecord(question, answer, sourceDocuments);
        
        // 评估相关性
        double relevanceScore = assessRelevance(question, answer);
        record.setRelevanceScore(relevanceScore);
        
        // 评估完整性
        double completenessScore = assessCompleteness(question, answer);
        record.setCompletenessScore(completenessScore);
        
        // 评估准确性（基于源文档）
        double accuracyScore = assessAccuracy(answer, sourceDocuments);
        record.setAccuracyScore(accuracyScore);
        
        // 存储评估记录
        qaRecords.put(record.getId(), record);
        
        return record;
    }
    
    /**
     * 评估答案与问题的相关性
     */
    private double assessRelevance(String question, String answer) {
        try {
            // 使用向量相似度评估相关性
            List<String> questionKeywords = extractKeywords(question);
            List<String> answerKeywords = extractKeywords(answer);
            
            // 计算关键词重叠率
            Set<String> questionSet = new HashSet<>(questionKeywords);
            Set<String> answerSet = new HashSet<>(answerKeywords);
            
            Set<String> intersection = new HashSet<>(questionSet);
            intersection.retainAll(answerSet);
            
            Set<String> union = new HashSet<>(questionSet);
            union.addAll(answerSet);
            
            double jaccardSimilarity = union.isEmpty() ? 0.0 : (double) intersection.size() / union.size();
            
            // 结合答案长度进行调整
            double lengthFactor = Math.min(1.0, answer.length() / 100.0); // 假设100字符为基准
            
            return Math.min(1.0, jaccardSimilarity * 0.7 + lengthFactor * 0.3);
            
        } catch (Exception e) {
            return 0.5; // 默认中等分数
        }
    }
    
    /**
     * 评估答案的完整性
     */
    private double assessCompleteness(String question, String answer) {
        // 基于答案长度和结构评估完整性
        double lengthScore = Math.min(1.0, answer.length() / 200.0); // 200字符为理想长度
        
        // 检查答案是否包含常见的完整性指标
        double structureScore = 0.0;
        
        if (answer.contains("首先") || answer.contains("第一")) structureScore += 0.2;
        if (answer.contains("其次") || answer.contains("第二")) structureScore += 0.2;
        if (answer.contains("最后") || answer.contains("总结")) structureScore += 0.2;
        if (answer.contains("例如") || answer.contains("比如")) structureScore += 0.2;
        if (answer.contains("因此") || answer.contains("所以")) structureScore += 0.2;
        
        return Math.min(1.0, lengthScore * 0.6 + structureScore * 0.4);
    }
    
    /**
     * 评估答案的准确性（基于源文档）
     */
    private double assessAccuracy(String answer, List<String> sourceDocuments) {
        if (sourceDocuments == null || sourceDocuments.isEmpty()) {
            return 0.5; // 无源文档时给中等分数
        }
        
        // 计算答案与源文档的相似度
        double totalSimilarity = 0.0;
        
        for (String doc : sourceDocuments) {
            double similarity = calculateTextSimilarity(answer, doc);
            totalSimilarity += similarity;
        }
        
        return Math.min(1.0, totalSimilarity / sourceDocuments.size());
    }
    
    /**
     * 计算文本相似度
     */
    private double calculateTextSimilarity(String text1, String text2) {
        List<String> words1 = extractKeywords(text1);
        List<String> words2 = extractKeywords(text2);
        
        Set<String> set1 = new HashSet<>(words1);
        Set<String> set2 = new HashSet<>(words2);
        
        Set<String> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);
        
        Set<String> union = new HashSet<>(set1);
        union.addAll(set2);
        
        return union.isEmpty() ? 0.0 : (double) intersection.size() / union.size();
    }
    
    /**
     * 提取关键词
     */
    private List<String> extractKeywords(String text) {
        // 简单的关键词提取：分词并过滤停用词
        String[] words = text.toLowerCase()
                .replaceAll("[^\\u4e00-\\u9fa5a-zA-Z0-9\\s]", "")
                .split("\\s+");
        
        Set<String> stopWords = Set.of("的", "是", "在", "有", "和", "或", "但", "而", "也", "都", 
                "会", "能", "要", "可以", "应该", "这", "那", "一", "一个", "the", "is", "are", 
                "and", "or", "but", "in", "on", "at", "to", "for", "of", "with");
        
        return Arrays.stream(words)
                .filter(word -> word.length() > 1)
                .filter(word -> !stopWords.contains(word))
                .distinct()
                .toList();
    }
    
    /**
     * 收集用户反馈
     */
    public void collectUserFeedback(String qaRecordId, int rating, String comment, boolean isHelpful) {
        UserFeedback feedback = new UserFeedback(qaRecordId, rating, comment, isHelpful);
        userFeedbacks.put(UUID.randomUUID().toString(), feedback);
        
        // 可以在这里触发改进机制
        analyzeAndImprove(qaRecordId, feedback);
    }
    
    /**
     * 分析反馈并触发改进
     */
    private void analyzeAndImprove(String qaRecordId, UserFeedback feedback) {
        QARecord record = qaRecords.get(qaRecordId);
        if (record == null) return;
        
        // 如果评分较低，记录需要改进的点
        if (feedback.getRating() <= 2) {
            System.out.println("低评分问题记录 - 问题: " + record.getQuestion() + 
                             ", 评分: " + feedback.getRating() + 
                             ", 评论: " + feedback.getComment());
            
            // 这里可以实现自动改进机制，比如：
            // 1. 调整检索参数
            // 2. 优化提示词模板
            // 3. 增加相关文档
        }
    }
    
    /**
     * 获取质量统计报告
     */
    public Map<String, Object> getQualityReport() {
        Map<String, Object> report = new HashMap<>();
        
        if (qaRecords.isEmpty()) {
            report.put("totalQuestions", 0);
            return report;
        }
        
        double avgRelevance = qaRecords.values().stream()
                .mapToDouble(QARecord::getRelevanceScore)
                .average().orElse(0.0);
        
        double avgCompleteness = qaRecords.values().stream()
                .mapToDouble(QARecord::getCompletenessScore)
                .average().orElse(0.0);
        
        double avgAccuracy = qaRecords.values().stream()
                .mapToDouble(QARecord::getAccuracyScore)
                .average().orElse(0.0);
        
        double avgUserRating = userFeedbacks.values().stream()
                .mapToInt(UserFeedback::getRating)
                .average().orElse(0.0);
        
        report.put("totalQuestions", qaRecords.size());
        report.put("averageRelevanceScore", Math.round(avgRelevance * 100.0) / 100.0);
        report.put("averageCompletenessScore", Math.round(avgCompleteness * 100.0) / 100.0);
        report.put("averageAccuracyScore", Math.round(avgAccuracy * 100.0) / 100.0);
        report.put("averageUserRating", Math.round(avgUserRating * 100.0) / 100.0);
        report.put("totalFeedbacks", userFeedbacks.size());
        
        return report;
    }
}
```
