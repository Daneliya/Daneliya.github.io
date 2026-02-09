---
url: /常用框架/SpringAIAlibaba/Agent Framework/5_Messages消息.md
---

# Messages 消息

Messages 是 Spring AI Alibaba 中模型交互的基本单元。它们代表模型的输入和输出，携带在与 LLM 交互时表示对话状态所需的内容和元数据。

Messages 是包含以下内容的对象：

* **Role（角色）** - 标识消息类型（如 `system`、`user`、`assistant`）
* **Content（内容）** - 表示消息的实际内容（如文本、图像、音频、文档等）
* **Metadata（元数据）** - 可选字段，如响应信息、消息 ID 和 token 使用情况

Spring AI Alibaba 提供了一个标准的消息类型系统，可在所有模型提供商之间工作，确保无论调用哪个模型都具有一致的行为。

## 一、基础使用

使用 messages 最简单的方式是创建消息对象并在调用模型时传递它们。

```java
/**
 * 基础消息使用示例
 */
public static void basicMessageConfiguration() {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();

    DashScopeChatOptions options = DashScopeChatOptions.builder()
        .withModel("deepseek-v3.2")           // 模型名称
        .withTemperature(0.3)                 // 温度参数
        .withMaxToken(500)                    // 最大令牌数
        .withTopP(0.9)                        // Top-P 采样
        .build();

    // 创建 ChatModel
    ChatModel chatModel = DashScopeChatModel.builder()
        .dashScopeApi(dashScopeApi)
        .defaultOptions(options)
        .build();
    
    // 创建消息对象 // [!code ++:8]
    SystemMessage systemMsg = new SystemMessage("你是一个有帮助的助手。");
    UserMessage userMsg = new UserMessage("你好，你好吗？");

    // 与聊天模型一起使用
    List<org.springframework.ai.chat.messages.Message> messages = List.of(systemMsg, userMsg);
    Prompt prompt = new Prompt(messages);
    ChatResponse response = chatModel.call(prompt);  // 返回 ChatResponse，包含 AssistantMessage
    String answer = response.getResult().getOutput().getText();
    System.out.println(answer);
}
```

### 文本提示

文本提示是字符串 - 适用于简单的生成任务，不需要保留对话历史。

```java
/**
 * 文本提示示例
 */
public static void textConfiguration() {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();

    DashScopeChatOptions options = DashScopeChatOptions.builder()
        .withModel("deepseek-v3.2")           // 模型名称
        .withTemperature(0.3)                 // 温度参数
        .withMaxToken(500)                    // 最大令牌数
        .withTopP(0.9)                        // Top-P 采样
        .build();

    // 创建 ChatModel
    ChatModel chatModel = DashScopeChatModel.builder()
        .dashScopeApi(dashScopeApi)
        .defaultOptions(options)
        .build();

    // 使用字符串直接调用 // [!code ++:3]
    String response = chatModel.call("写一首关于春天的俳句");
    System.out.println(response);
}
```

**使用文本提示的场景**：

* 有单个独立的请求
* 不需要对话历史
* 想要最小的代码复杂性

### 消息提示

或者，你可以通过提供消息对象列表向模型传递消息列表。

```java
/**
 * 消息提示示例
 */
public static void messageConfiguration() {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();

    DashScopeChatOptions options = DashScopeChatOptions.builder()
        .withModel("deepseek-v3.2")           // 模型名称
        .withTemperature(0.3)                 // 温度参数
        .withMaxToken(500)                    // 最大令牌数
        .withTopP(0.9)                        // Top-P 采样
        .build();

    // 创建 ChatModel
    ChatModel chatModel = DashScopeChatModel.builder()
        .dashScopeApi(dashScopeApi)
        .defaultOptions(options)
        .build();

    // 创建消息对象 // [!code ++:8]
    List<org.springframework.ai.chat.messages.Message> messages = List.of(
        new SystemMessage("你是一个诗歌专家"),
        new UserMessage("写一首关于春天的俳句"),
        new AssistantMessage("樱花盛开时...")
    );
    Prompt prompt = new Prompt(messages);
    ChatResponse response = chatModel.call(prompt);
    String answer = response.getResult().getOutput().getText();
    System.out.println(answer);
}
```

**使用消息提示的场景**：

* 管理多轮对话
* 处理多模态内容（图像、音频、文件）
* 包含系统指令

## 二、消息类型

* **System Message（系统消息）** - 告诉模型如何行为并为交互提供上下文
* **User Message（用户消息）** - 表示用户输入和与模型的交互
* **Assistant Message（助手消息）** - 模型生成的响应，包括文本内容、工具调用和元数据
* **Tool Response Message（工具响应消息）** - 表示工具调用的输出

### System Message

`SystemMessage` 表示一组初始指令，用于引导模型的行为。你可以使用系统消息来设置语气、定义模型的角色并建立响应指南。

```java
/**
 * SystemMessage 基础指令示例
 */
public static void systemMessageConfiguration() {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();

    DashScopeChatOptions options = DashScopeChatOptions.builder()
        .withModel("deepseek-v3.2")           // 模型名称
        .withTemperature(0.3)                 // 温度参数
        .withMaxToken(500)                    // 最大令牌数
        .withTopP(0.9)                        // Top-P 采样
        .build();

    // 创建 ChatModel
    ChatModel chatModel = DashScopeChatModel.builder()
        .dashScopeApi(dashScopeApi)
        .defaultOptions(options)
        .build();

    // 基础指令 // [!code ++:9]
    SystemMessage systemMsg = new SystemMessage("你是一个有帮助的编程助手。");

    List<org.springframework.ai.chat.messages.Message> messages = List.of(
        systemMsg,
        new UserMessage("如何创建 REST API？")
    );
    // 调用并获取响应
    ChatResponse response = chatModel.call(new Prompt(messages));
    String answer = response.getResult().getOutput().getText();
    System.out.println(answer);
}
```

```java
/**
 * SystemMessage 详细角色设定示例
 */
public static void systemDetailMessageConfiguration() {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();

    DashScopeChatOptions options = DashScopeChatOptions.builder()
        .withModel("deepseek-v3.2")           // 模型名称
        .withTemperature(0.3)                 // 温度参数
        .withMaxToken(500)                    // 最大令牌数
        .withTopP(0.9)                        // Top-P 采样
        .build();

    // 创建 ChatModel
    ChatModel chatModel = DashScopeChatModel.builder()
        .dashScopeApi(dashScopeApi)
        .defaultOptions(options)
        .build();

    // 详细的角色设定 // [!code ++:13]
    SystemMessage systemMsg = new SystemMessage("""
         你是一位资深的 Java 开发者，擅长 Web 框架。
         始终提供代码示例并解释你的推理。
         在解释中要简洁但透彻。
         """);

    List<org.springframework.ai.chat.messages.Message> messages = List.of(
         systemMsg,
         new UserMessage("如何创建 REST API？")
    );
    // 调用并获取响应
    ChatResponse response = chatModel.call(new Prompt(messages));
    String answer = response.getResult().getOutput().getText();
    System.out.println(answer);
}
```

### User Message

`UserMessage` 表示用户输入和交互。它们可以包含文本、图像、音频、文件和任何其他数量的多模态内容。

#### 文本内容

```java
/**
 * UserMessage 文本内容示例
 */
@SneakyThrows
public static void userMessageTextConfiguration() {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();

    DashScopeChatOptions options = DashScopeChatOptions.builder()
        .withModel("deepseek-v3.2")           // 模型名称
        .withTemperature(0.3)                 // 温度参数
        .withMaxToken(500)                    // 最大令牌数
        .withTopP(0.9)                        // Top-P 采样
        .build();

    // 创建 ChatModel
    ChatModel chatModel = DashScopeChatModel.builder()
        .dashScopeApi(dashScopeApi)
        .defaultOptions(options)
        .build();

    // 调用并获取响应
    // 使用消息对象  // [!code ++:4]
    ChatResponse response = chatModel.call(
        new Prompt(List.of(new UserMessage("什么是机器学习？")))
    );
    String answer = response.getResult().getOutput().getText();
    System.out.println(answer);
    // 使用字符串快捷方式   // [!code ++:3]
    // 使用字符串是单个 UserMessage 的快捷方式
    String response2 = chatModel.call("什么是机器学习？");
    System.out.println(response2);
}
```

#### 消息元数据

```java
/**
 * UserMessage 消息元数据示例
 */
@SneakyThrows
public static void userMessageMateConfiguration() {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();

    DashScopeChatOptions options = DashScopeChatOptions.builder()
        .withModel("deepseek-v3.2")           // 模型名称
        .withTemperature(0.3)                 // 温度参数
        .withMaxToken(500)                    // 最大令牌数
        .withTopP(0.9)                        // Top-P 采样
        .build();

    // 创建 ChatModel
    ChatModel chatModel = DashScopeChatModel.builder()
        .dashScopeApi(dashScopeApi)
        .defaultOptions(options)
        .build();

    // 调用并获取响应  // [!code ++:8]
    UserMessage userMsg = UserMessage.builder()
        .text("你好！")
        .metadata(Map.of(
            "user_id", "alice",  // 可选：识别不同用户
            "session_id", "sess_123"  // 可选：会话标识符
        ))
        .build();
    ChatResponse response = chatModel.call(new Prompt(userMsg));
    String answer0 = response.getResult().getOutput().getText();
    System.out.println(answer0);
}
```

**注意**：元数据字段的行为因提供商而异 - 有些用于用户识别，有些则忽略它。要检查，请参考模型提供商的文档。

#### 多模态内容

`UserMessage` 可以包含多模态内容，如图像：

```java
/**
 * UserMessage 多模态内容示例
 */
@SneakyThrows
public static void userMessageUrlConfiguration() {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();

    DashScopeChatOptions options = DashScopeChatOptions.builder()
        .withModel("deepseek-v3.2")           // 模型名称
        .withTemperature(0.3)                 // 温度参数
        .withMaxToken(500)                    // 最大令牌数
        .withTopP(0.9)                        // Top-P 采样
        .build();

    // 创建 ChatModel
    ChatModel chatModel = DashScopeChatModel.builder()
        .dashScopeApi(dashScopeApi)
        .defaultOptions(options)
        .build();

    // 调用并获取响应
    // 从 URL 创建图像  // [!code ++:8]
    UserMessage userMsg = UserMessage.builder()
        .text("描述这张图片的内容。")
        .media(Media.builder()
               .mimeType(MimeTypeUtils.IMAGE_JPEG)
               .data(new URL("https://example.com/image.jpg"))
               .build())
        .build();
    ChatResponse response = chatModel.call(new Prompt(userMsg));
    String answer0 = response.getResult().getOutput().getText();
    System.out.println(answer0);
}
```

### Assistant Message

`AssistantMessage` 表示模型调用的输出。它们可以包括多模态数据、工具调用以及你稍后可以访问的提供商特定元数据。

```java
/**
 * AssistantMessage 基础使用示例
 */
@SneakyThrows
public static void assistantMessageBasicConfiguration() {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();

    DashScopeChatOptions options = DashScopeChatOptions.builder()
        .withModel("deepseek-v3.2")           // 模型名称
        .withTemperature(0.3)                 // 温度参数
        .withMaxToken(500)                    // 最大令牌数
        .withTopP(0.9)                        // Top-P 采样
        .build();

    // 创建 ChatModel
    ChatModel chatModel = DashScopeChatModel.builder()
        .dashScopeApi(dashScopeApi)
        .defaultOptions(options)
        .build();
	 // [!code ++:4]
    ChatResponse response = chatModel.call(new Prompt("解释 AI"));
    AssistantMessage aiMessage = response.getResult().getOutput();
    System.out.println(aiMessage.getText());
}
```

`AssistantMessage` 对象由模型调用返回，其中包含响应中的所有相关元数据。

提供商对消息类型的权重/上下文化方式不同，这意味着有时手动创建新的 `AssistantMessage` 对象并将其插入消息历史中（就像它来自模型一样）会很有帮助。

```java
/**
 * 手动创建 AssistantMessage 示例
 */
@SneakyThrows
public static void assistantMessageManualConfiguration() {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();

    DashScopeChatOptions options = DashScopeChatOptions.builder()
        .withModel("deepseek-v3.2")           // 模型名称
        .withTemperature(0.3)                 // 温度参数
        .withMaxToken(500)                    // 最大令牌数
        .withTopP(0.9)                        // Top-P 采样
        .build();

    // 创建 ChatModel
    ChatModel chatModel = DashScopeChatModel.builder()
        .dashScopeApi(dashScopeApi)
        .defaultOptions(options)
        .build();

    // 手动创建 AI 消息（例如，用于对话历史） // [!code ++:12]
    AssistantMessage aiMsg = new AssistantMessage("我很乐意帮助你回答这个问题！");

    // 添加到对话历史
    List<org.springframework.ai.chat.messages.Message> messages = List.of(
        new SystemMessage("你是一个有帮助的助手"),
        new UserMessage("你能帮我吗？"),
        aiMsg,  // 插入，就像它来自模型一样
        new UserMessage("太好了！2+2 等于多少？")
    );

    ChatResponse response = chatModel.call(new Prompt(messages));
    AssistantMessage aiMessage = response.getResult().getOutput();
    System.out.println(aiMessage.getText());
}
```

**AssistantMessage 属性**：

* **text**: 消息的文本内容
* **metadata**: 消息的元数据映射
* **toolCalls**: 模型进行的工具调用列表
* **media**: 媒体内容列表（如果有）

#### 工具调用

当模型进行工具调用时，它们包含在 `AssistantMessage` 中：

```java
/**
 * AssistantMessage 工具调用示例
 */
@SneakyThrows
public static void assistantMessageToolConfiguration() {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();

    DashScopeChatOptions options = DashScopeChatOptions.builder()
        .withModel("deepseek-v3.2")           // 模型名称
        .withTemperature(0.3)                 // 温度参数
        .withMaxToken(500)                    // 最大令牌数
        .withTopP(0.9)                        // Top-P 采样
        .build();

    // 创建 ChatModel
    ChatModel chatModel = DashScopeChatModel.builder()
        .dashScopeApi(dashScopeApi)
        .defaultOptions(options)
        .build();
	// [!code ++:10]
    ChatResponse response = chatModel.call(new Prompt("你好"));
    AssistantMessage aiMessage = response.getResult().getOutput();

    if (aiMessage.hasToolCalls()) {
        for (AssistantMessage.ToolCall toolCall : aiMessage.getToolCalls()) {
            System.out.println("Tool: " + toolCall.name());
            System.out.println("Args: " + toolCall.arguments());
            System.out.println("ID: " + toolCall.id());
        }
    }
}
```

#### Token 使用

Spring AI Alibaba 的 `ChatResponse` 可以在其元数据中保存 token 计数和其他使用元数据：

```java
/**
 * Token 使用信息访问示例
 */
@SneakyThrows
public static void assistantMessageTokenConfiguration() {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();

    DashScopeChatOptions options = DashScopeChatOptions.builder()
        .withModel("deepseek-v3.2")           // 模型名称
        .withTemperature(0.3)                 // 温度参数
        .withMaxToken(500)                    // 最大令牌数
        .withTopP(0.9)                        // Top-P 采样
        .build();

    // 创建 ChatModel
    ChatModel chatModel = DashScopeChatModel.builder()
        .dashScopeApi(dashScopeApi)
        .defaultOptions(options)
        .build();
    // [!code ++:9]
    ChatResponse response = chatModel.call(new Prompt("你好！"));
    ChatResponseMetadata metadata = response.getMetadata();

    // 访问使用信息
    if (metadata != null && metadata.getUsage() != null) {
        System.out.println("Input tokens: " + metadata.getUsage().getPromptTokens());
        System.out.println("Output tokens: " + metadata.getUsage().getCompletionTokens());
        System.out.println("Total tokens: " + metadata.getUsage().getTotalTokens());
    }
}
```

#### 流式和块

在流式传输期间，你将收到可以组合成完整消息对象的块：

```java
/**
 * 流式输出示例
 */
@SneakyThrows
public static void assistantMessageStreamConfiguration() {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();

    DashScopeChatOptions options = DashScopeChatOptions.builder()
        .withModel("deepseek-v3.2")           // 模型名称
        .withTemperature(0.3)                 // 温度参数
        .withMaxToken(500)                    // 最大令牌数
        .withTopP(0.9)                        // Top-P 采样
        .build();

    // 创建 ChatModel
    ChatModel chatModel = DashScopeChatModel.builder()
        .dashScopeApi(dashScopeApi)
        .defaultOptions(options)
        .build();
    // [!code ++:10]
    Flux<ChatResponse> responseStream = chatModel.stream(new Prompt("你好"));

    StringBuilder fullResponse = new StringBuilder();
    responseStream.subscribe(
        chunk -> {
            String content = chunk.getResult().getOutput().getText();
            fullResponse.append(content);
            System.out.print(content);
        }
    );
}
```

**了解更多**：

* 从聊天模型流式传输 tokens
* 从 agents 流式传输 tokens 和/或步骤

### Tool Response Message

对于支持工具调用的模型，AI 消息可以包含工具调用。工具消息用于将单个工具执行的结果传回模型。

```java
/**
 * ToolResponseMessage 工具响应消息示例
 */
@SneakyThrows
public static void toolResponseMessageConfiguration() {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();

    DashScopeChatOptions options = DashScopeChatOptions.builder()
        .withModel("deepseek-v3.2")           // 模型名称
        .withTemperature(0.3)                 // 温度参数
        .withMaxToken(500)                    // 最大令牌数
        .withTopP(0.9)                        // Top-P 采样
        .build();

    // 创建 ChatModel
    ChatModel chatModel = DashScopeChatModel.builder()
        .dashScopeApi(dashScopeApi)
        .defaultOptions(options)
        .build();

    // 在模型进行工具调用后 // [!code ++:28]
    AssistantMessage aiMessage = AssistantMessage.builder()
        .content("")
        .toolCalls(List.of(
            new AssistantMessage.ToolCall(
                "call_123",
                "tool",
                "get_weather",
                "{\"location\": \"San Francisco\"}"
            )
        ))
        .build();

    // 执行工具并创建结果消息
    String weatherResult = "晴朗，22°C";
    ToolResponseMessage toolMessage = ToolResponseMessage.builder()
        .responses(List.of(
            new ToolResponseMessage.ToolResponse("call_123", "get_weather", weatherResult)
        ))
        .build();

    // 继续对话
    List<org.springframework.ai.chat.messages.Message> messages = List.of(
        new UserMessage("旧金山的天气怎么样？"),
        aiMessage,      // 模型的工具调用
        toolMessage     // 工具执行结果
    );
    ChatResponse response = chatModel.call(new Prompt(messages));
    System.out.println(response.getResult().getOutput().getText());
}
```

**ToolResponseMessage 属性**：

* responses: ToolResponse 对象列表，每个包含：
  * **id**: 工具调用 ID（必须与 AIMessage 中的工具调用 ID 匹配）
  * **name**: 调用的工具名称
  * **responseData**: 工具调用的字符串化输出

## 三、多模态内容

**多模态性**指的是处理不同形式数据的能力，如文本、音频、图像和视频。Spring AI Alibaba 包含这些数据的标准类型，可以跨提供商使用。

聊天模型可以接受多模态数据作为输入并生成它作为输出。下面我们展示包含多模态数据的输入消息的简短示例。

### 图像输入

```java
/**
 * 图像输入示例
 */
@SneakyThrows
public static void imageMessageConfiguration() {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();

    DashScopeChatOptions options = DashScopeChatOptions.builder()
        .withModel("deepseek-v3.2")           // 模型名称
        .withTemperature(0.3)                 // 温度参数
        .withMaxToken(500)                    // 最大令牌数
        .withTopP(0.9)                        // Top-P 采样
        .build();

    // 创建 ChatModel
    ChatModel chatModel = DashScopeChatModel.builder()
        .dashScopeApi(dashScopeApi)
        .defaultOptions(options)
        .build();
    // 从 URL // [!code ++:16]
    UserMessage urlMessage = UserMessage.builder()
        .text("描述这张图片的内容。")
        .media(Media.builder()
               .mimeType(MimeTypeUtils.IMAGE_JPEG)
               .data(new URL("https://example.com/image.jpg"))
               .build())
        .build();
    // 从本地文件
    UserMessage localMessage = UserMessage.builder()
        .text("描述这张图片的内容。")
        .media(new Media(
            MimeTypeUtils.IMAGE_JPEG,
            new ClassPathResource("images/photo.jpg")
        ))
        .build();
    ChatResponse response = chatModel.call(new Prompt(urlMessage, localMessage));
    System.out.println(response.getResult().getOutput().getText());
}
```

### 音频输入

```java
/**
 * 音频输入示例
 */
public static void audioMessageConfiguration() {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();

    DashScopeChatOptions options = DashScopeChatOptions.builder()
        .withModel("deepseek-v3.2")           // 模型名称
        .withTemperature(0.3)                 // 温度参数
        .withMaxToken(500)                    // 最大令牌数
        .withTopP(0.9)                        // Top-P 采样
        .build();

    // 创建 ChatModel
    ChatModel chatModel = DashScopeChatModel.builder()
        .dashScopeApi(dashScopeApi)
        .defaultOptions(options)
        .build();
    // [!code ++:7]
    UserMessage message = UserMessage.builder()
        .text("描述这段音频的内容。")
        .media(new Media(
            MimeTypeUtils.parseMimeType("audio/wav"),
            new ClassPathResource("audio/recording.wav")
        ))
        .build();
    ChatResponse response = chatModel.call(new Prompt(message));
    System.out.println(response.getResult().getOutput().getText());
}
```

### 视频输入

```java
/**
 * 视频输入示例
 */
@SneakyThrows
public static void videoMessageConfiguration() {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();

    DashScopeChatOptions options = DashScopeChatOptions.builder()
        .withModel("deepseek-v3.2")           // 模型名称
        .withTemperature(0.3)                 // 温度参数
        .withMaxToken(500)                    // 最大令牌数
        .withTopP(0.9)                        // Top-P 采样
        .build();

    // 创建 ChatModel
    ChatModel chatModel = DashScopeChatModel.builder()
        .dashScopeApi(dashScopeApi)
        .defaultOptions(options)
        .build();
    // [!code ++:7]
    UserMessage message = UserMessage.builder()
        .text("描述这段视频的内容。")
        .media(Media.builder()
               .mimeType(MimeTypeUtils.parseMimeType("video/mp4"))
               .data(new URL("https://example.com/path/to/video.mp4"))
               .build())
        .build();
    ChatResponse response = chatModel.call(new Prompt(message));
    System.out.println(response.getResult().getOutput().getText());
}
```

**警告**：并非所有模型都支持所有文件类型。请查看模型提供商的文档以了解支持的格式和大小限制。

## 四、与 Chat Models 一起使用

Chat models 接受消息对象序列作为输入并返回 `ChatResponse`（包含 `AssistantMessage`）作为输出。交互通常是无状态的，因此简单的对话循环涉及使用不断增长的消息列表调用模型。

### 基础对话示例

```java
/**
 * Chat Models — 基础对话示例
 */
@SneakyThrows
public static void chatModelBasicMessageConfiguration() {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();

    DashScopeChatOptions options = DashScopeChatOptions.builder()
        .withModel("deepseek-v3.2")           // 模型名称
        .withTemperature(0.3)                 // 温度参数
        .withMaxToken(500)                    // 最大令牌数
        .withTopP(0.9)                        // Top-P 采样
        .build();

    // 创建 ChatModel
    ChatModel chatModel = DashScopeChatModel.builder()
        .dashScopeApi(dashScopeApi)
        .defaultOptions(options)
        .build();
	// [!code ++:15]
    List<Message> conversationHistory = new ArrayList<>();

    // 第一轮对话
    conversationHistory.add(new UserMessage("你好！"));
    ChatResponse response1 = chatModel.call(new Prompt(conversationHistory));
    conversationHistory.add(response1.getResult().getOutput());

    // 第二轮对话
    conversationHistory.add(new UserMessage("你能帮我学习 Java 吗？"));
    ChatResponse response2 = chatModel.call(new Prompt(conversationHistory));
    conversationHistory.add(response2.getResult().getOutput());

    // 第三轮对话
    conversationHistory.add(new UserMessage("从哪里开始？"));
    ChatResponse response3 = chatModel.call(new Prompt(conversationHistory));

    String answer = response3.getResult().getOutput().getText();
    System.out.println(answer);
}
```

### 使用 Builder 模式

Spring AI Alibaba 的消息类提供了 builder 模式以便于构建：

```java
/**
 * Chat Models — Builder 模式示例
 */
@SneakyThrows
public static void chatModelBuildMessageConfiguration() {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();

    DashScopeChatOptions options = DashScopeChatOptions.builder()
        .withModel("deepseek-v3.2")           // 模型名称
        .withTemperature(0.3)                 // 温度参数
        .withMaxToken(500)                    // 最大令牌数
        .withTopP(0.9)                        // Top-P 采样
        .build();

    // 创建 ChatModel
    ChatModel chatModel = DashScopeChatModel.builder()
        .dashScopeApi(dashScopeApi)
        .defaultOptions(options)
        .build();
    // [!code ++:21]
    List<Message> conversationHistory = new ArrayList<>();

    // UserMessage with builder
    UserMessage userMsg = UserMessage.builder()
        .text("你好，我想学习 Spring AI Alibaba")
        .metadata(Map.of("user_id", "user_123"))
        .build();
    conversationHistory.add(userMsg);

    // SystemMessage with builder
    SystemMessage systemMsg = SystemMessage.builder()
        .text("你是一个 Spring 框架专家")
        .metadata(Map.of("version", "1.0"))
        .build();
    conversationHistory.add(systemMsg);

    // AssistantMessage with builder
    AssistantMessage assistantMsg = AssistantMessage.builder()
        .content("我很乐意帮助你学习 Spring AI Alibaba！")
        .build();
    conversationHistory.add(assistantMsg);

    ChatResponse response = chatModel.call(new Prompt(conversationHistory));
    String answer = response.getResult().getOutput().getText();
    System.out.println(answer);
}
```

### 消息复制和修改

```java
/**
 * Chat Models — 消息复制和修改
 */
public static void messageCopyAndModify() {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();

    DashScopeChatOptions options = DashScopeChatOptions.builder()
        .withModel("deepseek-v3.2")           // 模型名称
        .withTemperature(0.3)                 // 温度参数
        .withMaxToken(500)                    // 最大令牌数
        .withTopP(0.9)                        // Top-P 采样
        .build();

    // 创建 ChatModel
    ChatModel chatModel = DashScopeChatModel.builder()
        .dashScopeApi(dashScopeApi)
        .defaultOptions(options)
        .build();
    // [!code ++:9]
    // 复制消息
    UserMessage original = new UserMessage("原始消息");
    UserMessage copy = original.copy();

    // 使用 mutate 创建修改的副本
    UserMessage modified = original.mutate()
        .text("修改后的消息")
        .metadata(Map.of("modified", true))
        .build();

    ChatResponse response = chatModel.call(new Prompt(copy, modified));
    String answer = response.getResult().getOutput().getText();
    System.out.println(answer);
}
```

## 五、在 ReactAgent 中使用

ReactAgent 自动管理消息历史，但你也可以直接使用消息：

```java
/**
 * 在 ReactAgent 中使用消息
 */
public static void messagesInReactAgent() throws GraphRunnerException {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();

    DashScopeChatOptions options = DashScopeChatOptions.builder()
        .withModel("deepseek-v3.2")           // 模型名称
        .withTemperature(0.3)                 // 温度参数
        .withMaxToken(500)                    // 最大令牌数
        .withTopP(0.9)                        // Top-P 采样
        .build();

    // 创建 ChatModel
    ChatModel chatModel = DashScopeChatModel.builder()
        .dashScopeApi(dashScopeApi)
        .defaultOptions(options)
        .build();
    // [!code ++:19]
    ReactAgent agent = ReactAgent.builder()
        .name("my_agent")
        .model(chatModel)
        .systemPrompt("你是一个有帮助的助手")
        .build();
    
    // 使用字符串
    AssistantMessage response1 = agent.call("你好");

    // 使用 UserMessage
    UserMessage userMsg = new UserMessage("帮我写一首诗");
    AssistantMessage response2 = agent.call(userMsg);

    // 使用消息列表
    List<Message> messages = List.of(
        new UserMessage("我喜欢春天"),
        new UserMessage("写一首关于春天的诗")
    );
    AssistantMessage response3 = agent.call(messages);
}
```
