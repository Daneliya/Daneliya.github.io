---
url: /AIGC/AI应用开发/02.LangGraph4j/5_LangChain4j基础.md
---
# LangChain4j 基础

LangChain4j 是 Ja‍‍‍va 生态系统中的大模型应用开发框架，为 Java 开发者提供了‌‌‌与 Python 版 LangChain 类似的功能。在构建大模‍‍‍型驱动的应用时，它能够帮助我们简化开发流程，提高代码复用率，并让‍‍‍应用更易于维护和扩展。本章将从基础概念入手，帮助你快速掌握 La‍‍‍ngChain4j 的核心知识和使用方法。

## 5.1 LangChain4j 简介与特点

LangChain4j 是针对‍‍‍ Java 生态系统开发的大型语言模型（LLM）应用框架，‌‌‌它提供了一套丰富的工具和抽象，简化了与各种 LLM 的交互‍‍‍过程。作为知名 AI 框架 LangChain 的 Jav‍‍‍a 实现版本，它保持了与 Python 版本相似的设计理念‍‍‍，同时充分利用了 Java 语言的优势。3SdhPNReyfSez0Q4gOc0v6ykW2hqke4CnFnKQxaIhL8=

LangChain4‍‍‍j 的核心理念是将 LLM 集成到应用程‌‌‌序中，使开发者能够构建端到端的、与语言模‍‍‍型交互的智能应用。它不仅仅是一个简单的 ‍‍‍API 调用封装，而是提供了从模型连接、‍‍‍提示管理到输出处理的完整工具链。

LangChain4j 的主要特点包括：

**接口统一性**：提供统一的抽象接口，让开发者可以无缝切换不同的语言模型提供商，如 OpenAI、Anthropic、Vertex AI 等，而无需修改大量代码。

**模块化设计**：框架分为多个功能模块，包括模型接口、内存组件、工具集成、输出解析等，开发者可以根据需要选择性使用。

**类型安全**：充分利用 Java 的静态类型系统，提供类型安全的 API，减少运行时错误。

**企业级集成**：提供与 Spring 生态系统的深度集成，便于在企业应用中使用。

**RAG 支持**：内置检索增强生成（Retrieval-Augmented Generation）功能，可以连接到各种知识库和向量数据库。

**功能链**：支持构建复杂的功能链和 AI 代理，可以执行多步骤任务。

LangChain4j 的架构主要包含以下几个核心组件：

1. **模型接口层**：提供统一的接口连接各种语言模型，如 ChatLanguageModel、EmbeddingModel 等。
2. **内存组件**：管理对话历史和上下文信息，支持短期和长期记忆。
3. **链（Chains）**：将多个组件组合成处理流程，如提示模板、模型调用、结果处理等。
4. **工具（Tools）**：让语言模型能够执行外部操作，如搜索、计算、API 调用等。
5. **输出处理器**：将模型输出解析成结构化数据，如 JSON、POJO 等。
6. **检索器（Retrievers）**：实现文档检索和相关内容提取功能。

LangChain4‍‍‍j 的设计目标是减少与大语言模型交互的复‌‌‌杂性，让开发者能够专注于业务逻辑而非底层实‍现‍‍细节。无论是构建简单的聊天机器人，还‍‍‍是复杂的 AI 助手，LangChain‍‍‍4j 都提供了必要的工具和抽象。

## 5.2 LangChain4j 依赖引入

要开始使用 Lan‍‍‍gChain4j，首先需要在项目中‌‌‌引入相关依赖。LangChain4‍‍‍j 采用模块化设计，因此你可以根据‍‍‍项目需求选择性地引入所需模块，而不‍‍‍必包含整个框架的所有功能。

在 Mav‍‍‍en 项目中，‌可‌以‌通过以下方‍式引‍入 ‍Lan‍gCh‍ain‍4‍j 的核‍心依赖：

```xml
<!-- LangChain4j 核心依赖 -->
<dependency>
    <groupId>dev.langchain4j</groupId>
    <artifactId>langchain4j</artifactId>
     <version>1.0.0-beta3</version>
</dependency>
```

这个核心依赖包含‍‍‍了 LangChain4j 的‌‌‌基础功能，包括模型接口、提示工‍‍‍程工具、链和代理的基本实现等。‍‍‍但要实际连接特定的大模型，还需‍‍‍要引入对应的模型集成模块。

例如，如果你想使用 OpenAI 的模型，需要额外引入：

```xml
<dependency>
    <groupId>dev.langchain4j</groupId>
    <artifactId>langchain4j-open-ai</artifactId>
    <version>1.1.0</version>
</dependency>
```

对于国内开‍‍‍发者来说，使用‌阿‌里‌云的大模型‍可能‍更方‍便，可‍以引入‍以下社‍区‍模块：

```xml
<!-- 阿里云灵积模型集成 -->
<dependency>
    <groupId>dev.langchain4j</groupId>
    <artifactId>langchain4j-community-dashscope</artifactId>
    <version>1.0.0-beta2</version>
</dependency>
```

需要注意的是，Lang‍‍‍Chain4j 仍在快速发展中，版本更新较‌‌为频‌繁。建议在使用前查看最新的官方文档，确‍‍‍认当前稳定版本和兼容性信息。你可以在 Ma‍‍‍ven Central 仓库中搜索 "la‍‍‍ngchain4j" 找到最新版本。7QiJ3WkhTRjV8VSaIHYq0+Wzni+Hi3xtR8CR8/IP1VI=

此外，LangCh‍‍‍ain4j 的社区版本（langc‌‌‌hain4j-community）‍‍‍包含了更多第三方集成，如果你需要使‍‍‍用特定的模型提供商或服务，可以查看‍‍‍是否有对应的社区集成模块。

## 5.3 支持的大模型列表

LangCha‍in4‍‍j 支持多种主流大模型‌，让开发者可以根据‌‌项目需求和‍预算灵活选择。下面是 Lan‍‍‍gChain4j 目前支持的‍主要大模型提‍‍供商及其特点：              ‍‍                  TRQG02HuvSbBCdyta/9OfF/iMg4d5URNJyKR3KkD/fE=

**1. OpenAI 模型**

OpenA‍‍‍I 提供的模型是‌‌目‌前市场上最受欢‍‍迎的‍选择之一，L‍‍ang‍Chain‍‍4j 对‍其支持最为完善：

* GPT-4 系列：最强大的通用模型，支持复杂推理、代码生成和创意写作
* GPT-3.5 Turbo：性能与成本的良好平衡点，适合大多数日常应用
* text-embedding-ada-002：用于文本嵌入的专用模型

使用示例：

```java
// 创建 OpenAI 聊天模型
ChatLanguageModel model = OpenAiChatModel.builder()
        .apiKey(System.getenv("OPENAI_API_KEY"))
        .modelName("gpt-3.5-turbo")
        .temperature(0.7f)
        .build();

// 进行简单对话
String response = model.chat("编程导航网站有哪些优质的学习资源？");
System.out.println(response);
```

**2. Anthropic Claude 模型**3SdhPNReyfSez0Q4gOc0v6ykW2hqke4CnFnKQxaIhL8=

Claud‍‍‍e 模型以其长‌上‌下‌文窗口和优‍秀的‍文本‍理解能‍力而闻‍名：

* Claude 3 Opus：顶级性能模型，适合复杂分析任务
* Claude 3 Sonnet：平衡性能和效率的中端模型
* Claude 3 Haiku：速度快、成本低的轻量级模型

使用示例：7QiJ3WkhTRjV8VSaIHYq0+Wzni+Hi3xtR8CR8/IP1VI=

```java
// 创建 Claude 聊天模型
ChatLanguageModel model = AnthropicChatModel.builder()
        .apiKey(System.getenv("ANTHROPIC_API_KEY"))
        .modelName("claude-3-sonnet-20240229")
        .temperature(0.5f)
        .build();

// 进行简单对话
String response = model.chat("如何使用老鱼简历制作一份有竞争力的程序员简历？");
System.out.println(response);
```

**3. 阿里云通义千问/灵积模型**

对于国内开发者，阿里云提供的模型是一个便捷选择：cLGytfopnrFuxnn3sz+3dYGbZsmkbigItBfA6ZV7hZU=

* Qwen-Max：性能最强的通义千问大模型
* Qwen-Plus：平衡通用型大模型
* Qwen-Turbo：响应速度快的轻量级模型

使用示例：

```java
// 创建通义千问聊天模型
ChatLanguageModel model = QwenChatModel.builder()
        .apiKey(System.getenv("DASHSCOPE_API_KEY"))
        .modelName("qwen-max")
        .build();

// 进行简单对话
String response = model.chat("面试鸭上有哪些热门的 Java 面试题？");
System.out.println(response);
```

**4. Google Vertex AI 模型**

Google 的 Gemini 系列模型：

* Gemini Pro：强大的通用型大模型
* Gemini Flash：快速响应的轻量级模型

**5. 开源模型支持**

对于希望自‍‍‍行部署模型的开‌发‌者‌，Lang‍Ch‍ai‍n4j‍ 也支‍持多种‍开‍源模型：

* Ollama：易于本地部署的开源模型包装器
* LocalAI：本地运行开源 AI 模型的服务

使用示例：

```java
// 创建 Ollama 聊天模型
ChatLanguageModel model = OllamaChatModel.builder()
        .baseUrl("http://localhost:11434")
        .modelName("llama3")
        .build();

// 进行简单对话
String response = model.chat("如何使用算法导航学习数据结构？");
System.out.println(response);
```

**6. 向量嵌入模型**HrGXUqFhjK7wNHkLfEF5cglTdzhFLxXIforC6kfYOak=

除了聊天模‍‍‍型外，LangC‌‌h‌ain4j 还‍‍支持‍多种向量嵌入‍‍模型，‍用于文本向‍‍量化和相‍似度搜索：

* OpenAI Embeddings：高质量但需要 API 调用
* AllMiniLML6V2EmbeddingModel：本地运行的轻量级嵌入模型
* HuggingFaceEmbedding：支持多种 HuggingFace 嵌入模型

使用示例：nqebE0GbQps0Ats4MKJjbVHQiAAW+ffJdMrCsN5dgzs=

```java
// 创建本地嵌入模型
EmbeddingModel embeddingModel = new AllMiniLmL6V2EmbeddingModel();

// 生成文本嵌入
Embedding embedding = embeddingModel.embed("剪切助手是一个提高工作效率的工具").content();
```

LangChain4j 的模型集成仍在不断扩展中，社区版本提供了更多模型的支持。你可以在官方文档的集成页面查看最新的支持列表：https://docs.langchain4j.dev/integrations/language-models/

## 5.4 基本使用方法

掌握了 Lang‍‍Ch‍ain4j 的依赖引入和支‌‌持的模型后，让我‌们开始学习其基本‍‍用法。LangChain4‍j‍‍ 的使用流程通常包括初始化模型‍‍、构建‍提示、处理响应等步骤             ‍                   

### 简单对话

最基础的用‍法是进行简单的对话‌交互：      ‍         ‍         ‍        Iy8qa2Wkgy1zjaDf5wVYJsxIyeHLdZx9B8sLhGVCeeI=

```java
import dev.langchain4j.community.model.dashscope.QwenChatModel;
import dev.langchain4j.model.chat.ChatLanguageModel;

public class SimpleChatExample {

    public static void main(String[] args) {
        // 初始化聊天模型
        ChatLanguageModel model = QwenChatModel.builder()
                .apiKey(System.getenv("DASHSCOPE_API_KEY"))
                .modelName("qwen-max")
                .temperature(0.7f)
                .build();
        
        // 发送用户问题并获取回答
        String response = model.chat("你好，我是程序员鱼皮，能介绍一下编程导航网站吗？");
        
        System.out.println("AI 回答: " + response);
    }
}
```

这段程序输出结果：

```plain
AI 回答: 你好，小小黑！很高兴见到你。LangChain4j 是一个用于构建基于语言模型的应用程序的 Java 框架。它简化了与各种语言模型（如 GPT-3, Claude 等）交互的过程，并提供了一种结构化的方式来开发复杂的对话系统或任何需要自然语言处理能力的应用。

### 主要特点

1. **易于集成**：LangChain4j 提供了一个简单易用的API，使得开发者可以轻松地将强大的语言模型集成到自己的项目中。
2. **灵活的链式调用**：通过链式方法调用，你可以创建复杂的逻辑流程，包括但不限于问题回答、信息检索、内容生成等任务。
3. **支持多种模型**：除了主流的大规模预训练模型外，还支持用户自定义的小型模型或者特定领域的模型。
4. **内存管理优化**：对于长时间运行的服务来说，有效的内存管理和资源释放是非常重要的。LangChain4j 在这方面做了很多工作来确保应用性能稳定。
5. **社区活跃度高**：作为一个开源项目，LangChain4j 有着活跃的开发者社区，这意味着你可以找到大量的文档、教程以及遇到问题时的帮助。

### 使用场景

- **聊天机器人**：构建能够进行多轮对话并理解上下文的智能助手。
- **自动化客服**：为电子商务网站或其他在线服务平台提供自动化的客户服务解决方案。
- **文本摘要生成**：快速生成文章或报告的摘要。
- **代码生成器**：根据需求描述自动生成简单的代码片段。
- **知识库查询**：结合企业的内部知识库，实现精准的信息检索功能。

如果你对如何开始使用 LangChain4j 感兴趣，建议查看其官方文档和示例项目，这将帮助你更快地上手。希望这些信息对你有所帮助！如果还有其他具体的问题，欢迎随时提问。
```

### 使用消息对象构建对话

如果需要更复杂的对话，可以使用 `Messages` 对象构建多轮对话：

```java
import dev.langchain4j.community.model.dashscope.QwenChatModel;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;

import java.util.ArrayList;
import java.util.List;

public class MultiTurnChatExample {

    public static void main(String[] args) {
        // 初始化聊天模型
        ChatLanguageModel model = QwenChatModel.builder()
            .apiKey(System.getenv("DASHSCOPE_API_KEY"))
            .modelName("qwen-max")
            .temperature(0.7f)
            .build();

        // 构建对话历史
        List<ChatMessage> messages = new ArrayList<>();

        // 添加系统消息，设定角色和行为边界
        messages.add(new SystemMessage("你是面试鸭的AI助手，专注于提供Java面试题解答"));

        // 添加用户问题
        messages.add(new UserMessage("请介绍一下Java中的多线程"));

        // 获取AI回答
        AiMessage response = model.chat(messages).content();
        System.out.println("AI 回答: " + response.text());

        // 将AI回答添加到对话历史
        messages.add(response);

        // 继续对话，提出后续问题
        messages.add(new UserMessage("线程池有哪些常见参数？"));

        // 获取新的回答
        AiMessage followUpResponse = model.chat(messages).content();
        System.out.println("\n后续问题 AI 回答: " + followUpResponse.text());
    }
}
```

````
AI 回答: Java中的多线程是指在一个程序中可以同时运行多个线程来执行不同的任务。这种并发执行的能力使得程序能够更好地利用CPU资源，提高应用程序的响应性和效率。下面是一些关于Java多线程的关键点：

1. **线程与进程**:
   - 进程是操作系统分配资源的基本单位，而线程则是进程中最小的执行单元。
   - 一个进程可以包含多个线程，这些线程共享该进程的资源（如内存空间）。

2. **创建线程的方法**:
   - 实现 `Runnable` 接口：定义一个实现了 `Runnable` 接口的类，并实现其 `run()` 方法。然后通过将其实例传递给 `Thread` 类构造器来创建线程对象。
     ```java
     public class MyRunnable implements Runnable {
         public void run() {
             System.out.println("Running in thread: " + Thread.currentThread().getName());
         }
     }

     // 创建并启动线程
     Thread t = new Thread(new MyRunnable());
     t.start();
     ```
   - 继承 `Thread` 类：直接继承 `Thread` 类，并重写 `run()` 方法。
     ```java
     public class MyThread extends Thread {
         @Override
         public void run() {
             System.out.println("Running in thread: " + this.getName());
         }
     }

     // 创建并启动线程
     MyThread t = new MyThread();
     t.start();
     ```

3. **线程的状态**:
   - 新建 (New)：当使用 `new` 关键字创建一个新的线程时。
   - 就绪 (Runnable)：调用 `start()` 方法后，线程进入就绪状态等待调度。
   - 运行 (Running)：一旦获得CPU时间片，线程开始执行。
   - 阻塞 (Blocked)：线程可能因等待I/O操作、锁等而被阻塞。
   - 死亡 (Dead)：线程执行完毕或由于异常而终止。

4. **线程同步**:
   - 为了防止多个线程同时访问共享资源而导致的数据不一致问题，Java提供了多种同步机制，比如 `synchronized` 关键字、`Lock` 接口以及原子变量等。
   - 使用 `synchronized` 可以锁定某个代码块或者方法，确保同一时刻只有一个线程可以访问该区域。
   - `ReentrantLock` 提供了比 `synchronized` 更灵活的锁机制，支持公平锁、非公平锁及尝试获取锁等功能。

5. **线程间通信**:
   - Java提供了几种方式让线程之间进行通信，包括 `wait()`、`notify()` 和 `notifyAll()` 方法，这些都是 `Object` 类的一部分。
   - `wait()` 方法使当前线程暂停执行，并释放任何持有的监视器锁；`notify()` 唤醒一个正在等待的对象上的单个线程；`notifyAll()` 则唤醒所有等待的线程。

6. **高级特性**:
   - `Executor` 框架：提供了一种更高级的方式来管理线程池，它可以帮助开发者更有效地管理和控制线程。
   - `Future` 和 `Callable`：允许从另一个线程获取结果，或者检查是否完成执行。
   - `Fork/Join` 框架：用于执行可以分解成更小部分的任务，非常适合于并行处理大量数据的情况。

理解Java多线程不仅对于开发高性能的应用至关重要，也是成为合格Java工程师不可或缺的一部分。希望以上信息对你有所帮助！

后续问题 AI 回答: 线程池是Java中用于管理和复用线程的一种机制，可以有效地控制线程的数量，减少线程创建和销毁的开销，提高系统的性能。在Java中，`java.util.concurrent`包提供了多种线程池实现，其中最常用的是`ThreadPoolExecutor`。以下是`ThreadPoolExecutor`的一些常见参数：

1. **corePoolSize**:
   - 核心线程数：线程池中的核心线程数量。即使这些线程处于空闲状态，它们也不会被回收，除非设置了`allowCoreThreadTimeOut`为`true`。

2. **maximumPoolSize**:
   - 最大线程数：线程池允许的最大线程数量。当任务队列已满且当前线程数小于最大线程数时，会创建新的线程来处理任务。

3. **keepAliveTime**:
   - 线程存活时间：当线程池中的线程数量超过核心线程数时，多余的空闲线程在等待新任务的时间超过这个值后会被终止。如果设置`allowCoreThreadTimeOut`为`true`，那么这个参数也会影响核心线程。

4. **unit**:
   - 时间单位：`keepAliveTime`参数的时间单位，可以是`TimeUnit`枚举中的任何一种（如`SECONDS`、`MILLISECONDS`等）。

5. **workQueue**:
   - 任务队列：用于保存等待执行的任务的阻塞队列。常见的队列类型有：
     - `ArrayBlockingQueue`：基于数组的有界阻塞队列。
     - `LinkedBlockingQueue`：基于链表的无界阻塞队列（默认容量为`Integer.MAX_VALUE`）。
     - `SynchronousQueue`：一个不存储元素的阻塞队列，每个插入操作必须等待另一个线程的对应移除操作。
     - `PriorityBlockingQueue`：具有优先级的无界阻塞队列。

6. **threadFactory**:
   - 线程工厂：用于创建新线程的工厂。可以通过自定义线程工厂来设置线程名称、优先级等属性。

7. **handler**:
   - 拒绝策略：当线程池和任务队列都达到饱和时，如何处理新提交的任务。常见的拒绝策略有：
     - `AbortPolicy`：抛出`RejectedExecutionException`异常。
     - `CallerRunsPolicy`：由调用者所在的线程来执行该任务。
     - `DiscardPolicy`：直接丢弃任务，不抛出异常。
     - `DiscardOldestPolicy`：丢弃队列中最老的任务，然后尝试重新提交当前任务。

### 示例代码

以下是一个使用`ThreadPoolExecutor`创建线程池的示例：

```java
import java.util.concurrent.*;

public class ThreadPoolExample {
    public static void main(String[] args) {
        // 创建线程池
        ThreadPoolExecutor executor = new ThreadPoolExecutor(
            5, // corePoolSize
            10, // maximumPoolSize
            60L, // keepAliveTime
            TimeUnit.SECONDS, // unit
            new LinkedBlockingQueue<>(100), // workQueue
            Executors.defaultThreadFactory(), // threadFactory
            new ThreadPoolExecutor.CallerRunsPolicy() // handler
        );

        // 提交任务
        for (int i = 0; i < 20; i++) {
            final int taskNumber = i;
            executor.execute(() -> {
                System.out.println("Task " + taskNumber + " is running on thread " + Thread.currentThread().getName());
                try {
                    Thread.sleep(1000); // 模拟任务执行时间
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            });
        }

        // 关闭线程池
        executor.shutdown();
        try {
            if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
                executor.shutdownNow();
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
        }
    }
}
```

在这个示例中，我们创建了一个线程池，设置了核心线程数为5，最大线程数为10，线程空闲时间为60秒，任务队列为容量为100的`LinkedBlockingQueue`，并使用了默认的线程工厂和`CallerRunsPolicy`拒绝策略。通过这种方式，我们可以更好地管理和控制线程的生命周期和资源使用。
````

### 使用聊天服务构建应用

LangChain4j 提供了 `ChatMemory` 来自动管理对话历史，简化多轮对话的开发：

```java
import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.community.model.dashscope.QwenChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemPromptTemplate;

// 定义助手接口
@SystemPromptTemplate("你是代码小抄的AI助手，专注于提供简洁有效的{{language}}代码示例")
interface CodeAssistant {
    String chat(String message);
    String generateExample(String task, String language);
}

public class ChatServiceExample {

    public static void main(String[] args) {
        // 初始化聊天模型
        ChatLanguageModel model = QwenChatModel.builder()
                .apiKey(System.getenv("DASHSCOPE_API_KEY"))
                .modelName("qwen-max")
                .temperature(0.7f)
                .build();
        
        // 创建聊天记忆，最多记住10条消息
        ChatMemory chatMemory = MessageWindowChatMemory.builder()
                .maxMessages(10)
                .build();
        
        // 创建助手服务
        CodeAssistant assistant = AiServices.builder(CodeAssistant.class)
                .chatLanguageModel(model)
                .chatMemory(chatMemory)
                .systemPromptVariable("language", "Java")
                .build();
        
        // 使用助手
        String response = assistant.chat("如何在Java中创建一个多线程安全的单例模式？");
        System.out.println("AI 回答: " + response);
        
        // 使用特定方法生成代码示例
        String example = assistant.generateExample("读取CSV文件", "Java");
        System.out.println("\n代码示例: " + example);
    }
}
```

### 结构化输出解析

LangChai‍‍‍n4j 支持将 AI 输出解析为‌‌‌结构化数据，非常适合需要从 AI‍‍‍ 回答中提取特定信息的场景：  ‍‍‍                ‍‍‍              

```java
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.community.model.dashscope.QwenChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;

// 定义结构化输出类
class JobRecommendation {
    private String title;
    private String description;
    private int experienceYearsRequired;
    private String[] requiredSkills;
    
    // Getters and setters...
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public int getExperienceYearsRequired() { return experienceYearsRequired; }
    public void setExperienceYearsRequired(int experienceYearsRequired) { this.experienceYearsRequired = experienceYearsRequired; }
    public String[] getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String[] requiredSkills) { this.requiredSkills = requiredSkills; }
    
    @Override
    public String toString() {
        return "职位名称: " + title + "\n" +
               "职位描述: " + description + "\n" +
               "所需经验: " + experienceYearsRequired + "年\n" +
               "所需技能: " + String.join(", ", requiredSkills);
    }
}

// 定义AI服务接口
interface JobAdvisor {
    @SystemMessage("你是老鱼简历的AI职业顾问，根据用户的技能和经验推荐合适的工作")
    JobRecommendation recommendJob(String skills, int yearsOfExperience);
}

public class StructuredOutputExample {

    public static void main(String[] args) {
        // 初始化聊天模型
        ChatLanguageModel model = QwenChatModel.builder()
                .apiKey(System.getenv("DASHSCOPE_API_KEY"))
                .modelName("qwen-max")
                .temperature(0.7f)
                .build();
        
        // 创建AI服务
        JobAdvisor jobAdvisor = AiServices.builder(JobAdvisor.class)
                .chatLanguageModel(model)
                .build();
        
        // 获取结构化职位推荐
        JobRecommendation recommendation = jobAdvisor.recommendJob(
                "Java, Spring Boot, Microservices, Docker", 3);
        
        System.out.println("AI 推荐职位:\n" + recommendation);
    }
}
```

这段程序输出结果：

```plain
▼plain复制代码AI 推荐职位:
职位名称: Java 后端开发工程师
职位描述: 负责设计、开发和维护基于Spring Boot的微服务架构应用，参与系统设计和架构优化，确保代码质量和性能
所需经验: 3年
所需技能: Java, Spring Boot, Microservices, Docker, REST API, SQL, Git, CI/CD
```

## 5.5 与 Python 版 LangChain 的差异

虽然 LangChai‍‍‍n4j 与 Python 版 LangCha‌‌‌in 在核心概念和设计理念上保持一致，但由于‍‍‍语言特性和生态系统的不同，两者存在一些显‍‍‍著差异。了解这些差异对于从 Python 版迁移‍‍‍或者同时使用两个版本的开发者特别重要。

### 语言特性差异

**1. 类型系统**3SdhPNReyfSez0Q4gOc0v6ykW2hqke4CnFnKQxaIhL8=

* Python 版：动态类型，更灵活但类型错误可能在运行时才被发现
* Java 版：静态类型，提供编译时类型检查，减少运行时错误

例如，在 Python 版中可以这样定义函数：

```python
▼python复制代码def get_response(prompt: str) -> str:
    return llm(prompt)
```

而在 Java 版中需要更明确的类型定义：

```java
public String getResponse(String prompt) {
    return llm.chat(prompt);
}
```

**2. 接口设计**85OwC9dA70cYmJ5h6K5cNTXdNAq0qMRNbG9wTf+m4FU=

* Python 版：倾向于使用函数式编程和链式调用
* Java 版：采用更面向对象的设计，广泛使用构建器模式和接口抽象

**3. 异步处理**

* Python 版：使用 `async/await` 进行异步编程
* Java 版：使用 CompletableFuture 或 Project Reactor 进行响应式编程

### 功能完整度

**1. 组件覆盖范围**

Pytho‍‍‍n 版 Lan‌g‌C‌hain ‍发展‍更早‍，功能‍更全面‍，支持‍的‍集成也更‍多，包括‍：3SdhPNReyfSez0Q4gOc0v6ykW2hqke4CnFnKQxaIhL8=

* 更多的模型提供商
* 更多的向量数据库
* 更丰富的工具集成
* 更多的示例和文档

LangC‍‍‍hain4j ‌虽‌然‌在快速发展‍，但‍在某‍些领域‍的支持‍仍在‍追赶‍中。

**2. 特有功能**3SdhPNReyfSez0Q4gOc0v6ykW2hqke4CnFnKQxaIhL8=

LangC‍ha‍‍in4j 利用‌ Java 生态‌‌系‍统的特点，提供了一‍些 Py‍‍thon ‍版没有的特性：   ‍‍                ‍‍             

* 与 Spring 生态深度集成
* 基于注解的声明式 AI 服务
* 更严格的类型安全
* 企业级功能如监控和指标收集

### API 设计差异

两个版本在‍‍‍ API 设计‌上‌也‌存在一些差‍异，‍以链‍（Ch‍ain‍）的实‍现‍为例：

Python 版：

```python
▼python复制代码from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.llms import OpenAI

prompt = PromptTemplate(
    input_variables=["product"],
    template="What is a good name for a company that makes {product}?",
)
chain = LLMChain(llm=OpenAI(), prompt=prompt)
result = chain.run("colorful socks")
```

Java 版（LangChain4j）：

```java
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.community.model.dashscope.QwenChatModel;
import dev.langchain4j.service.AiServices;

interface NamingService {
    @SystemMessage("你是一名专业的公司命名专家")
    String suggestCompanyName(String product);
}

public class ChainExample {
    public static void main(String[] args) {
        ChatLanguageModel model = QwenChatModel.builder()
                .apiKey(System.getenv("DASHSCOPE_API_KEY"))
                .modelName("qwen-max")
                .temperature(0.7f)
                .build();
        
        NamingService namingService = AiServices.builder(NamingService.class)
                .chatLanguageModel(model)
                .build();
        
        String name = namingService.suggestCompanyName("多彩袜子");
        System.out.println(name);
    }
}
```

### 社区和生态系统

Pytho‍‍‍n 版 Lan‌g‌C‌hain ‍拥有‍更大‍的社区‍和更丰‍富的生‍态‍系统，包‍括更多的‍:

* 教程和学习资源
* 第三方扩展和集成
* 示例项目和用例
* 社区贡献和支持

LangChain4‍‍‍j 的社区正在快速增长，但在资源丰富度‌‌‌上仍有差距。不过，对于 Java 开发‍‍‍者来说，LangChain4j 提供了‍‍‍更符合 Java 习惯的 API 和更‍‍‍好的与 Java 生态系统的集成。3SdhPNReyfSez0Q4gOc0v6ykW2hqke4CnFnKQxaIhL8=

### 错误处理机制

Python‍‍‍ 版本通常使用异常处理‌‌‌，但类型提示相对较少：‍‍‍           ‍‍‍           ‍‍‍          

```python
▼python复制代码try:
    result = chain.run(query)
except Exception as e:
    print(f"发生错误: {e}")
```

Java 版本提供了更加精确的异常类型和处理机制：

```java
public class RobustChatService {
    
    public Optional<String> generateResponse(String query) {
        try {
            String response = chatModel.generate(query);
            return Optional.of(response);
        } catch (ModelTimeoutException e) {
            log.warn("模型响应超时，查询：{}", query, e);
            return Optional.empty();
        } catch (ApiKeyException e) {
            log.error("API 密钥无效", e);
            throw new ServiceException("服务暂时不可用", e);
        } catch (RateLimitException e) {
            log.warn("触发限流，稍后重试", e);
            return Optional.empty();
        }
    }
}
```

## 5.6 LangChain4j 与 Spring 生态集成

LangChain‍4j ‍‍提供了与 Spring 框架‌的深度集成，让开发者‌‌能够使用熟悉的‍ Spring 开发模式来构建 A‍‍I‍ 应用。这种集成特别适合构建像编‍程导航这样的‍‍企业级 Web 应用               ‍‍                 

### Spring Boot Starter

LangC‍‍‍hain4j 提供了‌‌‌官方的 Spring‍‍‍ Boot Star‍‍‍ter，简化了配置‍过‍‍程。首先在项目中引入依赖：HrGXUqFhjK7wNHkLfEF5cglTdzhFLxXIforC6kfYOak=

```xml
<dependency>
    <groupId>dev.langchain4j</groupId>
    <artifactId>langchain4j-open-ai-spring-boot-starter</artifactId>
    <version>1.0.0-beta3</version>
</dependency>
```

通义千问可以用：

```xml
<dependency>
  <groupId>dev.langchain4j</groupId>
  <artifactId>langchain4j-community-dashscope-spring-boot-starter</artifactId>
  <version>1.0.0-beta3</version>
</dependency>
```

然后在 `application.yml` 中进行配置：

```yaml
▼yaml复制代码langchain4j:
  community:
    dashscope:
      api-key: ${QWEN_API_KEY}
      model-name: qwen-max
      temperature: 0.7
      max-tokens: 2000
      timeout: PT30S
  chat-memory:
    max-messages: 10
```

文档：[Spring Boot 集成 | LangChain4j 中文文档](https://docs.langchain4j.info/tutorials/spring-boot-integration)85OwC9dA70cYmJ5h6K5cNTXdNAq0qMRNbG9wTf+m4FU=

[DashScope (通义千问) | LangChain4j 中文文档](https://docs.langchain4j.info/integrations/language-models/dashscope)

### 服务调用

Spring‍‍‍ Boot 的自动配置‌‌‌功能让 LangCha‍‍‍in4j 的使用变得异‍‍‍常简单。框架会自动创建‍‍‍和配置必要的 Bean：HrGXUqFhjK7wNHkLfEF5cglTdzhFLxXIforC6kfYOak=

```java
import dev.langchain4j.model.chat.ChatLanguageModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChatController {

    ChatLanguageModel chatLanguageModel;

    ChatController(ChatLanguageModel chatLanguageModel) {
        this.chatLanguageModel = chatLanguageModel;
    }

    @GetMapping("/hello")
    public String hello(@RequestParam(value = "message", defaultValue = "介绍一下编程导航吧") String message) {
        return chatLanguageModel.chat(message);
    }
}
```
