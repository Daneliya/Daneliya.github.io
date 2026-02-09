---
url: /常用框架/SpringAIAlibaba/1_SpringAIAlibaba概览.md
---

# Spring AI Alibaba 概览

## 一、简介

**Spring AI Alibaba** 是阿里云推出的面向 Java 开发者的开源 AI 应用开发框架，基于 Spring AI 构建，旨在简化生成式 AI 应用的开发。它深度集成了阿里云通义系列大模型及云原生基础设施，提供高层次的 AI API 抽象，帮助开发者快速构建智能化应用。

## 二、项目架构

![Architecture](/assets/architecture-155a1907f1260526a6d192649944300b.BPLf5Dn8.png)

Spring AI Alibaba 项目从架构上包含如下三层：

* **Agent Framework**，是一个以 ReactAgent 设计理念为核心的 Agent 开发框架，使开发者能够构建具备自动上下文工程和人机交互等核心能力的Agent。
* **Graph**，graph 是一个低级别的工作流和多代理协调框架，能够帮助开发者实现复杂的应用程序编排，它具备丰富的预置节点和简化的图状态定义，Graph 是 Agent Framework 的底层运行时基座。
* **Augmented LLM**，以 Spring AI 框架底层原子抽象为基础，为构建大型语言模型（LLM）应用提供基础抽象，例如模型（Model）、工具（Tool）、多模态组件（MCP）、消息（Message）、向量存储（Vector Store）等。

## 三、设计原则

Spring AI Alibaba 推荐使用 Agent Framework 内置的 `ReactAgent` 抽象快速构建 Agent 应用。

如果需要组合 Multi-agent，Agent Framework 还预置了如 `SequentialAgent（顺序代理）` 、`ParallelAgent（并行代理）` 、`RoutingAgent（路由代理）` 和 `LoopAgent（循环代理）` 等基础多智能体工作流模式。

对于一些开发场景而言，直接使用 `Graph API` 也是可行的，它能为应用开发提供更灵活的编排、更直接的状态控制，适用于需要超高可靠性、大量自定义逻辑、需要精确控制延迟时的场景。

## 四、示例

引入JAR包

```xml
<dependency>
    <groupId>com.alibaba.cloud.ai</groupId>
    <artifactId>spring-ai-alibaba-agent-framework</artifactId>
    <version>1.1.0.0-M5</version>
</dependency>

<dependency>
    <groupId>com.alibaba.cloud.ai</groupId>
    <artifactId>spring-ai-alibaba-starter-dashscope</artifactId>
    <version>1.1.0.0-M5</version>
</dependency>
```

代码示例

```java
import com.alibaba.cloud.ai.dashscope.api.DashScopeApi;
import com.alibaba.cloud.ai.dashscope.chat.DashScopeChatModel;
import com.alibaba.cloud.ai.graph.agent.ReactAgent;
import com.alibaba.cloud.ai.graph.CompileConfig;

import org.springframework.ai.chat.model.ChatModel;

public class AgentExample {

    public static void main(String[] args) throws Exception {
        // 创建模型实例
        DashScopeApi dashScopeApi = DashScopeApi.builder()
            .apiKey(System.getenv("AI_DASHSCOPE_API_KEY"))
            .build();
        ChatModel chatModel = DashScopeChatModel.builder()
            .dashScopeApi(dashScopeApi)
            .build();

        // 创建 Agent
        ReactAgent agent = ReactAgent.builder()
            .name("weather_agent")
            .model(chatModel)
            .instruction("You are a helpful weather forecast assistant.")
            .build();

        // 运行 Agent
        agent.call("what is the weather in Hangzhou?");
    }
}
```

## 五、核心特性

Spring AI Alibaba 提供了丰富的功能，支持开发复杂的 AI 应用。以下是其主要特性：

* **模型交互与适配**：支持文本、图像、语音等多模态输入输出，提供同步、异步及流式通信模式。

* **提示词模板管理**：通过 Prompt Template 简化提示词的定义与动态替换。

* **结构化输出**：将非格式化的模型输出自动转换为 JavaBean，确保数据格式一致性。

* **函数调用**：支持 Function Calling，模型可调用预定义函数辅助完成任务。

* **检索增强（RAG）**：结合向量数据库，实现上下文增强的模型交互。

* **多轮对话支持**：通过 Chat Memory 管理对话上下文，支持连续对话。

* **ReactAgent**：构建具有推理和行动能力的智能代理，遵循 ReAct（推理 + 行动）范式，用于迭代解决问题。

* **多代理编排**：使用内置模式（包括 `SequentialAgent1`、`ParallelAgent`、`LlmRoutingAgent`和`LoopAgent`）组合多个代理，以执行复杂的任务。

* **上下文工程**：内置快速工程、上下文管理和对话流控制的最佳实践，以提高代理的可靠性和性能。

* **人机协同**：将人工反馈和审批步骤无缝集成到代理工作流程中，从而实现关键工具和操作的监督执行。

* **流式传输支持**：代理响应的实时流式传输

* **错误处理**：强大的错误恢复和重试机制

* **基于图的工作流**：基于图的工作流运行时和 API，用于条件路由、嵌套图、并行执行和状态管理。可将工作流导出为 PlantUML 和 Mermaid 格式。

* **A2A 支持**：通过 Nacos 集成支持代理间通信，实现跨服务的分布式代理协调和协作。

* **丰富的模型、工具和 MCP 支持**：利用 Spring AI 的核心概念，支持多种 LLM 提供程序（DashScope、OpenAI 等）、工具调用和模型上下文协议 (MCP)。
