---
url: /AIGC/AI应用开发/02.LangGraph4j/6_提示词工程（Prompt Engineering）.md
---
# 6\_提示词工程（Prompt Engineering）

提示词工程是与大语言模型‍‍‍有效沟通的艺术和科学，它直接决定了你能从 AI ‌‌‌获得多高质量的输出。本章将帮助你掌握提示词工程的‍‍‍核心技巧，使你能够充分发挥大模型的潜力，无论是使‍‍‍用 Python 版 LangChain 还是 ‍‍‍Java 版 LangChain4j。

## 6.1 提示词工程基础

提示词工程（Prompt‍‍‍ Engineering）是设计、优化和改进输‌‌‌入到 AI 模型中的提示词（prompt）的过‍‍‍程，目的是引导模型生成更准确、更有用的输出。随‍‍‍着大语言模型（LLM）的发展，一个好的提示词设‍‍‍计已成为有效利用这些模型的关键技能。Iy8qa2Wkgy1zjaDf5wVYJsxIyeHLdZx9B8sLhGVCeeI=

### 提示词的组成部分

一个完整的提示词通常包含以下几个核心组成部分：

**指令（Instruction）**：明确告诉模型需要做什么，例如"翻译"、"总结"、"解释"等。85OwC9dA70cYmJ5h6K5cNTXdNAq0qMRNbG9wTf+m4FU=

**上下文（Context）**：提供背景信息，帮助模型理解任务的环境和约束条件。

**输入数据（Input Data）**：需要模型处理的具体内容或信息。

**输出格式（Output Format）**：指定期望的输出格式，如 JSON、表格、分点列出等。7QiJ3WkhTRjV8VSaIHYq0+Wzni+Hi3xtR8CR8/IP1VI=

一个基本的提示词示例：

```plain
▼plain复制代码指令: 将以下中文文本翻译成英文
上下文: 这是一篇技术博客的开头部分
输入数据: 编程导航网站提供了丰富的编程学习资源，适合各个层次的开发者学习
输出格式: 请仅提供翻译结果，不需要解释
```

### 提示词工程的基本原则

有效的提示‍‍‍词工程遵循几个关‌‌键‌原则：    ‍‍  ‍      ‍‍   ‍     ‍‍    ‍        

1. **明确性**：提示词应当清晰明确，避免模糊或歧义的表述。
2. **具体性**：提供具体的指令和约束，而非笼统的要求。
3. **逐步引导**：对于复杂任务，将其分解为多个步骤逐一引导。
4. **示例展示**：通过少量示例说明期望的输入-输出关系。
5. **角色设定**：为模型设定适当的角色，引导其以特定身份回答。

### 在 LangChain4j 中使用基础提示词

LangC‍‍‍hain4j 提‌‌供‌了多种方式来构‍‍建和‍使用提示词。‍‍最基本‍的方式是通‍‍过直接构‍建消息列表：

首先我们需要引入依赖：

```xml
▼xml复制代码
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
<dependency>
  <groupId>dev.langchain4j</groupId>
  <artifactId>langchain4j-core</artifactId>
  <version>1.2.0</version>
</dependency>
```

下面是一个‍‍‍简单的示例代码：‌‌ ‌       ‍‍  ‍      ‍‍   ‍     ‍‍    ‍    

```java
▼java复制代码import dev.langchain4j.community.model.dashscope.QwenChatModel;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;

import java.util.ArrayList;
import java.util.List;

public class BasicPromptExample {
    public static void main(String[] args) {
        // 初始化模型
 ChatModel model = QwenChatModel.builder()
                .apiKey(System.getenv("DASHSCOPE_API_KEY"))
                .modelName("qwen-max")
                .temperature(0.7f)
                .build();
        
       
        // 构建消息列表
        List<ChatMessage> messages = new ArrayList<>();

        messages.add(new SystemMessage("你是编程导航网站的技术专家，擅长解释编程概念。"));
        messages.add(new UserMessage("请简明扼要地解释Java中的多线程概念，并给出一个简单示例。"));

        // 获取回答
        AiMessage response = model.chat(messages).aiMessage();

        System.out.println(response.text());
    }
}
```

这段程序输出结果：3SdhPNReyfSez0Q4gOc0v6ykW2hqke4CnFnKQxaIhL8=

````plain
▼plain复制代码Java中的多线程是指在同一个程序中可以同时执行多个线程（执行路径），每个线程可以独立执行不同的任务。

多线程的核心概念：
1. 线程：程序执行的最小单位，一个进程可以有多个线程
2. 并发：多个线程轮流使用CPU资源
3. 并行：多个线程同时在不同CPU核心上执行
4. 同步：协调多个线程的执行顺序和资源访问

简单示例：

```java
public class MultiThreadExample {
    public static void main(String[] args) {
        // 创建并启动第一个线程
        Thread thread1 = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                System.out.println("编程导航线程1: " + i);
                try {
                    Thread.sleep(1000); // 暂停1秒
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });
        
        // 创建并启动第二个线程
        Thread thread2 = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                System.out.println("编程导航线程2: " + i);
                try {
                    Thread.sleep(1000); // 暂停1秒
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });
        
        // 启动线程
        thread1.start();
        thread2.start();
    }
}
````

这个例子创建了两个线程，它们会同时执行并各自打印不同的消息，展示了基本的多线程并发执行。

````plain
▼plain复制代码


## 6.2 提示词模板设计
提示词模板是提高‍‍‍提示词工程效率的关键工具，它允许‌‌‌你创建可重用的提示词结构，并根据‍‍‍需要填充变量。LangChain‍‍‍4j 提供了强大的模板设计功能，‍‍‍帮助你构建灵活而高效的提示词。

### 提示词模板的核心概念
提示词模板‍‍‍本质上是包含占位符‌‌‌的提示词框架，这些‍‍‍占位符可以在运行时‍‍‍被实际值替换。良好‍‍‍的模板设计应遵循以下原则：

1. **模块化**：将模板拆分为可复用的组件。
2. **可读性**：模板结构清晰，易于理解和维护。
3. **灵活性**：允许根据不同情况调整提示词内容。
4. **一致性**：保持风格和结构的一致，提高模型响应的稳定性。

### 在 LangChain4j 中使用提示词模板
LangC‍‍‍hain4j ‌提‌供‌了多种方式‍来定‍义和‍使用提‍示词模‍板，包‍括‍注解方式和编‍程方‍式。

#### 使用系统消息模板
使用 `@SystemMessage` 注解可以轻松定义系统提示词模板：

```java
package com.yupi.mcp.mcpclient.controller;

import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.community.model.dashscope.QwenChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;

interface CodeExplainer {
    @SystemMessage("你是代码小抄网站的编程专家，专注于解释{language}代码。请使用通俗易懂的语言。")
    String explainCode(@UserMessage String code, @V("language") String language);

}

public class SystemPromptTemplateExample {
    public static void main(String[] args) {
        // 初始化通义千问模型（QwenChatModel）
        ChatModel model = QwenChatModel.builder()
                .apiKey(System.getenv("DASHSCOPE_API_KEY")) // 替换为你的通义API Key
                .modelName("qwen-max") // 可选模型：qwen-turbo, qwen-plus 等
                .temperature(0.7f)
                .build();

        // 使用 LangChain4j 的服务代理封装接口
        CodeExplainer explainer = AiServices.builder(CodeExplainer.class)
                .ChatModel(model)
                .build();

        // 示例 Java 代码
        String javaCode = "public static void main(String[] args) {\n    System.out.println(\"Hello, World!\");\n}";
        String explanation = explainer.explainCode(javaCode, "Java");
        System.out.println("Java代码解释:\n" + explanation);

        // 示例 Python 代码
        String pythonCode = "def greet(name):\n    print(f\"Hello, {name}!\")";
        explanation = explainer.explainCode(pythonCode, "Python");
        System.out.println("\nPython代码解释:\n" + explanation);
    }
}
````

#### 使用用户消息模板

同样，你可以使用 `@UserMessage` 注解来定义用户提示词模板：

```java
▼java复制代码import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.community.model.dashscope.QwenChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;

interface ResumeAssistant {
    @SystemMessage("你是老鱼简历网站的简历优化专家，擅长针对{industry}行业优化简历。")
    @UserMessage("请帮我优化以下{position}岗位的简历部分:\n\n{resumeContent}")
    String optimizeResume(@V("resumeContent") String resumeContent,
                          @V("industry") String industry,
                          @V("position") String position);
}

public class UserPromptTemplateExample {
    public static void main(String[] args) {
        // 初始化通义千问模型
        ChatModel model = QwenChatModel.builder()
                .apiKey(System.getenv("DASHSCOPE_API_KEY")) // 替换为你自己的 DashScope API Key
                .modelName("qwen-max")
                .temperature(0.7f)
                .build();

        // 创建服务
        ResumeAssistant assistant = AiServices.builder(ResumeAssistant.class)
                .ChatModel(model)
                .build();

        // 示例简历内容
        String resumeContent = "工作经验:\n2020-2023 某科技公司 软件工程师\n负责开发和维护公司核心产品，使用Java和Spring框架。";

        String optimized = assistant.optimizeResume(resumeContent, "互联网", "后端开发");

        System.out.println("优化后的简历:\n" + optimized);
    }
}
```

## 6.3 变量与动态提示词

动态提示词是提示‍‍词工程‍中的重要概念，它允许我们根‌‌据不同的上下文和需求‌调整提示词‍‍内容。在 LangChain4j ‍‍‍中，我们可以通过变量机制实现这一‍‍功能，使提示‍词更加灵活和适应性强               ‍                 

### 变量的类型与用途

在 LangChain4j 中，提示词变量可以有多种类型：

1. **简单文本变量**：替换为字符串值。
2. **数值变量**：替换为数字值。
3. **列表变量**：可以替换为项目列表。
4. **结构化对象变量**：可以替换为复杂的对象属性。

这些变量可用于各种场景：3SdhPNReyfSez0Q4gOc0v6ykW2hqke4CnFnKQxaIhL8=

* 个性化用户交互
* 动态调整指令细节
* 注入上下文信息
* 自定义输出格式

### 使用接口方法参数作为变量

LangC‍‍‍hain4j ‌的‌服‌务接口中，‍方法‍参数‍可以直‍接用作‍提示词‍模‍板中的变‍量：nqebE0GbQps0Ats4MKJjbVHQiAAW+ffJdMrCsN5dgzs=

```java
▼java复制代码import dev.langchain4j.community.model.dashscope.QwenChatModel;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;

/**
 * @author gulihua
 * @Description
 * @date 2025-07-28 20:30
 */
interface ContentGenerator {
    /**
     * 生成内容的方法，模板动态绑定参数
     * @param platform 发布平台
     * @param topic 话题
     * @param contentType 内容类型
     * @param style 文风
     * @param wordCount 字数
     * @return 生成的文本内容
     */
    @UserMessage("为{platform}平台创建一篇关于{topic}的{contentType}，风格要{style}，长度大约{wordCount}字。")
    String generateContent(
            @V("platform") String platform,
            @V("topic") String topic,
            @V("contentType") String contentType,
            @V("style") String style,
            @V("wordCount") int wordCount
    );

    public class DynamicVariablesExample {
        public static void main(String[] args) {
            // 初始化通义千问模型
            ChatModel model = QwenChatModel.builder()
                    .apiKey("sk-xxxxx")  // 通义千问 API KEY
                    .modelName("qwen-v1")  // 你可以换成 qwen-max、qwen-lite 等
                    .temperature(0.7f)
                    .build();

            // 创建服务
            ContentGenerator generator = AiServices.builder(ContentGenerator.class)
                    .ChatModel(model)
                    .build();

            // 调用接口生成内容
            String blogPost = generator.generateContent("编程导航", "Java多线程", "博客文章", "专业但易懂", 300);
            System.out.println("博客文章:\n" + blogPost + "\n");

            String socialPost = generator.generateContent("微信公众号", "AI应用开发", "短文", "幽默", 150);
            System.out.println("公众号文章:\n" + socialPost);
        }
    }
}
```

### 使用变量映射

对于更复杂‍的场景‍，可以使用变量‌映射来提供更多自定义‌‍：         ‍      ‍    ‍             ‍                  ‍              TRQG02HuvSbBCdyta/9OfF/iMg4d5URNJyKR3KkD/fE=

```java
▼java复制代码import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.community.model.dashscope.QwenChatModel;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class VariableMappingExample {
    public static void main(String[] args) {
        // 初始化通义千问模型
        ChatModel model = QwenChatModel.builder()
                .apiKey("apikey")
                .modelName("qwen-max") // 具体模型名按你申请的替换
                .temperature(0.7f)
                .build();

        // 准备变量
        Map<String, Object> variables = new HashMap<>();
        variables.put("algorithm", "快速排序");
        variables.put("difficulty", "中级");
        variables.put("audience", "计算机科学专业学生");

        List<String> keyPoints = List.of(
                "算法原理",
                "分区策略",
                "时间复杂度分析",
                "空间复杂度分析",
                "优化技巧"
        );

        // 手动拼接要点字符串，代替模板循环
        StringBuilder keyPointsStr = new StringBuilder();
        for (String point : keyPoints) {
            keyPointsStr.append("- ").append(point).append("\n");
        }

        variables.put("key_points", keyPointsStr.toString());
        variables.put("sections", 5);
        variables.put("language", "Java");

        // 拼接最终用户提示词（UserMessage）
        String userContent = String.format("""
                你是算法导航网站的算法专家。

                请为以下算法创建一个教程大纲:
                算法名称: %s

                难度级别: %s

                目标读者: %s

                需要覆盖的要点:
                %s
                要求:
                1. 大纲应包含不少于%d个主要部分
                2. 每个部分应有简短描述
                3. 在适当位置包含代码示例
                4. 使用%s编程语言
                """,
                variables.get("algorithm"),
                variables.get("difficulty"),
                variables.get("audience"),
                variables.get("key_points"),
                variables.get("sections"),
                variables.get("language"));

        // 构造消息列表，包含系统角色和用户提示
        List<ChatMessage> messages = List.of(
                new SystemMessage("你是算法导航网站的算法专家。"),
                new UserMessage(userContent)
        );

        // 调用模型
        String response = model.chat(messages).aiMessage().text();

        System.out.println("生成的教程大纲:\n" + response);
    }
}
```

### 条件变量处理

LangC‍‍h‍ain4j 还‌支‌持根据条件处‌理‍变量‍，这在需要根‍据特定‍‍条件调整提‍示词内容‍时非常有用‍：               ‍                 85OwC9dA70cYmJ5h6K5cNTXdNAq0qMRNbG9wTf+m4FU=

```java
▼java复制代码interface TechSupportBeginner {
    @SystemMessage("你是剪切助手网站的AI支持专家。用户技术水平：初学者。请使用简单易懂的术语，避免技术细节。")
    @UserMessage("我遇到了以下问题: {problem}")
    String provideSupport(@V("problem") String problem);
}

interface TechSupportAdvanced {
    @SystemMessage("你是剪切助手网站的AI支持专家。用户技术水平：高级。可以使用专业术语和详细技术解释。")
    @UserMessage("我遇到了以下问题: {problem}")
    String provideSupport(@V("problem") String problem);
}

public class ConditionalVariablesExample {
    public static void main(String[] args) {
        ChatModel model = QwenChatModel.builder()
                .apiKey(System.getenv("OPENAI_API_KEY"))
                .modelName("qwen-v1")
                .temperature(0.7f)
                .build();

        TechSupportBeginner beginnerSupport = AiServices.builder(TechSupportBeginner.class)
                .ChatModel(model)
                .build();

        TechSupportAdvanced advancedSupport = AiServices.builder(TechSupportAdvanced.class)
                .ChatModel(model)
                .build();

        String problem = "剪切助手无法同步我的剪贴板内容到其他设备";

        String beginnerAnswer = beginnerSupport.provideSupport(problem);
        System.out.println("给初学者的回答:\n" + beginnerAnswer + "\n");

        String advancedAnswer = advancedSupport.provideSupport(problem);
        System.out.println("给高级用户的回答:\n" + advancedAnswer);
    }
}
```

## 6.4 提示词优化技巧

即使使用了模‍‍‍板和变量，仍然需要不断‌‌‌优化提示词以获得最佳‍‍‍结果。以下是一些在 La‍‍‍ngChain4j 中‍‍‍进行提示词优化的关键技巧。7QiJ3WkhTRjV8VSaIHYq0+Wzni+Hi3xtR8CR8/IP1VI=

### 提示词优化的基本策略

1. **迭代改进**：通过多次尝试和调整逐步改进提示词。
2. **具体胜于抽象**：提供具体的指令和示例，而非笼统的要求。
3. **分解复杂任务**：将复杂任务分解为多个简单步骤。
4. **明确期望**：清晰地说明期望的输出格式和标准。
5. **上下文增强**：提供足够的上下文信息帮助模型理解任务。

### 结构化输出设计

结构化输出让‍‍‍ AI 的回答更加规范和‌‌‌易于处理。在开发老鱼简历‍‍‍的 AI 分析功能时，结‍‍‍构化的输出格式能够帮助系‍‍‍统更好地解析和展示分析结果：

```java
▼java复制代码import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.UserMessage;

// 简历分析服务
interface ResumeAnalyzer {
    @UserMessage("""
            请分析以下简历内容，并按照严格的 JSON 格式输出分析结果：
            
            简历内容：
            {{resume_content}}
            
            输出格式要求：
            {
              "overall_score": 数字(1-100),
              "strengths": ["优点1", "优点2", "优点3"],
              "weaknesses": ["不足1", "不足2", "不足3"],
              "suggestions": [
                {
                  "category": "分类",
                  "priority": "高/中/低",
                  "description": "具体建议"
                }
              ],
              "missing_skills": ["缺失技能1", "缺失技能2"],
              "industry_match": {
                "target_industry": "目标行业",
                "match_score": 数字(1-100),
                "explanation": "匹配度说明"
              }
            }
            
            注意：
            1. 必须严格按照上述 JSON 格式输出
            2. 所有字符串值必须用双引号包围
            3. 数字值不要加引号
            4. 确保 JSON 格式正确，可以被解析
            """)
    String analyzeResume(@V("resume_content") String resume_content);
}

public class StructuredOutputExample {
    public static void main(String[] args) {
        ChatModel model = QwenChatModel.builder()
                .apiKey("your-api-key")
                .modelName("qwen-max")
                .temperature(0.2f) // 较低温度确保输出格式稳定
                .build();
        
        ResumeAnalyzer analyzer = AiServices.create(ResumeAnalyzer.class, model);
        
        String resumeContent = """
                程序员鱼皮
                Java 开发工程师 | 5年经验
                
                技能：
                - Java, Spring Boot, MySQL
                - 熟悉微服务架构
                
                项目经验：
                - 编程导航：全栈学习平台，日活用户 10000+
                - 面试鸭：面试题库系统，题目数量 5000+
                
                教育背景：
                - 计算机科学与技术本科
                """;
        
        String analysis = analyzer.analyzeResume(resumeContent);
        System.out.println("简历分析结果：");
        System.out.println(analysis);
    }
}
```

### 多步骤推理优化

复杂的任务往‍‍‍往需要多步骤的推理过‌‌‌程。通过明确指导模型的思考步‍‍‍骤，可以显著提高输出质‍量‍‍。这种技术在代码小抄的代‍‍‍码分析功能中应用广泛：

````java
▼java复制代码import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.UserMessage;

interface CodeAnalyzer {
    @UserMessage("""
            你是代码小抄平台的高级代码分析师。请按照以下步骤分析代码：
            
            **第一步：代码理解**
            - 识别代码的主要功能
            - 分析代码结构和设计模式
            - 理解数据流和控制流
            
            **第二步：问题识别**
            - 检查潜在的 bug 和错误
            - 识别性能问题
            - 发现安全隐患
            - 评估代码可读性和维护性
            
            **第三步：优化建议**
            - 提供具体的改进方案
            - 给出优化后的代码示例
            - 解释优化的原因和好处
            
            **第四步：最佳实践**
            - 推荐相关的设计模式
            - 建议合适的工具和库
            - 提供进一步学习的方向
            
            请严格按照上述四个步骤分析以下代码：
            
            ```{{language}}
            {{code}}
            ```
            
            每个步骤都要有明确的标题，内容要详细且实用。
            """)
    String analyzeCode(@V("code") String code, @V("language") String language);
}

public class MultiStepReasoningExample {
    public static void main(String[] args) {
        ChatModel model = QwenChatModel.builder()
                .apiKey("your-api-key")
                .modelName("qwen-max")
                .temperature(0.3f)
                .build();
        
        CodeAnalyzer analyzer = AiServices.create(CodeAnalyzer.class, model);
        
        String javaCode = """
                public class UserManager {
                    private static List<User> users = new ArrayList<>();
                    
                    public static User login(String username, String password) {
                        for(int i = 0; i < users.size(); i++) {
                            User user = users.get(i);
                            if(user.getUsername().equals(username) && 
                               user.getPassword().equals(password)) {
                                return user;
                            }
                        }
                        return null;
                    }
                    
                    public static void addUser(User user) {
                        users.add(user);
                    }
                }
                """;
        
        String analysis = analyzer.analyzeCode(javaCode, "java");
        System.out.println("多步骤代码分析：");
        System.out.println(analysis);
    }
}
````

## 6.5 Few-shot 与 Zero-shot 提示词

Few-shot‍‍‍ 和 Zero-shot 是两种‌‌‌重要的提示词方法，它们在不同场景‍‍‍下有着各自的优势。LangCha‍‍‍in4j 支持这两种方法，让你能‍‍‍够根据需要选择最合适的提示词策略。

### Zero-shot 提示应用

Zero-s‍‍‍hot 提示适用于模型‌‌‌已经具备相关能力的‍‍‍场景。在剪切助手的智能分类‍‍‍功能中，我们可以直接让‍‍‍模型对剪切板内容进行分类：wkzLNuBRh6R+lZgXeGCYFHBSq3Izz4e/cck+rYjQNkc=

```java
▼java复制代码import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.UserMessage;

interface ContentClassifier {
    @UserMessage("""
            你是剪切助手的智能内容分类器。请将以下内容分类到合适的类别中：
            
            可选类别：
            - 代码片段
            - 网址链接  
            - 文本笔记
            - 数字信息
            - 图片描述
            - 其他
            
            内容：{{content}}
            
            请只返回类别名称，不要添加其他解释。
            """)
    String classifyContent(@V("content") String content);
}

public class ZeroShotExample {
    public static void main(String[] args) {
        ChatModel model = QwenChatModel.builder()
                .apiKey("your-api-key")
                .modelName("qwen-max")
                .temperature(0.1f) // 低温度确保分类结果稳定
                .build();
        
        ContentClassifier classifier = AiServices.create(ContentClassifier.class, model);
        
        // 测试不同类型的内容
        String[] testContents = {
                "public static void main(String[] args) { System.out.println(\"Hello\"); }",
                "https://www.codefather.cn/programming-roadmap",
                "记住明天下午 3 点开会讨论项目进度",
                "手机号：138-8888-8888，验证码：123456"
        };
        
        for (String content : testContents) {
            String category = classifier.classifyContent(content);
            System.out.println("内容：" + content.substring(0, Math.min(30, content.length())) + "...");
            System.out.println("分类：" + category);
            System.out.println();
        }
    }
}
```

### Few-shot 提示设计

Few-sh‍‍‍ot 提示通过提供示例来‌‌‌指导模型的行为。这种方法‍‍‍在处理特定格式或风格要求时‍特‍‍别有效。面试鸭的题目‍‍‍生成功能就大量使用了这种技术：7QiJ3WkhTRjV8VSaIHYq0+Wzni+Hi3xtR8CR8/IP1VI=

```java
▼java复制代码interface QuestionGenerator {
    @UserMessage("""
            你是面试鸭的专业题目生成器。请根据给定的技术栈和难度级别生成面试题。
            
            以下是一些示例：
            
            **示例 1：**
            技术栈：Java 基础
            难度：初级
            生成题目：请解释 Java 中 == 和 equals() 的区别，并给出使用场景。
            
            **示例 2：**
            技术栈：Spring Boot
            难度：中级  
            生成题目：在 Spring Boot 中如何实现自定义配置属性？请结合 @ConfigurationProperties 注解说明。
            
            **示例 3：**
            技术栈：数据库优化
            难度：高级
            生成题目：给定一个慢查询场景，请从索引设计、SQL 优化、分库分表等角度提出完整的优化方案。
            
            现在请为以下技术栈生成题目：
            技术栈：{{tech_stack}}
            难度：{{difficulty}}
            
            要求：
            1. 题目要有实际意义，贴近真实面试场景
            2. 难度要与指定级别匹配
            3. 可以包含代码示例或场景描述
            4. 题目要能考查候选人的实际能力
            """)
    String generateQuestion(@V("tech_stack") String tech_stack, @V("difficulty") String difficulty);
}

public class FewShotExample {
    public static void main(String[] args) {
        ChatModel model = QwenChatModel.builder()
                .apiKey("your-api-key")
                .modelName("qwen-max")
                .temperature(0.7f)
                .build();
        
        QuestionGenerator generator = AiServices.create(QuestionGenerator.class, model);
        
        // 生成不同类型的面试题
        String[] techStacks = {"Redis 缓存", "微服务架构", "前端性能优化"};
        String[] difficulties = {"初级", "中级", "高级"};
        
        for (String techStack : techStacks) {
            for (String difficulty : difficulties) {
                String question = generator.generateQuestion(techStack, difficulty);
                System.out.println("=== " + techStack + " - " + difficulty + " ===");
                System.out.println(question);
                System.out.println();
            }
        }
    }
}
```

## 6.6 提示词链优化

提示词链是将复‍‍‍杂任务分解为多个简单步骤的技‌‌‌术。每个步骤都有专门的提示词‍‍‍，步骤之间可以传递信息。这种‍‍‍方法能够处理更复杂的任务，同‍‍‍时保持每个步骤的清晰性。7QiJ3WkhTRjV8VSaIHYq0+Wzni+Hi3xtR8CR8/IP1VI=

### 链式处理设计

在算法导航‍‍‍的学习路径生成中，我‌‌‌们需要先分析用户水平‍‍‍，再推荐学习内容，最‍‍‍后制定学习计划。这个‍‍‍过程就适合用提示词链来实现：

```java
▼java复制代码import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.UserMessage;

// 第一步：用户水平评估
interface LevelAssessor {
    @UserMessage("""
            请评估用户的编程水平。根据以下信息给出评估结果：
            
            用户信息：{{user_info}}
            
            请按以下格式输出：
            整体水平：初级/中级/高级
            强项技能：[技能1, 技能2, 技能3]
            薄弱环节：[薄弱点1, 薄弱点2, 薄弱点3]
            学习特点：简要描述用户的学习特点和偏好
            """)
    String assessLevel(@V("user_info") String user_info);
}

// 第二步：内容推荐
interface ContentRecommender {
    @UserMessage("""
            基于用户水平评估结果，推荐合适的学习内容：
            
            用户评估：{{assessment}}
            目标方向：{{target_direction}}
            
            请推荐：
            1. 核心学习内容（3-5 个主题）
            2. 实践项目建议（2-3 个项目）
            3. 学习资源（书籍、视频、网站等）
            4. 预估学习时间
            """)
    String recommendContent(@V("assessment") String assessment, @V("target_direction") String target_direction);
}

// 第三步：学习计划制定
interface StudyPlanner {
    @UserMessage("""
            根据内容推荐制定详细的学习计划：
            
            推荐内容：{{recommendations}}
            可用时间：{{available_time}}
            
            请制定：
            1. 周学习计划（具体到每天的学习内容）
            2. 里程碑设置（每周或每月的目标）
            3. 进度检查方式
            4. 调整建议（如何根据学习情况调整计划）
            """)
    String createStudyPlan(@V("recommendations") String recommendations, @V("available_time") String available_time);
}

public class PromptChainExample {
    public static void main(String[] args) {
        ChatModel model = QwenChatModel.builder()
                .apiKey("your-api-key")
                .modelName("qwen-max")
                .temperature(0.5f)
                .build();
        
        // 创建链中的各个服务
        LevelAssessor assessor = AiServices.create(LevelAssessor.class, model);
        ContentRecommender recommender = AiServices.create(ContentRecommender.class, model);
        StudyPlanner planner = AiServices.create(StudyPlanner.class, model);
        
        // 用户信息
        String userInfo = """
                程序员鱼皮，计算机专业毕业，有 2 年 Java 开发经验。
                熟悉 Spring Boot、MySQL，做过编程导航和面试鸭项目。
                想要学习微服务架构和分布式系统，提升技术水平。
                每天可以投入 2-3 小时学习时间。
                """;
        
        // 第一步：评估用户水平
        System.out.println("=== 第一步：用户水平评估 ===");
        String assessment = assessor.assessLevel(userInfo);
        System.out.println(assessment);
        System.out.println();
        
        // 第二步：推荐学习内容
        System.out.println("=== 第二步：内容推荐 ===");
        String recommendations = recommender.recommendContent(assessment, "微服务架构与分布式系统");
        System.out.println(recommendations);
        System.out.println();
        
        // 第三步：制定学习计划
        System.out.println("=== 第三步：学习计划 ===");
        String studyPlan = planner.createStudyPlan(recommendations, "每天 2-3 小时，周末可以增加到 4-5 小时");
        System.out.println(studyPlan);
    }
}
```

### 链式优化策略

提示词链的优化需‍‍‍要考虑多个方面：步骤划分的合理‌‌‌性、信息传递的完整性、错误处理‍‍的健‍壮性。一个好的提示词链应该‍‍‍能够处理上游步骤的异常情况，并‍‍‍具备一定的自我修正能力：

```java
▼java复制代码import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.UserMessage;

// 带错误处理的提示词链
interface RobustChainProcessor {
    @UserMessage("""
            请处理以下任务，如果发现输入有问题，请指出并尝试修正：
            
            任务类型：{{task_type}}
            输入数据：{{input_data}}
            上一步结果：{{previous_result}}
            
            处理要求：
            1. 首先验证输入数据的有效性
            2. 如果数据有问题，给出具体的问题描述
            3. 尝试基于上下文信息进行合理推测或修正
            4. 如果无法修正，请明确说明需要什么额外信息
            5. 给出处理结果或下一步建议
            
            输出格式：
            状态：成功/需要修正/需要更多信息
            问题描述：（如果有问题）
            处理结果：（具体结果）
            建议：（下一步建议）
            """)
       String processWithValidation(@V("taskType") String taskType, @V("input_data") String input_data, @V("previous_result") String previous_result);
}

public class RobustChainExample {
    public static void main(String[] args) {
        ChatModel model = QwenChatModel.builder()
                .apiKey("your-api-key")
                .modelName("qwen-max")
                .temperature(0.3f)
                .build();
        
        RobustChainProcessor processor = AiServices.create(RobustChainProcessor.class, model);
        
        // 模拟处理过程中的异常情况
        String result = processor.processWithValidation(
                "代码质量分析",
                "这是一段不完整的代码...", // 故意提供不完整的输入
                "前一步分析显示代码结构良好"
        );
        
        System.out.println("健壮性处理结果：");
        System.out.println(result);
    }
}
```

通过系统性地掌握提‍‍‍示词工程的各种技术，你就能够构建出‌‌‌更加智能、准确和用户友好的 AI ‍‍‍应用。无论是开发编程导航的智能问答‍‍‍系统，还是优化面试鸭的题目生成功能‍‍‍，优秀的提示词设计都是成功的关键。

## 练习题

### 练习题 1（基础）：设计一个简单的提示词模板

为代码小抄‍‍‍网站设计一个代码解‌‌‌释功能的提示词‍‍‍模板。要求能够根据编程‍‍‍语言和用户水平动态‍‍‍调整解释的详细程度。

参考答案：

````java
▼java复制代码PromptTemplate template = PromptTemplate.from("""
        你是代码小抄的专业代码解释员。
        
        编程语言：{{language}}
        用户水平：{{user_level}}
        
        {{#is_beginner}}
        请用简单易懂的语言解释，避免复杂的技术术语。
        {{/is_beginner}}
        {{#is_advanced}}
        可以深入讲解技术细节和最佳实践。
        {{/is_advanced}}
        
        请解释以下代码的功能和工作原理：
        ```{{language}}
        {{code}}
        ```
        
        解释要求：
        1. 代码的主要功能
        2. 关键语法和概念
        3. 运行流程
        4. 可能的改进建议
        """);
````

### 练习题 2（中级）：实现一个 Few-shot 学习的提示词

为算法导航‍‍‍设计一个算法复杂‌‌度‌分析的 Few‍‍-s‍hot 提示‍‍词，要‍求能够分析‍‍时间复杂‍度和空间复杂度。

参考答案：nqebE0GbQps0Ats4MKJjbVHQiAAW+ffJdMrCsN5dgzs=

````java
▼java复制代码interface ComplexityAnalyzer {
    @UserMessage("""
            请分析算法的时间和空间复杂度。参考以下示例：
            
            示例 1：
            算法：冒泡排序
            时间复杂度：O(n²) - 需要两层循环，最坏情况下比较 n(n-1)/2 次
            空间复杂度：O(1) - 只使用常数个额外变量
            
            示例 2：
            算法：归并排序
            时间复杂度：O(n log n) - 分治策略，每层 O(n)，共 log n 层
            空间复杂度：O(n) - 需要额外数组存储合并结果
            
            现在请分析：
            算法：{{algorithm_name}}
            代码：
            ```
            {{code}}
            ```
            
            请按示例格式给出分析结果。
            """)
    String analyzeComplexity(@V("algorithm_name") String algorithm_name, @V("code") String code);
}
````

### 练习题 3（高级）：设计一个多步骤的提示词链

为老鱼简历‍‍‍设计一个完整的简历‌‌‌优化提示词链，包括‍‍‍：分析简历问题 →‍‍‍ 生成优化建议 →‍‍‍ 重写简历内容三个步骤。7QiJ3WkhTRjV8VSaIHYq0+Wzni+Hi3xtR8CR8/IP1VI=

参考答案：

```java
▼java复制代码// 第一步：问题分析
interface ResumeAnalyzer {
    @UserMessage("""
            分析简历存在的问题：
            
            简历内容：{{resume_content}}
            目标职位：{{target_position}}
            
            请从以下维度分析：
            1. 格式和结构问题
            2. 内容完整性问题  
            3. 关键词匹配问题
            4. 经历描述问题
            5. 技能展示问题
            
            输出格式：
            主要问题：[问题列表]
            优先级：高/中/低（按重要性排序）
            """)
    String analyzeProblems(@V("resume_content") String resume_content,  @V("target_position") String target_position);
}

// 第二步：优化建议
interface OptimizationAdvisor {
    @UserMessage("""
            基于问题分析，提供具体的优化建议：
            
            问题分析：{{problems}}
            
            请提供：
            1. 结构调整建议
            2. 内容补充建议
            3. 表达优化建议
            4. 关键词优化建议
            5. 具体的修改示例
            """)
    String generateAdvice(@V("problems") String problems);
}

// 第三步：内容重写
interface ContentRewriter {
    @UserMessage("""
            根据优化建议重写简历内容：
            
            原始简历：{{original_resume}}
            优化建议：{{advice}}
            
            请输出优化后的完整简历，保持专业性和吸引力。
            """)
    String rewriteResume(@V("original_resume") String original_resume, @V("advice") String advice);
}
```
