---
url: /Python/AI大模型应用开发/14_CSV数据分析智能工具.md
---

# CSV数据分析智能工具

## 一、项目介绍

本次项目是开发一款基于 Agent 的 CSV 数据分析智能工具，通过整合大语言模型与数据处理能力，实现对 CSV 文档的精准分析、可视化展示及数据提取，确保回答基于实际数据而非 “编造”。以下是其核心功能、使用流程及优势：

### 1、核心功能与使用流程

#### 1. 前期准备：API 密钥与文档上传

* **API 密钥配置**：左侧侧边栏提供 API 密钥输入框，用户需填写自有密钥以驱动模型（如 OpenAI API）。
* **CSV 格式限制**：仅支持`.csv`后缀文件上传，自动过滤其他格式（如 Excel、TXT），避免解析错误。

#### 2. 数据预览：交互式表格展示

* 上传 CSV 后，工具自动加载数据并以**交互式表格**展示（支持排序、搜索、全屏预览），方便用户快速了解数据结构（如列名、部分行内容）。

#### 3. 核心功能：问答、可视化与数据提取

##### （1）精准回答数据问题

* **示例**：提问 “数据集里所有房子卧室数的平均值是多少？”，工具返回准确结果（基于 500 + 行数据计算）。
* 原理：Agent 不直接传递全量数据，而是：
  1. 向模型发送数据前几行（帮助理解结构）；
  2. 模型生成计算所需的 Python 代码（如`df['卧室数'].mean()`）；
  3. 执行代码并返回结果，确保准确性。

#### （2）数据可视化展示

* 支持生成**散点图、折线图、条形图**等，直观呈现数据特征。
* 示例：“用条形图展示所有房子的装修状态”，工具自动：
  1. 生成提取 “装修状态” 数据的代码；
  2. 统计各状态的数量；
  3. 绘制条形图（支持悬停查看具体数值）。

#### （3）精准数据提取

* 支持按条件筛选数据，如 “提取所有价格高于 1000 万的房子”。
* **效果**：工具返回符合条件的记录（如示例中 8 套房子），并以表格形式展示，方便用户进一步分析。

### 2、技术优势

1. **准确性保障**
   基于 Agent 执行 Python 代码（而非模型直接猜测），确保计算结果、筛选数据与原始 CSV 一致。
2. **高效处理大量数据**
   无需传递全量数据给模型，仅通过代码逻辑处理，解决 “数据量过大超出模型上下文” 的问题，同时节省 Token 成本。
3. **交互友好**
   表格与图表均支持交互（排序、搜索、悬停查看），降低非技术用户的使用门槛。
4. **可追溯性**
   后台打印 Agent 执行流程（代码生成、执行步骤），方便用户验证结果可靠性。

### 3、适用场景

* 数据分析初学者：无需编写代码，通过自然语言获取数据洞察；
* 业务人员：快速提取关键数据（如高价值客户、热销产品）；
* 研究者：可视化数据分布（如变量相关性、分类统计）。

该工具通过 Agent 将 “自然语言提问” 转化为 “代码自动执行”，实现了 CSV 数据的 “零代码” 分析，兼顾准确性与易用性。

## 二、创建AI请求

工具的核心是通过封装`DataFrame Agent`函数，实现对用户 CSV 数据的提问、提取、可视化等需求的精准响应。该函数将用户请求转化为 AI 可执行的任务，并规范返回格式，以便前端根据内容类型（文本、表格、图表）进行差异化展示。以下是具体实现步骤与逻辑：

### 1、前期准备：项目初始化与依赖安装

#### 1. 项目结构

```markdown
CSV数据分析工具/
├─ data_agent.py  # 核心逻辑：与AI交互的DataFrame Agent函数
├─ requirements.txt  # 依赖清单
└─ sample_data.csv  # 示例CSV数据（测试用）
```

#### 2. 依赖安装

通过`requirements.txt`安装所需库（终端执行）：

```sh
pip install -r requirements.txt
```

关键依赖：`langchain`（Agent 框架）、`langchain-experimental`（DataFrame Agent 工具）、`pandas`（数据处理）、`openai`（模型调用）、`streamlit`（前端基础，后续用）。

### 2、核心函数`dataframe_agent`实现

该函数接收用户 API 密钥、DataFrame（表格数据）、用户请求，返回规范格式的响应（文本、表格或图表数据），供前端展示。

【utils.py】完整代码

```python
import json
from langchain_openai import ChatOpenAI
from langchain_experimental.agents.agent_toolkits import create_pandas_dataframe_agent

# 定义响应格式提示词
# 为确保 Agent 返回的内容可被前端正确解析，需规范输出格式（文本→answer键，表格→table键，图表→bar/line/scatter键）：
PROMPT_TEMPLATE = """
你是一位数据分析助手，你的回应内容取决于用户的请求内容。

1. 对于文字回答的问题，按照这样的格式回答：
   {"answer": "<你的答案写在这里>"}
例如：
   {"answer": "订单量最高的产品ID是'MNWC3-067'"}

2. 如果用户需要一个表格，按照这样的格式回答：
   {"table": {"columns": ["column1", "column2", ...], "data": [[value1, value2, ...], [value1, value2, ...], ...]}}

3. 如果用户的请求适合返回条形图，按照这样的格式回答：
   {"bar": {"columns": ["A", "B", "C", ...], "data": [34, 21, 91, ...]}}

4. 如果用户的请求适合返回折线图，按照这样的格式回答：
   {"line": {"columns": ["A", "B", "C", ...], "data": [34, 21, 91, ...]}}

5. 如果用户的请求适合返回散点图，按照这样的格式回答：
   {"scatter": {"columns": ["A", "B", "C", ...], "data": [34, 21, 91, ...]}}
注意：我们只支持三种类型的图表："bar", "line" 和 "scatter"。


请将所有输出作为JSON字符串返回。请注意要将"columns"列表和数据列表中的所有字符串都用双引号包围。
例如：{"columns": ["Products", "Orders"], "data": [["32085Lip", 245], ["76439Eye", 178]]}

你要处理的用户请求如下： 
"""

# 参数说明：
# openai_api_key：用户提供的OpenAI API密钥
# df：pandas.DataFrame对象（用户上传的CSV数据）
# user_query：用户的问题或需求（如“计算平均值”“提取高价房源”“画条形图”）
# 返回值：字典（含answer/table/bar/line/scatter等键，对应不同内容类型）
def dataframe_agent(openai_api_key, df, query):
    # 初始化模型（低随机性，确保遵循REACT框架和格式要求）
    model = ChatOpenAI(
        model="gpt-4-turbo",
        openai_api_key=openai_api_key,
        temperature=0 # 温度设为0，避免模型“自由发挥”导致格式错误
    )
    # 创建Agent执行器（整合模型与DataFrame）
    agent = create_pandas_dataframe_agent(
        llm=model,
        df=df, # 传入待分析的DataFrame
        agent_executor_kwargs={"handle_parsing_errors": True}, # 让模型自行处理解析错误
        verbose=True # 打印思考过程（便于调试）
    )
    prompt = PROMPT_TEMPLATE + query
    response = agent.invoke({"input": prompt})
    response_dict = json.loads(response["output"])
    return response_dict
```

### 3、函数测试：验证核心功能

以 “分析职业数据” 为例，测试`dataframe_agent`的有效性：

```python
import pandas as pd
import os

# 加载示例CSV数据（含“职业”列）
df = pd.read_csv("sample_data.csv")

# 从环境变量获取API密钥（实际使用中由用户输入）
api_key = os.getenv("OPENAI_API_KEY")

# 测试：查询数据中出现最多的职业
result = dataframe_agent(
    openai_api_key=api_key,
    df=df,
    user_query="数据中出现次数最多的职业是什么？"
)

print(result)  # 输出：{"answer": "数据中出现次数最多的职业是healthcare"}
```

执行过程解析（`verbose=True`时打印）

```sh
> 推理：需统计“职业”列的出现次数，找到最大值。
> 行动：生成代码`df['职业'].value_counts().idxmax()`，执行后得到结果“healthcare”。
> 观察：代码返回“healthcare”。
> 推理：符合文本回答需求，按格式返回{"answer": "..."}。
> 输出：{"answer": "数据中出现次数最多的职业是healthcare"}
```

### 4、关键逻辑说明

1. **格式约束**：通过提示词强制 Agent 返回 JSON 格式，确保前端能根据键（`answer`/`table`等）判断展示方式。
2. **错误处理**：`handle_parsing_errors=True`让模型自行修正格式错误，降低解析失败概率。
3. **效率优化**：Agent 仅通过代码处理 DataFrame（而非传递全量数据），节省 Token 并避免模型 “记忆过载”。

## 三、创建网站页面

### 1、前期准备

#### 1. 新建前端文件

创建`main.py`作为前端主文件，导入核心依赖：

```python
import pandas as pd
import streamlit as st
from utils import dataframe_agent # 导入后端交互函数
```

#### 2. 页面基础配置

1. 设置页面标题
2. 侧边栏：API密钥输入

### 2、核心功能实现

1. CSV 文件上传与数据预览
2. 用户输入与请求提交
3. 后端交互与结果展示：根据用户点击事件，调用`dataframe_agent`并处理返回结果（文本、表格、图表）。

【main.py】完整代码示例

```python
# 导入所需库：pandas处理数据，streamlit构建网页，dataframe_agent处理AI交互
import pandas as pd
import streamlit as st
from utils import dataframe_agent


# 定义图表创建函数：根据数据和类型生成对应图表
def create_chart(input_data, chart_type):
    # 将输入数据转换为DataFrame（表格形式）
    df_data = pd.DataFrame(input_data["data"], columns=input_data["columns"])
    # 把第一列设为索引（作为图表的横轴）
    df_data.set_index(input_data["columns"][0], inplace=True)
    # 根据图表类型绘制对应图表
    if chart_type == "bar":
        st.bar_chart(df_data)  # 条形图
    elif chart_type == "line":
        st.line_chart(df_data)  # 折线图
    elif chart_type == "scatter":
        st.scatter_chart(df_data)  # 散点图

# 设置网页标题
st.title("💡 CSV数据分析智能工具")

# 侧边栏：用于输入OpenAI API密钥
with st.sidebar:
    openai_api_key = st.text_input("请输入OpenAI API密钥：", type="password")
    # 显示获取API密钥的链接
    st.markdown("[获取OpenAI API key](https://platform.openai.com/account/api-keys)")

# 文件上传器：仅允许上传CSV文件
data = st.file_uploader("上传你的数据文件（CSV格式）：", type="csv")
# 如果用户上传了文件
if data:
    # 读取CSV数据并保存到会话状态（避免重复读取）
    st.session_state["df"] = pd.read_csv(data)
    # 折叠面板：展示原始数据表格
    with st.expander("原始数据"):
        st.dataframe(st.session_state["df"])

# 文本输入框：用户输入问题、数据提取或可视化请求
query = st.text_area("请输入你关于以上表格的问题，或数据提取请求，或可视化要求（支持散点图、折线图、条形图）：")
# 生成回答按钮
button = st.button("生成回答")

# 按钮点击后的逻辑处理
# 情况1：点击了按钮但未输入API密钥
if button and not openai_api_key:
    st.info("请输入你的OpenAI API密钥")
# 情况2：点击了按钮但未上传数据
if button and "df" not in st.session_state:
    st.info("请先上传数据文件")
# 情况3：点击了按钮，且密钥和数据都已提供
if button and openai_api_key and "df" in st.session_state:
    # 显示加载状态，提示用户等待
    with st.spinner("AI正在思考中，请稍等..."):
        # 调用后端函数，获取AI的响应（字典形式）
        response_dict = dataframe_agent(openai_api_key, st.session_state["df"], query)
        # 如果响应是文本回答，直接展示
        if "answer" in response_dict:
            st.write(response_dict["answer"])
        # 如果响应是表格数据，用表格展示
        if "table" in response_dict:
            st.table(pd.DataFrame(
                response_dict["table"]["data"],  # 表格内容
                columns=response_dict["table"]["columns"]  # 列名
            ))
        # 如果响应是条形图数据，调用函数生成条形图
        if "bar" in response_dict:
            create_chart(response_dict["bar"], "bar")
        # 如果响应是折线图数据，调用函数生成折线图
        if "line" in response_dict:
            create_chart(response_dict["line"], "line")
        # 如果响应是散点图数据，调用函数生成散点图
        if "scatter" in response_dict:
            create_chart(response_dict["scatter"], "scatter")
```

### 3、功能测试与效果

#### 1. 测试场景 1：数据提问

* **用户输入**：“所有用户的平均年龄是多少？”
* **结果**：AI 返回文本回答（如 “平均年龄为 35.2 岁”），通过`answer`键展示。

#### 2. 测试场景 2：数据提取

* **用户输入**：“提取年龄大于 30 的客户数据”
* **结果**：AI 返回表格数据（含列名和符合条件的行），通过`table`键以交互式表格展示。

#### 3. 测试场景 3：图表可视化

* **用户输入**：“用条形图展示各职业的人数分布”
* **结果**：AI 返回图表数据，通过`bar`键调用`st.bar_chart`展示，支持悬停查看具体数值。
