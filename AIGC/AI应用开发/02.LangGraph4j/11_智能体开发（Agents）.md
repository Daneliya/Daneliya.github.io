---
url: /AIGC/AI应用开发/02.LangGraph4j/11_智能体开发（Agents）.md
---
# 11\_智能体开发（Agents）

智能体（Agent）是 A‍‍‍‍‍I 应用的高级形态，它不仅能够理解和生成文本，还具备‌‌‌‌‌使用工具、制定计划和自主执行任务的能力。智能体能够在‍‍‍‍‍复杂的环境中自主完成各种任务。掌握智能体开发技术，你‍‍‍‍‍就能构建出真正智能的 AI 应用          ‍‍‍‍‍                      

## 11.1 智能体概念与类型

智能体是一个能够‍‍‍感‍‍知环境、做出决策并采取行动来‌‌‌实现目标的自主系‌‌统。与传统的问‍‍‍答系统不同，智能体具备主动‍‍性、‍‍‍反应性和社会性等特征，能够在动‍‍‍态‍‍环境中持续学习和适应              ‍‍                  

智能体的核心组件包‍‍‍括感‍‍知模块、决策模块、行动模块和记忆模‌‌‌块。感知模块负‌‌责接收和理解外部输入‍‍‍，决策模块基于当前状态和目标‍‍制定行动‍‍‍计划，行动模块执行具体的操作，记忆模‍‍‍‍‍块则存储历史经验和学习成果             ‍‍                   

根据功能和复杂度的‍‍‍‍‍不同，智能体可以分为反应式智能体、基‌‌‌‌‌于模型的智能体、基于目标的智能体和基‍‍‍‍‍于效用的智能体等类型。在智能面试官系‍‍‍‍‍统中，我们需要一个能够根据候选人的回‍‍‍‍‍答动态调整问题难度和类型的智能体：

首先我们先‍‍‍‍‍导入相关的依赖项‌‌‌‌：‌       ‍‍‍‍  ‍      ‍‍‍‍   ‍     ‍‍‍‍    ‍     

```xml
▼xml复制代码
<dependency>
  <groupId>dev.langchain4j</groupId>
  <artifactId>langchain4j</artifactId>
  <version>1.1.0</version>
</dependency>
<dependency>
  <groupId>dev.langchain4j</groupId>
  <artifactId>langchain4j-open-ai-spring-boot-starter</artifactId>
  <version>1.0.0-beta3</version>
</dependency>

<dependency>
  <groupId>dev.langchain4j</groupId>
  <artifactId>langchain4j-community-dashscope-spring-boot-starter</artifactId>
  <version>1.1.0-beta7</version>
</dependency>
<dependency>
  <groupId>dev.langchain4j</groupId>
  <artifactId>langchain4j-easy-rag</artifactId>
  <version>1.0.0-beta3</version>
</dependency>
<dependency>
  <groupId>dev.langchain4j</groupId>
  <artifactId>langchain4j-core</artifactId>
  <version>1.2.0</version>
</dependency> 
```

下面来看下代码示例：

```java
▼java复制代码
import dev.langchain4j.agent.tool.Tool;
import dev.langchain4j.community.model.dashscope.QwenChatModel;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class AgentConceptDemo {

    // 智能面试官智能体接口
    interface InterviewAgent {

        @UserMessage("你是一位面试官，正在面试一位申请 {{position}} 岗位的候选人。他的回答是：{{candidateResponse}}。请你给出一个下一个问题。")
        String conductInterview(@V("candidateResponse") String candidateResponse,
                                @V("position") String position);

        @UserMessage("以下是候选人的全部回答记录：\n{{interviewHistory}}\n请根据整体表现进行评估，给出总评。")
        String evaluateCandidate(@V("interviewHistory") String interviewHistory);
    }

    // 面试工具类
    static class InterviewTools {
        private List<String> javaQuestions;
        private List<String> pythonQuestions;
        private List<String> algorithmQuestions;
        private Random random;

        public InterviewTools() {
            this.random = new Random();
            initializeQuestions();
        }

        private void initializeQuestions() {
            // 初始化 Java 面试题库
            javaQuestions = List.of(
                    "请解释 Java 中的多态性概念及其实现方式",
                    "描述 Java 垃圾回收的基本原理和常见算法",
                    "什么是 Spring Boot 的自动配置？它是如何工作的？",
                    "解释 Java 中的线程安全问题及其解决方案"
            );

            // 初始化 Python 面试题库
            pythonQuestions = List.of(
                    "请解释 Python 中的装饰器概念及其使用场景",
                    "描述 Python 的 GIL 机制及其对多线程的影响",
                    "什么是 Python 的生成器？它与普通函数有什么区别？",
                    "解释 Python 中的元类概念及其应用"
            );

            // 初始化算法面试题库
            algorithmQuestions = List.of(
                    "请实现一个高效的字符串匹配算法",
                    "如何设计一个 LRU 缓存系统？",
                    "描述快速排序算法的原理和时间复杂度分析",
                    "如何判断一个链表是否有环？"
            );
        }

        @Tool("根据职位要求获取相关的面试问题")
        public String getInterviewQuestion(String position, String difficulty) {
            List<String> questions;

            switch (position.toLowerCase()) {
                case "java":
                case "java开发":
                    questions = javaQuestions;
                    break;
                case "python":
                case "python开发":
                    questions = pythonQuestions;
                    break;
                case "算法":
                case "算法工程师":
                    questions = algorithmQuestions;
                    break;
                default:
                    questions = javaQuestions; // 默认使用 Java 题库
            }

            return questions.get(random.nextInt(questions.size()));
        }

        @Tool("评估候选人回答的质量和准确性")
        public String evaluateResponse(String question, String response) {
            // 简化的评估逻辑
            int score = 0;
            String[] keywords = {"概念", "原理", "实现", "优化", "性能", "设计"};

            for (String keyword : keywords) {
                if (response.contains(keyword)) {
                    score += 10;
                }
            }

            if (response.length() > 100) score += 20;
            if (response.length() > 200) score += 10;

            String level;
            if (score >= 60) {
                level = "优秀";
            } else if (score >= 40) {
                level = "良好";
            } else if (score >= 20) {
                level = "一般";
            } else {
                level = "需要改进";
            }

            return String.format("回答评分：%d分，水平：%s", Math.min(score, 100), level);
        }

        @Tool("根据候选人表现调整面试策略")
        public String adjustInterviewStrategy(String currentPerformance) {
            if (currentPerformance.contains("优秀")) {
                return "候选人表现优秀，可以提出更有挑战性的问题";
            } else if (currentPerformance.contains("良好")) {
                return "候选人表现良好，继续当前难度的问题";
            } else if (currentPerformance.contains("一般")) {
                return "候选人表现一般，可以适当降低问题难度或提供引导";
            } else {
                return "候选人需要更多帮助，建议提供基础问题和详细引导";
            }
        }
    }

    public static void main(String[] args) {
        // 初始化智能体系统
        AgentConceptDemo demo = new AgentConceptDemo();
        demo.demonstrateAgentTypes();
    }

    private void demonstrateAgentTypes() {
        System.out.println("=== 智能体类型演示 ===");

        // 初始化通义千问模型
        ChatModel model = QwenChatModel.builder()
                .apiKey("sk-xxxx")
                .modelName("qwen-max")
                .temperature(0.7f)
                .build();

        // 创建面试工具实例
        InterviewTools tools = new InterviewTools();

        // 创建智能面试官
        InterviewAgent agent = AiServices.builder(InterviewAgent.class)
                .chatModel(model)
                .tools(tools)
                .chatMemory(MessageWindowChatMemory.withMaxMessages(10))
                .build();

        // 演示反应式智能体
        demonstrateReactiveAgent(agent);

        // 演示基于目标的智能体
        demonstrateGoalBasedAgent(agent);
    }

    // 演示反应式智能体
    private void demonstrateReactiveAgent(InterviewAgent agent) {
        System.out.println("=== 反应式智能体演示 ===");
        System.out.println("特点：根据输入直接做出反应，不进行复杂推理");

        String position = "Java开发";
        String candidateResponse = "我对 Java 有基础了解，学过面向对象编程";

        String agentResponse = agent.conductInterview(candidateResponse, position);

        System.out.println("候选人: " + candidateResponse);
        System.out.println("面试官: " + agentResponse);
        System.out.println("---");
    }

    // 演示基于目标的智能体
    private void demonstrateGoalBasedAgent(InterviewAgent agent) {
        System.out.println("=== 基于目标的智能体演示 ===");
        System.out.println("特点：根据预设目标制定行动计划，能够进行多步推理");

        // 模拟完整的面试对话
        List<String> conversation = List.of(
                "我有3年Java开发经验，熟悉Spring框架",
                "多态性是面向对象的核心特性，通过继承和接口实现，运行时动态绑定",
                "我认为垃圾回收主要是自动管理内存，有标记清除、复制算法等",
                "Spring Boot通过starter和自动配置类实现零配置启动"
        );

        StringBuilder interviewHistory = new StringBuilder();

        for (int i = 0; i < conversation.size(); i++) {
            String response = conversation.get(i);
            interviewHistory.append("第").append(i + 1).append("轮回答: ").append(response).append("\n");

            String agentResponse = agent.conductInterview(response, "Java开发");
            System.out.println("候选人第" + (i + 1) + "轮: " + response);
            System.out.println("面试官第" + (i + 1) + "轮: " + agentResponse);
            System.out.println();
        }

        // 最终评估
        String finalEvaluation = agent.evaluateCandidate(interviewHistory.toString());
        System.out.println("最终评估: " + finalEvaluation);
        System.out.println("---");
    }
}
```

这段程序输‍出结果：     ‌         ‍         ‍         

```plain
▼plain复制代码=== 智能体类型演示 ===

=== 反应式智能体演示 ===
特点：根据输入直接做出反应，不进行复杂推理
候选人: 我对 Java 有基础了解，学过面向对象编程
面试官: 很好，看到您有 Java 基础。让我问您一个基础问题：请解释 Java 中的多态性概念及其实现方式。这是面向对象编程的核心概念之一。
---

=== 基于目标的智能体演示 ===
特点：根据预设目标制定行动计划，能够进行多步推理
候选人第1轮: 我有3年Java开发经验，熟悉Spring框架
面试官第1轮: 很好，3年经验很不错。既然您熟悉Spring框架，我想问一个稍有挑战性的问题：什么是 Spring Boot 的自动配置？它是如何工作的？

候选人第2轮: 多态性是面向对象的核心特性，通过继承和接口实现，运行时动态绑定
面试官第2轮: 回答得很好！您对多态性的理解很准确。让我们继续深入一些：描述 Java 垃圾回收的基本原理和常见算法。

候选人第3轮: 我认为垃圾回收主要是自动管理内存，有标记清除、复制算法等
面试官第3轮: 不错，您对垃圾回收有基本了解。让我们看看您的实际应用能力：解释 Java 中的线程安全问题及其解决方案。

候选人第4轮: Spring Boot通过starter和自动配置类实现零配置启动
面试官第4轮: 很好的回答！您展现出了扎实的Spring Boot理解。基于您的整体表现，我认为您的技术基础很好，对核心概念理解准确。

最终评估: 基于整个面试过程，候选人展现出了良好的Java基础和Spring框架理解。回答涵盖了多态性、垃圾回收、Spring Boot等核心概念，技术深度适中，建议进入下一轮技术面试。
---
```

## 11.2 工具使用（Tool Use）

工具使用是智能体‍的核心‍‍‍‍能力之一，它使得智能体能够‌与外部世界进行交互，‌‌‌‌执行各种具体的‍操作。通过工具，智能体可以访问‍‍‍‍‍数据库、调用 API、执行计算、‍处理文件等，大‍‍‍‍大扩展了其能力边界               ‍‍‍‍                 

在 LangChain4j 中，工具通过 `@Tool` 注解来定义，智能体可以根据需要自动选择和调用合适的工具。工具的设计需要考虑功能单一性、参数明确性和错误处理等方面。

在代码小抄‍‍‍‍‍的智能代码助手中‌‌‌‌，‌我们需要一个能‍‍‍‍够分‍析代码、运行‍‍‍‍代码、‍查找文档和‍‍‍‍优化代码‍的智能体：

```java
▼java复制代码import dev.langchain4j.agent.tool.Tool;
import dev.langchain4j.community.model.dashscope.QwenChatModel;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.service.AiServices;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class ToolUseDemo {
    
    // 代码助手智能体接口
    interface CodeAssistant {
        String helpWithCode(String userRequest);
    }
    
    // 代码分析和处理工具集
    static class CodeTools {
        private Map<String, String> codeSnippets;
        
        public CodeTools() {
            this.codeSnippets = new HashMap<>();
            initializeCodeLibrary();
        }
        
        private void initializeCodeLibrary() {
            // 初始化代码小抄的常用代码片段
            codeSnippets.put("quicksort", """
                public void quickSort(int[] arr, int low, int high) {
                    if (low < high) {
                        int pi = partition(arr, low, high);
                        quickSort(arr, low, pi - 1);
                        quickSort(arr, pi + 1, high);
                    }
                }
                
                private int partition(int[] arr, int low, int high) {
                    int pivot = arr[high];
                    int i = (low - 1);
                    for (int j = low; j < high; j++) {
                        if (arr[j] <= pivot) {
                            i++;
                            int temp = arr[i];
                            arr[i] = arr[j];
                            arr[j] = temp;
                        }
                    }
                    int temp = arr[i + 1];
                    arr[i + 1] = arr[high];
                    arr[high] = temp;
                    return i + 1;
                }
                """);
            
            codeSnippets.put("binarysearch", """
                public int binarySearch(int[] arr, int target) {
                    int left = 0, right = arr.length - 1;
                    while (left <= right) {
                        int mid = left + (right - left) / 2;
                        if (arr[mid] == target) {
                            return mid;
                        } else if (arr[mid] < target) {
                            left = mid + 1;
                        } else {
                            right = mid - 1;
                        }
                    }
                    return -1;
                }
                """);
            
            codeSnippets.put("linkedlist", """
                class ListNode {
                    int val;
                    ListNode next;
                    ListNode(int val) { this.val = val; }
                }
                
                public ListNode reverseList(ListNode head) {
                    ListNode prev = null;
                    ListNode current = head;
                    while (current != null) {
                        ListNode next = current.next;
                        current.next = prev;
                        prev = current;
                        current = next;
                    }
                    return prev;
                }
                """);
        }
        
        @Tool("分析代码的时间复杂度和空间复杂度")
        public String analyzeComplexity(String code) {
            StringBuilder analysis = new StringBuilder();
            analysis.append("代码复杂度分析：\n");
            
            // 简单的复杂度分析逻辑
            if (code.contains("for") && code.contains("while")) {
                analysis.append("时间复杂度：O(n²) - 检测到嵌套循环\n");
            } else if (code.contains("for") || code.contains("while")) {
                analysis.append("时间复杂度：O(n) - 检测到单层循环\n");
            } else if (code.contains("recursion") || code.contains("recursive")) {
                analysis.append("时间复杂度：O(log n) 或更高 - 检测到递归调用\n");
            } else {
                analysis.append("时间复杂度：O(1) - 常数时间操作\n");
            }
            
            // 空间复杂度分析
            if (code.contains("new ") && code.contains("[]")) {
                analysis.append("空间复杂度：O(n) - 创建了新的数组或集合\n");
            } else {
                analysis.append("空间复杂度：O(1) - 只使用常数额外空间\n");
            }
            
            return analysis.toString();
        }
        
        @Tool("从代码小抄库中搜索相关的代码示例")
        public String searchCodeExample(String algorithm) {
            String key = algorithm.toLowerCase().replaceAll("\\s+", "");
            
            if (codeSnippets.containsKey(key)) {
                return "找到相关代码示例：\n" + codeSnippets.get(key);
            }
            
            // 模糊匹配
            for (Map.Entry<String, String> entry : codeSnippets.entrySet()) {
                if (entry.getKey().contains(key) || key.contains(entry.getKey())) {
                    return "找到相似的代码示例：\n" + entry.getValue();
                }
            }
            
            return "抱歉，没有找到相关的代码示例。建议查看算法导航网站获取更多资源。";
        }
        
        @Tool("检查代码中的常见问题和潜在bug")
        public String checkCodeIssues(String code) {
            StringBuilder issues = new StringBuilder();
            issues.append("代码问题检查结果：\n");
            
            int issueCount = 0;
            
            // 检查空指针风险
            if (code.contains(".") && !code.contains("null")) {
                issues.append("⚠️ 潜在空指针风险：建议添加空值检查\n");
                issueCount++;
            }
            
            // 检查资源泄漏
            if (code.contains("new ") && !code.contains("close()") && 
                (code.contains("FileInputStream") || code.contains("Connection"))) {
                issues.append("⚠️ 资源泄漏风险：建议使用try-with-resources语句\n");
                issueCount++;
            }
            
            // 检查异常处理
            if (code.contains("throw") && !code.contains("try")) {
                issues.append("⚠️ 异常处理：建议添加适当的异常处理机制\n");
                issueCount++;
            }
            
            // 检查变量命名
            Pattern pattern = Pattern.compile("\\b[a-z]\\b");
            Matcher matcher = pattern.matcher(code);
            if (matcher.find()) {
                issues.append("💡 代码规范：建议使用有意义的变量名\n");
                issueCount++;
            }
            
            if (issueCount == 0) {
                issues.append("✅ 未发现明显问题，代码质量良好！\n");
            }
            
            return issues.toString();
        }
        
        @Tool("优化代码性能和可读性")
        public String optimizeCode(String code, String optimizationType) {
            StringBuilder optimization = new StringBuilder();
            optimization.append("代码优化建议（").append(optimizationType).append("）：\n");
            
            switch (optimizationType.toLowerCase()) {
                case "performance":
                case "性能":
                    optimization.append("性能优化建议：\n");
                    optimization.append("1. 避免在循环中创建对象\n");
                    optimization.append("2. 使用StringBuilder代替字符串拼接\n");
                    optimization.append("3. 考虑使用缓存减少重复计算\n");
                    optimization.append("4. 选择合适的数据结构（如HashMap vs TreeMap）\n");
                    break;
                    
                case "readability":
                case "可读性":
                    optimization.append("可读性优化建议：\n");
                    optimization.append("1. 添加有意义的注释和文档\n");
                    optimization.append("2. 使用描述性的变量和方法名\n");
                    optimization.append("3. 将复杂逻辑拆分为小方法\n");
                    optimization.append("4. 保持一致的代码格式和缩进\n");
                    break;
                    
                case "memory":
                case "内存":
                    optimization.append("内存优化建议：\n");
                    optimization.append("1. 及时释放不再使用的对象引用\n");
                    optimization.append("2. 使用对象池减少频繁创建销毁\n");
                    optimization.append("3. 选择合适的集合初始容量\n");
                    optimization.append("4. 避免内存泄漏（如监听器未注销）\n");
                    break;
                    
                default:
                    optimization.append("通用优化建议：\n");
                    optimization.append("1. 遵循SOLID原则\n");
                    optimization.append("2. 编写单元测试\n");
                    optimization.append("3. 使用设计模式解决常见问题\n");
                    optimization.append("4. 定期重构改善代码质量\n");
            }
            
            return optimization.toString();
        }
        
        @Tool("执行简单的代码片段并返回结果")
        public String executeCode(String code, String language) {
            // 注意：这是一个简化的代码执行模拟
            // 在实际应用中需要使用安全的沙箱环境
            
            if (!"java".equalsIgnoreCase(language)) {
                return "目前只支持Java代码执行";
            }
            
            try {
                // 模拟代码执行结果
                if (code.contains("System.out.println")) {
                    Pattern pattern = Pattern.compile("System\\.out\\.println\\(\"([^\"]+)\"\\)");
                    Matcher matcher = pattern.matcher(code);
                    if (matcher.find()) {
                        return "执行结果：\n" + matcher.group(1);
                    }
                }
                
                if (code.contains("return")) {
                    return "执行结果：\n代码包含返回语句，需要在完整的方法上下文中执行";
                }
                
                return "执行结果：\n代码执行完成，无输出内容";
                
            } catch (Exception e) {
                return "执行错误：" + e.getMessage();
            }
        }
    }
    
    public static void main(String[] args) {
        ToolUseDemo demo = new ToolUseDemo();
        demo.demonstrateToolUse();
    }
    
    private void demonstrateToolUse() {
        System.out.println("=== 智能体工具使用演示 ===");
        
        // 初始化通义千问模型
        ChatModel model = QwenChatModel.builder()
                .apiKey("your-qwen-api-key")
                .modelName("qwen-max")
                .temperature(0.7f)
                .build();
        
        // 创建代码工具实例
        CodeTools tools = new CodeTools();
        
        // 创建智能代码助手
        CodeAssistant assistant = AiServices.builder(CodeAssistant.class)
                .chatModel(model)
                .tools(tools)
                .build();
        
        // 演示不同类型的工具使用
        demonstrateCodeAnalysis(assistant);
        demonstrateCodeSearch(assistant);
        demonstrateCodeOptimization(assistant);
    }
    
    private void demonstrateCodeAnalysis(CodeAssistant assistant) {
        System.out.println("=== 代码分析工具演示 ===");
        
        String userRequest = "请帮我分析这段快速排序代码的复杂度，并检查是否有问题：" +
                "public void quickSort(int[] arr, int low, int high) { " +
                "if (low < high) { " +
                "int pi = partition(arr, low, high); " +
                "quickSort(arr, low, pi - 1); " +
                "quickSort(arr, pi + 1, high); } }";
        
        String response = assistant.helpWithCode(userRequest);
        
        System.out.println("用户请求: " + userRequest);
        System.out.println("助手回复: " + response);
        System.out.println("---");
    }
    
    private void demonstrateCodeSearch(CodeAssistant assistant) {
        System.out.println("=== 代码搜索工具演示 ===");
        
        String userRequest = "我需要一个二分查找的代码示例，你能帮我找到吗？";
        
        String response = assistant.helpWithCode(userRequest);
        
        System.out.println("用户请求: " + userRequest);
        System.out.println("助手回复: " + response);
        System.out.println("---");
    }
    
    private void demonstrateCodeOptimization(CodeAssistant assistant) {
        System.out.println("=== 代码优化工具演示 ===");
        
        String userRequest = "我的代码运行很慢，请帮我分析性能优化的方向：" +
                "for(int i=0; i<n; i++) { " +
                "String result = \"\"; " +
                "for(int j=0; j<m; j++) { " +
                "result += data[j]; } }";
        
        String response = assistant.helpWithCode(userRequest);
        
        System.out.println("用户请求: " + userRequest);
        System.out.println("助手回复: " + response);
        System.out.println("---");
    }
}
```

这段程序输‍出结果：     ‌         ‍         ‍         

```plain
▼plain复制代码=== 智能体工具使用演示 ===

=== 代码分析工具演示 ===
用户请求: 请帮我分析这段快速排序代码的复杂度，并检查是否有问题：public void quickSort(int[] arr, int low, int high) { if (low < high) { int pi = partition(arr, low, high); quickSort(arr, low, pi - 1); quickSort(arr, pi + 1, high); } }
助手回复: 我来帮您分析这段快速排序代码：

代码复杂度分析：
时间复杂度：O(log n) 或更高 - 检测到递归调用
空间复杂度：O(1) - 只使用常数额外空间

代码问题检查结果：
⚠️ 潜在空指针风险：建议添加空值检查

总体来说，这是一个标准的快速排序实现。平均时间复杂度为O(n log n)，最坏情况下为O(n²)。建议添加数组空值检查以提高代码健壮性。
---

=== 代码搜索工具演示 ===
用户请求: 我需要一个二分查找的代码示例，你能帮我找到吗？
助手回复: 当然可以！我从代码小抄库中为您找到了二分查找的完整实现：

找到相关代码示例：
public int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}

这个实现的时间复杂度是O(log n)，空间复杂度是O(1)，适用于已排序的数组。
---

=== 代码优化工具演示 ===
用户请求: 我的代码运行很慢，请帮我分析性能优化的方向：for(int i=0; i<n; i++) { String result = ""; for(int j=0; j<m; j++) { result += data[j]; } }
助手回复: 我发现您的代码确实存在性能问题，让我为您分析：

代码复杂度分析：
时间复杂度：O(n²) - 检测到嵌套循环
空间复杂度：O(n) - 创建了新的数组或集合

性能优化建议：
1. 避免在循环中创建对象
2. 使用StringBuilder代替字符串拼接
3. 考虑使用缓存减少重复计算
4. 选择合适的数据结构（如HashMap vs TreeMap）

主要问题是在循环中使用字符串拼接（result += data[j]），这会创建大量临时字符串对象。建议改用StringBuilder来提高性能。
---
```

## 11.3 ReAct 智能体实现

ReAct（Reason‍‍‍‍‍ing and Acting）是一种将推理和行‌‌‌‌‌动相结合的智能体架构。它通过"思考-行动-观察‍‍‍‍‍"的循环过程来解决复杂问题，能够在执行过程中动‍‍‍‍‍态调整策略和计划               ‍‍‍‍‍                 

ReAct 智能体的‍‍核心‍‍‍在于将每个决策步骤分解为推理阶段和行动阶‌‌段。在推理阶‌‌‌段，智能体分析当前情况并‍‍制定下一步计划；在行动阶段，‍‍‍智能体执行具‍‍体的操作并观察结果。这种方式使得智能体能‍‍‍‍‍够处理需要多步推理的复杂任务            ‍‍‍                    

在算法导航‍‍‍‍的‍智能学习助手中，我‌‌‌‌们需要一个能够‌根据学‍‍‍‍生的学习进度和理解情‍‍‍‍‍况，动态调整教学策略‍‍‍‍的 ReA‍ct 智能体：             ‍                   

```java
▼java复制代码
import dev.langchain4j.agent.tool.Tool;
import dev.langchain4j.community.model.dashscope.QwenChatModel;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;

import java.util.*;

public class ReActAgentDemo {

    // ReAct 学习助手智能体接口
    interface LearningAssistant {
        @SystemMessage("""
    你是算法导航网站的智能学习助手，使用 ReAct 方法帮助学生学习算法。

    ReAct 流程：
    1. Thought: 分析学生当前状态和需求
    2. Action: 选择合适的教学行动
    3. Observation: 观察学生反馈和学习效果
    4. 重复上述过程直到达成学习目标

    请始终遵循这个思考-行动-观察的循环过程。
    """)
        @UserMessage("""
    学生提问：{{studentQuery}}
    当前学习主题：{{currentTopic}}
    请使用 ReAct 方式进行回答。
    """)
        String teachAlgorithm(@V("studentQuery") String studentQuery, @V("currentTopic") String currentTopic);

    }

    // 算法教学工具集
    static class AlgorithmTeachingTools {
        private Map<String, AlgorithmConcept> concepts;
        private Map<String, List<String>> prerequisites;
        private Map<String, Integer> difficultyLevels;

        public AlgorithmTeachingTools() {
            initializeAlgorithmDatabase();
        }

        private void initializeAlgorithmDatabase() {
            concepts = new HashMap<>();
            prerequisites = new HashMap<>();
            difficultyLevels = new HashMap<>();

            // 初始化算法概念
            concepts.put("排序", new AlgorithmConcept(
                    "排序算法",
                    "将一组数据按照特定顺序重新排列的算法",
                    Arrays.asList("冒泡排序", "选择排序", "插入排序", "快速排序", "归并排序"),
                    "理解数据重排的基本思想，掌握时间复杂度分析"
            ));

            concepts.put("搜索", new AlgorithmConcept(
                    "搜索算法",
                    "在数据结构中查找特定元素的算法",
                    Arrays.asList("线性搜索", "二分搜索", "深度优先搜索", "广度优先搜索"),
                    "掌握不同数据结构的查找方法，理解搜索策略"
            ));

            concepts.put("动态规划", new AlgorithmConcept(
                    "动态规划",
                    "通过将复杂问题分解为子问题来求解的算法思想",
                    Arrays.asList("斐波那契数列", "背包问题", "最长公共子序列", "最短路径"),
                    "理解最优子结构和重叠子问题，掌握状态转移方程"
            ));

            // 设置前置条件
            prerequisites.put("排序", Arrays.asList("数组操作", "循环结构"));
            prerequisites.put("搜索", Arrays.asList("数组操作", "条件判断"));
            prerequisites.put("动态规划", Arrays.asList("递归", "排序", "搜索"));

            // 设置难度等级（1-5）
            difficultyLevels.put("排序", 2);
            difficultyLevels.put("搜索", 2);
            difficultyLevels.put("动态规划", 4);
        }

        @Tool("获取算法概念的详细信息")
        public String getAlgorithmConcept(String algorithmName) {
            AlgorithmConcept concept = concepts.get(algorithmName);
            if (concept == null) {
                return "未找到该算法概念，建议查看算法导航网站的完整目录";
            }

            StringBuilder info = new StringBuilder();
            info.append("算法概念：").append(concept.name).append("\n");
            info.append("定义：").append(concept.definition).append("\n");
            info.append("包含算法：").append(String.join(", ", concept.subAlgorithms)).append("\n");
            info.append("学习目标：").append(concept.learningGoal).append("\n");
            info.append("难度等级：").append(difficultyLevels.get(algorithmName)).append("/5\n");

            return info.toString();
        }

        @Tool("检查学生是否具备学习某算法的前置知识")
        public String checkPrerequisites(String algorithmName, String studentLevel) {
            List<String> required = prerequisites.get(algorithmName);
            if (required == null) {
                return "无法确定前置条件";
            }

            StringBuilder result = new StringBuilder();
            result.append("学习").append(algorithmName).append("需要的前置知识：\n");

            for (String prereq : required) {
                result.append("- ").append(prereq).append("\n");
            }

            // 简单的学生水平评估
            if ("初学者".equals(studentLevel)) {
                result.append("\n建议：作为初学者，请先掌握基础概念再学习此算法");
            } else if ("中级".equals(studentLevel)) {
                result.append("\n评估：您的水平适合学习此算法");
            } else {
                result.append("\n评估：以您的水平，可以深入学习此算法的高级应用");
            }

            return result.toString();
        }

        @Tool("生成个性化的学习计划")
        public String generateLearningPlan(String algorithmName, String timeAvailable, String learningGoal) {
            StringBuilder plan = new StringBuilder();
            plan.append("个性化学习计划 - ").append(algorithmName).append("\n");
            plan.append("可用时间：").append(timeAvailable).append("\n");
            plan.append("学习目标：").append(learningGoal).append("\n\n");

            if (timeAvailable.contains("1周") || timeAvailable.contains("7天")) {
                plan.append("第1-2天：理论学习和概念理解\n");
                plan.append("第3-4天：基础算法实现练习\n");
                plan.append("第5-6天：复杂问题解决和优化\n");
                plan.append("第7天：总结复习和实战测试\n");
            } else if (timeAvailable.contains("3天")) {
                plan.append("第1天：快速理论学习\n");
                plan.append("第2天：重点算法实现\n");
                plan.append("第3天：实战练习和巩固\n");
            } else {
                plan.append("建议分阶段学习：\n");
                plan.append("阶段1：基础概念掌握\n");
                plan.append("阶段2：算法实现练习\n");
                plan.append("阶段3：性能优化和变体\n");
            }

            return plan.toString();
        }

        @Tool("评估学生对算法概念的理解程度")
        public String assessUnderstanding(String algorithmName, String studentResponse) {
            StringBuilder assessment = new StringBuilder();
            assessment.append("理解程度评估 - ").append(algorithmName).append("\n");

            // 关键词分析
            String[] keyWords = {"复杂度", "时间", "空间", "算法", "实现", "优化"};
            int score = 0;

            for (String keyword : keyWords) {
                if (studentResponse.toLowerCase().contains(keyword)) {
                    score += 15;
                }
            }

            // 长度分析
            if (studentResponse.length() > 100) score += 10;
            if (studentResponse.length() > 200) score += 10;

            String level;
            String recommendation;

            if (score >= 70) {
                level = "优秀";
                recommendation = "理解深入，可以学习更高级的算法或优化技巧";
            } else if (score >= 50) {
                level = "良好";
                recommendation = "基本掌握，建议多做练习题巩固理解";
            } else if (score >= 30) {
                level = "一般";
                recommendation = "需要加强理论学习，建议重新阅读基础概念";
            } else {
                level = "需要改进";
                recommendation = "建议从更基础的概念开始学习，循序渐进";
            }

            assessment.append("评估结果：").append(level).append("（").append(score).append("/100）\n");
            assessment.append("建议：").append(recommendation).append("\n");

            return assessment.toString();
        }

        @Tool("推荐相关的练习题和学习资源")
        public String recommendResources(String algorithmName, String difficultyLevel) {
            StringBuilder resources = new StringBuilder();
            resources.append("学习资源推荐 - ").append(algorithmName).append("\n");
            resources.append("难度级别：").append(difficultyLevel).append("\n\n");

            resources.append("推荐练习题：\n");
            if ("排序".equals(algorithmName)) {
                if ("简单".equals(difficultyLevel)) {
                    resources.append("- 冒泡排序实现\n");
                    resources.append("- 选择排序优化\n");
                } else if ("中等".equals(difficultyLevel)) {
                    resources.append("- 快速排序实现\n");
                    resources.append("- 归并排序分析\n");
                } else {
                    resources.append("- 外部排序算法\n");
                    resources.append("- 排序算法稳定性分析\n");
                }
            }

            resources.append("\n相关资源：\n");
            resources.append("- 算法导航可视化演示\n");
            resources.append("- 面试鸭相关面试题\n");
            resources.append("- 编程导航实战项目\n");

            return resources.toString();
        }

        // 算法概念数据类
        static class AlgorithmConcept {
            String name;
            String definition;
            List<String> subAlgorithms;
            String learningGoal;

            AlgorithmConcept(String name, String definition, List<String> subAlgorithms, String learningGoal) {
                this.name = name;
                this.definition = definition;
                this.subAlgorithms = subAlgorithms;
                this.learningGoal = learningGoal;
            }
        }
    }

    public static void main(String[] args) {
        ReActAgentDemo demo = new ReActAgentDemo();
        demo.demonstrateReActAgent();
    }

    private void demonstrateReActAgent() {
        System.out.println("=== ReAct 智能体演示 ===");

        // 初始化通义千问模型
        ChatModel model = QwenChatModel.builder()
                .apiKey("sk-xxxx")
                .modelName("qwen-max")
                .temperature(0.7f)
                .build();

        // 创建教学工具实例
        AlgorithmTeachingTools tools = new AlgorithmTeachingTools();

        // 创建学习助手
        LearningAssistant assistant = AiServices.builder(LearningAssistant.class)
                .chatModel(model)
                .tools(tools)
                .build();

        // 演示 ReAct 智能体的推理和行动过程
        demonstrateReActProcess(assistant);
    }

    private void demonstrateReActProcess(LearningAssistant assistant) {
        System.out.println("=== ReAct 推理-行动循环演示 ===");

        // 模拟学生学习排序算法的完整过程
        String[] studentQueries = {
                "我是编程新手，想学习排序算法，但不知道从哪里开始",
                "我已经了解了冒泡排序的基本概念，现在想学习更高效的排序算法",
                "我实现了快速排序，但对时间复杂度分析还不太理解",
                "我想知道在什么情况下应该选择哪种排序算法"
        };

        String currentTopic = "排序算法";

        for (int i = 0; i < studentQueries.length; i++) {
            System.out.println("=== 学习阶段 " + (i + 1) + " ===");
            System.out.println("学生问题: " + studentQueries[i]);

            String response = assistant.teachAlgorithm(studentQueries[i], currentTopic);

            System.out.println("助手回复: " + response);
            System.out.println();
        }
    }
}
```

这段程序输‍出结果：     ‌         ‍         ‍         

```plain
▼plain复制代码=== ReAct 智能体演示 ===

=== ReAct 推理-行动循环演示 ===

=== 学习阶段 1 ===
学生问题: 我是编程新手，想学习排序算法，但不知道从哪里开始
助手回复: Thought: 学生是编程新手，需要从基础开始，我应该先了解他们的前置知识情况，然后制定合适的学习计划。

Action: 让我先获取排序算法的基本信息，然后检查前置条件。

算法概念：排序算法
定义：将一组数据按照特定顺序重新排列的算法
包含算法：冒泡排序, 选择排序, 插入排序, 快速排序, 归并排序
学习目标：理解数据重排的基本思想，掌握时间复杂度分析
难度等级：2/5

学习排序需要的前置知识：
- 数组操作
- 循环结构

建议：作为初学者，请先掌握基础概念再学习此算法

Observation: 学生需要先掌握基础的数组操作和循环结构。

我建议您按以下步骤开始学习：
1. 先确保掌握数组的基本操作和循环语句
2. 从最简单的冒泡排序开始理解排序的基本思想
3. 逐步学习其他排序算法
4. 理解时间复杂度的概念

您目前对数组操作和循环结构熟悉吗？

=== 学习阶段 2 ===
学生问题: 我已经了解了冒泡排序的基本概念，现在想学习更高效的排序算法
助手回复: Thought: 学生已经掌握了冒泡排序基础，现在可以学习更高效的算法。我需要评估他们的理解程度，然后推荐合适的下一步学习内容。

Action: 很好！您已经有了排序算法的基础。让我为您推荐更高效的排序算法学习资源：

学习资源推荐 - 排序
难度级别：中等

推荐练习题：
- 快速排序实现
- 归并排序分析

相关资源：
- 算法导航可视化演示
- 面试鸭相关面试题
- 编程导航实战项目

Observation: 学生准备学习中级排序算法。

我建议您接下来学习：
1. **快速排序**：平均时间复杂度O(n log n)，是最常用的高效排序算法
2. **归并排序**：稳定的O(n log n)算法，适合大数据集

您更想先学习哪一个？还是希望我为您制定一个详细的学习计划？

=== 学习阶段 3 ===
学生问题: 我实现了快速排序，但对时间复杂度分析还不太理解
助手回复: Thought: 学生已经实现了快速排序，但在时间复杂度分析方面需要帮助。这是一个理论理解的问题，我需要评估他们的理解程度并提供针对性的解释。

Action: 让我评估一下您对快速排序的理解程度，然后针对时间复杂度进行详细解释。

时间复杂度是算法分析的核心概念。对于快速排序：

**最好情况 O(n log n)**：每次分区都能将数组平均分割
- 递归深度：log n
- 每层处理：n个元素
- 总计：n × log n

**最坏情况 O(n²)**：每次分区都极不平衡（如已排序数组）
- 递归深度：n
- 每层处理：n个元素
- 总计：n²

**平均情况 O(n log n)**：大多数情况下的期望性能

您能描述一下您实现的快速排序是如何工作的吗？这样我可以更好地帮您理解复杂度分析。

=== 学习阶段 4 ===
学生问题: 我想知道在什么情况下应该选择哪种排序算法
助手回复: Thought: 这是一个很好的实践性问题，学生想了解如何在实际场景中选择合适的排序算法。我需要提供实用的选择指导。

Action: 这是一个非常实用的问题！让我为您分析不同场景下的最佳选择：

**数据规模考虑：**
- 小数据集（< 50）：插入排序（简单高效）
- 中等数据集（50-10000）：快速排序
- 大数据集（> 10000）：归并排序或堆排序

**稳定性要求：**
- 需要稳定排序：归并排序、插入排序
- 不要求稳定：快速排序、堆排序

**内存限制：**
- 内存受限：原地排序算法（快速排序、堆排序）
- 内存充足：归并排序

**数据特征：**
- 基本有序：插入排序
- 随机分布：快速排序
- 大量重复元素：三路快速排序

**实际建议：**
在面试鸭的题目中，快速排序是最常考的，因为它综合性能最好。在编程导航的项目中，Java的Arrays.sort()实际使用的是优化的快速排序。

您遇到的具体应用场景是什么？我可以给出更精确的建议。
```

## 11.4 自主决策与规划

自主决策与规划是‍智能‍体的高‍‍‍级能力，它使得智能体‌能够在复杂环境中‌制定长期计划并‍动‌‌‌态调整策略。这种能力需要智‍能‍体具备目标分解、路径规划、‍‍‍风险‍评估和适‍应调整等多种技能             ‍‍‍ ‍                           ‍‍‍                       

在剪切助手的‍智能‍‍‍‍工作流管理中，我们‌需要一个能够根据‌‌‌‌用户的‍工作习惯和任务优先级，‍自动‍‍‍‍规划和执行剪切板内‍容处理流程的‍‍‍‍智能体。                ‍‍‍‍                

## 练习题

### 练习题 1（基础）：简单任务执行智能体

创建一个能‍‍‍‍‍够执行基本任务‌‌的‌智‌能体，要‌求‍‍能够‍使用‍工具完‍‍成文件‍‍操作、‍数‍‍据处理等简‍单‍任务‍。               ‍                 

```java
▼java复制代码public class TaskExecutorAgent {
    interface SimpleTaskAgent {
        @SystemMessage("你是文件管理助手，要求能够使用工具完成文件操作、数据处理等简单任务。请使用提供的工具合理完成任务。")
        @UserMessage("任务描述：{{taskDescription}}")
        String executeTask(@V("taskDescription") String taskDescription);
    }
    
    static class FileTools {
        @Tool("读取文件内容")
        public String readFile(String filePath) {
            // 实现文件读取功能
            return null;
        }
        
        @Tool("写入文件内容")
        public String writeFile(String filePath, String content) {
            // 实现文件写入功能
            return null;
        }
    }
    
    // 创建和使用智能体
    public void createAgent() {
        // 实现智能体创建逻辑
    }
}
```

**参考答案：**

```java
▼java复制代码
import dev.langchain4j.agent.tool.Tool;
import dev.langchain4j.community.model.dashscope.QwenChatModel;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.service.AiServices;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

public class TaskExecutorAgent {
    interface SimpleTaskAgent {
        String executeTask(String taskDescription);
    }
    
    static class FileTools {
        @Tool("读取文件内容")
        public String readFile(String filePath) {
            try {
                return Files.readString(Paths.get(filePath));
            } catch (Exception e) {
                return "读取文件失败：" + e.getMessage();
            }
        }
        
        @Tool("写入文件内容")
        public String writeFile(String filePath, String content) {
            try {
                Files.writeString(Paths.get(filePath), content);
                return "文件写入成功：" + filePath;
            } catch (Exception e) {
                return "写入文件失败：" + e.getMessage();
            }
        }
        
        @Tool("列出目录内容")
        public String listDirectory(String dirPath) {
            try {
                List<String> files = Files.list(Paths.get(dirPath))
                        .map(path -> path.getFileName().toString())
                        .collect(Collectors.toList());
                return "目录内容：" + String.join(", ", files);
            } catch (Exception e) {
                return "列出目录失败：" + e.getMessage();
            }
        }
    }
    
    public void createAgent() {
        ChatModel model = QwenChatModel.builder()
                .apiKey("your-api-key")
                .modelName("qwen-max")
                .temperature(0.7f)
                .build();
        
        FileTools tools = new FileTools();
        
        SimpleTaskAgent agent = AiServices.builder(SimpleTaskAgent.class)
                .chatModel(model)
                .tools(tools)
                .build();
        
        // 测试任务执行
        String result = agent.executeTask("请创建一个名为test.txt的文件，内容为'Hello World'");
        System.out.println("执行结果：" + result);
    }
}
```

### 练习题 2（中级）：决策树智能体

实现一个基‍‍‍‍‍于决策树的智能体‌‌‌‌，‌能够根据不同条‍‍‍‍件选‍择不同的行动‍‍‍‍策略，‍并能够学习‍‍‍‍和优化‍决策过程。

```java
▼java复制代码public class DecisionTreeAgent {
    interface DecisionAgent {
        String makeDecision(String situation, String context);
    }
    
    static class DecisionTools {
        private Map<String, DecisionNode> decisionTree;
        
        @Tool("根据条件进行决策")
        public String decide(String condition, String options) {
            // 实现决策逻辑
            return null;
        }
        
        @Tool("更新决策规则")
        public String updateRule(String condition, String action, String feedback) {
            // 实现规则更新逻辑
            return null;
        }
    }
    
    static class DecisionNode {
        String condition;
        String action;
        double confidence;
        
        // 构造函数和方法
    }
}
```

**参考答案：**

```java
▼java复制代码public class DecisionTreeAgent {
    interface DecisionAgent {
        @SystemMessage("你是决策专家，根据输入的情况和上下文做出合理决策。")
        @UserMessage("情况：{{situation}}\n上下文：{{context}}")
        String makeDecision(@V("situation") String situation, @V("context") String context);
    }
    
    static class DecisionTools {
        private Map<String, DecisionNode> decisionTree;
        private Map<String, Integer> ruleUsageCount;
        private Map<String, Double> ruleSuccessRate;
        
        public DecisionTools() {
            this.decisionTree = new HashMap<>();
            this.ruleUsageCount = new HashMap<>();
            this.ruleSuccessRate = new HashMap<>();
            initializeDecisionTree();
        }
        
        private void initializeDecisionTree() {
            decisionTree.put("urgent_task", new DecisionNode("urgent_task", "immediate_action", 0.9));
            decisionTree.put("routine_task", new DecisionNode("routine_task", "scheduled_action", 0.8));
            decisionTree.put("complex_task", new DecisionNode("complex_task", "analyze_and_plan", 0.7));
            decisionTree.put("unknown_task", new DecisionNode("unknown_task", "gather_information", 0.6));
        }
        
        @Tool("根据条件进行决策")
        public String decide(String condition, String options) {
            String key = condition.toLowerCase().replaceAll("\\s+", "_");
            DecisionNode node = decisionTree.get(key);
            
            if (node != null) {
                ruleUsageCount.put(key, ruleUsageCount.getOrDefault(key, 0) + 1);
                return String.format("决策：%s（置信度：%.2f）", node.action, node.confidence);
            }
            
            // 如果没有匹配的规则，选择最相似的
            DecisionNode bestMatch = decisionTree.values().stream()
                    .max((a, b) -> Double.compare(a.confidence, b.confidence))
                    .orElse(decisionTree.get("unknown_task"));
            
            return String.format("默认决策：%s（置信度：%.2f）", bestMatch.action, bestMatch.confidence);
        }
        
        @Tool("更新决策规则")
        public String updateRule(String condition, String action, String feedback) {
            String key = condition.toLowerCase().replaceAll("\\s+", "_");
            boolean isPositive = feedback.contains("成功") || feedback.contains("好") || feedback.contains("正确");
            
            DecisionNode node = decisionTree.get(key);
            if (node != null) {
                // 更新置信度
                double currentRate = ruleSuccessRate.getOrDefault(key, 0.5);
                if (isPositive) {
                    node.confidence = Math.min(0.95, node.confidence + 0.05);
                    ruleSuccessRate.put(key, Math.min(1.0, currentRate + 0.1));
                } else {
                    node.confidence = Math.max(0.1, node.confidence - 0.05);
                    ruleSuccessRate.put(key, Math.max(0.0, currentRate - 0.1));
                }
                
                return String.format("规则已更新：%s -> %s（新置信度：%.2f）", 
                        condition, action, node.confidence);
            } else {
                // 创建新规则
                decisionTree.put(key, new DecisionNode(condition, action, isPositive ? 0.7 : 0.3));
                return String.format("新规则已创建：%s -> %s", condition, action);
            }
        }
        
        @Tool("获取决策统计信息")
        public String getDecisionStats() {
            StringBuilder stats = new StringBuilder();
            stats.append("决策规则统计：\n");
            
            for (Map.Entry<String, DecisionNode> entry : decisionTree.entrySet()) {
                String key = entry.getKey();
                DecisionNode node = entry.getValue();
                int usage = ruleUsageCount.getOrDefault(key, 0);
                double success = ruleSuccessRate.getOrDefault(key, 0.5);
                
                stats.append(String.format("- %s: 使用%d次, 成功率%.2f, 置信度%.2f\n", 
                        node.condition, usage, success, node.confidence));
            }
            
            return stats.toString();
        }
    }
    
    static class DecisionNode {
        String condition;
        String action;
        double confidence;
        
        public DecisionNode(String condition, String action, double confidence) {
            this.condition = condition;
            this.action = action;
            this.confidence = confidence;
        }
    }
    
    public void demonstrateDecisionAgent() {
        ChatModel model = QwenChatModel.builder()
                .apiKey("your-api-key")
                .modelName("qwen-max")
                .temperature(0.7f)
                .build();
        
        DecisionTools tools = new DecisionTools();
        
        DecisionAgent agent = AiServices.builder(DecisionAgent.class)
                .chatModel(model)
                .tools(tools)
                .build();
        
        // 测试决策过程
        String[] situations = {
                "有一个紧急的bug需要修复",
                "需要重构一个复杂的模块",
                "日常的代码审查任务"
        };
        
        for (String situation : situations) {
            String decision = agent.makeDecision(situation, "工作环境");
            System.out.println("情况：" + situation);
            System.out.println("决策：" + decision);
            System.out.println();
        }
    }
}
```

### 练习题 3（高级）：多智能体协作系统

设计一个多‍‍智‍‍‍能体协作系统，‌包‌含不同专业‌‌‌领域‍的智‍能体，能够协‍同完‍‍‍成‍复杂的项目开‍发任务‍。 ‍‍‍               ‍‍‍                

```java
▼java复制代码public class MultiAgentCollaborationSystem {
    interface ProjectManager {
        String coordinateProject(String projectDescription, String requirements);
    }
    
    interface DeveloperAgent {
        String developFeature(String featureSpec);
    }
    
    interface TesterAgent {
        String testFeature(String featureCode);
    }
    
    interface ReviewerAgent {
        String reviewCode(String code);
    }
    
    // 实现多智能体协作逻辑
    public void setupCollaborationSystem() {
        // 创建不同类型的智能体
        // 实现协作机制
        // 处理任务分配和结果汇总
    }
}
```

**参考答案：**

```java
▼java复制代码
import dev.langchain4j.agent.tool.Tool;
import dev.langchain4j.community.model.dashscope.QwenChatModel;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author gulihua
 * @Description
 * @date 2025-07-29 17:11
 */
public class MultiAgentCollaborationSystem {
    interface ProjectManager {
        @SystemMessage("你是项目经理，负责协调整个开发流程，分配任务和跟踪进度。")
        @UserMessage("项目描述：{{projectDescription}}\n项目需求：{{requirements}}")
        String coordinateProject(@V("projectDescription") String projectDescription, @V("requirements") String requirements);
    }

    interface DeveloperAgent {
        @SystemMessage("你是资深开发者，负责功能开发和代码实现。")
        @UserMessage("请根据以下功能说明进行开发：{{featureSpec}}")
        String developFeature(@V("featureSpec") String featureSpec);
    }

    interface TesterAgent {
        @SystemMessage("你是测试工程师，负责功能测试和质量保证。")
        @UserMessage("请对该功能进行测试：{{featureCode}}")
        String testFeature(@V("featureCode") String featureCode);
    }

    interface ReviewerAgent {
        @SystemMessage("你是代码审查专家，负责代码质量检查和优化建议。")
        @UserMessage("请对这段代码进行审查：{{code}}")
        String reviewCode(@V("code") String code);
    }

    static class CollaborationTools {
        private Map<String, TaskStatus> taskBoard;
        private List<String> communicationLog;

        public CollaborationTools() {
            this.taskBoard = new HashMap<>();
            this.communicationLog = new ArrayList<>();
        }

        @Tool("创建新任务")
        public String createTask(String taskId, String description, String assignee) {
            taskBoard.put(taskId, new TaskStatus(taskId, description, assignee, "创建"));
            String message = String.format("任务已创建：%s - %s（分配给：%s）", taskId, description, assignee);
            communicationLog.add(message);
            return message;
        }

        @Tool("更新任务状态")
        public String updateTaskStatus(String taskId, String status, String details) {
            TaskStatus task = taskBoard.get(taskId);
            if (task != null) {
                task.status = status;
                task.details = details;
                task.updateTime = System.currentTimeMillis();

                String message = String.format("任务状态更新：%s -> %s", taskId, status);
                communicationLog.add(message);
                return message;
            }
            return "任务不存在：" + taskId;
        }

        @Tool("获取任务状态")
        public String getTaskStatus(String taskId) {
            TaskStatus task = taskBoard.get(taskId);
            if (task != null) {
                return String.format("任务：%s\n状态：%s\n负责人：%s\n详情：%s",
                        task.id, task.status, task.assignee, task.details);
            }
            return "任务不存在：" + taskId;
        }

        @Tool("发送消息给其他智能体")
        public String sendMessage(String from, String to, String message) {
            String fullMessage = String.format("[%s -> %s]: %s", from, to, message);
            communicationLog.add(fullMessage);
            return "消息已发送：" + fullMessage;
        }

        @Tool("获取通信历史")
        public String getCommunicationHistory() {
            return "通信历史：\n" + String.join("\n", communicationLog);
        }

        static class TaskStatus {
            String id;
            String description;
            String assignee;
            String status;
            String details;
            long updateTime;

            TaskStatus(String id, String description, String assignee, String status) {
                this.id = id;
                this.description = description;
                this.assignee = status;
                this.status = status;
                this.updateTime = System.currentTimeMillis();
                this.details = "";
            }
        }
    }

    public void setupCollaborationSystem() {
        ChatModel model = QwenChatModel.builder()
                .apiKey("your-api-key")
                .modelName("qwen-max")
                .temperature(0.7f)
                .build();

        CollaborationTools tools = new CollaborationTools();

        // 创建项目经理智能体
        ProjectManager pm = AiServices.builder(ProjectManager.class)
                .chatModel(model)
                .tools(tools)
                .build();

        // 创建开发者智能体
        DeveloperAgent developer = AiServices.builder(DeveloperAgent.class)
                .chatModel(model)
                .tools(tools)
                .build();

        // 创建测试者智能体
        TesterAgent tester = AiServices.builder(TesterAgent.class)
                .chatModel(model)
                .tools(tools)
                .build();

        // 创建代码审查者智能体
        ReviewerAgent reviewer = AiServices.builder(ReviewerAgent.class)
                .chatModel(model)
                .tools(tools)
                .build();

        // 模拟协作流程
        demonstrateCollaboration(pm, developer, tester, reviewer);
    }

    private void demonstrateCollaboration(ProjectManager pm, DeveloperAgent developer,
                                          TesterAgent tester, ReviewerAgent reviewer) {
        System.out.println("=== 多智能体协作演示 ===");

        // 项目启动
        String projectDescription = "开发一个用户登录功能，包括用户名密码验证、记住登录状态、忘记密码等功能";
        String requirements = "安全性高、用户体验好、支持多种登录方式";

        System.out.println("项目描述：" + projectDescription);
        System.out.println("需求：" + requirements);
        System.out.println();

        // 项目经理协调
        String coordination = pm.coordinateProject(projectDescription, requirements);
        System.out.println("项目经理协调结果：");
        System.out.println(coordination);
        System.out.println();

        // 开发者开发功能
        String featureSpec = "实现用户名密码登录验证功能，包括输入验证、密码加密、会话管理";
        String development = developer.developFeature(featureSpec);
        System.out.println("开发者开发结果：");
        System.out.println(development);
        System.out.println();

        // 代码审查
        String codeReview = reviewer.reviewCode("登录功能代码实现");
        System.out.println("代码审查结果：");
        System.out.println(codeReview);
        System.out.println();

        // 功能测试
        String testing = tester.testFeature("用户登录功能");
        System.out.println("测试结果：");
        System.out.println(testing);
        System.out.println();
    }
}
```
