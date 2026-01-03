---
url: /常用框架/SpringAIAlibaba/Agent Framework/7_StructuredOutput结构化输出.md
---

# Structured Output 结构化输出

结构化输出允许 Agent 以特定的、可预测的格式返回数据。相比于解析自然语言响应，您可以直接获得 JSON 对象或 Java POJO 形式的结构化数据，应用程序可以直接使用。

Spring AI Alibaba 的 `ReactAgent.Builder` 通过 `outputSchema` 和 `outputType` 方法处理结构化输出。当您设置所需的结构化输出模式时，Agent 会自动在用户消息中增加模式指令，模型会根据指定的格式生成数据。

```java
Builder outputSchema(String outputSchema)
```

## 一、输出格式选项

Spring AI Alibaba 支持两种方式控制结构化输出：

* **`outputSchema(String schema)`**: 提供自定义的 JSON schema 字符串
* **`outputType(Class type)`**: 提供 Java 类 - 使用 `BeanOutputConverter` 自动转换为 JSON schema
* **不指定**: 返回非结构化的自然语言响应

结构化响应在 Agent 的 `AssistantMessage` 中作为 JSON 文本返回，可以解析为您需要的格式。

## 二、输出 Schema 策略

您可以使用 JSON schema 字符串显式定义输出格式。这使您可以完全控制结构，并可以为每个字段包含详细的描述。

### 方法签名

```java
Builder outputSchema(String outputSchema)
```

**参数:**

* `outputSchema` (String, 必需): 定义结构化输出格式的 JSON schema 字符串。Schema 应包含字段名称、类型、描述和要求，以指导模型。

### 示例

**基本 JSON Schema:**

```java
/**
 * 基本 JSON Schema 示例
 */
@SneakyThrows
public static void jsonConfiguration() {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();
    // 模型配置
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
    String contactInfoSchema = """
            请按照以下JSON格式输出：
            {
                "name": "人名",
                "email": "电子邮箱地址",
                "phone": "电话号码"
            }
            """;
    // 创建 Agent
    ReactAgent agent = ReactAgent.builder()
        .name("contact_extractor")
        .model(chatModel)
        .outputSchema(contactInfoSchema) // [!code ++]
        .build();
    // 调用并获取响应
    AssistantMessage result = agent.call("从以下信息提取联系方式：张三，zhangsan@example.com，(555) 123-4567");
    System.out.println(result.getText());
    // 输出:
    //        {
    //            "name": "张三",
    //            "email": "zhangsan@example.com",
    //            "phone": "(555) 123-4567"
    //        }
}
```

**复杂嵌套 Schema:**

````java
/**
 * 复杂嵌套 Schema 示例
 */
@SneakyThrows
public static void productReviewSchemaConfiguration() {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();
    // 模型配置
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
    
    // [!code ++:12]
    String productReviewSchema = """
            请严格按照以下JSON格式返回产品评价分析：
            {
                "rating": 1-5之间的整数评分,
                "sentiment": "情感倾向（正面/负面/中性）",
                "keyPoints": ["关键点1", "关键点2", "关键点3"],
                "details": {
                    "pros": ["优点1", "优点2"],
                    "cons": ["缺点1", "缺点2"]
                }
            }
            """;
    // 创建 Agent
    ReactAgent agent = ReactAgent.builder()
        .name("review_analyzer")
        .model(chatModel)
        .outputSchema(productReviewSchema) // [!code ++]
        .build();
    // 调用并获取响应
    AssistantMessage result = agent.call("分析评价：这个产品很棒，5星好评。配送快速，但价格稍贵。");
    System.out.println(result.getText());
    // 输出:
    //```json
    //        {
    //            "rating": 5,
    //            "sentiment": "正面",
    //            "keyPoints": ["产品很棒", "配送快速", "价格稍贵"],
    //            "details": {
    //                "pros": ["产品品质好", "配送速度快"],
    //                "cons": ["价格偏高"]
    //            }
    //        }
    //```
}
````

**结构化分析 Schema:**

````java
/**
 * 结构化分析 Schema 示例
 */
@SneakyThrows
public static void analysisSchemaConfiguration() {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();
    // 模型配置
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
    
    // [!code ++:13]
    String analysisSchema = """
            请按照以下JSON格式返回文本分析结果：
            {
                "summary": "内容摘要（50字以内）",
                "keywords": ["关键词1", "关键词2", "关键词3"],
                "sentiment": "情感倾向（正面/负面/中性）",
                "entities": {
                    "persons": ["人名1", "人名2"],
                    "locations": ["地点1", "地点2"],
                    "organizations": ["组织1", "组织2"]
                }
            }
            """;
    // 创建 Agent
    ReactAgent agent = ReactAgent.builder()
        .name("text_analyzer")
        .model(chatModel)
        .outputSchema(analysisSchema) // [!code ++]
        .build();
    // 调用并获取响应
    AssistantMessage result = agent.call("分析这段文字：昨天，李明在北京参加了阿里巴巴公司的技术大会，感受到了创新的力量。");
    System.out.println(result.getText());
    // 输出:
    //```json
    //        {
    //            "summary": "李明在北京参加阿里巴巴技术大会，感受到创新力量。",
    //            "keywords": ["李明", "阿里巴巴", "技术大会", "创新"],
    //            "sentiment": "正面",
    //            "entities": {
    //                "persons": ["李明"],
    //                "locations": ["北京"],
    //                "organizations": ["阿里巴巴公司"]
    //            }
    //        }
    //```
}
````

`outputSchema` 方法提供了最大的灵活性，您可以定义任何 JSON 结构，并提供详细的中文或英文指令来指导模型的输出格式。

## 三、输出类型策略

对于类型安全的结构化输出，您可以提供 Java 类，Spring AI Alibaba 将使用 `BeanOutputConverter` 自动将其转换为 JSON schema。这种方法确保了编译时类型安全和自动 schema 生成。

### 方法签名

```java
Builder outputType(Class<?> outputType)
```

**参数:**

* `outputType` (`Class`, 必需): 定义输出结构的 Java 类。该类应该是带有标准 getter 和 setter 的 POJO。

## 四、工作原理

当 outputFormat 或 outputType 被指定时，Spring AI Alibaba 会自动选择：

* 当大模型服务支持 “原生结构化输出” 时（目前支持 OpenAiChatModel、DashScopeChatModel），自动使用模型内置的结构化输出能力（这也是目前最稳定、可靠的方式，因为模型服务会自动提供校验支持）。
* 针对其他没有 “原生结构化输出” 的模型，Spring AI Alibaba 会使用内置的 ToolCall策略，通过一个动态的 ToolCall 来格式化模型输出。

结构化响应将在 Agent 的状态对象 OverAllState 中返回，可通过 `structured_output` 读取。

### 模型原生结构化输出

比如，针对 DashScopeChatModel 模型，在配置 outputSchema 或 outputType 后，Spring AI Alibaba 会自动设置如下参数，以启用模型原生结构化输出能力。

```java
ChatOptions options = DashScopeChatOptions.builder()
.withResponseFormat(
    DashScopeResponseFormat.builder()
        .type(DashScopeResponseFormat.Type.JSON_OBJECT)
        .build())
.build();
```

同时，Spring AI Alibaba 框架会增强系统 Prompt，引导模型输出格式化内容

```java
// In AgentLlmNode.augmentUserMessage() method
public void augmentUserMessage(List<Message> messages, String outputSchema) {
    if (!StringUtils.hasText(outputSchema)) {
        return;
    }

    for (int i = messages.size() - 1; i >= 0; i--) {
        Message message = messages.get(i);
        if (message instanceof UserMessage userMessage) {
            messages.set(i, userMessage.mutate()
                .text(userMessage.getText() + System.lineSeparator() + outputSchema)
                .build());
            break;
        }
    }
}
```

> 注意，相比于 DashScope 模型是通过增强 Prompt 提示词实现最终的 JSON 格式，实现的是一个尽最大努力的效果，OpenAI 模型则是在模型 API 层面支持 Json 格式，提供格式的严格保证支持。

### ToolCall 结构化输出

对于不支持原生结构化输出的模型，Spring AI Alibaba 支持通过调用工具来实现相同效果。此方法适用于所有支持工具调用的模型，即大多数现代模型。

## 五、错误处理

模型可能不总是返回格式完美的 JSON。以下是处理潜在问题的策略:

### Try-Catch 模式

```java
/**
 * Try-Catch 错误处理示例
 */
@SneakyThrows
public static void tryCatchConfiguration() {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();
    // 模型配置
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

    // 创建 Agent
    ReactAgent agent = ReactAgent.builder()
        .name("data_extractor")
        .model(chatModel)
        .outputType(DataOutput.class)
        .build();
    // 调用并获取响应
    AssistantMessage result = agent.call("提取数据");
    try { // [!code ++:9]
        ObjectMapper mapper = new ObjectMapper();
        DataOutput data = mapper.readValue(result.getText(), DataOutput.class);
        // 处理数据
    } catch (JsonProcessingException e) {
        System.err.println("JSON解析失败: " + e.getMessage());
        System.err.println("原始输出: " + result.getText());
        // 回退处理
    }
}
```

### 验证模式

```java
package com.xxl.ai.framework.output;

import lombok.Data;

/**
 * @Classname ValidatedOutput
 * @Description 结构化输出验证
 * @Date 2025/12/7 23:55
 * @Created by xxl
 */
@Data
public class ValidatedOutput {

    private String title;
    private Integer rating;

    public void validate() throws IllegalArgumentException {
        if (title == null || title.isEmpty()) {
            throw new IllegalArgumentException("标题不能为空");
        }
        if (rating != null && (rating < 1 || rating > 5)) {
            throw new IllegalArgumentException("评分必须在1-5之间");
        }
    }

}
```

验证模式示例

```java
/**
 * 验证模式示例
 */
@SneakyThrows
public static void validationPatternConfiguration() {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();
    // 模型配置
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
    // 创建 Agent
    ReactAgent agent = ReactAgent.builder()
        .name("validated_agent")
        .model(chatModel)
        .outputType(ValidatedOutput.class) // [!code ++]
        .build();
    // 调用并获取响应
    try { // [!code ++:9]
        AssistantMessage result = agent.call("生成评价");
        ObjectMapper mapper = new ObjectMapper();
        ValidatedOutput output = mapper.readValue(result.getText(), ValidatedOutput.class);
        output.validate();  // 如果无效则抛出异常
        System.out.println("Valid output: " + output.getTitle());
    } catch (Exception e) {
        System.err.println("Validation failed: " + e.getMessage());
    }
}
```

### 重试模式

```java
package com.xxl.ai.framework.output;

import lombok.Data;

/**
 * @Classname ContactOutput
 * @Description 联系信息输出类
 * @Date 2025/12/8 00:01
 * @Created by xxl
 */
@Data
public class ContactOutput {

    private String name;

    private String email;

    private String phone;
}
```

重试模式示例

```java
/**
 * 重试模式示例
 */
public static void retryPatternConfiguration() {
    // 创建 DashScope API 实例
    DashScopeApi dashScopeApi = DashScopeApi.builder()
        .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
        .build();
    // 模型配置
    DashScopeChatOptions options = DashScopeChatOptions.builder()
        .withModel("deepseek-v3.2")           // 模型名称
        .withTemperature(0.3)                 // 温度参数
        .withMaxToken(500)          // 最大令牌数
        .withTopP(0.9)                        // Top-P 采样
        .build();
    // 创建 ChatModel
    ChatModel chatModel = DashScopeChatModel.builder()
        .dashScopeApi(dashScopeApi)
        .defaultOptions(options)
        .build();

    ReactAgent agent = ReactAgent.builder()
        .name("retry_agent")
        .model(chatModel)
        .outputType(ContactOutput.class)
        .build();

    int maxRetries = 3;
    ContactOutput data = null;
    ObjectMapper mapper = new ObjectMapper();

    for (int i = 0; i < maxRetries; i++) { // [!code ++:15]
        try {
            AssistantMessage result = agent.call("提取数据");
            data = mapper.readValue(result.getText(), ContactOutput.class);
            break;  // 成功
        } catch (Exception e) {
            if (i == maxRetries - 1) {
                throw new RuntimeException("多次尝试后仍然失败", e);
            }
            System.out.println("第" + (i + 1) + "次尝试失败，重试中...");
        }
    }
    if (data != null) {
        System.out.println("Successfully extracted: " + data.getName());
    }
}
```

Spring AI Alibaba 专注于简单性和灵活性，允许开发者在显式 schema 字符串（最大控制）和 Java 类（类型安全）之间进行选择。
