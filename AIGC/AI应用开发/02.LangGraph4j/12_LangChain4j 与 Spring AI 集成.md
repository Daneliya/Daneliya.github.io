---
url: /AIGC/AI应用开发/02.LangGraph4j/12_LangChain4j 与 Spring AI 集成.md
---
# 12\_LangChain4j 与 Spring AI 集成

Spring AI 和 ‍‍La‍ngChain4j 都是优秀的 AI 应用开‌‌发框架，各有其独‌特的优势和适用场景。理解这两个框‍‍架的特点并学会合理组合使用，‍能够让我们构建出更加‍‍强大和灵活的 AI 应用。掌握框架集成技‍术，你就‍‍能在企业级项目中发挥出最大的技术价值        ‍                        

## 12.1 Spring AI 简介

[Spring AI](https://docs.spring.io/spring-ai/reference/) 是 Spring 生态系统的新成员，旨在简化 AI 功能与 Spring 应用的集成。Spring AI 通过提供统一接口、支持集成多种 AI 服务提供商和模型类型、各种 AI 开发常用的特性（比如 RAG 知识库、Tools 工具调用和 MCP 模型上下文协议），简化了 AI 应用开发代码，使开发者能够专注于业务逻辑，提高了开发效率。7QiJ3WkhTRjV8VSaIHYq0+Wzni+Hi3xtR8CR8/IP1VI=

!\[img]\(12\_LangChain4j 与 Spring AI 集成.assets/5XxhcDamZGd8GGj5.webp)

Spring ‍‍‍AI 的文档写得还是比较清‌‌‌晰易懂的，打破了我对国外文‍‍‍档的一贯认知（      ‍‍‍             ‍‍‍             

Spring AI 的核心特性如下，参考官方文档：HrGXUqFhjK7wNHkLfEF5cglTdzhFLxXIforC6kfYOak=

* 跨 AI 供应商的可移植 API 支持：适用于聊天、文本转图像和嵌入模型，同时支持同步和流式 API 选项，并可访问特定于模型的功能。
* 支持所有主流 AI 模型供应商：如 Anthropic、OpenAI、微软、亚马逊、谷歌和 Ollama，支持的模型类型包括：聊天补全、嵌入、文本转图像、音频转录、文本转语音
* 结构化输出：将 AI 模型输出映射到 POJO（普通 Java 对象）。
* 支持所有主流向量数据库：如 Apache Cassandra、Azure Cosmos DB、Azure Vector Search、Chroma、Elasticsearch、GemFire、MariaDB、Milvus、MongoDB Atlas、Neo4j、OpenSearch、Oracle、PostgreSQL/PGVector、PineCone、Qdrant、Redis、SAP Hana、Typesense 和 Weaviate。
* 跨向量存储供应商的可移植 API：包括新颖的类 SQL 元数据过滤 API。
* 工具/函数调用：允许模型请求执行客户端工具和函数，从而根据需要访问必要的实时信息并采取行动。
* 可观测性：提供与 AI 相关操作的监控信息。
* 文档 ETL 框架：适用于数据工程场景。
* AI 模型评估工具：帮助评估生成内容并防范幻觉响应。
* Spring Boot 自动配置和启动器：适用于 AI 模型和向量存储。
* ChatClient API：与 AI 聊天模型通信的流式 API，用法类似于 WebClient 和 RestClient API。
* Advisors API：封装常见的生成式 AI 模式，转换发送至语言模型（LLM）和从语言模型返回的数据，并提供跨各种模型和用例的可移植性。
* 支持聊天对话记忆和检索增强生成（RAG）。

Spring AI 默认没有支持所有的大模型（尤其是国产的），更多的是支持兼容 OpenAI API 的大模型的集成，参考 [官方的模型对比](https://docs.spring.io/spring-ai/reference/api/chat/comparison.html)。因此，我们如果想要调用阿里系大模型（比如通义千问），推荐直接使用阿里自主封装的 [Spring AI Alibaba 框架](https://java2ai.com/)，它不仅能直接继承阿里系大模型，用起来更方便，而且与标准的 Spring AI 保持兼容。

可以参考下‍‍‍列官方文档，来跑通调‌‌‌用大模型的流程：  ‍‍‍          ‍‍‍          ‍‍‍          nqebE0GbQps0Ats4MKJjbVHQiAAW+ffJdMrCsN5dgzs=

* [灵积模型接入指南](https://java2ai.com/docs/1.0.0-M6.1/models/dashScope/)
* [通义千问接入指南](https://java2ai.com/docs/1.0.0-M6.1/models/qwq/)

1）引入依赖：

```xml
▼xml复制代码<dependency>
    <groupId>com.alibaba.cloud.ai</groupId>
    <artifactId>spring-ai-alibaba-starter</artifactId>
    <version>1.0.0-M6.1</version>
</dependency>
```

官方提醒：由于 spring-ai 相关依赖包还没有发布到中央仓库，如出现 spring-ai-core 等相关依赖解析问题，请在项目的 pom.xml 依赖中加入如下仓库配置。

```xml
▼xml复制代码<repositories>
  <repository>
    <id>spring-milestones</id>
    <name>Spring Milestones</name>
    <url>https://repo.spring.io/milestone</url>
    <snapshots>
      <enabled>false</enabled>
    </snapshots>
  </repository>
</repositories>
```

2）编写配‍‍置‍：      ‌ ‌     ‌  ‍  ‍      ‍  ‍ ‍     ‍       ‍               ‍            nqebE0GbQps0Ats4MKJjbVHQiAAW+ffJdMrCsN5dgzs=

```yaml
▼yaml复制代码spring:
  application:
    name: spring-ai-alibaba-qwq-chat-client-example
  ai:
    dashscope:
      api-key: ${AI_DASHSCOPE_API_KEY}
      chat:
        options:
          model: qwen-plus
```

3）编写示例代码，注意要注入 `dashscopeChatModel`：

```java
▼java复制代码// 取消注释即可在 SpringBoot 项目启动时执行
@Component
public class SpringAiAiInvoke implements CommandLineRunner {

    @Resource
    private ChatModel dashscopeChatModel;

    @Override
    public void run(String... args) throws Exception {
        AssistantMessage output = dashscopeChatModel.call(new Prompt("你好，我是鱼皮"))
                .getResult()
                .getOutput();
        System.out.println(output.getText());
    }
}
```

上述代码实现了 C‍‍‍ommandLineRunner 接‌‌‌口，我们启动 Spring Boot‍‍‍ 项目时，会自动注入大模型 Chat‍‍‍Model 依赖，并且单次执行该类的‍‍‍ run 方法，达到测试的效果。

💡 上述代码中我们是通‍‍‍过 ChatModel 对象调用大模型，适合简单‌‌‌的对话场景。除了这种方式外，Spring AI ‍‍‍还提供了 ChatClient 调用方式，提供更‍‍‍多高级功能（比如会话记忆），适合复杂场景，在后续‍‍‍ AI 应用开发章节中会详细介绍。

## 12.2 Spring AI 与 LangChain4j 对比

Spring A‍I 和‍ L‍angChain4j ‌虽然都致力于简化 ‌AI 应用开发‍‌，但在设计理念、架构风格和使用‍场‍景上存在显著差异。理解这‍些差异对‍于选择合‍适的框架至关重要            ‍   ‍                          ‍                       

Spring AI 更注重与 S‍‍‍pring 生态系统的集成，提供了统一的抽象接口和声明式的配置方‌‌‌式。它的设计更符合传统 Spring 应用的开发模式，对于已‍‍‍经熟悉 Spring 框架的开发者来说学习成本较低。而 Lan‍‍‍gChain4j 则更专注于 AI 应用的特定需求，提供了更丰‍‍‍富的 AI 相关功能和更灵活的组合方式。

### 主要对比：

#### Spring AI

Spring AI 是‍ Sp‍‍ring Framework 官方推‌出的一个项目，旨在将‌‌生成式 AI 功能无缝‍集成到 Spring 生态系统中。‍‍它的核心‍理念是为 Spring 开发者提供一种熟悉‍且惯‍‍用的方式来构建 AI 驱动的应用             ‍‍                   

\*\*主要特点：\*\*yc4QRp8ovNJ57GPA7bri+mKydKIKzxDFmOrjcxZEUcM=

* **Spring 生态原生集成：** 与 Spring Boot、Spring Framework 深度融合，开发者可以利用熟悉的 Spring 编程模型（如依赖注入、自动化配置）来开发 AI 应用。
* **模型抽象：** 提供了统一的 API 来与各种大型语言模型 (LLM) 和嵌入模型 (Embedding Model) 进行交互，包括 OpenAI、Azure OpenAI、Google Gemini、Hugging Face 等。这意味着你可以轻松切换底层模型提供商，而无需修改大部分业务代码。
* **RAG 支持：** 提供了构建 RAG 应用所需的基本组件，例如文档加载器 (`DocumentReader`)、文本分割器 (`TextSplitter`)、嵌入模型 (`EmbeddingModel`) 和向量存储 (`VectorStore`)。
* **函数调用 (Function Calling) / 工具使用：** 支持 LLM 调用外部工具或函数，扩展 LLM 的能力，使其能够执行更复杂的任务。
* **结构化输出 (Structured Output)：** 能够将 LLM 的非结构化文本输出映射到 Java POJO 对象，方便下游业务逻辑处理。
* **流式 API：** 支持与 LLM 进行流式交互，实时获取生成内容，提升用户体验。
* **易于上手：** 对于 Spring 开发者来说，学习曲线平缓，可以快速开始构建 AI 应用。

**适用场景：**

* **Spring 开发者优先：** 如果你的项目基于 Spring Boot，并且希望充分利用 Spring 生态的便利性来构建 AI 应用，Spring AI 是一个非常自然的选择。
* **快速原型开发：** 凭借其与 Spring 的深度集成和简化的 API，非常适合快速构建 AI 功能原型。
* **企业级应用：** 适用于需要将 AI 能力嵌入到现有 Spring 驱动的企业级应用中。

#### LangChain4j

LangChain4j‍‍‍ 是 LangChain 框架的 Java ‌‌‌移植版本，其核心目标是提供一个全面的工具包，‍‍‍用于构建由 LLM 驱动的复杂应用程序。它强‍‍‍调组合性、模块化和高级抽象，旨在帮助开发者更‍‍‍容易地构建和管理复杂的 AI 工作流。

\*\*主要特点：\*\*wkzLNuBRh6R+lZgXeGCYFHBSq3Izz4e/cck+rYjQNkc=

* 全面的 AI 工具包：

  提供了广泛的模块和抽象，涵盖了 LLM 的各个方面，包括：

  * **模型集成：** 支持多种 LLM 和嵌入模型（OpenAI, Google Gemini, Azure OpenAI, HugChain, Ollama, DashScope 等）。
  * **文档处理：** 强大的文档加载器 (Document Loader) 和解析器 (Document Parser)，支持多种文件格式（PDF, DOCX, TXT, HTML 等）。灵活的文本分割器 (Document Splitter)。
  * **数据存储：** 支持多种向量存储 (Embedding Store)，如 Chroma, Pinecone, Milvus, Redis, PgVector, InMemory 等。
  * **检索器 (Retriever)：** 提供多种检索策略，用于从向量存储中检索相关信息。
  * **链 (Chain) 和代理 (Agent)：** 核心概念，用于编排 LLM 调用、工具使用、RAG 流程等，实现复杂的逻辑。
  * **内存 (Memory)：** 管理 LLM 对话的历史上下文。
  * **工具 (Tool)：** 允许 LLM 与外部系统或 API 交互。

* **模块化和可组合性：** 强调将不同的组件（模型、检索器、链、工具等）组合起来构建复杂的 AI 应用程序，提供了高度的灵活性。

* **社区驱动：** 作为 LangChain 生态的一部分，受益于庞大的社区支持和活跃的开发。

* **易于理解的抽象：** 即使对于非 Spring 开发者，其核心概念和抽象也相对容易理解和上手。

* **Beta 或 Snapshot 版本较多：** 由于发展迅速，很多模块可能仍处于 Beta 或 Snapshot 阶段，这意味着 API 可能会有变化。

**适用场景：**

* **复杂 AI 应用开发：** 如果你需要构建高度定制化、流程复杂的 LLM 应用，特别是涉及多步骤链、自定义代理行为、多种数据源集成等场景。
* **通用 AI 开发：** 不限于 Spring 生态，如果你在构建一个独立的 Java AI 服务或与非 Spring 项目集成，LangChain4j 同样适用。
* **研究和实验：** 提供丰富的模块和实验性功能，适合在 AI 领域进行探索和创新。
* **需要精细控制：** 如果你需要对 RAG 流程的每个环节（如文档解析、分割策略、检索算法、上下文管理）进行精细控制和定制。

## 练习题

### 实现统一的 AI 服务适配器

设计并实现一个 ‍AI‍‍ 服务适配器，能够根据不同‌的业务场景自动选‌‌择使用 Spr‍ing AI 或 LangC‍‍hai‍n4j。要求支持配置化的策‍略选择，‍‍并提供统一的调用接口            ‍‍                    cLGytfopnrFuxnn3sz+3dYGbZsmkbigItBfA6ZV7hZU=

参考答案：

```java
▼java复制代码
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.response.ChatResponse;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;

import java.util.List;
import java.util.stream.Collectors;


public class SpringAiChatModel implements ChatModel {

    private final ChatClient chatClient;

    public SpringAiChatModel(ChatClient chatClient) {
        this.chatClient = chatClient;
    }


    @Override
    public ChatResponse chat(List<ChatMessage> messages) {
        // 1. 将 LangChain4j 的消息格式转换为 Spring AI 的消息格式
        List<org.springframework.ai.chat.messages.Message> springAiMessages = messages.stream()
                .map(this::toSpringAiMessage)
                .collect(Collectors.toList());

        // 2. 使用 Spring AI 的 ChatClient 发送请求
        ChatClient.CallResponseSpec call = chatClient.prompt(new Prompt(springAiMessages)).call();

        // 3. 获取响应并转换为 LangChain4j 的格式
        String content = call.content();
        AiMessage aiMessage = AiMessage.from(content);

        return ChatResponse.builder().aiMessage(aiMessage).build();
    }

    // 辅助方法，用于转换消息类型
    private org.springframework.ai.chat.messages.Message toSpringAiMessage(ChatMessage chatMessage) {
        // 这里可以根据 LangChain4j 的消息类型进行更详细的转换
        // 为了简化，我们只处理文本内容
        String content = getMessageContent(chatMessage);
        return new org.springframework.ai.chat.messages.UserMessage(content);
    }


    private String getMessageContent(ChatMessage message) {
        if (message instanceof UserMessage userMessage) {
            return userMessage.singleText();
        } else if (message instanceof AiMessage aiMessage) {
            return aiMessage.text();
        } else if (message instanceof SystemMessage systemMessage) {
            return systemMessage.text();
        } else {
            return message.toString();
        }
    }
}
```
