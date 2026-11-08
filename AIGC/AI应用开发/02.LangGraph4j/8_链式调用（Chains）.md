---
url: /AIGC/AI应用开发/02.LangGraph4j/8_链式调用（Chains）.md
---
# 8\_链式调用（Chains）

输出解析器是 LangCha‍‍in‍4j ‍‍中负责将大语言模型的文本输出转换为结构化数据‌‌的重要组件。平常‌我们写程序需要将用户‌‌的自然语言查询转换‍‍为系统能理解的结构化数据一样‍，输出解析器帮助我们将 A‍‍I ‍‍的回答转换为程序可以直接使用的格式                          ‍‍      ‍掌握输出解析器‍‍，你就能构建更加智能和实用的 AI 应用      ‍‍‍                          

## 7.1 解析器概念与作用

输出解析器是连接自‍‍然语‍‍言输‍出与程序逻辑的桥梁。大语言‌‌模型生成的是文本‌‌，而我们的应用程‌序‍‍通常需要的是结构化数据，如 ‍‍JSO‍‍N 对象、列表或特‍定格式的字符串                          ‍      ‍‍解‍‍析器的作用就是完成这种转换         ‍   ‍‍                    

### 解析器的核心功能

输出解析器主要承担三个核心‍功能：‍‍‍‍格式指导、内容解析和错误处理。格式指导是指在‌提示词中明确告诉模型‌‌‌‌应该以什么格式输出；内容解析是‍将模型的文本输出转换为程序需要的数‍‍‍‍据结构；错误处理‍则是当解析失败时的补救措施           ‍‍‍‍ ‍                               ‍‍‍‍                     

在面试鸭的题目分析功‍‍‍能中‍‍，我们需要将 AI 对面试题的分析结‌‌‌果解析为包含难度等‌‌级、知识点、参考答案等‍‍‍字段的结构化数据。这就是一个典型‍‍的输出解‍‍‍析应用场景：              ‍‍‍‍‍                              ‍‍                    

首先我们需要引入依赖包：

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

下面是一个‍简单的示例代码： ‌         ‍         ‍         ‍    

```java
▼java复制代码import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.qwen.QwenChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.UserMessage;

// 定义面试题分析结果的数据结构
class InterviewQuestionAnalysis {
    private String difficulty;
    private String[] knowledgePoints;
    private String suggestedAnswer;
    private int estimatedTime;
    
    // 构造函数
    public InterviewQuestionAnalysis(String difficulty, String[] knowledgePoints, 
                                   String suggestedAnswer, int estimatedTime) {
        this.difficulty = difficulty;
        this.knowledgePoints = knowledgePoints;
        this.suggestedAnswer = suggestedAnswer;
        this.estimatedTime = estimatedTime;
    }
    
    // getter 方法
    public String getDifficulty() { return difficulty; }
    public String[] getKnowledgePoints() { return knowledgePoints; }
    public String getSuggestedAnswer() { return suggestedAnswer; }
    public int getEstimatedTime() { return estimatedTime; }
    
    @Override
    public String toString() {
        return String.format("难度: %s, 知识点: %s, 预计时间: %d分钟", 
                           difficulty, String.join(", ", knowledgePoints), estimatedTime);
    }
}

// 面试题分析服务接口
interface QuestionAnalyzer {
    @UserMessage("""
            请分析以下面试题，并按照指定格式输出结果：
            
            面试题：{{question}}
            
            请严格按照以下 JSON 格式输出：
            {
              "difficulty": "初级/中级/高级",
              "knowledgePoints": ["知识点1", "知识点2", "知识点3"],
              "suggestedAnswer": "参考答案的详细描述",
              "estimatedTime": 答题时间（数字，单位分钟）
            }
            
            注意：必须输出有效的 JSON 格式，不要添加任何其他文字。
            """)
    String analyzeQuestion(String question);
}

public class OutputParserBasicExample {
    public static void main(String[] args) {
        // 初始化通义千问模型
        ChatModel model = QwenChatModel.builder()
                .apiKey("your-api-key")
                .modelName("qwen-max")
                .temperature(0.2f) // 低温度确保输出格式稳定
                .build();
        
        // 创建分析服务
        QuestionAnalyzer analyzer = AiServices.create(QuestionAnalyzer.class, model);
        
        // 测试面试题
        String question = "请解释 Java 中的多态性，并给出一个具体的代码示例。";
        
        System.out.println("=== 面试鸭题目分析 ===");
        System.out.println("题目：" + question);
        
        try {
            // 获取 AI 分析结果
            String jsonResult = analyzer.analyzeQuestion(question);
            System.out.println("\nAI 分析结果（JSON 格式）：");
            System.out.println(jsonResult);
            
            // 这里可以进一步解析 JSON 为 Java 对象
            // 实际应用中会使用 JSON 解析库如 Jackson 或 Gson
            System.out.println("\n解析成功！可以将此 JSON 转换为程序对象使用。");
            
        } catch (Exception e) {
            System.out.println("解析失败：" + e.getMessage());
        }
    }
}
```

这段程序输‍‍‍出结果：   ‌ ‌ ‌     ‍  ‍  ‍   ‍   ‍   ‍ ‍    ‍    

```plain
▼plain复制代码=== 面试鸭题目分析 ===
题目：请解释 Java 中的多态性，并给出一个具体的代码示例。

AI 分析结果（JSON 格式）：
{
  "difficulty": "中级",
  "knowledgePoints": ["面向对象编程", "继承", "方法重写", "动态绑定"],
  "suggestedAnswer": "多态性是指同一个接口可以有多种不同的实现方式...",
  "estimatedTime": 8
}

解析成功！可以将此 JSON 转换为程序对象使用。
```

### 解析器的优势

使用输出解析器的主要‍‍‍优势‍‍在于提高了数据的可靠性和程序的健壮‌‌‌性。没有解析器的情‌‌况下，我们只能依赖字‍‍‍符串操作来提取信息，这种方式容易‍‍出错且难‍‍‍以维护。而解析器提供了标准化的处理流‍‍‍程‍‍，能够处理各种边界情况和异常情况             ‍‍                   

## 7.2 结构化输出解析

结构化输出解‍‍‍‍‍析是将 AI 的文本输出‌‌‌‌‌转换为程序中可直接使用的数‍‍‍据‍‍结构。LangCha‍‍‍‍‍in4j 提供了多种内置‍‍‍‍‍的解析器来处理常见的数据格式。

### JSON 输出解析

JSON 是最常‍‍‍‍‍用的结构化数据格式，特别适合表示‌‌‌‌‌复杂的嵌套数据结构。在老鱼简历的‍‍‍‍‍简历分析功能中，我们需要将 AI‍‍‍‍‍ 对简历的评估结果解析为包含多个‍‍‍‍‍维度评分的 JSON 对象：

```java
▼java复制代码import dev.langchain4j.model.output.Response;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.UserMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.annotation.JsonProperty;

// 简历评估结果的数据结构
class ResumeEvaluation {
    @JsonProperty("overall_score")
    private int overallScore;
    
    @JsonProperty("technical_skills")
    private TechnicalSkills technicalSkills;
    
    @JsonProperty("work_experience")
    private WorkExperience workExperience;
    
    @JsonProperty("education_background")
    private EducationBackground educationBackground;
    
    @JsonProperty("improvement_suggestions")
    private String[] improvementSuggestions;
    
    // 内部类定义
    public static class TechnicalSkills {
        private int score;
        private String[] strengths;
        private String[] weaknesses;
        
        // getter 和 setter 方法
        public int getScore() { return score; }
        public void setScore(int score) { this.score = score; }
        public String[] getStrengths() { return strengths; }
        public void setStrengths(String[] strengths) { this.strengths = strengths; }
        public String[] getWeaknesses() { return weaknesses; }
        public void setWeaknesses(String[] weaknesses) { this.weaknesses = weaknesses; }
    }
    
    public static class WorkExperience {
        private int score;
        private String feedback;
        
        public int getScore() { return score; }
        public void setScore(int score) { this.score = score; }
        public String getFeedback() { return feedback; }
        public void setFeedback(String feedback) { this.feedback = feedback; }
    }
    
    public static class EducationBackground {
        private int score;
        private String relevance;
        
        public int getScore() { return score; }
        public void setScore(int score) { this.score = score; }
        public String getRelevance() { return relevance; }
        public void setRelevance(String relevance) { this.relevance = relevance; }
    }
    
    // 主类的 getter 和 setter 方法
    public int getOverallScore() { return overallScore; }
    public void setOverallScore(int overallScore) { this.overallScore = overallScore; }
    public TechnicalSkills getTechnicalSkills() { return technicalSkills; }
    public void setTechnicalSkills(TechnicalSkills technicalSkills) { this.technicalSkills = technicalSkills; }
    public WorkExperience getWorkExperience() { return workExperience; }
    public void setWorkExperience(WorkExperience workExperience) { this.workExperience = workExperience; }
    public EducationBackground getEducationBackground() { return educationBackground; }
    public void setEducationBackground(EducationBackground educationBackground) { this.educationBackground = educationBackground; }
    public String[] getImprovementSuggestions() { return improvementSuggestions; }
    public void setImprovementSuggestions(String[] improvementSuggestions) { this.improvementSuggestions = improvementSuggestions; }
}

// 简历评估服务
interface ResumeEvaluator {
    @UserMessage("""
            请对以下简历进行全面评估，并按照指定的 JSON 格式输出结果：
            
            简历内容：
            {{resume_content}}
            
            目标职位：{{target_position}}
            
            请按照以下 JSON 格式输出评估结果：
            {
              "overall_score": 总体评分（1-100），
              "technical_skills": {
                "score": 技术技能评分（1-100），
                "strengths": ["优势技能1", "优势技能2"],
                "weaknesses": ["薄弱技能1", "薄弱技能2"]
              },
              "work_experience": {
                "score": 工作经验评分（1-100），
                "feedback": "工作经验反馈"
              },
              "education_background": {
                "score": 教育背景评分（1-100），
                "relevance": "与目标职位的相关性描述"
              },
              "improvement_suggestions": ["改进建议1", "改进建议2", "改进建议3"]
            }
            
            请确保输出的是有效的 JSON 格式。
            """)
    String evaluateResume(@V("resume_content") String resume_content, @V("target_position") String target_position);
}

public class JsonOutputParserExample {
    public static void main(String[] args) {
        ChatModel model = QwenChatModel.builder()
                .apiKey("your-api-key")
                .modelName("qwen-max")
                .temperature(0.1f) // 极低温度确保格式一致性
                .build();
        
        ResumeEvaluator evaluator = AiServices.create(ResumeEvaluator.class, model);
        ObjectMapper objectMapper = new ObjectMapper();
        
        // 模拟简历内容
        String resumeContent = """
                程序员鱼皮
                Java 后端开发工程师 | 5年经验
                
                技术技能：
                - 熟练掌握 Java、Spring Boot、MySQL
                - 了解 Redis、Docker、微服务架构
                - 有云开发和前后端分离项目经验
                
                工作经验：
                - 2019-2024：某互联网公司后端开发工程师
                - 负责编程导航和面试鸭等项目的后端开发
                - 参与系统架构设计和性能优化
                
                教育背景：
                - 2015-2019：某大学计算机科学与技术专业，本科
                """;
        
        String targetPosition = "Java 高级开发工程师";
        
        System.out.println("=== 老鱼简历智能评估 ===");
        System.out.println("目标职位：" + targetPosition);
        
        try {
            // 获取评估结果
            String jsonResult = evaluator.evaluateResume(resumeContent, targetPosition);
            System.out.println("\n原始 JSON 结果：");
            System.out.println(jsonResult);
            
            // 解析为 Java 对象
            ResumeEvaluation evaluation = objectMapper.readValue(jsonResult, ResumeEvaluation.class);
            
            System.out.println("\n=== 解析后的结构化结果 ===");
            System.out.println("总体评分：" + evaluation.getOverallScore());
            System.out.println("技术技能评分：" + evaluation.getTechnicalSkills().getScore());
            System.out.println("技术优势：" + String.join(", ", evaluation.getTechnicalSkills().getStrengths()));
            System.out.println("工作经验评分：" + evaluation.getWorkExperience().getScore());
            System.out.println("改进建议：" + String.join("; ", evaluation.getImprovementSuggestions()));
            
        } catch (Exception e) {
            System.out.println("解析失败：" + e.getMessage());
        }
    }
}
```

### 列表输出解析

当我们需要获‍‍‍‍‍取列表形式的数据时，列表‌‌‌‌‌输出解析器就派上用场了。‍‍‍‍‍在算法导航的学习路径生成‍‍‍‍‍功能中，我们需要 AI ‍‍‍‍‍输出一个有序的学习步骤列表：

```java
▼java复制代码import java.util.List;
import java.util.Arrays;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

// 学习路径生成服务
interface LearningPathGenerator {
    @UserMessage("""
            请为学习 {{topic}} 生成一个详细的学习路径。
            
            用户背景：{{user_background}}
            学习目标：{{learning_goal}}
            可用时间：{{available_time}}
            
            请按照以下格式输出学习步骤，每个步骤占一行：
            1. 步骤标题 - 预计时间 - 难度等级 - 简要描述
            2. 步骤标题 - 预计时间 - 难度等级 - 简要描述
            ...
            
            要求：
            - 步骤要循序渐进，难度递增
            - 每个步骤包含具体的学习内容
            - 预计时间要合理
            - 难度等级分为：入门、初级、中级、高级
            """)
    String generateLearningPath(@V("topic") String topic, @V("user_background") String user_background, 
                               @V("learning_goal") String learning_goal, @V("available_time") String available_time);
}

// 学习步骤数据结构
class LearningStep {
    private int stepNumber;
    private String title;
    private String estimatedTime;
    private String difficulty;
    private String description;
    
    public LearningStep(int stepNumber, String title, String estimatedTime, 
                       String difficulty, String description) {
        this.stepNumber = stepNumber;
        this.title = title;
        this.estimatedTime = estimatedTime;
        this.difficulty = difficulty;
        this.description = description;
    }
    
    // getter 方法
    public int getStepNumber() { return stepNumber; }
    public String getTitle() { return title; }
    public String getEstimatedTime() { return estimatedTime; }
    public String getDifficulty() { return difficulty; }
    public String getDescription() { return description; }
    
    @Override
    public String toString() {
        return String.format("第%d步: %s (%s, %s) - %s", 
                           stepNumber, title, estimatedTime, difficulty, description);
    }
}

// 自定义列表解析器
class LearningPathParser {
    private static final Pattern STEP_PATTERN = Pattern.compile(
        "(\\d+)\\. (.+?) - (.+?) - (.+?) - (.+)"
    );
    
    public static List<LearningStep> parseSteps(String rawOutput) {
        String[] lines = rawOutput.split("\n");
        return Arrays.stream(lines)
                .map(String::trim)
                .filter(line -> !line.isEmpty())
                .map(LearningPathParser::parseStep)
                .filter(step -> step != null)
                .toList();
    }
    
    private static LearningStep parseStep(String line) {
        Matcher matcher = STEP_PATTERN.matcher(line);
        if (matcher.matches()) {
            int stepNumber = Integer.parseInt(matcher.group(1));
            String title = matcher.group(2).trim();
            String estimatedTime = matcher.group(3).trim();
            String difficulty = matcher.group(4).trim();
            String description = matcher.group(5).trim();
            
            return new LearningStep(stepNumber, title, estimatedTime, difficulty, description);
        }
        return null;
    }
}

public class ListOutputParserExample {
    public static void main(String[] args) {
        ChatModel model = QwenChatModel.builder()
                .apiKey("your-api-key")
                .modelName("qwen-max")
                .temperature(0.4f)
                .build();
        
        LearningPathGenerator generator = AiServices.create(LearningPathGenerator.class, model);
        
        System.out.println("=== 算法导航学习路径生成 ===");
        
        // 生成学习路径
        String rawPath = generator.generateLearningPath(
                "数据结构与算法",
                "有 Java 基础，但算法基础薄弱",
                "能够解决中等难度的算法题，通过技术面试",
                "每天 2 小时，持续 3 个月"
        );
        
        System.out.println("AI 生成的原始学习路径：");
        System.out.println(rawPath);
        
        // 解析为结构化数据
        List<LearningStep> steps = LearningPathParser.parseSteps(rawPath);
        
        System.out.println("\n=== 解析后的结构化学习路径 ===");
        for (LearningStep step : steps) {
            System.out.println(step);
        }
        
        // 统计信息
        System.out.println("\n=== 学习路径统计 ===");
        System.out.println("总步骤数：" + steps.size());
        
        long advancedSteps = steps.stream()
                .filter(step -> "高级".equals(step.getDifficulty()))
                .count();
        System.out.println("高级难度步骤：" + advancedSteps + " 个");
    }
}
```

这段程序输‍‍‍出结果：   ‌ ‌ ‌     ‍  ‍  ‍   ‍   ‍   ‍ ‍    ‍    

```plain
▼plain复制代码=== 算法导航学习路径生成 ===
AI 生成的原始学习路径：
1. 复习Java基础语法 - 1周 - 入门 - 确保对Java语法和面向对象概念的理解
2. 学习时间复杂度分析 - 3天 - 初级 - 理解Big O记号和算法效率分析
3. 掌握数组和字符串操作 - 1周 - 初级 - 练习基本的数组和字符串算法题
...

=== 解析后的结构化学习路径 ===
第1步: 复习Java基础语法 (1周, 入门) - 确保对Java语法和面向对象概念的理解
第2步: 学习时间复杂度分析 (3天, 初级) - 理解Big O记号和算法效率分析
...

=== 学习路径统计 ===
总步骤数：12
高级难度步骤：3 个
```

## 7.3 自定义输出格式

在实际应用中，我们经‍‍‍‍‍常需要处理特定的输出格式，这时就需要创建‌‌‌‌‌自定义的输出解析器。自定义解析器让我们能‍‍‍‍‍够处理任何格式的输出，并将其转换为程序需‍‍‍‍‍要的数据结构              ‍‍‍‍‍                  

### 创建自定义解析器

在代码小抄的‍代码分‍‍‍‍析功能中，我们需要‌解析 AI 对代码的‌‌‌‌多维‍度分析结果。这些结果可能‍包含代码‍‍‍‍质量评分、潜在问‍题列表、优化建议等多种‍‍‍‍信息：                 ‍‍‍‍               

````java
▼java复制代码import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

// 代码分析结果数据结构
class CodeAnalysisResult {
    private int qualityScore;
    private List<CodeIssue> issues;
    private List<OptimizationSuggestion> suggestions;
    private CodeMetrics metrics;
    
    public CodeAnalysisResult() {
        this.issues = new ArrayList<>();
        this.suggestions = new ArrayList<>();
    }
    
    // 内部类定义
    public static class CodeIssue {
        private String type;
        private String severity;
        private String description;
        private int lineNumber;
        
        public CodeIssue(String type, String severity, String description, int lineNumber) {
            this.type = type;
            this.severity = severity;
            this.description = description;
            this.lineNumber = lineNumber;
        }
        
        // getter 方法
        public String getType() { return type; }
        public String getSeverity() { return severity; }
        public String getDescription() { return description; }
        public int getLineNumber() { return lineNumber; }
        
        @Override
        public String toString() {
            return String.format("[%s] %s (第%d行): %s", severity, type, lineNumber, description);
        }
    }
    
    public static class OptimizationSuggestion {
        private String category;
        private String description;
        private String example;
        
        public OptimizationSuggestion(String category, String description, String example) {
            this.category = category;
            this.description = description;
            this.example = example;
        }
        
        // getter 方法
        public String getCategory() { return category; }
        public String getDescription() { return description; }
        public String getExample() { return example; }
        
        @Override
        public String toString() {
            return String.format("[%s] %s", category, description);
        }
    }
    
    public static class CodeMetrics {
        private int linesOfCode;
        private int complexity;
        private double maintainabilityIndex;
        
        public CodeMetrics(int linesOfCode, int complexity, double maintainabilityIndex) {
            this.linesOfCode = linesOfCode;
            this.complexity = complexity;
            this.maintainabilityIndex = maintainabilityIndex;
        }
        
        // getter 方法
        public int getLinesOfCode() { return linesOfCode; }
        public int getComplexity() { return complexity; }
        public double getMaintainabilityIndex() { return maintainabilityIndex; }
    }
    
    // 主类的 getter 和 setter 方法
    public int getQualityScore() { return qualityScore; }
    public void setQualityScore(int qualityScore) { this.qualityScore = qualityScore; }
    public List<CodeIssue> getIssues() { return issues; }
    public void setIssues(List<CodeIssue> issues) { this.issues = issues; }
    public List<OptimizationSuggestion> getSuggestions() { return suggestions; }
    public void setSuggestions(List<OptimizationSuggestion> suggestions) { this.suggestions = suggestions; }
    public CodeMetrics getMetrics() { return metrics; }
    public void setMetrics(CodeMetrics metrics) { this.metrics = metrics; }
}

// 代码分析服务
interface CodeAnalysisService {
    @UserMessage("""
            请对以下代码进行全面分析，并按照指定格式输出结果：
            
            代码内容：
            ```{{language}}
            {{code}}
            ```
            
            请按照以下格式输出分析结果：
            
            === 质量评分 ===
            QUALITY_SCORE: 数字(1-100)
            
            === 代码问题 ===
            ISSUE: 问题类型|严重程度|问题描述|行号
            ISSUE: 问题类型|严重程度|问题描述|行号
            ...
            
            === 优化建议 ===
            SUGGESTION: 分类|建议描述|示例代码
            SUGGESTION: 分类|建议描述|示例代码
            ...
            
            === 代码指标 ===
            METRICS: 代码行数|复杂度|可维护性指数
            
            请严格按照上述格式输出，每个部分都要包含。
            """)
    String analyzeCode(@V("code") String code, @V("language") String language);
}

// 自定义解析器
class CodeAnalysisParser {
    private static final Pattern QUALITY_PATTERN = Pattern.compile("QUALITY_SCORE: (\\d+)");
    private static final Pattern ISSUE_PATTERN = Pattern.compile("ISSUE: (.+?)\\|(.+?)\\|(.+?)\\|(\\d+)");
    private static final Pattern SUGGESTION_PATTERN = Pattern.compile("SUGGESTION: (.+?)\\|(.+?)\\|(.+)");
    private static final Pattern METRICS_PATTERN = Pattern.compile("METRICS: (\\d+)\\|(\\d+)\\|([\\d.]+)");
    
    public static CodeAnalysisResult parse(String rawOutput) {
        CodeAnalysisResult result = new CodeAnalysisResult();
        
        // 解析质量评分
        Matcher qualityMatcher = QUALITY_PATTERN.matcher(rawOutput);
        if (qualityMatcher.find()) {
            result.setQualityScore(Integer.parseInt(qualityMatcher.group(1)));
        }
        
        // 解析代码问题
        Matcher issueMatcher = ISSUE_PATTERN.matcher(rawOutput);
        while (issueMatcher.find()) {
            String type = issueMatcher.group(1).trim();
            String severity = issueMatcher.group(2).trim();
            String description = issueMatcher.group(3).trim();
            int lineNumber = Integer.parseInt(issueMatcher.group(4));
            
            result.getIssues().add(new CodeAnalysisResult.CodeIssue(type, severity, description, lineNumber));
        }
        
        // 解析优化建议
        Matcher suggestionMatcher = SUGGESTION_PATTERN.matcher(rawOutput);
        while (suggestionMatcher.find()) {
            String category = suggestionMatcher.group(1).trim();
            String description = suggestionMatcher.group(2).trim();
            String example = suggestionMatcher.group(3).trim();
            
            result.getSuggestions().add(new CodeAnalysisResult.OptimizationSuggestion(category, description, example));
        }
        
        // 解析代码指标
        Matcher metricsMatcher = METRICS_PATTERN.matcher(rawOutput);
        if (metricsMatcher.find()) {
            int linesOfCode = Integer.parseInt(metricsMatcher.group(1));
            int complexity = Integer.parseInt(metricsMatcher.group(2));
            double maintainabilityIndex = Double.parseDouble(metricsMatcher.group(3));
            
            result.setMetrics(new CodeAnalysisResult.CodeMetrics(linesOfCode, complexity, maintainabilityIndex));
        }
        
        return result;
    }
}

public class CustomOutputParserExample {
    public static void main(String[] args) {
        ChatModel model = QwenChatModel.builder()
                .apiKey("your-api-key")
                .modelName("qwen-max")
                .temperature(0.2f)
                .build();
        
        CodeAnalysisService service = AiServices.create(CodeAnalysisService.class, model);
        
        // 测试代码
        String testCode = """
                public class UserService {
                    private List<User> users = new ArrayList<>();
                    
                    public User findUser(String name) {
                        for(int i = 0; i < users.size(); i++) {
                            User user = users.get(i);
                            if(user.getName().equals(name)) {
                                return user;
                            }
                        }
                        return null;
                    }
                    
                    public void addUser(User user) {
                        users.add(user);
                    }
                }
                """;
        
        System.out.println("=== 代码小抄智能分析 ===");
        System.out.println("分析代码：");
        System.out.println(testCode);
        
        try {
            // 获取分析结果
            String rawResult = service.analyzeCode(testCode, "java");
            System.out.println("\n原始分析结果：");
            System.out.println(rawResult);
            
            // 使用自定义解析器解析
            CodeAnalysisResult analysis = CodeAnalysisParser.parse(rawResult);
            
            System.out.println("\n=== 解析后的结构化结果 ===");
            System.out.println("代码质量评分：" + analysis.getQualityScore());
            
            System.out.println("\n发现的问题：");
            for (CodeAnalysisResult.CodeIssue issue : analysis.getIssues()) {
                System.out.println("  " + issue);
            }
            
            System.out.println("\n优化建议：");
            for (CodeAnalysisResult.OptimizationSuggestion suggestion : analysis.getSuggestions()) {
                System.out.println("  " + suggestion);
            }
            
            System.out.println("\n代码指标：");
            CodeAnalysisResult.CodeMetrics metrics = analysis.getMetrics();
            if (metrics != null) {
                System.out.println("  代码行数：" + metrics.getLinesOfCode());
                System.out.println("  复杂度：" + metrics.getComplexity());
                System.out.println("  可维护性指数：" + metrics.getMaintainabilityIndex());
            }
            
        } catch (Exception e) {
            System.out.println("分析失败：" + e.getMessage());
        }
    }
}
````

### 模板化输出格式

对于复杂的输出格式，我们可以使用模板化的方法来确保输出的一致性。在剪切助手的内容分类功能中，我们需要对剪切板内容进行多维度的分类和标记：

```java
▼java复制代码// 内容分类结果数据结构
class ContentClassificationResult {
    private String primaryCategory;
    private String[] secondaryCategories;
    private double confidence;
    private String[] tags;
    private String summary;
    private ContentMetadata metadata;
    
    public static class ContentMetadata {
        private String language;
        private int wordCount;
        private String format;
        private boolean containsCode;
        private boolean containsUrl;
        
        // 构造函数和 getter 方法
        public ContentMetadata(String language, int wordCount, String format, 
                             boolean containsCode, boolean containsUrl) {
            this.language = language;
            this.wordCount = wordCount;
            this.format = format;
            this.containsCode = containsCode;
            this.containsUrl = containsUrl;
        }
        
        public String getLanguage() { return language; }
        public int getWordCount() { return wordCount; }
        public String getFormat() { return format; }
        public boolean isContainsCode() { return containsCode; }
        public boolean isContainsUrl() { return containsUrl; }
    }
    
    // 构造函数和 getter 方法
    public ContentClassificationResult() {}
    
    public String getPrimaryCategory() { return primaryCategory; }
    public void setPrimaryCategory(String primaryCategory) { this.primaryCategory = primaryCategory; }
    public String[] getSecondaryCategories() { return secondaryCategories; }
    public void setSecondaryCategories(String[] secondaryCategories) { this.secondaryCategories = secondaryCategories; }
    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }
    public String[] getTags() { return tags; }
    public void setTags(String[] tags) { this.tags = tags; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public ContentMetadata getMetadata() { return metadata; }
    public void setMetadata(ContentMetadata metadata) { this.metadata = metadata; }
}

// 内容分类服务
interface ContentClassifier {
    @UserMessage("""
            请对以下剪切板内容进行智能分类和分析：
            
            内容：
            {{content}}
            
            请按照以下模板格式输出分析结果：
            
            [PRIMARY_CATEGORY]
            主要分类（从以下选择：代码片段、文档资料、网址链接、图片信息、数字数据、其他内容）
            [/PRIMARY_CATEGORY]
            
            [SECONDARY_CATEGORIES]
            次要分类1,次要分类2,次要分类3（最多3个，用逗号分隔）
            [/SECONDARY_CATEGORIES]
            
            [CONFIDENCE]
            置信度（0.0-1.0之间的小数）
            [/CONFIDENCE]
            
            [TAGS]
            标签1,标签2,标签3,标签4（最多5个相关标签，用逗号分隔）
            [/TAGS]
            
            [SUMMARY]
            内容摘要（不超过50字的简要描述）
            [/SUMMARY]
            
            [METADATA]
            语言|字数|格式|是否包含代码|是否包含网址
            [/METADATA]
            
            请严格按照上述模板格式输出，不要添加其他内容。
            """)
    String classifyContent(@V("content") String content);
}

// 模板化解析器
class TemplateOutputParser {
    public static ContentClassificationResult parseClassification(String rawOutput) {
        ContentClassificationResult result = new ContentClassificationResult();
        
        // 解析主要分类
        String primaryCategory = extractSection(rawOutput, "PRIMARY_CATEGORY");
        result.setPrimaryCategory(primaryCategory);
        
        // 解析次要分类
        String secondaryCategoriesText = extractSection(rawOutput, "SECONDARY_CATEGORIES");
        if (secondaryCategoriesText != null && !secondaryCategoriesText.isEmpty()) {
            result.setSecondaryCategories(secondaryCategoriesText.split(","));
        }
        
        // 解析置信度
        String confidenceText = extractSection(rawOutput, "CONFIDENCE");
        if (confidenceText != null) {
            try {
                result.setConfidence(Double.parseDouble(confidenceText.trim()));
            } catch (NumberFormatException e) {
                result.setConfidence(0.5); // 默认值
            }
        }
        
        // 解析标签
        String tagsText = extractSection(rawOutput, "TAGS");
        if (tagsText != null && !tagsText.isEmpty()) {
            result.setTags(tagsText.split(","));
        }
        
        // 解析摘要
        String summary = extractSection(rawOutput, "SUMMARY");
        result.setSummary(summary);
        
        // 解析元数据
        String metadataText = extractSection(rawOutput, "METADATA");
        if (metadataText != null) {
            String[] metaParts = metadataText.split("\\|");
            if (metaParts.length >= 5) {
                String language = metaParts[0].trim();
                int wordCount = Integer.parseInt(metaParts[1].trim());
                String format = metaParts[2].trim();
                boolean containsCode = Boolean.parseBoolean(metaParts[3].trim());
                boolean containsUrl = Boolean.parseBoolean(metaParts[4].trim());
                
                result.setMetadata(new ContentClassificationResult.ContentMetadata(
                    language, wordCount, format, containsCode, containsUrl));
            }
        }
        
        return result;
    }
    
    private static String extractSection(String text, String sectionName) {
        String startTag = "[" + sectionName + "]";
        String endTag = "[/" + sectionName + "]";
        
        int startIndex = text.indexOf(startTag);
        int endIndex = text.indexOf(endTag);
        
        if (startIndex != -1 && endIndex != -1 && endIndex > startIndex) {
            return text.substring(startIndex + startTag.length(), endIndex).trim();
        }
        
        return null;
    }
}

public class TemplateOutputParserExample {
    public static void main(String[] args) {
        ChatModel model = QwenChatModel.builder()
                .apiKey("your-api-key")
                .modelName("qwen-max")
                .temperature(0.3f)
                .build();
        
        ContentClassifier classifier = AiServices.create(ContentClassifier.class, model);
        
        // 测试不同类型的内容
        String[] testContents = {
                "public void quickSort(int[] arr, int low, int high) { /* 快速排序实现 */ }",
                "https://www.codefather.cn - 编程导航，程序员学习成长社区",
                "明天下午3点在会议室A讨论编程导航新功能开发计划，参会人员包括程序员鱼皮等技术团队成员。"
        };
        
        System.out.println("=== 剪切助手智能内容分类 ===");
        
        for (int i = 0; i < testContents.length; i++) {
            String content = testContents[i];
            System.out.println("\n--- 测试内容 " + (i + 1) + " ---");
            System.out.println("内容：" + content);
            
            try {
                // 获取分类结果
                String rawResult = classifier.classifyContent(content);
                System.out.println("\n原始分类结果：");
                System.out.println(rawResult);
                
                // 解析结果
                ContentClassificationResult result = TemplateOutputParser.parseClassification(rawResult);
                
                System.out.println("\n解析后的结果：");
                System.out.println("主要分类：" + result.getPrimaryCategory());
                System.out.println("次要分类：" + String.join(", ", result.getSecondaryCategories()));
                System.out.println("置信度：" + result.getConfidence());
                System.out.println("标签：" + String.join(", ", result.getTags()));
                System.out.println("摘要：" + result.getSummary());
                
                if (result.getMetadata() != null) {
                    ContentClassificationResult.ContentMetadata meta = result.getMetadata();
                    System.out.println("元数据：语言=" + meta.getLanguage() + 
                                     ", 字数=" + meta.getWordCount() + 
                                     ", 包含代码=" + meta.isContainsCode());
                }
                
            } catch (Exception e) {
                System.out.println("分类失败：" + e.getMessage());
            }
        }
    }
}
```

## 7.4 错误处理与重试机制

在实际应用中，输出解析可能会因为各种原因失败，如模型输出格式不正确、网络问题、或者解析逻辑错误。建立完善的错误处理和重试机制是构建稳定 AI 应用的关键。

### 解析错误处理

当解析失败时，我们需要能够识别错误类型并采取相应的处理措施。在面试鸭的自动评分功能中，解析错误可能会影响面试结果的准确性，因此需要特别谨慎：

````java
▼java复制代码import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

// 面试回答评分结果
class InterviewScore {
    private int technicalScore;
    private int communicationScore;
    private int problemSolvingScore;
    private String feedback;
    private String[] strengths;
    private String[] improvements;
    
    // 构造函数和 getter/setter 方法
    public InterviewScore() {}
    
    public int getTechnicalScore() { return technicalScore; }
    public void setTechnicalScore(int technicalScore) { this.technicalScore = technicalScore; }
    public int getCommunicationScore() { return communicationScore; }
    public void setCommunicationScore(int communicationScore) { this.communicationScore = communicationScore; }
    public int getProblemSolvingScore() { return problemSolvingScore; }
    public void setProblemSolvingScore(int problemSolvingScore) { this.problemSolvingScore = problemSolvingScore; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    public String[] getStrengths() { return strengths; }
    public void setStrengths(String[] strengths) { this.strengths = strengths; }
    public String[] getImprovements() { return improvements; }
    public void setImprovements(String[] improvements) { this.improvements = improvements; }
    
    public int getOverallScore() {
        return (technicalScore + communicationScore + problemSolvingScore) / 3;
    }
}

// 面试评分服务
interface InterviewScorer {
    @UserMessage("""
            请对以下面试回答进行评分：
            
            面试问题：{{question}}
            候选人回答：{{answer}}
            职位要求：{{position_requirements}}
            
            请按照以下 JSON 格式输出评分结果：
            {
              "technical_score": 技术能力评分(0-100),
              "communication_score": 沟通表达评分(0-100),
              "problem_solving_score": 问题解决能力评分(0-100),
              "feedback": "详细反馈意见",
              "strengths": ["优势1", "优势2"],
              "improvements": ["改进建议1", "改进建议2"]
            }
            
            评分要客观公正，反馈要具体有用。
            """)
    String scoreAnswer(@V("question") String question, @V("answer") String answer, @V("position_requirements") String position_requirements);
}

// 带错误处理的解析器
class RobustInterviewScoreParser {
    private static final ObjectMapper objectMapper = new ObjectMapper();
    
    public static class ParseResult {
        private final boolean success;
        private final InterviewScore score;
        private final String errorMessage;
        private final ParseErrorType errorType;
        
        public ParseResult(InterviewScore score) {
            this.success = true;
            this.score = score;
            this.errorMessage = null;
            this.errorType = null;
        }
        
        public ParseResult(String errorMessage, ParseErrorType errorType) {
            this.success = false;
            this.score = null;
            this.errorMessage = errorMessage;
            this.errorType = errorType;
        }
        
        public boolean isSuccess() { return success; }
        public InterviewScore getScore() { return score; }
        public String getErrorMessage() { return errorMessage; }
        public ParseErrorType getErrorType() { return errorType; }
    }
    
    public enum ParseErrorType {
        INVALID_JSON,
        MISSING_FIELDS,
        INVALID_SCORE_RANGE,
        NETWORK_ERROR,
        UNKNOWN_ERROR
    }
    
    public static ParseResult parseWithErrorHandling(String jsonOutput) {
        try {
            // 清理输出内容
            String cleanedJson = cleanJsonOutput(jsonOutput);
            
            // 尝试解析 JSON
            var jsonNode = objectMapper.readTree(cleanedJson);
            
            // 验证必需字段
            if (!hasRequiredFields(jsonNode)) {
                return new ParseResult("缺少必需的评分字段", ParseErrorType.MISSING_FIELDS);
            }
            
            // 创建评分对象
            InterviewScore score = new InterviewScore();
            
            // 解析和验证评分
            int techScore = jsonNode.get("technical_score").asInt();
            int commScore = jsonNode.get("communication_score").asInt();
            int problemScore = jsonNode.get("problem_solving_score").asInt();
            
            if (!isValidScore(techScore) || !isValidScore(commScore) || !isValidScore(problemScore)) {
                return new ParseResult("评分超出有效范围 (0-100)", ParseErrorType.INVALID_SCORE_RANGE);
            }
            
            score.setTechnicalScore(techScore);
            score.setCommunicationScore(commScore);
            score.setProblemSolvingScore(problemScore);
            score.setFeedback(jsonNode.get("feedback").asText());
            
            // 解析数组字段
            if (jsonNode.has("strengths")) {
                String[] strengths = objectMapper.convertValue(
                    jsonNode.get("strengths"), String[].class);
                score.setStrengths(strengths);
            }
            
            if (jsonNode.has("improvements")) {
                String[] improvements = objectMapper.convertValue(
                    jsonNode.get("improvements"), String[].class);
                score.setImprovements(improvements);
            }
            
            return new ParseResult(score);
            
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            return new ParseResult("JSON 格式错误: " + e.getMessage(), ParseErrorType.INVALID_JSON);
        } catch (Exception e) {
            return new ParseResult("未知解析错误: " + e.getMessage(), ParseErrorType.UNKNOWN_ERROR);
        }
    }
    
    private static String cleanJsonOutput(String rawOutput) {
        // 移除可能的 markdown 代码块标记
        String cleaned = rawOutput.replaceAll("```json", "").replaceAll("```", "");
        
        // 移除前后空白
        cleaned = cleaned.trim();
        
        // 如果输出包含多余的文本，尝试提取 JSON 部分
        int jsonStart = cleaned.indexOf("{");
        int jsonEnd = cleaned.lastIndexOf("}");
        
        if (jsonStart != -1 && jsonEnd != -1 && jsonEnd > jsonStart) {
            cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
        }
        
        return cleaned;
    }
    
    private static boolean hasRequiredFields(com.fasterxml.jackson.databind.JsonNode jsonNode) {
        return jsonNode.has("technical_score") && 
               jsonNode.has("communication_score") && 
               jsonNode.has("problem_solving_score") && 
               jsonNode.has("feedback");
    }
    
    private static boolean isValidScore(int score) {
        return score >= 0 && score <= 100;
    }
}

// 带重试机制的评分服务
class RetryableInterviewScorer {
    private final InterviewScorer scorer;
    private final int maxRetries;
    private final long retryDelayMs;
    
    public RetryableInterviewScorer(InterviewScorer scorer, int maxRetries, long retryDelayMs) {
        this.scorer = scorer;
        this.maxRetries = maxRetries;
        this.retryDelayMs = retryDelayMs;
    }
    
    public CompletableFuture<InterviewScore> scoreWithRetry(String question, String answer, String requirements) {
        return CompletableFuture.supplyAsync(() -> {
            RobustInterviewScoreParser.ParseResult lastResult = null;
            
            for (int attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    System.out.println("尝试评分，第 " + attempt + " 次...");
                    
                    // 调用评分服务
                    String rawOutput = scorer.scoreAnswer(question, answer, requirements);
                    
                    // 解析结果
                    RobustInterviewScoreParser.ParseResult result = 
                        RobustInterviewScoreParser.parseWithErrorHandling(rawOutput);
                    
                    if (result.isSuccess()) {
                        System.out.println("评分成功！");
                        return result.getScore();
                    }
                    
                    lastResult = result;
                    System.out.println("解析失败: " + result.getErrorMessage());
                    
                    // 根据错误类型决定是否重试
                    if (!shouldRetry(result.getErrorType())) {
                        break;
                    }
                    
                    // 等待后重试
                    if (attempt < maxRetries) {
                        try {
                            Thread.sleep(retryDelayMs * attempt); // 指数退避
                        } catch (InterruptedException e) {
                            Thread.currentThread().interrupt();
                            throw new RuntimeException("重试被中断", e);
                        }
                    }
                    
                } catch (Exception e) {
                    System.out.println("评分过程出错: " + e.getMessage());
                    if (attempt == maxRetries) {
                        throw new RuntimeException("评分失败，已达到最大重试次数", e);
                    }
                }
            }
            
            // 所有重试都失败了
            String errorMsg = lastResult != null ? lastResult.getErrorMessage() : "未知错误";
            throw new RuntimeException("评分失败: " + errorMsg);
        });
    }
    
    private boolean shouldRetry(RobustInterviewScoreParser.ParseErrorType errorType) {
        // 某些错误类型不适合重试
        return errorType != RobustInterviewScoreParser.ParseErrorType.INVALID_SCORE_RANGE;
    }
}

public class ErrorHandlingExample {
    public static void main(String[] args) {
        ChatModel model = QwenChatModel.builder()
                .apiKey("your-api-key")
                .modelName("qwen-max")
                .temperature(0.3f)
                .build();
        
        InterviewScorer basicScorer = AiServices.create(InterviewScorer.class, model);
        RetryableInterviewScorer robustScorer = new RetryableInterviewScorer(basicScorer, 3, 1000);
        
        System.out.println("=== 面试鸭智能评分系统 ===");
        
        String question = "请解释 Java 中的垃圾回收机制";
        String answer = "Java 的垃圾回收是自动内存管理机制，主要负责回收不再使用的对象。" +
                       "常见的垃圾回收器有 Serial GC、Parallel GC、G1 GC 等。" +
                       "垃圾回收的过程包括标记和清除两个阶段。";
        String requirements = "Java 后端开发工程师，要求熟悉 JVM 原理";
        
        try {
            // 使用带重试机制的评分
            CompletableFuture<InterviewScore> futureScore = robustScorer.scoreWithRetry(question, answer, requirements);
            
            InterviewScore score = futureScore.get(30, TimeUnit.SECONDS);
            
            System.out.println("\n=== 评分结果 ===");
            System.out.println("技术能力评分：" + score.getTechnicalScore());
            System.out.println("沟通表达评分：" + score.getCommunicationScore());
            System.out.println("问题解决能力评分：" + score.getProblemSolvingScore());
            System.out.println("综合评分：" + score.getOverallScore());
            System.out.println("反馈意见：" + score.getFeedback());
            
            if (score.getStrengths() != null) {
                System.out.println("优势：" + String.join(", ", score.getStrengths()));
            }
            
            if (score.getImprovements() != null) {
                System.out.println("改进建议：" + String.join(", ", score.getImprovements()));
            }
            
        } catch (Exception e) {
            System.out.println("评分失败：" + e.getMessage());
        }
    }
}
````

### 重试策略优化

不同类型的错误需要不同的重试策略。网络错误通常适合立即重试，而格式错误可能需要调整提示词后再重试。在算法导航的代码执行结果解析中，我们需要根据错误类型采用不同的处理策略：

````java
▼java复制代码import java.util.concurrent.ThreadLocalRandom;

// 代码执行结果数据结构
class CodeExecutionResult {
    private boolean success;
    private String output;
    private String errorMessage;
    private long executionTime;
    private int memoryUsage;
    
    // 构造函数和 getter/setter 方法
    public CodeExecutionResult() {}
    
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getOutput() { return output; }
    public void setOutput(String output) { this.output = output; }
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    public long getExecutionTime() { return executionTime; }
    public void setExecutionTime(long executionTime) { this.executionTime = executionTime; }
    public int getMemoryUsage() { return memoryUsage; }
    public void setMemoryUsage(int memoryUsage) { this.memoryUsage = memoryUsage; }
}

// 智能重试策略
class SmartRetryStrategy {
    private final int maxRetries;
    private final long baseDelayMs;
    private final double backoffMultiplier;
    private final long maxDelayMs;
    
    public SmartRetryStrategy(int maxRetries, long baseDelayMs, double backoffMultiplier, long maxDelayMs) {
        this.maxRetries = maxRetries;
        this.baseDelayMs = baseDelayMs;
        this.backoffMultiplier = backoffMultiplier;
        this.maxDelayMs = maxDelayMs;
    }
    
    public <T> T executeWithRetry(RetryableOperation<T> operation, String operationName) throws Exception {
        Exception lastException = null;
        
        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                System.out.println("执行 " + operationName + "，第 " + attempt + " 次尝试");
                return operation.execute();
                
            } catch (Exception e) {
                lastException = e;
                System.out.println("第 " + attempt + " 次尝试失败: " + e.getMessage());
                
                // 判断是否应该重试
                if (!shouldRetry(e, attempt)) {
                    break;
                }
                
                // 计算延迟时间
                if (attempt < maxRetries) {
                    long delay = calculateDelay(attempt);
                    System.out.println("等待 " + delay + "ms 后重试...");
                    
                    try {
                        Thread.sleep(delay);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException("重试被中断", ie);
                    }
                }
            }
        }
        
        throw new RuntimeException("操作失败，已达到最大重试次数 (" + maxRetries + ")", lastException);
    }
    
    private boolean shouldRetry(Exception e, int attempt) {
        String errorMessage = e.getMessage().toLowerCase();
        
        // 网络相关错误，适合重试
        if (errorMessage.contains("timeout") || 
            errorMessage.contains("connection") || 
            errorMessage.contains("network")) {
            return true;
        }
        
        // 临时服务错误，适合重试
        if (errorMessage.contains("service unavailable") || 
            errorMessage.contains("rate limit")) {
            return true;
        }
        
        // JSON 格式错误，前几次可以重试
        if (errorMessage.contains("json") && attempt <= 2) {
            return true;
        }
        
        // 其他错误类型不重试
        return false;
    }
    
    private long calculateDelay(int attempt) {
        // 指数退避 + 随机抖动
        long delay = (long) (baseDelayMs * Math.pow(backoffMultiplier, attempt - 1));
        
        // 添加随机抖动，避免雷群效应
        double jitter = ThreadLocalRandom.current().nextDouble(0.5, 1.5);
        delay = (long) (delay * jitter);
        
        // 限制最大延迟
        return Math.min(delay, maxDelayMs);
    }
    
    @FunctionalInterface
    public interface RetryableOperation<T> {
        T execute() throws Exception;
    }
}

// 代码执行解析服务
interface CodeExecutionParser {
    @UserMessage("""
            请解析以下代码执行信息并输出结构化结果：
            
            代码：
            ```{{language}}
            {{code}}
            ```
            
            执行输出：{{execution_output}}
            错误信息：{{error_info}}
            
            请按照以下 JSON 格式输出：
            {
              "success": 是否执行成功(true/false),
              "output": "程序输出内容",
              "error_message": "错误信息（如果有）",
              "execution_time": 执行时间毫秒数,
              "memory_usage": 内存使用量KB
            }
            """)
    String parseExecution(@V("code")String code, @V("language")String language, @V("execution_output") String execution_output, @V("error_info") String error_info);
}

public class SmartRetryExample {
    public static void main(String[] args) {
        ChatModel model = QwenChatModel.builder()
                .apiKey("your-api-key")
                .modelName("qwen-max")
                .temperature(0.2f)
                .build();
        
        CodeExecutionParser parser = AiServices.create(CodeExecutionParser.class, model);
        SmartRetryStrategy retryStrategy = new SmartRetryStrategy(3, 1000, 2.0, 10000);
        ObjectMapper objectMapper = new ObjectMapper();
        
        System.out.println("=== 算法导航代码执行解析 ===");
        
        String code = """
                public class QuickSort {
                    public static void quickSort(int[] arr, int low, int high) {
                        if (low < high) {
                            int pi = partition(arr, low, high);
                            quickSort(arr, low, pi - 1);
                            quickSort(arr, pi + 1, high);
                        }
                    }
                    
                    public static void main(String[] args) {
                        int[] arr = {64, 34, 25, 12, 22, 11, 90};
                        quickSort(arr, 0, arr.length - 1);
                        System.out.println(Arrays.toString(arr));
                    }
                }
                """;
        
        String executionOutput = "[11, 12, 22, 25, 34, 64, 90]";
        String errorInfo = "";
        
        try {
            // 使用智能重试策略执行解析
            CodeExecutionResult result = retryStrategy.executeWithRetry(() -> {
                String jsonResult = parser.parseExecution(code, "java", executionOutput, errorInfo);
                
                // 解析 JSON
                CodeExecutionResult parsedResult = objectMapper.readValue(jsonResult, CodeExecutionResult.class);
                
                // 验证结果的合理性
                if (parsedResult.getExecutionTime() < 0 || parsedResult.getMemoryUsage() < 0) {
                    throw new RuntimeException("解析结果数据异常");
                }
                
                return parsedResult;
                
            }, "代码执行结果解析");
            
            System.out.println("\n=== 解析成功 ===");
            System.out.println("执行成功：" + result.isSuccess());
            System.out.println("程序输出：" + result.getOutput());
            System.out.println("执行时间：" + result.getExecutionTime() + "ms");
            System.out.println("内存使用：" + result.getMemoryUsage() + "KB");
            
            if (!result.isSuccess() && result.getErrorMessage() != null) {
                System.out.println("错误信息：" + result.getErrorMessage());
            }
            
        } catch (Exception e) {
            System.out.println("解析最终失败：" + e.getMessage());
        }
    }
}
````

这段程序输出结果：

```plain
▼plain复制代码=== 算法导航代码执行解析 ===
执行 代码执行结果解析，第 1 次尝试

=== 解析成功 ===
执行成功：true
程序输出：[11, 12, 22, 25, 34, 64, 90]
执行时间：15ms
内存使用：256KB
```

## 7.5 解析器实践

在实际开发中，遵循一些最佳实践能够显著提高输出解析器的可靠性和维护性。这些实践是从大量项目经验中总结出来的，适用于各种应用场景。

### 设计原则

优秀的输出解析器应该遵循几个核心设计原则。首先是明确性原则，提示词要清晰地说明期望的输出格式，不能有歧义。其次是容错性原则，解析器要能处理各种异常情况，包括格式错误、缺失字段等。还有就是可扩展性原则，设计时要考虑未来可能的需求变化。

在代码小抄的多语言代码分析功能中，我们需要设计一个能够处理多种编程语言的通用解析器：

````java
▼java复制代码// 通用代码分析结果
class UniversalCodeAnalysis {
    private String language;
    private AnalysisMetrics metrics;
    private List<CodeIssue> issues;
    private List<Suggestion> suggestions;
    private LanguageSpecificInfo languageInfo;
    
    public static class AnalysisMetrics {
        private int linesOfCode;
        private int complexity;
        private double maintainabilityIndex;
        private int testCoverage;
        
        public AnalysisMetrics(int linesOfCode, int complexity, double maintainabilityIndex, int testCoverage) {
            this.linesOfCode = linesOfCode;
            this.complexity = complexity;
            this.maintainabilityIndex = maintainabilityIndex;
            this.testCoverage = testCoverage;
        }
        
        // getter 方法
        public int getLinesOfCode() { return linesOfCode; }
        public int getComplexity() { return complexity; }
        public double getMaintainabilityIndex() { return maintainabilityIndex; }
        public int getTestCoverage() { return testCoverage; }
    }
    
    public static class CodeIssue {
        private String category;
        private String severity;
        private String description;
        private String location;
        private String suggestion;
        
        public CodeIssue(String category, String severity, String description, String location, String suggestion) {
            this.category = category;
            this.severity = severity;
            this.description = description;
            this.location = location;
            this.suggestion = suggestion;
        }
        
        // getter 方法
        public String getCategory() { return category; }
        public String getSeverity() { return severity; }
        public String getDescription() { return description; }
        public String getLocation() { return location; }
        public String getSuggestion() { return suggestion; }
    }
    
    public static class Suggestion {
        private String type;
        private String description;
        private String example;
        private int priority;
        
        public Suggestion(String type, String description, String example, int priority) {
            this.type = type;
            this.description = description;
            this.example = example;
            this.priority = priority;
        }
        
        // getter 方法
        public String getType() { return type; }
        public String getDescription() { return description; }
        public String getExample() { return example; }
        public int getPriority() { return priority; }
    }
    
    public static class LanguageSpecificInfo {
        private Map<String, Object> specificMetrics;
        
        public LanguageSpecificInfo() {
            this.specificMetrics = new HashMap<>();
        }
        
        public void addMetric(String key, Object value) {
            specificMetrics.put(key, value);
        }
        
        public Object getMetric(String key) {
            return specificMetrics.get(key);
        }
        
        public Map<String, Object> getSpecificMetrics() { return specificMetrics; }
    }
    
    // 构造函数和 getter/setter 方法
    public UniversalCodeAnalysis() {
        this.issues = new ArrayList<>();
        this.suggestions = new ArrayList<>();
        this.languageInfo = new LanguageSpecificInfo();
    }
    
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public AnalysisMetrics getMetrics() { return metrics; }
    public void setMetrics(AnalysisMetrics metrics) { this.metrics = metrics; }
    public List<CodeIssue> getIssues() { return issues; }
    public void setIssues(List<CodeIssue> issues) { this.issues = issues; }
    public List<Suggestion> getSuggestions() { return suggestions; }
    public void setSuggestions(List<Suggestion> suggestions) { this.suggestions = suggestions; }
    public LanguageSpecificInfo getLanguageInfo() { return languageInfo; }
    public void setLanguageInfo(LanguageSpecificInfo languageInfo) { this.languageInfo = languageInfo; }
}

// 通用代码分析服务
interface UniversalCodeAnalyzer {
    @UserMessage("""
            请对以下 {{language}} 代码进行全面分析：
            
            ```{{language}}
            {{code}}
            ```
            
            请按照以下 XML 格式输出分析结果（XML 格式比 JSON 更容易解析复杂的嵌套结构）：
            
            <analysis>
                <language>{{language}}</language>
                <metrics>
                    <lines_of_code>代码行数</lines_of_code>
                    <complexity>复杂度评分</complexity>
                    <maintainability>可维护性指数</maintainability>
                    <test_coverage>测试覆盖率估计</test_coverage>
                </metrics>
                <issues>
                    <issue>
                        <category>问题分类</category>
                        <severity>严重程度</severity>
                        <description>问题描述</description>
                        <location>位置信息</location>
                        <suggestion>修复建议</suggestion>
                    </issue>
                    <!-- 更多问题... -->
                </issues>
                <suggestions>
                    <suggestion>
                        <type>建议类型</type>
                        <description>建议描述</description>
                        <example>示例代码</example>
                        <priority>优先级(1-5)</priority>
                    </suggestion>
                    <!-- 更多建议... -->
                </suggestions>
                <language_specific>
                    <!-- 根据不同语言添加特定的分析信息 -->
                </language_specific>
            </analysis>
            
            请确保输出有效的 XML 格式。
            """)
    String analyzeCode(@V("code")String code, @V("language")String language);
}

// XML 解析器（使用 DOM 解析）
class XmlCodeAnalysisParser {
    public static UniversalCodeAnalysis parseXmlAnalysis(String xmlOutput) throws Exception {
        // 清理 XML 输出
        String cleanedXml = cleanXmlOutput(xmlOutput);
        
        // 解析 XML
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document doc = builder.parse(new ByteArrayInputStream(cleanedXml.getBytes("UTF-8")));
        
        UniversalCodeAnalysis analysis = new UniversalCodeAnalysis();
        
        // 解析基本信息
        analysis.setLanguage(getTextContent(doc, "language"));
        
        // 解析指标
        Element metricsElement = (Element) doc.getElementsByTagName("metrics").item(0);
        if (metricsElement != null) {
            int linesOfCode = Integer.parseInt(getTextContent(metricsElement, "lines_of_code"));
            int complexity = Integer.parseInt(getTextContent(metricsElement, "complexity"));
            double maintainability = Double.parseDouble(getTextContent(metricsElement, "maintainability"));
            int testCoverage = Integer.parseInt(getTextContent(metricsElement, "test_coverage"));
            
            analysis.setMetrics(new UniversalCodeAnalysis.AnalysisMetrics(
                linesOfCode, complexity, maintainability, testCoverage));
        }
        
        // 解析问题列表
        NodeList issueNodes = doc.getElementsByTagName("issue");
        for (int i = 0; i < issueNodes.getLength(); i++) {
            Element issueElement = (Element) issueNodes.item(i);
            
            String category = getTextContent(issueElement, "category");
            String severity = getTextContent(issueElement, "severity");
            String description = getTextContent(issueElement, "description");
            String location = getTextContent(issueElement, "location");
            String suggestion = getTextContent(issueElement, "suggestion");
            
            analysis.getIssues().add(new UniversalCodeAnalysis.CodeIssue(
                category, severity, description, location, suggestion));
        }
        
        // 解析建议列表
        NodeList suggestionNodes = doc.getElementsByTagName("suggestion");
        for (int i = 0; i < suggestionNodes.getLength(); i++) {
            Element suggestionElement = (Element) suggestionNodes.item(i);
            
            String type = getTextContent(suggestionElement, "type");
            String description = getTextContent(suggestionElement, "description");
            String example = getTextContent(suggestionElement, "example");
            int priority = Integer.parseInt(getTextContent(suggestionElement, "priority"));
            
            analysis.getSuggestions().add(new UniversalCodeAnalysis.Suggestion(
                type, description, example, priority));
        }
        
        // 解析语言特定信息
        Element languageSpecificElement = (Element) doc.getElementsByTagName("language_specific").item(0);
        if (languageSpecificElement != null) {
            NodeList childNodes = languageSpecificElement.getChildNodes();
            for (int i = 0; i < childNodes.getLength(); i++) {
                if (childNodes.item(i).getNodeType() == Node.ELEMENT_NODE) {
                    Element child = (Element) childNodes.item(i);
                    analysis.getLanguageInfo().addMetric(child.getTagName(), child.getTextContent());
                }
            }
        }
        
        return analysis;
    }
    
    private static String cleanXmlOutput(String rawOutput) {
        // 移除可能的 markdown 代码块标记
        String cleaned = rawOutput.replaceAll("```xml", "").replaceAll("```", "");
        
        // 移除前后空白
        cleaned = cleaned.trim();
        
        // 如果输出包含多余的文本，尝试提取 XML 部分
        int xmlStart = cleaned.indexOf("<analysis>");
        int xmlEnd = cleaned.lastIndexOf("</analysis>");
        
        if (xmlStart != -1 && xmlEnd != -1 && xmlEnd > xmlStart) {
            cleaned = cleaned.substring(xmlStart, xmlEnd + "</analysis>".length());
        }
        
        return cleaned;
    }
    
    private static String getTextContent(Document doc, String tagName) {
        NodeList nodes = doc.getElementsByTagName(tagName);
        if (nodes.getLength() > 0) {
            return nodes.item(0).getTextContent().trim();
        }
        return "";
    }
    
    private static String getTextContent(Element parent, String tagName) {
        NodeList nodes = parent.getElementsByTagName(tagName);
        if (nodes.getLength() > 0) {
            return nodes.item(0).getTextContent().trim();
        }
        return "";
    }
}

public class BestPracticesExample {
    public static void main(String[] args) {
        ChatModel model = QwenChatModel.builder()
                .apiKey("your-api-key")
                .modelName("qwen-max")
                .temperature(0.1f)
                .build();
        
        UniversalCodeAnalyzer analyzer = AiServices.create(UniversalCodeAnalyzer.class, model);
        
        // 测试不同语言的代码
        Map<String, String> testCodes = Map.of(
            "java", """
                    public class Calculator {
                        public int add(int a, int b) {
                            return a + b;
                        }
                        
                        public int divide(int a, int b) {
                            return a / b; // 潜在的除零错误
                        }
                    }
                    """,
            "python", """
                    def fibonacci(n):
                        if n <= 1:
                            return n
                        else:
                            return fibonacci(n-1) + fibonacci(n-2)  # 效率问题
                    
                    print(fibonacci(10))
                    """,
            "javascript", """
                    function processUser(user) {
                        if (user.name) {
                            return user.name.toUpperCase();
                        }
                        return null; // 可能的空指针问题
                    }
                    """
        );
        
        System.out.println("=== 代码小抄多语言分析系统 ===");
        
        for (Map.Entry<String, String> entry : testCodes.entrySet()) {
            String language = entry.getKey();
            String code = entry.getValue();
            
            System.out.println("\n--- " + language.toUpperCase() + " 代码分析 ---");
            
            try {
                // 分析代码
                String xmlResult = analyzer.analyzeCode(code, language);
                System.out.println("原始 XML 结果：");
                System.out.println(xmlResult.substring(0, Math.min(300, xmlResult.length())) + "...");
                
                // 解析结果
                UniversalCodeAnalysis analysis = XmlCodeAnalysisParser.parseXmlAnalysis(xmlResult);
                
                System.out.println("\n解析后的结果：");
                System.out.println("语言：" + analysis.getLanguage());
                
                if (analysis.getMetrics() != null) {
                    UniversalCodeAnalysis.AnalysisMetrics metrics = analysis.getMetrics();
                    System.out.println("代码行数：" + metrics.getLinesOfCode());
                    System.out.println("复杂度：" + metrics.getComplexity());
                    System.out.println("可维护性：" + metrics.getMaintainabilityIndex());
                }
                
                System.out.println("发现问题数：" + analysis.getIssues().size());
                for (UniversalCodeAnalysis.CodeIssue issue : analysis.getIssues()) {
                    System.out.println("  - [" + issue.getSeverity() + "] " + issue.getDescription());
                }
                
                System.out.println("优化建议数：" + analysis.getSuggestions().size());
                for (UniversalCodeAnalysis.Suggestion suggestion : analysis.getSuggestions()) {
                    System.out.println("  - " + suggestion.getDescription() + " (优先级: " + suggestion.getPriority() + ")");
                }
                
            } catch (Exception e) {
                System.out.println("分析失败：" + e.getMessage());
            }
        }
    }
}
````

### 性能优化策略

在处理大量解析任务时，性能优化变得至关重要。我们可以通过缓存、批处理、异步处理等方式来提升解析器的性能。在老鱼简历的批量简历分析功能中，这些优化技术能够显著提升用户体验：

```java
▼java复制代码import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

// 高性能解析器管理器
class HighPerformanceParserManager {
    private final Map<String, Object> parseCache = new ConcurrentHashMap<>();
    private final ScheduledExecutorService executorService = Executors.newSingleThreadScheduledExecutor();
    private final ChatModel model;
    private final long cacheExpirationMs = 30 * 60 * 1000; // 30分钟缓存
    
    // 缓存条目
    static class CacheEntry {
        private final Object data;
        private final long timestamp;
        
        public CacheEntry(Object data) {
            this.data = data;
            this.timestamp = System.currentTimeMillis();
        }
        
        public Object getData() { return data; }
        public boolean isExpired(long expirationMs) {
            return System.currentTimeMillis() - timestamp > expirationMs;
        }
    }
    
    public HighPerformanceParserManager(ChatModel model) {
        this.model = model;
        
        // 启动缓存清理任务
        executorService.scheduleAtFixedRate(this::cleanExpiredCache, 10, 10, TimeUnit.MINUTES);
    }
    
    // 批量简历分析
    public CompletableFuture<List<ResumeAnalysisResult>> analyzeBatchResumes(List<String> resumes) {
        return CompletableFuture.supplyAsync(() -> {
            System.out.println("开始批量分析 " + resumes.size() + " 份简历");
            
            // 并行处理每份简历
            List<CompletableFuture<ResumeAnalysisResult>> futures = resumes.stream()
                    .map(resume -> analyzeResumeAsync(resume))
                    .toList();
            
            // 等待所有分析完成
            CompletableFuture<Void> allOf = CompletableFuture.allOf(
                    futures.toArray(new CompletableFuture[0]));
            
            return allOf.thenApply(v -> 
                    futures.stream()
                            .map(CompletableFuture::join)
                            .toList()
            ).join();
            
        }, executorService);
    }
    
    // 异步单个简历分析
    public CompletableFuture<ResumeAnalysisResult> analyzeResumeAsync(String resumeContent) {
        return CompletableFuture.supplyAsync(() -> {
            // 生成缓存键
            String cacheKey = generateCacheKey(resumeContent);
            
            // 检查缓存
            CacheEntry cachedEntry = (CacheEntry) parseCache.get(cacheKey);
            if (cachedEntry != null && !cachedEntry.isExpired(cacheExpirationMs)) {
                System.out.println("从缓存获取简历分析结果");
                return (ResumeAnalysisResult) cachedEntry.getData();
            }
            
            try {
                // 执行分析
                ResumeAnalysisResult result = performResumeAnalysis(resumeContent);
                
                // 缓存结果
                parseCache.put(cacheKey, new CacheEntry(result));
                
                return result;
                
            } catch (Exception e) {
                throw new RuntimeException("简历分析失败", e);
            }
            
        }, executorService);
    }
    
    private ResumeAnalysisResult performResumeAnalysis(String resumeContent) {
        // 创建简历分析服务
        ResumeAnalysisService service = AiServices.create(ResumeAnalysisService.class, model);
        
        // 调用分析
        String jsonResult = service.analyzeResume(resumeContent);
        
        // 解析结果
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(jsonResult, ResumeAnalysisResult.class);
        } catch (Exception e) {
            throw new RuntimeException("解析分析结果失败", e);
        }
    }
    
    private String generateCacheKey(String content) {
        // 使用内容的哈希值作为缓存键
        return "resume_" + content.hashCode();
    }
    
    private void cleanExpiredCache() {
        parseCache.entrySet().removeIf(entry -> {
            CacheEntry cacheEntry = (CacheEntry) entry.getValue();
            return cacheEntry.isExpired(cacheExpirationMs);
        });
        
        System.out.println("清理过期缓存，当前缓存大小：" + parseCache.size());
    }
    
    public void shutdown() {
        executorService.shutdown();
        try {
            if (!executorService.awaitTermination(60, TimeUnit.SECONDS)) {
                executorService.shutdownNow();
            }
        } catch (InterruptedException e) {
            executorService.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
    
    // 获取性能统计
    public Map<String, Object> getPerformanceStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("cache_size", parseCache.size());
        stats.put("cache_hit_rate", calculateCacheHitRate());
        return stats;
    }
    
    private double calculateCacheHitRate() {
        // 简化的缓存命中率计算
        return parseCache.size() > 0 ? 0.75 : 0.0; // 示例值
    }
}

// 简历分析结果数据结构
class ResumeAnalysisResult {
    private int overallScore;
    private String level;
    private String[] strengths;
    private String[] weaknesses;
    private String[] suggestions;
    
    // 构造函数和 getter/setter 方法
    public ResumeAnalysisResult() {}
    
    public int getOverallScore() { return overallScore; }
    public void setOverallScore(int overallScore) { this.overallScore = overallScore; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public String[] getStrengths() { return strengths; }
    public void setStrengths(String[] strengths) { this.strengths = strengths; }
    public String[] getWeaknesses() { return weaknesses; }
    public void setWeaknesses(String[] weaknesses) { this.weaknesses = weaknesses; }
    public String[] getSuggestions() { return suggestions; }
    public void setSuggestions(String[] suggestions) { this.suggestions = suggestions; }
}

// 简历分析服务接口
interface ResumeAnalysisService {
    @UserMessage("""
            请分析以下简历并给出评估：
            
            {{resume_content}}
            
            请按 JSON 格式输出：
            {
              "overall_score": 总体评分(0-100),
              "level": "水平等级",
              "strengths": ["优势1", "优势2"],
              "weaknesses": ["不足1", "不足2"],
              "suggestions": ["建议1", "建议2"]
            }
            """)
    String analyzeResume(@V("resume_content")String resume_content);
}

public class PerformanceOptimizationExample {
    public static void main(String[] args) {
        ChatModel model = QwenChatModel.builder()
                .apiKey("your-api-key")
                .modelName("qwen-max")
                .temperature(0.3f)
                .build();
        
        HighPerformanceParserManager manager = new HighPerformanceParserManager(model);
        
        // 模拟批量简历数据
        List<String> testResumes = Arrays.asList(
                "程序员鱼皮，Java开发工程师，5年经验，熟悉Spring Boot、MySQL等技术...",
                "小王，前端开发工程师，3年经验，熟悉React、Vue等框架...",
                "小李，Python开发工程师，4年经验，有机器学习项目经验...",
                "小张，全栈开发工程师，6年经验，做过编程导航等大型项目..."
        );
        
        System.out.println("=== 老鱼简历高性能批量分析 ===");
        
        long startTime = System.currentTimeMillis();
        
        try {
            // 执行批量分析
            CompletableFuture<List<ResumeAnalysisResult>> future = manager.analyzeBatchResumes(testResumes);
            
            List<ResumeAnalysisResult> results = future.get(60, TimeUnit.SECONDS);
            
            long endTime = System.currentTimeMillis();
            System.out.println("\n批量分析完成，耗时：" + (endTime - startTime) + "ms");
            
            // 显示结果
            for (int i = 0; i < results.size(); i++) {
                ResumeAnalysisResult result = results.get(i);
                System.out.println("\n简历 " + (i + 1) + " 分析结果：");
                System.out.println("  评分：" + result.getOverallScore());
                System.out.println("  水平：" + result.getLevel());
                if (result.getStrengths() != null) {
                    System.out.println("  优势：" + String.join(", ", result.getStrengths()));
                }
            }
            
            // 显示性能统计
            Map<String, Object> stats = manager.getPerformanceStats();
            System.out.println("\n=== 性能统计 ===");
            stats.forEach((key, value) -> System.out.println(key + ": " + value));
            
            // 测试缓存效果 - 重复分析第一份简历
            System.out.println("\n=== 测试缓存效果 ===");
            long cacheStartTime = System.currentTimeMillis();
            
            CompletableFuture<ResumeAnalysisResult> cachedResult = manager.analyzeResumeAsync(testResumes.get(0));
            cachedResult.get(10, TimeUnit.SECONDS);
            
            long cacheEndTime = System.currentTimeMillis();
            System.out.println("缓存查询耗时：" + (cacheEndTime - cacheStartTime) + "ms");
            
        } catch (Exception e) {
            System.out.println("批量分析失败：" + e.getMessage());
        } finally {
            manager.shutdown();
        }
    }
}
```

通过系统性地掌握输出解析器的各种技术和最佳实践，你就能够构建出高效、可靠的 AI 应用。无论是开发编程导航的智能问答系统，还是优化面试鸭的自动评分功能，优秀的输出解析器都是成功的关键组件。

## 练习题

### 练习题 1（基础）：设计一个简单的 JSON 输出解析器

为剪切助手设计一个文本摘要功能的输出解析器，要求能够解析包含摘要内容、关键词和情感倾向的 JSON 输出。

参考答案：

```java
▼java复制代码class TextSummaryResult {
    private String summary;
    private String[] keywords;
    private String sentiment;
    private int confidence;
    
    // 构造函数和 getter/setter 方法
    public TextSummaryResult() {}
    
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public String[] getKeywords() { return keywords; }
    public void setKeywords(String[] keywords) { this.keywords = keywords; }
    public String getSentiment() { return sentiment; }
    public void setSentiment(String sentiment) { this.sentiment = sentiment; }
    public int getConfidence() { return confidence; }
    public void setConfidence(int confidence) { this.confidence = confidence; }
}

interface TextSummarizer {
    @UserMessage("""
            请对以下文本进行摘要分析：
            
            {{text}}
            
            请按 JSON 格式输出：
            {
              "summary": "文本摘要",
              "keywords": ["关键词1", "关键词2", "关键词3"],
              "sentiment": "positive/negative/neutral",
              "confidence": 置信度(0-100)
            }
            """)
    String summarizeText(@V("text")String text);
}

public static TextSummaryResult parseTextSummary(String jsonOutput) throws Exception {
    ObjectMapper mapper = new ObjectMapper();
    return mapper.readValue(jsonOutput, TextSummaryResult.class);
}
```

### 练习题 2（中级）：实现一个带错误处理的自定义解析器

为算法导航设计一个算法复杂度分析的解析器，要求能够处理多种输出格式错误，并提供合理的默认值。

参考答案：

```java
▼java复制代码class AlgorithmComplexityResult {
    private String timeComplexity;
    private String spaceComplexity;
    private String explanation;
    private int difficultyLevel;
    
    // 构造函数和 getter/setter 方法
    public AlgorithmComplexityResult() {}
    
    public String getTimeComplexity() { return timeComplexity; }
    public void setTimeComplexity(String timeComplexity) { this.timeComplexity = timeComplexity; }
    public String getSpaceComplexity() { return spaceComplexity; }
    public void setSpaceComplexity(String spaceComplexity) { this.spaceComplexity = spaceComplexity; }
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
    public int getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(int difficultyLevel) { this.difficultyLevel = difficultyLevel; }
}

class ComplexityAnalysisParser {
    public static AlgorithmComplexityResult parseWithErrorHandling(String rawOutput) {
        AlgorithmComplexityResult result = new AlgorithmComplexityResult();
        
        try {
            // 尝试 JSON 解析
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(rawOutput);
            
            result.setTimeComplexity(node.has("time_complexity") ? 
                node.get("time_complexity").asText() : "O(n)");
            result.setSpaceComplexity(node.has("space_complexity") ? 
                node.get("space_complexity").asText() : "O(1)");
            result.setExplanation(node.has("explanation") ? 
                node.get("explanation").asText() : "分析结果不完整");
            result.setDifficultyLevel(node.has("difficulty") ? 
                node.get("difficulty").asInt() : 3);
                
        } catch (Exception e) {
            // 解析失败时使用正则表达式提取
            result.setTimeComplexity(extractWithRegex(rawOutput, "时间复杂度[：:]\\s*(O\\([^)]+\\))", "O(n)"));
            result.setSpaceComplexity(extractWithRegex(rawOutput, "空间复杂度[：:]\\s*(O\\([^)]+\\))", "O(1)"));
            result.setExplanation("使用备用解析方法获取的结果");
            result.setDifficultyLevel(3);
        }
        
        return result;
    }
    
    private static String extractWithRegex(String text, String pattern, String defaultValue) {
        Pattern p = Pattern.compile(pattern);
        Matcher m = p.matcher(text);
        return m.find() ? m.group(1) : defaultValue;
    }
}
```

### 练习题 3（高级）：构建一个高性能的批量解析系统

为代码小抄设计一个能够批量处理代码片段分析的高性能解析系统，要求支持缓存、异步处理和错误恢复。

参考答案：

```java
▼java复制代码
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.service.AiServices;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Semaphore;

class BatchCodeAnalysisManager {
    private final Map<String, CacheEntry> cache = new ConcurrentHashMap<>();
    private final ExecutorService executor = Executors.newFixedThreadPool(8);
    private final ChatModel model;
    private final Semaphore rateLimiter = new Semaphore(10); // 限制并发数

    static class CacheEntry {
        private final CodeAnalysisResult result;
        private final long timestamp;

        public CacheEntry(CodeAnalysisResult result) {
            this.result = result;
            this.timestamp = System.currentTimeMillis();
        }

        public CodeAnalysisResult getResult() {
            return result;
        }

        public boolean isExpired() {
            return System.currentTimeMillis() - timestamp > 300000; // 5分钟过期
        }
    }

    public BatchCodeAnalysisManager(ChatModel model) {
        this.model = model;
    }

    public CompletableFuture<List<CodeAnalysisResult>> analyzeBatch(List<String> codeSnippets) {
        List<CompletableFuture<CodeAnalysisResult>> futures = codeSnippets.stream()
                .map(this::analyzeWithCache)
                .toList();

        return CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
                .thenApply(v -> futures.stream()
                        .map(CompletableFuture::join)
                        .toList());
    }

    private CompletableFuture<CodeAnalysisResult> analyzeWithCache(String code) {
        String cacheKey = "code_" + code.hashCode();

        // 检查缓存
        CacheEntry cached = cache.get(cacheKey);
        if (cached != null && !cached.isExpired()) {
            return CompletableFuture.completedFuture(cached.getResult());
        }

        return CompletableFuture.supplyAsync(() -> {
            try {
                rateLimiter.acquire(); // 限流

                // 执行分析
                CodeAnalysisService service = AiServices.create(CodeAnalysisService.class, model);
                String result = service.analyzeCode(code, "java");

                // 解析结果
                CodeAnalysisResult analysisResult = parseAnalysisResult(result);

                // 缓存结果
                cache.put(cacheKey, new CacheEntry(analysisResult));

                return analysisResult;

            } catch (Exception e) {
                // 返回默认结果而不是抛出异常
                return createDefaultResult("分析失败: " + e.getMessage());
            } finally {
                rateLimiter.release();
            }
        }, executor);
    }

    private CodeAnalysisResult parseAnalysisResult(String jsonResult) {
        // 实现解析逻辑
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(jsonResult, CodeAnalysisResult.class);
        } catch (Exception e) {
            return createDefaultResult("解析失败");
        }
    }

    private CodeAnalysisResult createDefaultResult(String error) {
        CodeAnalysisResult result = new CodeAnalysisResult();
        result.setSuccess(false);
        result.setErrorMessage(error);
        return result;
    }

    public void shutdown() {
        executor.shutdown();
    }

    public class CodeAnalysisResult {
        private boolean success;
        private String errorMessage;

        public boolean getSuccess() {
            return this.success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }

        public String getErrorMessage() {
            return this.errorMessage;
        }

        public void setErrorMessage(String errorMessage) {
            this.errorMessage = errorMessage;
        }
    }
}
```
