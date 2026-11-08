---
url: /AIGC/AI应用开发/02.LangGraph4j/9_记忆功能（Memory）.md
---
# 9\_记忆功能（Memory）

记忆功能是构建智能对‍‍‍话系统的核心要素。就像我们在开发编程导航‌‌‌时需要记住用户的学习进度和偏好一样，AI‍‍‍ 应用也需要通过记忆功能来维持对话的连贯‍‍‍性和个性化体验。掌握记忆功能的设计和实现‍‍‍，你就能构建出真正智能的对话系统。

## 9.1 记忆组件基础

记忆组件是 LangC‍‍hai‍n4j 中负责存储和管理对话历史的核心模‌‌块。它不仅仅是简单‌的数据存储，更是一个智能‍‍的上下文管理系统，能够根据不同的策‍略来保存、‍‍检索和更新对话信息             ‍‍‍                               ‍                    Iy8qa2Wkgy1zjaDf5wVYJsxIyeHLdZx9B8sLhGVCeeI=

### 记忆的基本概念

记忆系统的设计需要‍‍‍考虑三个关键维度：存储容量、检索效‌‌‌率和上下文相关性。存储容量决定了系‍‍‍统能够记住多少历史信息，检索效率影‍‍‍响对话的响应速度，上下文相关性则关‍‍‍系到 AI 回答的准确性和连贯性。

在智能模拟面试‍功能中‍‍，系统需要记住面试官提‌出的问题、候选人的‌‌回答、以及‍之前的评价，这样才能进行连贯的‍‍面‍试对话。让我们通过一个基‍础的记忆系统‍‍来理解这些概念：             ‍‍                   wkzLNuBRh6R+lZgXeGCYFHBSq3Izz4e/cck+rYjQNkc=

我们首先需要导入相关的依赖：

```xml
▼xml复制代码
<dependency>
  <groupId>dev.langchain4j</groupId>
  <artifactId>langchain4j</artifactId>
  <version>1.1.0</version>
</dependency>

<dependency>
  <groupId>dev.langchain4j</groupId>
  <artifactId>langchain4j-open-ai</artifactId>
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

下面来看下‍‍‍代码示例：  ‌ ‌ ‌     ‍  ‍  ‍   ‍   ‍   ‍ ‍    ‍    ‍ 3SdhPNReyfSez0Q4gOc0v6ykW2hqke4CnFnKQxaIhL8=

```java
▼java复制代码import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.qwen.QwenChatModel;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

// 基础记忆接口
interface BasicMemory {
    void addMessage(ChatMessage message);
    List<ChatMessage> getMessages();
    void clear();
    int getMessageCount();
    boolean isEmpty();
}

// 简单记忆实现
class SimpleMemoryImpl implements BasicMemory {
    private final List<ChatMessage> messages;
    private final int maxCapacity;
    
    public SimpleMemoryImpl(int maxCapacity) {
        this.messages = new ArrayList<>();
        this.maxCapacity = maxCapacity;
    }
    
    @Override
    public synchronized void addMessage(ChatMessage message) {
        messages.add(message);
        
        // 当超过容量限制时，移除最早的消息
        while (messages.size() > maxCapacity) {
            messages.remove(0);
        }
    }
    
    @Override
    public synchronized List<ChatMessage> getMessages() {
        return new ArrayList<>(messages);
    }
    
    @Override
    public synchronized void clear() {
        messages.clear();
    }
    
    @Override
    public synchronized int getMessageCount() {
        return messages.size();
    }
    
    @Override
    public synchronized boolean isEmpty() {
        return messages.isEmpty();
    }
}


 
// 带时间戳的记忆条目
class TimestampedMessage {
    private final ChatMessage message;
    private final LocalDateTime timestamp;
    private final String messageId;

    public TimestampedMessage(ChatMessage message) {
        this.message = message;
        this.timestamp = LocalDateTime.now();
        this.messageId = "msg_" + System.currentTimeMillis() + "_" + Math.random();
    }

    // getter 方法
    public ChatMessage getMessage() {
        return message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getMessageId() {
        return messageId;
    }

    @Override
    public String toString() {
        return String.format("[%s] %s: %s",
                timestamp.toString(),
                message.type(),
                getMessageContent(message).substring(0, Math.min(50, getMessageContent(message).length())));
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


// 面试记忆管理器
class InterviewMemoryManager {
    private final Map<String, BasicMemory> candidateMemories;
    private final ChatModel model;

    public InterviewMemoryManager(ChatModel model) {
        this.candidateMemories = new ConcurrentHashMap<>();
        this.model = model;
    }

    // 为候选人创建或获取记忆
    public BasicMemory getOrCreateMemory(String candidateId) {
        return candidateMemories.computeIfAbsent(candidateId,
                k -> new SimpleMemoryImpl(20)); // 每个候选人最多记住20条消息
    }

    // 开始面试
    public String startInterview(String candidateId, String position) {
        BasicMemory memory = getOrCreateMemory(candidateId);

        // 添加系统消息设定面试场景
        SystemMessage systemMsg = new SystemMessage(
                "你是面试鸭的专业面试官，正在面试" + position + "职位的候选人。" +
                        "请保持专业、友好的态度，根据对话历史提出有针对性的问题。"
        );
        memory.addMessage(systemMsg);

        String welcomeMessage = "欢迎参加" + position + "职位的面试！" +
                "我是您今天的面试官，让我们开始吧。请先简单介绍一下自己。";

        // 记录面试官的欢迎消息
        AiMessage welcomeMsg = new AiMessage(welcomeMessage);
        memory.addMessage(welcomeMsg);

        System.out.println("为候选人 " + candidateId + " 创建面试记忆，当前消息数：" + memory.getMessageCount());

        return welcomeMessage;
    }

    // 处理候选人回答
    public String processCandidateAnswer(String candidateId, String answer) {
        BasicMemory memory = getOrCreateMemory(candidateId);

        // 记录候选人的回答
        UserMessage userMsg = new UserMessage(answer);
        memory.addMessage(userMsg);

        // 基于历史对话生成面试官回应
        String context = buildContextFromMemory(memory);
        String response = generateInterviewerResponse(context, answer);

        // 记录面试官的回应
        AiMessage aiMsg = new AiMessage(response);
        memory.addMessage(aiMsg);

        System.out.println("候选人 " + candidateId + " 回答已记录，当前消息数：" + memory.getMessageCount());

        return response;
    }

    // 从记忆中构建上下文
    private String buildContextFromMemory(BasicMemory memory) {
        List<ChatMessage> messages = memory.getMessages();
        StringBuilder context = new StringBuilder();

        context.append("对话历史：\n");
        for (ChatMessage msg : messages) {
            if (msg instanceof SystemMessage) {
                continue; // 跳过系统消息
            }

            String role = msg instanceof UserMessage ? "候选人" : "面试官";
            String content = getMessageContent(msg);
            context.append(role).append("：").append(content).append("\n");
        }

        return context.toString();
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

    // 生成面试官回应
    private String generateInterviewerResponse(String context, String currentAnswer) {
        try {
            String prompt = context + "\n候选人刚才的回答：" + currentAnswer +
                    "\n\n请作为面试官，基于对话历史给出专业的回应或提出下一个问题。";

            return model.chat(prompt);
        } catch (Exception e) {
            return "感谢您的回答。请继续介绍您的技术背景。";
        }
    }

    // 获取面试摘要
    public String getInterviewSummary(String candidateId) {
        BasicMemory memory = candidateMemories.get(candidateId);
        if (memory == null || memory.isEmpty()) {
            return "该候选人尚未开始面试。";
        }

        String context = buildContextFromMemory(memory);
        String prompt = "请基于以下面试对话，生成简洁的面试摘要：\n" + context;

        try {
            return model.chat(prompt);
        } catch (Exception e) {
            return "面试摘要生成失败。";
        }
    }

    // 清除候选人记忆
    public void clearCandidateMemory(String candidateId) {
        BasicMemory memory = candidateMemories.get(candidateId);
        if (memory != null) {
            memory.clear();
            System.out.println("已清除候选人 " + candidateId + " 的面试记忆");
        }
    }

    // 获取统计信息
    public Map<String, Integer> getMemoryStats() {
        Map<String, Integer> stats = new ConcurrentHashMap<>();

        candidateMemories.forEach((candidateId, memory) -> {
            stats.put(candidateId, memory.getMessageCount());
        });

        return stats;
    }
}

public class BasicMemoryExample {
    public static void main(String[] args) {
        // 初始化通义千问模型
        ChatModel model = QwenChatModel.builder()
                .apiKey("your-api-key")
                .modelName("qwen-max")
                .temperature(0.7f)
                .build();
        
        // 创建面试记忆管理器
        InterviewMemoryManager memoryManager = new InterviewMemoryManager(model);
        
        String candidateId = "candidate_yupi";
        String position = "Java 后端开发工程师";
        
        System.out.println("=== 面试鸭记忆功能演示 ===");
        
        // 开始面试
        System.out.println("--- 开始面试 ---");
        String welcomeMessage = memoryManager.startInterview(candidateId, position);
        System.out.println("面试官：" + welcomeMessage);
        
        // 模拟多轮对话
        String[] candidateAnswers = {
                "我是程序员鱼皮，有5年Java开发经验，主要做过编程导航和面试鸭等项目。",
                "我熟悉Spring Boot、MySQL、Redis等技术栈，有丰富的Web开发经验。",
                "在编程导航项目中，我负责后端架构设计和核心功能开发，日活用户达到10万+。",
                "我认为我的优势是学习能力强，能够快速掌握新技术，并且有良好的代码规范。"
        };
        
        for (int i = 0; i < candidateAnswers.length; i++) {
            System.out.println("\n--- 第 " + (i + 1) + " 轮对话 ---");
            System.out.println("候选人：" + candidateAnswers[i]);
            
            String response = memoryManager.processCandidateAnswer(candidateId, candidateAnswers[i]);
            System.out.println("面试官：" + response);
        }
        
        // 显示记忆统计
        System.out.println("\n--- 记忆统计 ---");
        Map<String, Integer> stats = memoryManager.getMemoryStats();
        stats.forEach((id, count) -> 
            System.out.println("候选人 " + id + "：" + count + " 条消息"));
        
        // 生成面试摘要
        System.out.println("\n--- 面试摘要 ---");
        String summary = memoryManager.getInterviewSummary(candidateId);
        System.out.println(summary);
        
        // 清除记忆
        memoryManager.clearCandidateMemory(candidateId);
    }
}
```

这段程序输‍出结果：     ‌         ‍         ‍         

```plain
▼plain复制代码=== 面试鸭记忆功能演示 ===
--- 开始面试 ---
为候选人 candidate_yupi 创建面试记忆，当前消息数：2
面试官：欢迎参加Java 后端开发工程师职位的面试！我是您今天的面试官，让我们开始吧。请先简单介绍一下自己。

--- 第 1 轮对话 ---
候选人：我是程序员鱼皮，有5年Java开发经验，主要做过编程导航和面试鸭等项目。
候选人 candidate_yupi 回答已记录，当前消息数：4
面试官：很好！程序员鱼皮，您的项目经验很丰富。能详细介绍一下编程导航和面试鸭这两个项目吗？

--- 第 2 轮对话 ---
候选人：我熟悉Spring Boot、MySQL、Redis等技术栈，有丰富的Web开发经验。
候选人 candidate_yupi 回答已记录，当前消息数：6
面试官：技术栈很全面。在您提到的这些技术中，能具体谈谈在项目中是如何使用Redis的吗？

--- 记忆统计 ---
候选人 candidate_yupi：8 条消息

--- 面试摘要 ---
候选人程序员鱼皮表现出色，具有5年Java开发经验，熟悉主流技术栈，有编程导航等成功项目经验...
```

### 记忆的工作机制

记忆系统的工作机制‍包括‍‍消息的添加、存储、检索和清理四‌个核心环节。消息‌‌添加时需要验证格式‍和内容，存储时要考虑容量限制‍‍和数据‍结构，检索时需要保证效率和准确性，‍清理‍‍时要平衡性能和信息保留             ‍‍                   

## 9.2 短期记忆实现

短期记忆专注‍‍‍于维护最近的对话内容，通‌‌‌常采用滑动窗口或 LRU‍‍‍（最近最少使用）策略来管‍‍‍理有限的存储空间。这种记‍‍‍忆方式适合快速响应的对话场景。

### 滑动窗口记忆

滑动窗口记忆是最直‍观的短‍‍期记忆实现方式。它维护一个固定‌大小的消息队列，当‌‌新消息到达时，如果‍队列已满，就移除最旧的消息  ‍‍                         ‍‍     在剪切助‍手的智能分类功能中，我们只需要‍‍记住用‍户最近的几次操作来提供个性化建议：TRQG02HuvSbBCdyta/9OfF/iMg4d5URNJyKR3KkD/fE=

```java
▼java复制代码
import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.locks.ReentrantReadWriteLock;


// 滑动窗口短期记忆实现
class SlidingWindowMemory implements BasicMemory {
    private final Queue<ChatMessage> messageQueue;
    private final int windowSize;
    private final ReentrantReadWriteLock lock;

    public SlidingWindowMemory(int windowSize) {
        this.windowSize = windowSize;
        this.messageQueue = new LinkedList<>();
        this.lock = new ReentrantReadWriteLock();
    }

    @Override
    public void addMessage(ChatMessage message) {
        lock.writeLock().lock();
        try {
            messageQueue.offer(message);

            // 维护窗口大小
            while (messageQueue.size() > windowSize) {
                ChatMessage removed = messageQueue.poll();
                System.out.println("移除旧消息：" + getMessageContent(removed).substring(0, Math.min(30, getMessageContent(removed).length())) + "...");
            }
        } finally {
            lock.writeLock().unlock();
        }
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
    @Override
    public List<ChatMessage> getMessages() {
        lock.readLock().lock();
        try {
            return new ArrayList<>(messageQueue);
        } finally {
            lock.readLock().unlock();
        }
    }

    @Override
    public void clear() {
        lock.writeLock().lock();
        try {
            messageQueue.clear();
        } finally {
            lock.writeLock().unlock();
        }
    }

    @Override
    public int getMessageCount() {
        lock.readLock().lock();
        try {
            return messageQueue.size();
        } finally {
            lock.readLock().unlock();
        }
    }

    @Override
    public boolean isEmpty() {
        lock.readLock().lock();
        try {
            return messageQueue.isEmpty();
        } finally {
            lock.readLock().unlock();
        }
    }

    // 获取窗口使用率
    public double getWindowUtilization() {
        lock.readLock().lock();
        try {
            return (double) messageQueue.size() / windowSize;
        } finally {
            lock.readLock().unlock();
        }
    }
}

// 基于令牌数量的短期记忆
class TokenBasedShortMemory implements BasicMemory {
    private final List<ChatMessage> messages;
    private final int maxTokens;
    private final ReentrantReadWriteLock lock;
    private int currentTokenCount;

    public TokenBasedShortMemory(int maxTokens) {
        this.maxTokens = maxTokens;
        this.messages = new ArrayList<>();
        this.lock = new ReentrantReadWriteLock();
        this.currentTokenCount = 0;
    }

    @Override
    public void addMessage(ChatMessage message) {
        lock.writeLock().lock();
        try {
            int messageTokens = estimateTokenCount(getMessageContent(message));
            messages.add(message);
            currentTokenCount += messageTokens;

            // 当超过令牌限制时，移除最旧的消息
            while (currentTokenCount > maxTokens && !messages.isEmpty()) {
                ChatMessage removed = messages.remove(0);
                int removedTokens = estimateTokenCount(getMessageContent(removed));
                currentTokenCount -= removedTokens;
                System.out.println("因令牌限制移除消息，节省 " + removedTokens + " 个令牌");
            }
        } finally {
            lock.writeLock().unlock();
        }
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
    @Override
    public List<ChatMessage> getMessages() {
        lock.readLock().lock();
        try {
            return new ArrayList<>(messages);
        } finally {
            lock.readLock().unlock();
        }
    }

    @Override
    public void clear() {
        lock.writeLock().lock();
        try {
            messages.clear();
            currentTokenCount = 0;
        } finally {
            lock.writeLock().unlock();
        }
    }

    @Override
    public int getMessageCount() {
        lock.readLock().lock();
        try {
            return messages.size();
        } finally {
            lock.readLock().unlock();
        }
    }

    @Override
    public boolean isEmpty() {
        lock.readLock().lock();
        try {
            return messages.isEmpty();
        } finally {
            lock.readLock().unlock();
        }
    }

    // 简单的令牌数量估算
    private int estimateTokenCount(String text) {
        // 粗略估算：中文字符按1.5个令牌计算，英文单词按1个令牌计算
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

    // 获取当前令牌使用情况
    public TokenUsageInfo getTokenUsage() {
        lock.readLock().lock();
        try {
            return new TokenUsageInfo(currentTokenCount, maxTokens);
        } finally {
            lock.readLock().unlock();
        }
    }

    // 令牌使用信息
    public static class TokenUsageInfo {
        private final int usedTokens;
        private final int maxTokens;

        public TokenUsageInfo(int usedTokens, int maxTokens) {
            this.usedTokens = usedTokens;
            this.maxTokens = maxTokens;
        }

        public int getUsedTokens() { return usedTokens; }
        public int getMaxTokens() { return maxTokens; }
        public double getUsageRate() { return (double) usedTokens / maxTokens; }
        public int getAvailableTokens() { return maxTokens - usedTokens; }

        @Override
        public String toString() {
            return String.format("令牌使用：%d/%d (%.1f%%)",
                    usedTokens, maxTokens, getUsageRate() * 100);
        }
    }
}

// 剪切助手的智能分类记忆管理器
class ClipboardMemoryManager {
    private final SlidingWindowMemory recentActions;
    private final TokenBasedShortMemory contentMemory;
    private final ChatModel model;

    public ClipboardMemoryManager(ChatModel model) {
        this.model = model;
        this.recentActions = new SlidingWindowMemory(10); // 记住最近10个操作
        this.contentMemory = new TokenBasedShortMemory(2000); // 最多2000个令牌的内容记忆
    }

    // 记录用户操作
    public void recordUserAction(String action, String content) {
        UserMessage actionMsg = new UserMessage("操作：" + action + "，内容：" + content);
        recentActions.addMessage(actionMsg);

        // 如果是重要内容，也加入内容记忆
        if (isImportantContent(content)) {
            contentMemory.addMessage(actionMsg);
        }

        System.out.println("记录用户操作：" + action);
        System.out.println("窗口使用率：" + String.format("%.1f%%", recentActions.getWindowUtilization() * 100));
        System.out.println("令牌使用：" + contentMemory.getTokenUsage());
    }

    // 获取个性化建议
    public String getPersonalizedSuggestion(String currentContent) {
        List<ChatMessage> recentMessages = recentActions.getMessages();
        List<ChatMessage> contentMessages = contentMemory.getMessages();

        StringBuilder context = new StringBuilder();
        context.append("用户最近的操作历史：\n");

        for (ChatMessage msg : recentMessages) {
            context.append("- ").append(getMessageContent(msg)).append("\n");
        }

        context.append("\n重要内容记忆：\n");
        for (ChatMessage msg : contentMessages) {
            context.append("- ").append(getMessageContent(msg)).append("\n");
        }

        context.append("\n当前剪切板内容：").append(currentContent);
        context.append("\n\n请基于用户的使用习惯，为当前内容提供智能分类建议。");

        try {
            return model.chat(context.toString());
        } catch (Exception e) {
            return "基于您的使用习惯，建议将此内容分类为常用类别。";
        }
    }


    // 判断是否为重要内容
    private boolean isImportantContent(String content) {
        // 简单的重要性判断逻辑
        return content.length() > 50 ||
                content.contains("密码") ||
                content.contains("账号") ||
                content.contains("代码") ||
                content.contains("http");
    }

    // 获取记忆统计信息
    public String getMemoryStats() {
        StringBuilder stats = new StringBuilder();
        stats.append("=== 剪切助手记忆统计 ===\n");
        stats.append("近期操作记忆：").append(recentActions.getMessageCount()).append(" 条\n");
        stats.append("窗口使用率：").append(String.format("%.1f%%", recentActions.getWindowUtilization() * 100)).append("\n");
        stats.append("内容记忆：").append(contentMemory.getMessageCount()).append(" 条\n");
        stats.append(contentMemory.getTokenUsage().toString()).append("\n");

        return stats.toString();
    }

    // 清理记忆
    public void clearMemory() {
        recentActions.clear();
        contentMemory.clear();
        System.out.println("已清理所有短期记忆");
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


public class ShortTermMemoryExample {
    public static void main(String[] args) {
        ChatModel model = QwenChatModel.builder()
                .apiKey("your-api-key")
                .modelName("qwen-max")
                .temperature(0.6f)
                .build();
        
        ClipboardMemoryManager memoryManager = new ClipboardMemoryManager(model);
        
        System.out.println("=== 剪切助手短期记忆演示 ===");
        
        // 模拟用户的一系列操作
        String[][] userActions = {
                {"复制", "程序员鱼皮的编程导航网站：https://www.codefather.cn"},
                {"复制", "public class HelloWorld { public static void main(String[] args) { System.out.println(\"Hello\"); } }"},
                {"复制", "用户名：yupi，密码：123456"},
                {"分类", "将代码片段分类到开发类别"},
                {"复制", "面试鸭题库：算法题、数据结构、系统设计"},
                {"搜索", "查找包含Java关键字的内容"},
                {"复制", "老鱼简历模板下载链接"},
                {"复制", "SELECT * FROM users WHERE status = 'active'"},
                {"分类", "将SQL语句分类到数据库类别"},
                {"复制", "今天的会议记录：讨论了项目进度和技术方案"},
                {"删除", "清理过期的临时文件"},
                {"复制", "算法导航学习路径：数组->链表->树->图"}
        };
        
        // 执行操作并观察记忆变化
        for (int i = 0; i < userActions.length; i++) {
            String action = userActions[i][0];
            String content = userActions[i][1];
            
            System.out.println("\n--- 操作 " + (i + 1) + " ---");
            memoryManager.recordUserAction(action, content);
            
            // 每隔几个操作显示统计信息
            if ((i + 1) % 4 == 0) {
                System.out.println("\n" + memoryManager.getMemoryStats());
            }
        }
        
        // 测试个性化建议
        System.out.println("\n--- 个性化建议测试 ---");
        String testContent = "import java.util.*; public class Solution { public int[] twoSum(int[] nums, int target) { /* 算法实现 */ } }";
        String suggestion = memoryManager.getPersonalizedSuggestion(testContent);
        System.out.println("当前内容：" + testContent);
        System.out.println("智能建议：" + suggestion);
        
        // 最终统计
        System.out.println("\n" + memoryManager.getMemoryStats());
    }
}
```

### 优先级记忆

除了基于时间‍‍‍和令牌的短期记忆，我们‌‌‌还可以实现基于优先级的‍‍记忆‍系统。重要的消息会‍‍‍被优先保留，而不重要的‍‍‍消息则会被优先淘汰。3SdhPNReyfSez0Q4gOc0v6ykW2hqke4CnFnKQxaIhL8=

## 9.3 长期记忆与对话历史

长期记忆负责保‍‍‍存重要的历史信息，这些信息‌‌‌可能在很长时间后仍然有用。‍‍‍与短期记忆不同，长期记忆通‍‍‍常需要持久化存储，并且要有‍‍‍智能的信息筛选和压缩机制。

### 分层记忆架构

在算法导航的个性化‍‍‍学习系统中，我们需要记住用户的学习历‌‌‌史、偏好设置、掌握程度等信息。这些信‍‍‍息需要长期保存，并且要能够快速检索和‍‍‍更新：               ‍‍‍                 

```java
▼java复制代码import java.io.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

// 长期记忆条目
class LongTermMemoryEntry implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String entryId;
    private String userId;
    private String category;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime lastAccessedAt;
    private int accessCount;
    private double importance;
    
    public LongTermMemoryEntry(String userId, String category, String content, double importance) {
        this.entryId = "entry_" + System.currentTimeMillis() + "_" + Math.random();
        this.userId = userId;
        this.category = category;
        this.content = content;
        this.importance = importance;
        this.createdAt = LocalDateTime.now();
        this.lastAccessedAt = LocalDateTime.now();
        this.accessCount = 1;
    }
    
    // 更新访问信息
    public void updateAccess() {
        this.lastAccessedAt = LocalDateTime.now();
        this.accessCount++;
    }
    
    // 计算记忆价值（基于重要性、访问频率和时间衰减）
    public double calculateMemoryValue() {
        long daysSinceCreated = java.time.Duration.between(createdAt, LocalDateTime.now()).toDays();
        long daysSinceAccessed = java.time.Duration.between(lastAccessedAt, LocalDateTime.now()).toDays();
        
        // 时间衰减因子
        double timeDecay = Math.exp(-daysSinceAccessed * 0.1);
        
        // 访问频率加权
        double accessWeight = Math.log(accessCount + 1);
        
        return importance * timeDecay * accessWeight;
    }
    
    // getter 和 setter 方法
    public String getEntryId() { return entryId; }
    public String getUserId() { return userId; }
    public String getCategory() { return category; }
    public String getContent() { return content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getLastAccessedAt() { return lastAccessedAt; }
    public int getAccessCount() { return accessCount; }
    public double getImportance() { return importance; }
    public void setImportance(double importance) { this.importance = importance; }
    
    @Override
    public String toString() {
        return String.format("[%s] %s: %s (重要性: %.2f, 访问: %d次)", 
                           category, userId, content.substring(0, Math.min(50, content.length())), 
                           importance, accessCount);
    }
}

// 长期记忆管理器
class LongTermMemoryManager {
    private final Map<String, List<LongTermMemoryEntry>> userMemories;
    private final Map<String, LongTermMemoryEntry> entryIndex;
    private final ScheduledExecutorService scheduler;
    private final String persistenceFile;
    private final int maxEntriesPerUser;
    private final ChatModel model;
    
    public LongTermMemoryManager(ChatModel model, String persistenceFile, int maxEntriesPerUser) {
        this.model = model;
        this.persistenceFile = persistenceFile;
        this.maxEntriesPerUser = maxEntriesPerUser;
        this.userMemories = new ConcurrentHashMap<>();
        this.entryIndex = new ConcurrentHashMap<>();
        this.scheduler = Executors.newScheduledThreadPool(2);
        
        // 启动定期清理和持久化任务
        scheduler.scheduleAtFixedRate(this::performMaintenance, 1, 1, TimeUnit.HOURS);
        scheduler.scheduleAtFixedRate(this::persistMemories, 10, 10, TimeUnit.MINUTES);
        
        // 启动时加载历史记忆
        loadMemories();
    }
    
    // 添加长期记忆
    public void addLongTermMemory(String userId, String category, String content, double importance) {
        LongTermMemoryEntry entry = new LongTermMemoryEntry(userId, category, content, importance);
        
        userMemories.computeIfAbsent(userId, k -> new ArrayList<>()).add(entry);
        entryIndex.put(entry.getEntryId(), entry);
        
        // 检查用户记忆条目数量限制
        List<LongTermMemoryEntry> userEntries = userMemories.get(userId);
        if (userEntries.size() > maxEntriesPerUser) {
            // 移除价值最低的记忆条目
            LongTermMemoryEntry leastValuable = userEntries.stream()
                    .min((a, b) -> Double.compare(a.calculateMemoryValue(), b.calculateMemoryValue()))
                    .orElse(null);
            
            if (leastValuable != null) {
                userEntries.remove(leastValuable);
                entryIndex.remove(leastValuable.getEntryId());
                System.out.println("移除低价值记忆：" + leastValuable.getContent().substring(0, Math.min(30, leastValuable.getContent().length())));
            }
        }
        
        System.out.println("添加长期记忆：" + category + " - " + content.substring(0, Math.min(50, content.length())));
    }
    
    // 检索相关记忆
    public List<LongTermMemoryEntry> retrieveRelevantMemories(String userId, String query, int maxResults) {
        List<LongTermMemoryEntry> userEntries = userMemories.getOrDefault(userId, new ArrayList<>());
        
        // 使用AI模型进行语义相似度匹配
        List<ScoredMemory> scoredMemories = new ArrayList<>();
        
        for (LongTermMemoryEntry entry : userEntries) {
            double relevanceScore = calculateRelevanceScore(query, entry.getContent());
            double memoryValue = entry.calculateMemoryValue();
            double combinedScore = relevanceScore * 0.7 + memoryValue * 0.3;
            
            scoredMemories.add(new ScoredMemory(entry, combinedScore));
            entry.updateAccess(); // 更新访问信息
        }
        
        // 按综合得分排序并返回前N个
        return scoredMemories.stream()
                .sorted((a, b) -> Double.compare(b.score, a.score))
                .limit(maxResults)
                .map(sm -> sm.entry)
                .collect(Collectors.toList());
    }
    
    // 计算相关性得分
    private double calculateRelevanceScore(String query, String content) {
        try {
            String prompt = String.format(
                "请评估以下查询与内容的相关性，返回0-1之间的数值：\n查询：%s\n内容：%s\n相关性得分：",
                query, content
            );
            
            String response = model.chat(prompt);
            
            // 尝试从响应中提取数值
            Pattern pattern = Pattern.compile("([0-9]*\\.?[0-9]+)");
            Matcher matcher = pattern.matcher(response);
            if (matcher.find()) {
                double score = Double.parseDouble(matcher.group(1));
                return Math.min(1.0, Math.max(0.0, score));
            }
        } catch (Exception e) {
            // 如果AI评估失败，使用简单的关键词匹配
            return simpleKeywordMatch(query, content);
        }
        
        return 0.0;
    }
    
    // 简单关键词匹配
    private double simpleKeywordMatch(String query, String content) {
        String[] queryWords = query.toLowerCase().split("\\s+");
        String lowerContent = content.toLowerCase();
        
        int matches = 0;
        for (String word : queryWords) {
            if (lowerContent.contains(word)) {
                matches++;
            }
        }
        
        return (double) matches / queryWords.length;
    }
    
    // 生成基于长期记忆的学习建议
    public String generateLearningAdvice(String userId, String currentTopic) {
        List<LongTermMemoryEntry> relevantMemories = retrieveRelevantMemories(userId, currentTopic, 5);
        
        StringBuilder context = new StringBuilder();
        context.append("用户学习历史：\n");
        
        for (LongTermMemoryEntry memory : relevantMemories) {
            context.append("- [").append(memory.getCategory()).append("] ")
                   .append(memory.getContent()).append("\n");
        }
        
        context.append("\n当前学习主题：").append(currentTopic);
        context.append("\n\n请基于用户的学习历史，为当前主题提供个性化的学习建议。");
        
        try {
            return model.chat(context.toString());
        } catch (Exception e) {
            return "基于您的学习历史，建议循序渐进地学习" + currentTopic + "相关知识。";
        }
    }
    
    // 定期维护
    private void performMaintenance() {
        System.out.println("开始长期记忆维护...");
        
        int totalEntries = entryIndex.size();
        int removedEntries = 0;
        
        // 清理过期或低价值的记忆条目
        List<String> toRemove = new ArrayList<>();
        
        for (LongTermMemoryEntry entry : entryIndex.values()) {
            // 移除超过一年未访问且价值很低的条目
            long daysSinceAccessed = java.time.Duration.between(entry.getLastAccessedAt(), LocalDateTime.now()).toDays();
            
            if (daysSinceAccessed > 365 && entry.calculateMemoryValue() < 0.1) {
                toRemove.add(entry.getEntryId());
            }
        }
        
        for (String entryId : toRemove) {
            LongTermMemoryEntry entry = entryIndex.remove(entryId);
            if (entry != null) {
                List<LongTermMemoryEntry> userEntries = userMemories.get(entry.getUserId());
                if (userEntries != null) {
                    userEntries.remove(entry);
                }
                removedEntries++;
            }
        }
        
        System.out.println("维护完成：总条目 " + totalEntries + "，清理 " + removedEntries + " 条");
    }
    
    // 持久化记忆
    private void persistMemories() {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(persistenceFile))) {
            Map<String, Object> data = new HashMap<>();
            data.put("userMemories", userMemories);
            data.put("entryIndex", entryIndex);
            data.put("timestamp", LocalDateTime.now());
            
            oos.writeObject(data);
            System.out.println("记忆已持久化到文件：" + persistenceFile);
        } catch (IOException e) {
            System.err.println("持久化失败：" + e.getMessage());
        }
    }
    
    // 加载记忆
    @SuppressWarnings("unchecked")
    private void loadMemories() {
        File file = new File(persistenceFile);
        if (!file.exists()) {
            System.out.println("未找到历史记忆文件，从空白状态开始");
            return;
        }
        
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(persistenceFile))) {
            Map<String, Object> data = (Map<String, Object>) ois.readObject();
            
            Map<String, List<LongTermMemoryEntry>> loadedUserMemories = 
                (Map<String, List<LongTermMemoryEntry>>) data.get("userMemories");
            Map<String, LongTermMemoryEntry> loadedEntryIndex = 
                (Map<String, LongTermMemoryEntry>) data.get("entryIndex");
            
            if (loadedUserMemories != null) {
                userMemories.putAll(loadedUserMemories);
            }
            if (loadedEntryIndex != null) {
                entryIndex.putAll(loadedEntryIndex);
            }
            
            LocalDateTime savedTime = (LocalDateTime) data.get("timestamp");
            System.out.println("成功加载长期记忆，保存时间：" + savedTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            System.out.println("加载记忆条目：" + entryIndex.size() + " 条");
            
        } catch (IOException | ClassNotFoundException e) {
            System.err.println("加载记忆失败：" + e.getMessage());
        }
    }
    
    // 获取用户记忆统计
    public Map<String, Object> getUserMemoryStats(String userId) {
        List<LongTermMemoryEntry> userEntries = userMemories.getOrDefault(userId, new ArrayList<>());
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEntries", userEntries.size());
        stats.put("categories", userEntries.stream()
                .collect(Collectors.groupingBy(LongTermMemoryEntry::getCategory, Collectors.counting())));
        
        OptionalDouble avgImportance = userEntries.stream()
                .mapToDouble(LongTermMemoryEntry::getImportance)
                .average();
        stats.put("averageImportance", avgImportance.orElse(0.0));
        
        return stats;
    }
    
    // 关闭管理器
    public void shutdown() {
        scheduler.shutdown();
        persistMemories(); // 最后一次持久化
        
        try {
            if (!scheduler.awaitTermination(30, TimeUnit.SECONDS)) {
                scheduler.shutdownNow();
            }
        } catch (InterruptedException e) {
            scheduler.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
    
    // 评分记忆内部类
    private static class ScoredMemory {
        final LongTermMemoryEntry entry;
        final double score;
        
        ScoredMemory(LongTermMemoryEntry entry, double score) {
            this.entry = entry;
            this.score = score;
        }
    }
}

public class LongTermMemoryExample {
    public static void main(String[] args) {
        ChatModel model = QwenChatModel.builder()
                .apiKey("your-api-key")
                .modelName("qwen-max")
                .temperature(0.5f)
                .build();
        
        LongTermMemoryManager memoryManager = new LongTermMemoryManager(
            model, "algorithm_learning_memory.dat", 100);
        
        String userId = "user_yupi";
        
        System.out.println("=== 算法导航长期记忆演示 ===");
        
        // 模拟用户学习历史的积累
        String[][] learningHistory = {
                {"学习进度", "完成了数组基础知识学习，掌握了基本操作", "0.8"},
                {"解题记录", "成功解决了两数之和问题，使用哈希表优化", "0.9"},
                {"知识点", "理解了时间复杂度和空间复杂度的概念", "0.7"},
                {"项目经验", "在编程导航项目中使用了ArrayList和HashMap", "0.8"},
                {"学习偏好", "喜欢通过实际项目来学习算法知识", "0.6"},
                {"困难点", "对递归算法的理解还不够深入", "0.9"},
                {"成就", "在面试鸭上完成了100道算法题", "0.8"},
                {"目标", "希望能够解决中等难度的算法题", "0.7"},
                {"学习方式", "偏好视频教程配合代码实践", "0.5"},
                {"技能树", "已掌握：数组、链表；正在学习：树和图", "0.9"}
        };
        
        // 添加学习记忆
        System.out.println("--- 建立学习记忆 ---");
        for (String[] record : learningHistory) {
            String category = record[0];
            String content = record[1];
            double importance = Double.parseDouble(record[2]);
            
            memoryManager.addLongTermMemory(userId, category, content, importance);
        }
        
        // 显示用户记忆统计
        System.out.println("\n--- 记忆统计 ---");
        Map<String, Object> stats = memoryManager.getUserMemoryStats(userId);
        System.out.println("总记忆条目：" + stats.get("totalEntries"));
        System.out.println("平均重要性：" + String.format("%.2f", (Double) stats.get("averageImportance")));
        
        @SuppressWarnings("unchecked")
        Map<String, Long> categories = (Map<String, Long>) stats.get("categories");
        System.out.println("分类统计：");
        categories.forEach((category, count) -> 
            System.out.println("  " + category + ": " + count + " 条"));
        
        // 测试记忆检索
        System.out.println("\n--- 记忆检索测试 ---");
        String[] queries = {
                "二叉树算法",
                "项目实战经验",
                "递归相关问题"
        };
        
        for (String query : queries) {
            System.out.println("\n查询：" + query);
            List<LongTermMemoryEntry> relevantMemories = 
                memoryManager.retrieveRelevantMemories(userId, query, 3);
            
            for (int i = 0; i < relevantMemories.size(); i++) {
                LongTermMemoryEntry memory = relevantMemories.get(i);
                System.out.println("  " + (i + 1) + ". " + memory);
            }
        }
        
        // 生成学习建议
        System.out.println("\n--- 个性化学习建议 ---");
        String currentTopic = "二叉树遍历算法";
        String advice = memoryManager.generateLearningAdvice(userId, currentTopic);
        System.out.println("当前学习主题：" + currentTopic);
        System.out.println("AI建议：" + advice);
        
        // 关闭管理器
        memoryManager.shutdown();
    }
}
```

这段程序输‍出结果：     ‌         ‍         ‍         TRQG02HuvSbBCdyta/9OfF/iMg4d5URNJyKR3KkD/fE=

```plain
▼plain复制代码=== 算法导航长期记忆演示 ===
--- 建立学习记忆 ---
添加长期记忆：学习进度 - 完成了数组基础知识学习，掌握了基本操作
添加长期记忆：解题记录 - 成功解决了两数之和问题，使用哈希表优化
添加长期记忆：知识点 - 理解了时间复杂度和空间复杂度的概念
...

--- 记忆统计 ---
总记忆条目：10
平均重要性：0.76
分类统计：
  学习进度: 1 条
  解题记录: 1 条
  知识点: 1 条
  项目经验: 1 条
  ...

--- 记忆检索测试 ---
查询：二叉树算法
  1. [技能树] user_yupi: 已掌握：数组、链表；正在学习：树和图 (重要性: 0.90, 访问: 2次)
  2. [困难点] user_yupi: 对递归算法的理解还不够深入 (重要性: 0.90, 访问: 2次)
  ...

--- 个性化学习建议 ---
当前学习主题：二叉树遍历算法
AI建议：基于您的学习历史，建议从递归的基础概念开始，结合具体的项目实践来理解二叉树遍历...
```

## 9.4 记忆缓存与持久化

记忆系统的‍‍‍性能很大程度上取决于‌‌‌缓存策略和持久化‍‍‍机制。合理的缓存能够提高‍‍‍访问速度，而可靠的持‍‍‍久化则保证了数据的安全性。TRQG02HuvSbBCdyta/9OfF/iMg4d5URNJyKR3KkD/fE=

### 多级缓存架构

在代码小抄的‍‍‍代码分析历史功能中，我们‌‌‌需要快速访问用户最近分析‍‍‍过的代码，同时也要能够检‍‍‍索到很久以前的分析结果。‍‍‍这就需要一个多级缓存系统：

````java
▼java复制代码import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.lang.ref.SoftReference;
import java.util.concurrent.atomic.AtomicLong;

// 缓存条目
class CacheEntry<T> {
    private final String key;
    private final T value;
    private final long createdTime;
    private volatile long lastAccessTime;
    private final AtomicLong accessCount;
    private final int priority;
    
    public CacheEntry(String key, T value, int priority) {
        this.key = key;
        this.value = value;
        this.priority = priority;
        this.createdTime = System.currentTimeMillis();
        this.lastAccessTime = createdTime;
        this.accessCount = new AtomicLong(1);
    }
    
    public T getValue() {
        this.lastAccessTime = System.currentTimeMillis();
        this.accessCount.incrementAndGet();
        return value;
    }
    
    // getter 方法
    public String getKey() { return key; }
    public long getCreatedTime() { return createdTime; }
    public long getLastAccessTime() { return lastAccessTime; }
    public long getAccessCount() { return accessCount.get(); }
    public int getPriority() { return priority; }
    
    // 计算缓存价值
    public double getCacheValue() {
        long age = System.currentTimeMillis() - lastAccessTime;
        double timeDecay = Math.exp(-age / (24 * 60 * 60 * 1000.0)); // 按天衰减
        return priority * timeDecay * Math.log(accessCount.get() + 1);
    }
}

// 多级缓存管理器
class MultiLevelCacheManager<T> {
    // L1缓存：内存中的高速缓存
    private final Map<String, CacheEntry<T>> l1Cache;
    private final int l1MaxSize;
    
    // L2缓存：软引用缓存，内存不足时会被回收
    private final Map<String, SoftReference<CacheEntry<T>>> l2Cache;
    private final int l2MaxSize;
    
    // L3缓存：磁盘持久化缓存
    private final PersistentCache<T> l3Cache;
    
    // 访问统计
    private final AtomicLong l1Hits = new AtomicLong(0);
    private final AtomicLong l2Hits = new AtomicLong(0);
    private final AtomicLong l3Hits = new AtomicLong(0);
    private final AtomicLong misses = new AtomicLong(0);
    
    public MultiLevelCacheManager(int l1MaxSize, int l2MaxSize, String l3CacheDir) {
        this.l1MaxSize = l1MaxSize;
        this.l2MaxSize = l2MaxSize;
        this.l1Cache = new ConcurrentHashMap<>();
        this.l2Cache = new ConcurrentHashMap<>();
        this.l3Cache = new PersistentCache<>(l3CacheDir);
    }
    
    // 获取缓存值
    public T get(String key) {
        // L1缓存查找
        CacheEntry<T> entry = l1Cache.get(key);
        if (entry != null) {
            l1Hits.incrementAndGet();
            return entry.getValue();
        }
        
        // L2缓存查找
        SoftReference<CacheEntry<T>> softRef = l2Cache.get(key);
        if (softRef != null) {
            entry = softRef.get();
            if (entry != null) {
                l2Hits.incrementAndGet();
                // 提升到L1缓存
                promoteToL1(key, entry);
                return entry.getValue();
            } else {
                // 软引用已被回收，清理
                l2Cache.remove(key);
            }
        }
        
        // L3缓存查找
        T value = l3Cache.get(key);
        if (value != null) {
            l3Hits.incrementAndGet();
            // 创建新的缓存条目并提升到L1
            CacheEntry<T> newEntry = new CacheEntry<>(key, value, 1);
            promoteToL1(key, newEntry);
            return value;
        }
        
        misses.incrementAndGet();
        return null;
    }
    
    // 存储到缓存
    public void put(String key, T value, int priority) {
        CacheEntry<T> entry = new CacheEntry<>(key, value, priority);
        
        // 直接存储到L1缓存
        promoteToL1(key, entry);
        
        // 异步存储到L3缓存
        l3Cache.putAsync(key, value);
    }
    
    // 提升到L1缓存
    private void promoteToL1(String key, CacheEntry<T> entry) {
        l1Cache.put(key, entry);
        
        // 检查L1缓存大小限制
        if (l1Cache.size() > l1MaxSize) {
            evictFromL1();
        }
    }
    
    // 从L1缓存中淘汰条目
    private void evictFromL1() {
        // 找到价值最低的条目
        String evictKey = l1Cache.entrySet().stream()
                .min((e1, e2) -> Double.compare(
                    e1.getValue().getCacheValue(), 
                    e2.getValue().getCacheValue()))
                .map(Map.Entry::getKey)
                .orElse(null);
        
        if (evictKey != null) {
            CacheEntry<T> evicted = l1Cache.remove(evictKey);
            
            // 降级到L2缓存
            if (evicted != null) {
                demoteToL2(evictKey, evicted);
            }
        }
    }
    
    // 降级到L2缓存
    private void demoteToL2(String key, CacheEntry<T> entry) {
        l2Cache.put(key, new SoftReference<>(entry));
        
        // 检查L2缓存大小限制
        if (l2Cache.size() > l2MaxSize) {
            evictFromL2();
        }
    }
    
    // 从L2缓存中淘汰条目
    private void evictFromL2() {
        // 简单的FIFO淘汰策略
        Iterator<String> iterator = l2Cache.keySet().iterator();
        if (iterator.hasNext()) {
            String key = iterator.next();
            l2Cache.remove(key);
        }
    }
    
    // 获取缓存统计信息
    public CacheStats getStats() {
        long totalRequests = l1Hits.get() + l2Hits.get() + l3Hits.get() + misses.get();
        
        return new CacheStats(
            l1Hits.get(), l2Hits.get(), l3Hits.get(), misses.get(),
            totalRequests, l1Cache.size(), l2Cache.size()
        );
    }
    
    // 清理缓存
    public void clear() {
        l1Cache.clear();
        l2Cache.clear();
        l3Cache.clear();
    }
    
    // 关闭缓存管理器
    public void shutdown() {
        l3Cache.shutdown();
    }
}

// 持久化缓存实现
class PersistentCache<T> {
    private final String cacheDir;
    private final ExecutorService asyncExecutor;
    
    public PersistentCache(String cacheDir) {
        this.cacheDir = cacheDir;
        this.asyncExecutor = Executors.newFixedThreadPool(2);
        
        // 确保缓存目录存在
        new File(cacheDir).mkdirs();
    }
    
    public T get(String key) {
        File cacheFile = new File(cacheDir, key + ".cache");
        if (!cacheFile.exists()) {
            return null;
        }
        
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(cacheFile))) {
            @SuppressWarnings("unchecked")
            T value = (T) ois.readObject();
            return value;
        } catch (IOException | ClassNotFoundException e) {
            // 缓存文件损坏，删除它
            cacheFile.delete();
            return null;
        }
    }
    
    public void put(String key, T value) {
        File cacheFile = new File(cacheDir, key + ".cache");
        
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(cacheFile))) {
            oos.writeObject(value);
        } catch (IOException e) {
            System.err.println("持久化缓存写入失败：" + e.getMessage());
        }
    }
    
    public void putAsync(String key, T value) {
        asyncExecutor.submit(() -> put(key, value));
    }
    
    public void clear() {
        File dir = new File(cacheDir);
        File[] files = dir.listFiles((file, name) -> name.endsWith(".cache"));
        
        if (files != null) {
            for (File file : files) {
                file.delete();
            }
        }
    }
    
    public void shutdown() {
        asyncExecutor.shutdown();
        try {
            if (!asyncExecutor.awaitTermination(30, TimeUnit.SECONDS)) {
                asyncExecutor.shutdownNow();
            }
        } catch (InterruptedException e) {
            asyncExecutor.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}

// 缓存统计信息
class CacheStats {
    private final long l1Hits;
    private final long l2Hits;
    private final long l3Hits;
    private final long misses;
    private final long totalRequests;
    private final int l1Size;
    private final int l2Size;
    
    public CacheStats(long l1Hits, long l2Hits, long l3Hits, long misses, 
                     long totalRequests, int l1Size, int l2Size) {
        this.l1Hits = l1Hits;
        this.l2Hits = l2Hits;
        this.l3Hits = l3Hits;
        this.misses = misses;
        this.totalRequests = totalRequests;
        this.l1Size = l1Size;
        this.l2Size = l2Size;
    }
    
    public double getHitRate() {
        return totalRequests > 0 ? (double) (l1Hits + l2Hits + l3Hits) / totalRequests : 0.0;
    }
    
    public double getL1HitRate() {
        return totalRequests > 0 ? (double) l1Hits / totalRequests : 0.0;
    }
    
    @Override
    public String toString() {
        return String.format(
            "缓存统计 - 总命中率: %.2f%%, L1命中率: %.2f%%, L1大小: %d, L2大小: %d, 总请求: %d",
            getHitRate() * 100, getL1HitRate() * 100, l1Size, l2Size, totalRequests
        );
    }
}

// 代码分析结果（用于演示）
class CodeAnalysisResult implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String codeHash;
    private String language;
    private String analysisResult;
    private LocalDateTime analyzedAt;
    
    public CodeAnalysisResult(String codeHash, String language, String analysisResult) {
        this.codeHash = codeHash;
        this.language = language;
        this.analysisResult = analysisResult;
        this.analyzedAt = LocalDateTime.now();
    }
    
    // getter 方法
    public String getCodeHash() { return codeHash; }
    public String getLanguage() { return language; }
    public String getAnalysisResult() { return analysisResult; }
    public LocalDateTime getAnalyzedAt() { return analyzedAt; }
    
    @Override
    public String toString() {
        return String.format("[%s] %s代码分析：%s", 
                           analyzedAt.format(DateTimeFormatter.ofPattern("MM-dd HH:mm")),
                           language, 
                           analysisResult.substring(0, Math.min(50, analysisResult.length())));
    }
}

// 代码分析缓存管理器
class CodeAnalysisCacheManager {
    private final MultiLevelCacheManager<CodeAnalysisResult> cacheManager;
    private final ChatModel model;
    
    public CodeAnalysisCacheManager(ChatModel model) {
        this.model = model;
        this.cacheManager = new MultiLevelCacheManager<>(50, 200, "./code_analysis_cache");
    }
    
    // 分析代码（带缓存）
    public CodeAnalysisResult analyzeCode(String code, String language) {
        // 生成代码哈希作为缓存键
        String codeHash = generateCodeHash(code);
        
        // 先从缓存中查找
        CodeAnalysisResult cached = cacheManager.get(codeHash);
        if (cached != null) {
            System.out.println("从缓存获取分析结果：" + codeHash);
            return cached;
        }
        
        // 缓存未命中，执行实际分析
        System.out.println("执行新的代码分析：" + codeHash);
        String analysisResult = performCodeAnalysis(code, language);
        
        // 创建分析结果并缓存
        CodeAnalysisResult result = new CodeAnalysisResult(codeHash, language, analysisResult);
        
        // 根据代码复杂度设置缓存优先级
        int priority = calculateCachePriority(code, language);
        cacheManager.put(codeHash, result, priority);
        
        return result;
    }
    
    // 执行实际的代码分析
    private String performCodeAnalysis(String code, String language) {
        try {
            String prompt = String.format(
                "请分析以下%s代码的质量、潜在问题和改进建议：\n```%s\n%s\n```",
                language, language, code
            );
            
            return model.chat(prompt);
        } catch (Exception e) {
            return "代码分析失败：" + e.getMessage();
        }
    }
    
    // 生成代码哈希
    private String generateCodeHash(String code) {
        // 简单的哈希实现，实际应用中应使用更好的哈希算法
        return "hash_" + Math.abs(code.hashCode());
    }
    
    // 计算缓存优先级
    private int calculateCachePriority(String code, String language) {
        int priority = 1;
        
        // 根据代码长度调整优先级
        if (code.length() > 1000) priority += 2;
        else if (code.length() > 500) priority += 1;
        
        // 根据语言类型调整优先级
        if ("java".equalsIgnoreCase(language) || "python".equalsIgnoreCase(language)) {
            priority += 1;
        }
        
        // 根据代码复杂度调整优先级
        if (code.contains("class") || code.contains("function") || code.contains("def")) {
            priority += 1;
        }
        
        return Math.min(priority, 5); // 最大优先级为5
    }
    
    // 获取缓存统计
    public CacheStats getCacheStats() {
        return cacheManager.getStats();
    }
    
    // 清理缓存
    public void clearCache() {
        cacheManager.clear();
    }
    
    // 关闭管理器
    public void shutdown() {
        cacheManager.shutdown();
    }
}

public class CacheAndPersistenceExample {
    public static void main(String[] args) {
        ChatModel model = QwenChatModel.builder()
                .apiKey("your-api-key")
                .modelName("qwen-max")
                .temperature(0.4f)
                .build();
        
        CodeAnalysisCacheManager cacheManager = new CodeAnalysisCacheManager(model);
        
        System.out.println("=== 代码小抄缓存系统演示 ===");
        
        // 测试代码样本
        String[] testCodes = {
                "public class HelloWorld { public static void main(String[] args) { System.out.println(\"Hello, World!\"); } }",
                "def fibonacci(n): return n if n <= 1 else fibonacci(n-1) + fibonacci(n-2)",
                "function quickSort(arr) { if (arr.length <= 1) return arr; /* 快排实现 */ }",
                "class Calculator { constructor() { this.result = 0; } add(x) { this.result += x; return this; } }",
                "public class HelloWorld { public static void main(String[] args) { System.out.println(\"Hello, World!\"); } }" // 重复代码，测试缓存
        };
        
        String[] languages = {"java", "python", "javascript", "javascript", "java"};
        
        // 第一轮分析（全部缓存未命中）
        System.out.println("--- 第一轮分析 ---");
        for (int i = 0; i < testCodes.length; i++) {
            System.out.println("\n分析代码 " + (i + 1) + ":");
            CodeAnalysisResult result = cacheManager.analyzeCode(testCodes[i], languages[i]);
            System.out.println("结果：" + result);
        }
        
        System.out.println("\n" + cacheManager.getCacheStats());
        
        // 第二轮分析（部分缓存命中）
        System.out.println("\n--- 第二轮分析（测试缓存效果）---");
        for (int i = 0; i < 3; i++) {
            System.out.println("\n重新分析代码 " + (i + 1) + ":");
            CodeAnalysisResult result = cacheManager.analyzeCode(testCodes[i], languages[i]);
            System.out.println("结果：" + result);
        }
        
        System.out.println("\n" + cacheManager.getCacheStats());
        
        // 添加更多代码以测试缓存淘汰
        System.out.println("\n--- 测试缓存淘汰机制 ---");
        for (int i = 0; i < 60; i++) {
            String code = "// 测试代码 " + i + "\npublic void test" + i + "() { System.out.println(\"Test " + i + "\"); }";
            cacheManager.analyzeCode(code, "java");
            
            if (i % 20 == 19) {
                System.out.println("添加了 " + (i + 1) + " 个新分析结果");
                System.out.println(cacheManager.getCacheStats());
            }
        }
        
        System.out.println("\n=== 最终缓存统计 ===");
        System.out.println(cacheManager.getCacheStats());
        
        cacheManager.shutdown();
    }
}
````

### 异步持久化策略

为了不影响用户体验，记忆系统通常采用异步持久化策略。重要的记忆会立即持久化，而一般的记忆则会批量处理。

## 9.5 记忆优化与管理

随着时间的推移，记忆系统会积累大量数据，需要有效的优化和管理策略来保持系统性能。

### 智能记忆压缩

在老鱼简历的用户行为分析功能中，我们需要压缩历史行为数据，保留关键信息的同时减少存储空间：7QiJ3WkhTRjV8VSaIHYq0+Wzni+Hi3xtR8CR8/IP1VI=

```java
▼java复制代码import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

// 记忆压缩管理器
class MemoryCompressionManager {
    private final ChatModel model;
    private final ExecutorService compressionExecutor;

    public MemoryCompressionManager(ChatModel model) {
        this.model = model;
        this.compressionExecutor = Executors.newFixedThreadPool(3);
    }

    // 压缩对话历史
    public CompletableFuture<String> compressConversationHistory(List<ChatMessage> messages, int targetLength) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                // 构建压缩提示
                StringBuilder conversationText = new StringBuilder();
                for (ChatMessage message : messages) {
                    String role = getMessageRole(message);
                    String content = getMessageContent(message);
                    conversationText.append(role).append("：").append(content).append("\n");
                }

                String compressionPrompt = String.format(
                        "请将以下对话历史压缩为不超过%d字的摘要，保留关键信息和上下文：\n\n%s\n\n压缩摘要：",
                        targetLength, conversationText.toString()
                );

                return model.chat(compressionPrompt);

            } catch (Exception e) {
                return "对话历史压缩失败：" + e.getMessage();
            }
        }, compressionExecutor);
    }
    private String getMessageRole(ChatMessage message) {
        if (message instanceof UserMessage) {
            return "用户";
        } else if (message instanceof AiMessage) {
            return "助手";
        } else if (message instanceof SystemMessage) {
            return "系统";
        } else {
            return "系统"; // 默认为系统消息
        }
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

    // 压缩用户行为数据
    public CompletableFuture<UserBehaviorSummary> compressUserBehavior(List<UserAction> actions) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                // 分析行为模式
                Map<String, Long> actionCounts = actions.stream()
                        .collect(Collectors.groupingBy(UserAction::getActionType, Collectors.counting()));

                Map<String, List<UserAction>> actionsByCategory = actions.stream()
                        .collect(Collectors.groupingBy(UserAction::getCategory));

                // 使用AI生成行为摘要
                StringBuilder behaviorContext = new StringBuilder();
                behaviorContext.append("用户行为统计：\n");

                actionCounts.forEach((action, count) ->
                        behaviorContext.append("- ").append(action).append("：").append(count).append("次\n"));

                behaviorContext.append("\n分类行为详情：\n");
                actionsByCategory.forEach((category, categoryActions) -> {
                    behaviorContext.append("【").append(category).append("】\n");
                    categoryActions.stream().limit(3).forEach(action ->
                            behaviorContext.append("  ").append(action.getDescription()).append("\n"));
                });

                String summaryPrompt = behaviorContext.toString() +
                        "\n请基于以上数据生成用户行为特征摘要，包括使用偏好、活跃时段、主要需求等。";

                String aiSummary = model.chat(summaryPrompt);
                ZoneId zoneId = ZoneId.systemDefault();
                return new UserBehaviorSummary(
                        actions.get(0).getUserId(),
                        actionCounts,
                        aiSummary,
                        actions.stream().mapToLong(a -> a.getTimestamp().atZone(zoneId).toEpochSecond()).min().orElse(0),
                        actions.stream().mapToLong(a -> a.getTimestamp().atZone(zoneId).toEpochSecond()).max().orElse(0)
                );

            } catch (Exception e) {
                return new UserBehaviorSummary(
                        actions.get(0).getUserId(),
                        new HashMap<>(),
                        "行为分析失败：" + e.getMessage(),
                        0, 0
                );
            }
        }, compressionExecutor);
    }

    public void shutdown() {
        compressionExecutor.shutdown();
    }
}

// 用户行为记录
class UserAction {
    private String userId;
    private String actionType;
    private String category;
    private String description;
    private LocalDateTime timestamp;
    private Map<String, Object> metadata;
    
    public UserAction(String userId, String actionType, String category, String description) {
        this.userId = userId;
        this.actionType = actionType;
        this.category = category;
        this.description = description;
        this.timestamp = LocalDateTime.now();
        this.metadata = new HashMap<>();
    }
    
    // getter 方法
    public String getUserId() { return userId; }
    public String getActionType() { return actionType; }
    public String getCategory() { return category; }
    public String getDescription() { return description; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public Map<String, Object> getMetadata() { return metadata; }
    
    public void addMetadata(String key, Object value) {
        metadata.put(key, value);
    }
}

// 用户行为摘要
class UserBehaviorSummary {
    private String userId;
    private Map<String, Long> actionCounts;
    private String behaviorSummary;
    private long periodStart;
    private long periodEnd;
    
    public UserBehaviorSummary(String userId, Map<String, Long> actionCounts, 
                              String behaviorSummary, long periodStart, long periodEnd) {
        this.userId = userId;
        this.actionCounts = actionCounts;
        this.behaviorSummary = behaviorSummary;
        this.periodStart = periodStart;
        this.periodEnd = periodEnd;
    }
    
    // getter 方法
    public String getUserId() { return userId; }
    public Map<String, Long> getActionCounts() { return actionCounts; }
    public String getBehaviorSummary() { return behaviorSummary; }
    public long getPeriodStart() { return periodStart; }
    public long getPeriodEnd() { return periodEnd; }
    
    @Override
    public String toString() {
        return String.format("用户%s行为摘要：%s", userId, behaviorSummary);
    }
}

public class MemoryOptimizationExample {
    public static void main(String[] args) {
        ChatModel model = QwenChatModel.builder()
                .apiKey("your-api-key")
                .modelName("qwen-max")
                .temperature(0.5f)
                .build();
        
        MemoryCompressionManager compressionManager = new MemoryCompressionManager(model);
        
        System.out.println("=== 老鱼简历记忆优化演示 ===");
        
        // 模拟用户行为数据
        String userId = "user_yupi";
        List<UserAction> userActions = Arrays.asList(
                new UserAction(userId, "查看", "简历模板", "浏览Java开发工程师简历模板"),
                new UserAction(userId, "编辑", "个人信息", "修改联系方式和邮箱"),
                new UserAction(userId, "添加", "项目经验", "添加编程导航项目经验"),
                new UserAction(userId, "优化", "技能描述", "优化Java技能栈描述"),
                new UserAction(userId, "查看", "优化建议", "查看AI简历优化建议"),
                new UserAction(userId, "导出", "简历文件", "导出PDF格式简历"),
                new UserAction(userId, "分享", "简历链接", "生成简历分享链接"),
                new UserAction(userId, "编辑", "项目经验", "完善面试鸭项目描述"),
                new UserAction(userId, "查看", "简历评分", "查看简历质量评分"),
                new UserAction(userId, "优化", "排版格式", "调整简历排版和字体")
        );
        
        // 测试行为压缩
        System.out.println("--- 用户行为压缩测试 ---");
        try {
            CompletableFuture<UserBehaviorSummary> behaviorFuture = 
                compressionManager.compressUserBehavior(userActions);
            
            UserBehaviorSummary summary = behaviorFuture.get(30, TimeUnit.SECONDS);
            
            System.out.println("原始行为记录数：" + userActions.size());
            System.out.println("行为统计：");
            summary.getActionCounts().forEach((action, count) -> 
                System.out.println("  " + action + ": " + count + "次"));
            System.out.println("行为摘要：" + summary.getBehaviorSummary());
            
        } catch (Exception e) {
            System.out.println("行为压缩失败：" + e.getMessage());
        }
        
        // 测试对话历史压缩
        System.out.println("\n--- 对话历史压缩测试 ---");
        List<ChatMessage> conversationHistory = Arrays.asList(
                new UserMessage("我想优化我的Java开发工程师简历"),
                new AiMessage("好的，我来帮您分析简历。请先上传您的简历或者描述一下您的背景。"),
                new UserMessage("我是程序员鱼皮，有5年Java开发经验，做过编程导航和面试鸭项目"),
                new AiMessage("很好！您的项目经验很丰富。建议在简历中突出这两个项目的技术栈和成果。"),
                new UserMessage("编程导航用了Spring Boot、MySQL、Redis，面试鸭用了React和Node.js"),
                new AiMessage("技术栈很全面！建议按照前后端分离、全栈开发的角度来组织简历结构。"),
                new UserMessage("具体应该怎么写项目描述？"),
                new AiMessage("建议使用STAR法则：Situation、Task、Action、Result，突出具体的技术难点和解决方案。")
        );
        
        try {
            CompletableFuture<String> compressionFuture = 
                compressionManager.compressConversationHistory(conversationHistory, 200);
            
            String compressedHistory = compressionFuture.get(30, TimeUnit.SECONDS);
            
            System.out.println("原始对话轮数：" + conversationHistory.size());
            System.out.println("压缩后摘要：" + compressedHistory);
            
        } catch (Exception e) {
            System.out.println("对话压缩失败：" + e.getMessage());
        }
        
        compressionManager.shutdown();
    }
}
```

这段程序输出结果：

```plain
▼plain复制代码=== 老鱼简历记忆优化演示 ===
--- 用户行为压缩测试 ---
原始行为记录数：10
行为统计：
  查看: 3次
  编辑: 2次
  添加: 1次
  优化: 2次
  导出: 1次
  分享: 1次
行为摘要：用户主要专注于简历内容的完善和优化，表现出对Java开发职位的明确目标...

--- 对话历史压缩测试 ---
原始对话轮数：8
压缩后摘要：用户程序员鱼皮寻求Java开发简历优化帮助，具有5年经验和编程导航、面试鸭项目经验...
```

## 9.6 多轮对话记忆实战

多轮对话是记忆系统最复杂的应用场景，需要维护长期的对话状态，同时保持对话的连贯性和个性化。

### 上下文感知对话系统

在编程导航的学习助手功能中，我们需要实现一个能够记住学习进度、理解上下文、提供个性化指导的对话系统：

```java
▼java复制代码// 对话上下文管理器
class ConversationContextManager {
    private final Map<String, ConversationContext> activeContexts;
    private final LongTermMemoryManager longTermMemory;
    private final ChatModel model;
    private final ScheduledExecutorService contextCleaner;
    
    public ConversationContextManager(ChatModel model, LongTermMemoryManager longTermMemory) {
        this.model = model;
        this.longTermMemory = longTermMemory;
        this.activeContexts = new ConcurrentHashMap<>();
        this.contextCleaner = Executors.newScheduledThreadPool(1);
        
        // 定期清理不活跃的上下文
        contextCleaner.scheduleAtFixedRate(this::cleanInactiveContexts, 30, 30, TimeUnit.MINUTES);
    }
    
    // 处理用户消息
    public String processUserMessage(String userId, String message) {
        ConversationContext context = getOrCreateContext(userId);
        
        try {
            // 更新上下文
            context.addUserMessage(message);
            
            // 分析消息意图
            MessageIntent intent = analyzeMessageIntent(message, context);
            context.setCurrentIntent(intent);
            
            // 检索相关的长期记忆
            List<LongTermMemoryEntry> relevantMemories = longTermMemory.retrieveRelevantMemories(
                userId, message, 5);
            
            // 生成回复
            String response = generateContextualResponse(context, relevantMemories);
            
            // 更新对话历史
            context.addAssistantMessage(response);
            
            // 如果是重要信息，保存到长期记忆
            if (intent.getImportance() > 0.7) {
                longTermMemory.addLongTermMemory(
                    userId, intent.getCategory(), message, intent.getImportance());
            }
            
            return response;
            
        } catch (Exception e) {
            return "抱歉，我遇到了一些问题。请稍后再试。";
        }
    }
    
    // 获取或创建对话上下文
    private ConversationContext getOrCreateContext(String userId) {
        return activeContexts.computeIfAbsent(userId, k -> new ConversationContext(userId));
    }
    
    // 分析消息意图
    private MessageIntent analyzeMessageIntent(String message, ConversationContext context) {
        try {
            String intentPrompt = String.format(
                "分析以下消息的意图，返回JSON格式：\n" +
                "消息：%s\n" +
                "对话历史：%s\n\n" +
                "请返回：{\"category\": \"分类\", \"intent\": \"具体意图\", \"importance\": 重要性(0-1), \"needsFollowUp\": true/false}",
                message, context.getRecentHistory(3)
            );
            
            String intentResponse = model.chat(intentPrompt);
            return parseMessageIntent(intentResponse);
            
        } catch (Exception e) {
            return new MessageIntent("general", "general_query", 0.5, false);
        }
    }
    
    // 解析消息意图
    private MessageIntent parseMessageIntent(String response) {
        try {
            // 简化的JSON解析
            String category = extractJsonValue(response, "category", "general");
            String intent = extractJsonValue(response, "intent", "general_query");
            double importance = Double.parseDouble(extractJsonValue(response, "importance", "0.5"));
            boolean needsFollowUp = Boolean.parseBoolean(extractJsonValue(response, "needsFollowUp", "false"));
            
            return new MessageIntent(category, intent, importance, needsFollowUp);
            
        } catch (Exception e) {
            return new MessageIntent("general", "general_query", 0.5, false);
        }
    }
    
    // 简单的JSON值提取
    private String extractJsonValue(String json, String key, String defaultValue) {
        Pattern pattern = Pattern.compile("\"" + key + "\"\\s*:\\s*\"?([^,}\"]+)\"?");
        Matcher matcher = pattern.matcher(json);
        return matcher.find() ? matcher.group(1).trim() : defaultValue;
    }
    
    // 生成上下文感知的回复
    private String generateContextualResponse(ConversationContext context, List<LongTermMemoryEntry> memories) {
        StringBuilder prompt = new StringBuilder();
        
        // 系统角色设定
        prompt.append("你是编程导航的智能学习助手，专门帮助用户学习编程技术。\n\n");
        
        // 用户画像
        prompt.append("用户信息：\n");
        prompt.append("- 用户ID：").append(context.getUserId()).append("\n");
        prompt.append("- 当前学习阶段：").append(context.getCurrentLearningStage()).append("\n");
        prompt.append("- 学习偏好：").append(context.getLearningPreferences()).append("\n\n");
        
        // 相关记忆
        if (!memories.isEmpty()) {
            prompt.append("相关学习历史：\n");
            for (LongTermMemoryEntry memory : memories) {
                prompt.append("- ").append(memory.getContent()).append("\n");
            }
            prompt.append("\n");
        }
        
        // 最近对话历史
        prompt.append("最近对话：\n");
        prompt.append(context.getRecentHistory(5)).append("\n");
        
        // 当前消息和意图
        prompt.append("当前用户消息：").append(context.getLastUserMessage()).append("\n");
        prompt.append("消息意图：").append(context.getCurrentIntent().getIntent()).append("\n\n");
        
        prompt.append("请基于以上信息，生成个性化、有针对性的回复。回复要体现对用户学习历史的理解，并提供实用的学习建议。");
        
        return model.chat(prompt.toString());
    }
    
    // 清理不活跃的上下文
    private void cleanInactiveContexts() {
        long cutoffTime = System.currentTimeMillis() - (2 * 60 * 60 * 1000); // 2小时
        
        activeContexts.entrySet().removeIf(entry -> {
            ConversationContext context = entry.getValue();
            if (context.getLastActivityTime() < cutoffTime) {
                System.out.println("清理不活跃的对话上下文：" + entry.getKey());
                return true;
            }
            return false;
        });
    }
    
    // 获取对话统计信息
    public Map<String, Object> getConversationStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("activeContexts", activeContexts.size());
        
        int totalMessages = activeContexts.values().stream()
                .mapToInt(ctx -> ctx.getMessageCount())
                .sum();
        stats.put("totalMessages", totalMessages);
        
        return stats;
    }
    
    // 关闭管理器
    public void shutdown() {
        contextCleaner.shutdown();
        try {
            if (!contextCleaner.awaitTermination(30, TimeUnit.SECONDS)) {
                contextCleaner.shutdownNow();
            }
        } catch (InterruptedException e) {
            contextCleaner.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}

// 对话上下文
class ConversationContext {
    private final String userId;
    private final List<ChatMessage> messages;
    private final Map<String, Object> contextData;
    private MessageIntent currentIntent;
    private long lastActivityTime;
    private String currentLearningStage;
    private String learningPreferences;

    public ConversationContext(String userId) {
        this.userId = userId;
        this.messages = new ArrayList<>();
        this.contextData = new HashMap<>();
        this.lastActivityTime = System.currentTimeMillis();
        this.currentLearningStage = "初学者";
        this.learningPreferences = "理论结合实践";
    }

    public void addUserMessage(String message) {
        messages.add(new UserMessage(message));
        updateActivity();
    }

    public void addAssistantMessage(String message) {
        messages.add(new AiMessage(message));
        updateActivity();
    }

    private void updateActivity() {
        this.lastActivityTime = System.currentTimeMillis();
    }

    public String getRecentHistory(int messageCount) {
        StringBuilder history = new StringBuilder();
        int start = Math.max(0, messages.size() - messageCount * 2);

        for (int i = start; i < messages.size(); i++) {
            ChatMessage msg = messages.get(i);
            String role = msg instanceof UserMessage ? "用户" : "助手";
            String content = getMessageContent(messages.get(i));
            history.append(role).append("：").append(content).append("\n");
        }

        return history.toString();
    }

    public String getLastUserMessage() {
        for (int i = messages.size() - 1; i >= 0; i--) {
            if (messages.get(i) instanceof UserMessage) {
                String content = getMessageContent(messages.get(i));
                return content;
            }
        }
        return "";
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

    // getter 和 setter 方法
    public String getUserId() {
        return userId;
    }

    public MessageIntent getCurrentIntent() {
        return currentIntent;
    }

    public void setCurrentIntent(MessageIntent currentIntent) {
        this.currentIntent = currentIntent;
    }

    public long getLastActivityTime() {
        return lastActivityTime;
    }

    public int getMessageCount() {
        return messages.size();
    }

    public String getCurrentLearningStage() {
        return currentLearningStage;
    }

    public void setCurrentLearningStage(String currentLearningStage) {
        this.currentLearningStage = currentLearningStage;
    }

    public String getLearningPreferences() {
        return learningPreferences;
    }

    public void setLearningPreferences(String learningPreferences) {
        this.learningPreferences = learningPreferences;
    }

    public void setContextData(String key, Object value) {
        contextData.put(key, value);
    }

    public Object getContextData(String key) {
        return contextData.get(key);
    }
}


// 消息意图
class MessageIntent {
    private String category;
    private String intent;
    private double importance;
    private boolean needsFollowUp;
    
    public MessageIntent(String category, String intent, double importance, boolean needsFollowUp) {
        this.category = category;
        this.intent = intent;
        this.importance = importance;
        this.needsFollowUp = needsFollowUp;
    }
    
    // getter 方法
    public String getCategory() { return category; }
    public String getIntent() { return intent; }
    public double getImportance() { return importance; }
    public boolean isNeedsFollowUp() { return needsFollowUp; }
}

public class MultiTurnConversationExample {
    public static void main(String[] args) {
        ChatModel model = QwenChatModel.builder()
                .apiKey("your-api-key")
                .modelName("qwen-max")
                .temperature(0.6f)
                .build();
        
        // 创建长期记忆管理器
        LongTermMemoryManager longTermMemory = new LongTermMemoryManager(model, "learning_memory.dat", 50);
        
        // 创建对话上下文管理器
        ConversationContextManager conversationManager = new ConversationContextManager(model, longTermMemory);
        
        String userId = "student_yupi";
        
        System.out.println("=== 编程导航多轮对话记忆演示 ===");
        System.out.println("学生：程序员鱼皮");
        System.out.println("助手：编程导航智能学习助手");
        System.out.println();
        
        // 模拟多轮学习对话
        String[] userMessages = {
                "我想学习Java算法，但是基础不太好，应该从哪里开始？",
                "我之前学过一些Java语法，做过编程导航项目，但算法确实是弱项。",
                "那我应该先学哪些数据结构呢？",
                "数组我基本掌握了，链表还不太熟悉，能给我一些练习建议吗？",
                "我在面试鸭上做了一些链表题目，但是递归的部分还是不太理解。",
                "能给我推荐一些递归的练习题吗？最好是从简单到复杂的。",
                "谢谢！我想问一下，学完这些基础数据结构后，下一步应该学什么？",
                "好的，我会按照你的建议来学习。对了，有什么方法可以检验我的学习效果吗？"
        };
        
        // 执行多轮对话
        for (int i = 0; i < userMessages.length; i++) {
            System.out.println("--- 第 " + (i + 1) + " 轮对话 ---");
            System.out.println("学生：" + userMessages[i]);
            
            String response = conversationManager.processUserMessage(userId, userMessages[i]);
            System.out.println("助手：" + response);
            System.out.println();
            
            // 模拟思考时间
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
        
        // 显示对话统计
        System.out.println("=== 对话统计 ===");
        Map<String, Object> stats = conversationManager.getConversationStats();
        stats.forEach((key, value) -> System.out.println(key + ": " + value));
        
        // 测试记忆效果 - 在新对话中引用之前的内容
        System.out.println("\n=== 记忆效果测试 ===");
        String memoryTestMessage = "我之前提到的递归问题，现在有了一些进展，想和你分享一下。";
        System.out.println("学生：" + memoryTestMessage);
        
        String memoryResponse = conversationManager.processUserMessage(userId, memoryTestMessage);
        System.out.println("助手：" + memoryResponse);
        
        // 关闭管理器
        conversationManager.shutdown();
        longTermMemory.shutdown();
    }
}
```

## 9.7 Java 环境下的记忆实现

在 Java 环境中实现记忆功能需要考虑线程安全、内存管理、序列化等技术细节。LangChain4j 提供了完整的记忆实现框架。

### LangChain4j 记忆集成

LangChain4j 的记忆系统设计充分考虑了 Java 的特性，提供了类型安全、高性能的记忆实现：wkzLNuBRh6R+lZgXeGCYFHBSq3Izz4e/cck+rYjQNkc=

```java
▼java复制代码import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.memory.chat.TokenWindowChatMemory;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

// 集成 LangChain4j 记忆的完整示例
class ComprehensiveMemorySystem {
    private final ChatModel model;
    private final Map<String, MessageWindowChatMemory> userMemories;
    private final TokenWindowChatMemory sharedMemory;
    
    public ComprehensiveMemorySystem(ChatModel model) {
        this.model = model;
        this.userMemories = new ConcurrentHashMap<>();

        TokenCountEstimator openAiTokenCountEstimator = new OpenAiTokenCountEstimator("gpt-4o");

        // 创建共享的令牌窗口记忆
        this.sharedMemory = TokenWindowChatMemory.builder()
                .maxTokens(4000, openAiTokenCountEstimator)
                .build();
    }
    
    // 创建带记忆的 AI 服务
    public IntelligentAssistant createAssistantForUser(String userId) {
        // 为每个用户创建独立的记忆
        MessageWindowChatMemory userMemory = userMemories.computeIfAbsent(
            userId, k -> MessageWindowChatMemory.withMaxMessages(15)
        );
        
        return AiServices.builder(IntelligentAssistant.class)
                .chatModel(model)
                .chatMemory(userMemory)
                .build();
    }
    
    // 创建带共享记忆的服务
    public SharedKnowledgeAssistant createSharedAssistant() {
        return AiServices.builder(SharedKnowledgeAssistant.class)
                .chatModel(model)
                .chatMemory(sharedMemory)
                .build();
    }
    
    // 获取用户记忆统计
    public Map<String, Integer> getUserMemoryStats() {
        Map<String, Integer> stats = new HashMap<>();
        userMemories.forEach((userId, memory) -> {
            stats.put(userId, memory.messages().size());
        });
        return stats;
    }
    
    // 清除用户记忆
    public void clearUserMemory(String userId) {
        MessageWindowChatMemory memory = userMemories.get(userId);
        if (memory != null) {
            memory.clear();
        }
    }
    
    // 清除所有记忆
    public void clearAllMemories() {
        userMemories.values().forEach(MessageWindowChatMemory::clear);
        sharedMemory.clear();
    }
}

// 智能助手接口
interface IntelligentAssistant {
    @SystemMessage("""
            你是一个智能编程助手，能够记住用户的对话历史。
            请根据之前的对话内容提供连贯、个性化的帮助。
            """)
    String chat(String message);
}

// 共享知识助手接口
interface SharedKnowledgeAssistant {
    @SystemMessage("""
            你是一个共享知识库助手，能够学习和记住所有用户的交互。
            请利用积累的知识为用户提供更好的服务。
            """)
    String shareKnowledge(@MemoryId String sessionId, String question);
}


// 记忆性能监控器
class MemoryPerformanceMonitor {
    private final Map<String, MemoryMetrics> metricsMap;
    private final ScheduledExecutorService scheduler;
    
    public MemoryPerformanceMonitor() {
        this.metricsMap = new ConcurrentHashMap<>();
        this.scheduler = Executors.newScheduledThreadPool(1);
        
        // 定期收集性能指标
        scheduler.scheduleAtFixedRate(this::collectMetrics, 1, 1, TimeUnit.MINUTES);
    }
    
    public void recordMemoryOperation(String userId, String operation, long duration) {
        MemoryMetrics metrics = metricsMap.computeIfAbsent(userId, k -> new MemoryMetrics());
        metrics.recordOperation(operation, duration);
    }
    
    private void collectMetrics() {
        System.out.println("=== 记忆性能监控 ===");
        metricsMap.forEach((userId, metrics) -> {
            System.out.println("用户 " + userId + ": " + metrics.getSummary());
        });
    }
    
    public void shutdown() {
        scheduler.shutdown();
    }
    
    // 内部类：记忆指标
    static class MemoryMetrics {
        private final Map<String, List<Long>> operationTimes;
        private final AtomicLong totalOperations;
        
        public MemoryMetrics() {
            this.operationTimes = new ConcurrentHashMap<>();
            this.totalOperations = new AtomicLong(0);
        }
        
        public void recordOperation(String operation, long duration) {
            operationTimes.computeIfAbsent(operation, k -> new ArrayList<>()).add(duration);
            totalOperations.incrementAndGet();
        }
        
        public String getSummary() {
            StringBuilder summary = new StringBuilder();
            summary.append("总操作数: ").append(totalOperations.get());
            
            operationTimes.forEach((op, times) -> {
                double avgTime = times.stream().mapToLong(Long::longValue).average().orElse(0.0);
                summary.append(", ").append(op).append("平均耗时: ").append(String.format("%.2fms", avgTime));
            });
            
            return summary.toString();
        }
    }
}

public class JavaMemoryImplementationExample {
    public static void main(String[] args) {
        ChatModel model = QwenChatModel.builder()
                .apiKey("your-api-key")
                .modelName("qwen-max")
                .temperature(0.6f)
                .build();
        
        ComprehensiveMemorySystem memorySystem = new ComprehensiveMemorySystem(model);
        MemoryPerformanceMonitor monitor = new MemoryPerformanceMonitor();
        
        System.out.println("=== Java 环境记忆系统演示 ===");
        
        // 创建多个用户的助手
        String[] userIds = {"yupi", "xiaoming", "xiaoli"};
        Map<String, IntelligentAssistant> userAssistants = new HashMap<>();
        
        for (String userId : userIds) {
            userAssistants.put(userId, memorySystem.createAssistantForUser(userId));
        }
        
        // 创建共享知识助手
        SharedKnowledgeAssistant sharedAssistant = memorySystem.createSharedAssistant();
        
        // 模拟多用户对话
        System.out.println("--- 多用户独立记忆测试 ---");
        
        // 用户1的对话
        String userId1 = "yupi";
        IntelligentAssistant assistant1 = userAssistants.get(userId1);
        
        long startTime = System.currentTimeMillis();
        String response1 = assistant1.chat("我是程序员鱼皮，想学习Java算法");
        long duration1 = System.currentTimeMillis() - startTime;
        monitor.recordMemoryOperation(userId1, "chat", duration1);
        
        System.out.println("用户" + userId1 + "：我是程序员鱼皮，想学习Java算法");
        System.out.println("助手：" + response1);
        
        // 用户2的对话
        String userId2 = "xiaoming";
        IntelligentAssistant assistant2 = userAssistants.get(userId2);
        
        startTime = System.currentTimeMillis();
        String response2 = assistant2.chat("我想学习Python数据分析");
        long duration2 = System.currentTimeMillis() - startTime;
        monitor.recordMemoryOperation(userId2, "chat", duration2);
        
        System.out.println("\n用户" + userId2 + "：我想学习Python数据分析");
        System.out.println("助手：" + response2);
        
        // 继续用户1的对话，测试记忆连贯性
        startTime = System.currentTimeMillis();
        String response3 = assistant1.chat("我对递归算法特别感兴趣");
        long duration3 = System.currentTimeMillis() - startTime;
        monitor.recordMemoryOperation(userId1, "chat", duration3);
        
        System.out.println("\n用户" + userId1 + "：我对递归算法特别感兴趣");
        System.out.println("助手：" + response3);
        
        // 测试共享知识助手
        System.out.println("\n--- 共享知识助手测试 ---");
        String sharedResponse1 = sharedAssistant.shareKnowledge("session1", "Java和Python哪个更适合初学者？");
        System.out.println("问题：Java和Python哪个更适合初学者？");
        System.out.println("共享助手：" + sharedResponse1);
        
        String sharedResponse2 = sharedAssistant.shareKnowledge("session2", "刚才有人问过类似的问题吗？");
        System.out.println("\n问题：刚才有人问过类似的问题吗？");
        System.out.println("共享助手：" + sharedResponse2);
        
        // 显示记忆统计
        System.out.println("\n--- 记忆系统统计 ---");
        Map<String, Integer> memoryStats = memorySystem.getUserMemoryStats();
        memoryStats.forEach((userId, messageCount) -> 
            System.out.println("用户 " + userId + " 的记忆消息数：" + messageCount));
        
        // 测试记忆清理
        System.out.println("\n--- 记忆清理测试 ---");
        System.out.println("清理用户 " + userId2 + " 的记忆");
        memorySystem.clearUserMemory(userId2);
        
        // 验证清理效果
        String response4 = assistant2.chat("我们之前聊过什么？");
        System.out.println("用户" + userId2 + "：我们之前聊过什么？");
        System.out.println("助手：" + response4);
        
        // 等待性能监控输出
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // 关闭监控器
        monitor.shutdown();
    }
}
```

这段程序输出结果：

```plain
▼plain复制代码=== Java 环境记忆系统演示 ===
--- 多用户独立记忆测试 ---
用户yupi：我是程序员鱼皮，想学习Java算法
助手：你好程序员鱼皮！很高兴帮助你学习Java算法。基于你的背景，我建议从数据结构基础开始...

用户xiaoming：我想学习Python数据分析
助手：Python是数据分析的优秀选择！我建议你从pandas和numpy这两个核心库开始学习...

用户yupi：我对递归算法特别感兴趣
助手：很好！结合你之前提到的Java算法学习目标，递归确实是一个重要的算法思想...

--- 共享知识助手测试 ---
问题：Java和Python哪个更适合初学者？
共享助手：这是一个很好的问题。根据我的了解，两种语言都有各自的优势...

问题：刚才有人问过类似的问题吗？
共享助手：是的，刚才确实有关于编程语言选择的讨论...

--- 记忆系统统计 ---
用户 yupi 的记忆消息数：4
用户 xiaoming 的记忆消息数：2
用户 xiaoli 的记忆消息数：0

--- 记忆清理测试 ---
清理用户 xiaoming 的记忆
用户xiaoming：我们之前聊过什么？
助手：我没有找到我们之前的对话记录。让我们重新开始吧！

=== 记忆性能监控 ===
用户 yupi: 总操作数: 2, chat平均耗时: 1234.50ms
用户 xiaoming: 总操作数: 1, chat平均耗时: 987.00ms
```

通过深入理解和掌握记忆功能的各种技术，你就能够构建出具有真正智能对话能力的 AI 应用。无论是开发编程导航的学习助手，还是优化面试鸭的面试体验，有效的记忆管理都是成功的关键要素。

## 练习题

### 练习题 1（基础）：实现一个简单的用户偏好记忆系统

为剪切助手设计一个用户偏好记忆系统，能够记住用户的分类习惯、常用功能和操作偏好，并在后续使用中提供个性化建议。

参考答案：

```java
▼java复制代码class UserPreferenceMemory {
    private final Map<String, Map<String, Integer>> userPreferences;
    private final Map<String, List<String>> recentActions;
    
    public UserPreferenceMemory() {
        this.userPreferences = new ConcurrentHashMap<>();
        this.recentActions = new ConcurrentHashMap<>();
    }
    
    public void recordUserAction(String userId, String action, String category) {
        // 记录偏好统计
        userPreferences.computeIfAbsent(userId, k -> new ConcurrentHashMap<>())
                      .merge(category, 1, Integer::sum);
        
        // 记录最近操作
        recentActions.computeIfAbsent(userId, k -> new ArrayList<>()).add(action);
        
        // 保持最近操作列表大小
        List<String> actions = recentActions.get(userId);
        if (actions.size() > 10) {
            actions.remove(0);
        }
    }
    
    public String getPersonalizedSuggestion(String userId, String currentContent) {
        Map<String, Integer> preferences = userPreferences.get(userId);
        if (preferences == null || preferences.isEmpty()) {
            return "建议将内容分类到常用类别";
        }
        
        // 找到最常用的分类
        String mostUsedCategory = preferences.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("默认");
        
        return "基于您的使用习惯，建议将此内容分类到：" + mostUsedCategory;
    }
    
    public Map<String, Integer> getUserPreferences(String userId) {
        return userPreferences.getOrDefault(userId, new HashMap<>());
    }
}
```

**练习题 2（高级）：构建一个多层级的智能记忆管理系统**

为面试鸭设计一个完整的记忆管理系统，包括短期对话记忆、中期会话记忆和长期用户画像记忆，支持智能的记忆迁移和压缩。

参考答案：3SdhPNReyfSez0Q4gOc0v6ykW2hqke4CnFnKQxaIhL8=

```java
▼java复制代码

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatModel;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

class HierarchicalMemoryManager {
    // 短期记忆：当前对话
    private final Map<String, MessageWindowChatMemory> shortTermMemory;

    // 中期记忆：会话摘要
    private final Map<String, List<SessionSummary>> mediumTermMemory;

    // 长期记忆：用户画像
    private final Map<String, UserProfile> longTermMemory;

    private final ChatModel model;
    private final ScheduledExecutorService memoryManager;

    public HierarchicalMemoryManager(ChatModel model) {
        this.model = model;
        this.shortTermMemory = new ConcurrentHashMap<>();
        this.mediumTermMemory = new ConcurrentHashMap<>();
        this.longTermMemory = new ConcurrentHashMap<>();
        this.memoryManager = Executors.newScheduledThreadPool(2);

        // 定期进行记忆迁移和压缩
        memoryManager.scheduleAtFixedRate(this::performMemoryMigration, 30, 30, TimeUnit.MINUTES);
    }

    public String processMessage(String userId, String message) {
        // 获取或创建短期记忆
        MessageWindowChatMemory shortMemory = shortTermMemory.computeIfAbsent(
                userId, k -> MessageWindowChatMemory.withMaxMessages(10)
        );

        // 添加用户消息到短期记忆
        shortMemory.add(new UserMessage(message));

        // 基于多层记忆生成回复
        String response = generateResponseWithHierarchicalMemory(userId, message);

        // 添加AI回复到短期记忆
        shortMemory.add(new AiMessage(response));

        return response;
    }

    private String generateResponseWithHierarchicalMemory(String userId, String message) {
        StringBuilder context = new StringBuilder();

        // 添加长期记忆（用户画像）
        UserProfile profile = longTermMemory.get(userId);
        if (profile != null) {
            context.append("用户画像：").append(profile.getSummary()).append("\n");
        }

        // 添加中期记忆（相关会话摘要）
        List<SessionSummary> sessions = mediumTermMemory.get(userId);
        if (sessions != null && !sessions.isEmpty()) {
            context.append("历史会话摘要：\n");
            sessions.stream().limit(3).forEach(session ->
                    context.append("- ").append(session.getSummary()).append("\n"));
        }

        // 添加短期记忆（当前对话）
        MessageWindowChatMemory shortMemory = shortTermMemory.get(userId);
        if (shortMemory != null) {
            context.append("当前对话：\n");
            shortMemory.messages().forEach(msg -> {
                String role = msg instanceof UserMessage ? "用户" : "面试官";
                context.append(role).append("：").append(getMessageContent(msg)).append("\n");
            });
        }

        context.append("\n当前消息：").append(message);
        context.append("\n请基于以上信息生成专业的面试回复。");

        try {
            return model.chat(context.toString());
        } catch (Exception e) {
            return "面试继续进行中，请继续您的回答。";
        }
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
    private void performMemoryMigration() {
        System.out.println("开始执行记忆迁移...");

        shortTermMemory.forEach((userId, shortMemory) -> {
            if (shortMemory.messages().size() >= 8) {
                // 将短期记忆压缩为会话摘要
                CompletableFuture.supplyAsync(() -> {
                    try {
                        String summary = compressToSessionSummary(shortMemory.messages());
                        SessionSummary sessionSummary = new SessionSummary(summary, System.currentTimeMillis());

                        mediumTermMemory.computeIfAbsent(userId, k -> new ArrayList<>()).add(sessionSummary);

                        // 清理短期记忆，保留最近2条消息
                        List<dev.langchain4j.data.message.ChatMessage> messages = shortMemory.messages();
                        shortMemory.clear();
                        if (messages.size() >= 2) {
                            shortMemory.add(messages.get(messages.size() - 2));
                            shortMemory.add(messages.get(messages.size() - 1));
                        }

                        return null;
                    } catch (Exception e) {
                        System.err.println("记忆迁移失败：" + e.getMessage());
                        return null;
                    }
                });
            }
        });

        // 更新长期记忆（用户画像）
        mediumTermMemory.forEach((userId, sessions) -> {
            if (sessions.size() >= 5) {
                CompletableFuture.runAsync(() -> updateUserProfile(userId, sessions));
            }
        });
    }

    private String compressToSessionSummary(List<dev.langchain4j.data.message.ChatMessage> messages) {
        StringBuilder conversation = new StringBuilder();
        messages.forEach(msg -> {
            String role = msg instanceof UserMessage ? "候选人" : "面试官";
            conversation.append(role).append("：").append(getMessageContent(msg)).append("\n");
        });

        String prompt = "请将以下面试对话压缩为简洁的摘要：\n" + conversation.toString();
        return model.chat(prompt);
    }

    private void updateUserProfile(String userId, List<SessionSummary> sessions) {
        try {
            StringBuilder profileContext = new StringBuilder();
            profileContext.append("基于以下面试会话摘要，更新用户画像：\n");

            sessions.forEach(session ->
                    profileContext.append("- ").append(session.getSummary()).append("\n"));

            profileContext.append("\n请生成用户的技能水平、面试表现、改进建议等画像信息。");

            String profileUpdate = model.chat(profileContext.toString());

            UserProfile profile = longTermMemory.computeIfAbsent(userId, k -> new UserProfile(userId));
            profile.updateProfile(profileUpdate);

            System.out.println("更新用户画像：" + userId);

        } catch (Exception e) {
            System.err.println("用户画像更新失败：" + e.getMessage());
        }
    }

    static class SessionSummary {
        private final String summary;
        private final long timestamp;

        public SessionSummary(String summary, long timestamp) {
            this.summary = summary;
            this.timestamp = timestamp;
        }

        public String getSummary() { return summary; }
        public long getTimestamp() { return timestamp; }
    }

    static class UserProfile {
        private final String userId;
        private String profileSummary;
        private long lastUpdated;

        public UserProfile(String userId) {
            this.userId = userId;
            this.profileSummary = "新用户，暂无画像信息";
            this.lastUpdated = System.currentTimeMillis();
        }

        public void updateProfile(String newSummary) {
            this.profileSummary = newSummary;
            this.lastUpdated = System.currentTimeMillis();
        }

        public String getSummary() { return profileSummary; }
        public String getUserId() { return userId; }
        public long getLastUpdated() { return lastUpdated; }
    }

    public void shutdown() {
        memoryManager.shutdown();
    }
}
```
