---
url: /Java/解决方案/工具类/POI.md
---

# Excel数据导出

分两大类：**传统POI系（.xls/.xlsx）**、**新一代轻量化/高性能方案**，还有封装好的工具框架，按项目选型直接挑。

> 格式说明：
>
> * `.xls`：Excel97-2003，最大65536行，HSSF
> * `.xlsx`：Excel2007+，XSSF / SXSSF（大数据量）

## 1. Apache POI（最经典，使用最多）

底层原生方案，所有导出框架基本都是封装它。 依赖：

```xml
<!-- xlsx 基础 -->
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>5.2.5</version>
</dependency>
```

### 三个模式

1. **HSSF（.xls）**：少量数据，上限65536行，现在很少用

2. **XSSF（.xlsx）**：全部数据加载内存，**数据量大OOM**，适合万行以内

3. **SXSSF（.xlsx，重点）**：滑动窗口，只保留窗口内数据在内存，**百万级导出首选**，会生成临时文件，注意清理

   ✅ 优点：灵活，样式、合并单元格、批注、图片、公式都支持

   ❌ 缺点：原生API繁琐，代码量大；SXSSF有临时文件坑；大文件CPU/内存仍有压力

## 2. EasyExcel（阿里，国内业务首选⭐推荐）

**对POI SXSSF封装，解决POI内存爆炸问题**，几乎是国内后台导出标配

* 底层：POI SXSSF
* 特性：**一行一行读/写，低内存**，百万行导出不容易OOM；注解驱动，代码简洁；自动样式、合并、下拉、字典转换

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>easyexcel</artifactId>
    <version>3.3.2</version>
</dependency>
```

✅ 优点：上手快、文档多、社区活跃、适配SpringBoot、支持模板填充（fill）

❌ 缺点：复杂定制样式（精细画布、复杂公式）不如原生POI自由；版本迭代慢一点

> 适合场景：管理后台列表导出、模板填充导出（合同/报表）

## 3. Hutool POI（Hutool工具包）

对POI轻量封装，API极简，适合简单导出，**不适合超大百万行**

```xml
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-poi</artifactId>
    <version>5.8.30</version>
</dependency>
```

✅ 优点：一行代码导出，快速开发，小数据量很香

❌ 缺点：底层是XSSF，大数据直接OOM；复杂样式能力弱

## 4. Alibaba EasyPoi

也是POI封装，主打**模板导出（word/excel）**，基于注解+模板语法

✅ 适合：固定模板报表、带图片、循环行模板填充

❌ 缺点：更新慢，大数据导出性能一般，新项目优先EasyExcel

## 5. Apache POI-OOXML Streaming / Excel Streaming Reader

偏底层流式，一般很少手写，是EasyExcel底层原理

## 6. 其他小众方案

### (1) Aspose.Cells

商业收费组件，功能极强，支持复杂公式、宏、加密、图表；**不推荐商用无授权，有版权风险**

### (2) LibreOffice / OpenOffice 后台转码（不是Java生成）

Java调用LibreOffice，把html/pdf/csv转Excel。适合复杂排版、已有模板文件渲染，性能差，需要服务器装LibreOffice，依赖环境。

### (3) CSV导出（伪Excel）

直接输出逗号分隔csv，用Excel打开。**不是真Excel，无样式、合并单元格**，优点：速度极快、内存极低，超大清单导出备选；缺点：编码、中文乱码坑多，不能放格式。

## 7. 新一代无POI方案（新方向）

### FastExcel（独立实现，不依赖POI）

纯自研解析写入，脱离POI包，包体积更小、性能更好，国内开源

> github: alibaba/fastexcel（注意和easyexcel区分）

## 📋选型速查表

| 方案            | 底层      | 适合数据量            | 优势                             | 短板                         |
| --------------- | --------- | --------------------- | -------------------------------- | ---------------------------- |
| POI原生SXSSF    | POI       | 十万~百万             | 自由度最高，所有样式自定义       | 代码繁琐，要自己处理临时文件 |
| EasyExcel       | POI SXSSF | 千~百万（业务最常用） | 注解、低内存、模板填充、文档完善 | 极致复杂样式略麻烦           |
| Hutool-poi      | POI XSSF  | <1万行简单导出        | 代码极简，快速开发               | 大数据OOM                    |
| EasyPoi         | POI       | 模板报表              | 模板循环渲染强                   | 维护活跃度低                 |
| CSV             | 无        | 超大纯文本清单        | 速度最快，几乎不占内存           | 无样式，不是标准xlsx         |
| LibreOffice转码 | 软件调用  | 复杂固定排版          | 支持宏、复杂原生Excel效果        | 环境依赖、慢、稳定性差       |

## ✅ 生产项目常规推荐

1. **普通后台列表导出、大部分业务** → **EasyExcel**（首选）
2. **需要极其精细样式、图表、复杂公式、自定义合并逻辑** → 原生POI SXSSF
3. **简单小量导出、工具脚本** → Hutool poi
4. **超大量只需要纯数据，不需要样式** → CSV
5. 模板填充类报表：优先EasyExcel Fill填充模式

## 补充踩坑提醒

1. SXSSF/EasyExcel导出完，一定要 `finish()`，否则临时文件留在服务器磁盘占满
2. SpringBoot Web导出：用response输出流，不要先生成本地文件再读（容易磁盘爆满）
3. 百万级导出：**分页查数据库 + 流式写Excel**，不要一次性查出全表数据放内存
4. 导出加异步：量大导出不要同步接口，异步任务+下载链接（避免接口超时）

# Word 模板渲染

> 重点：**都是拿做好的docx模板，填入变量、循环表格、图片、条件隐藏内容**，优先 `.docx`，老 `.doc` 格式支持很差，尽量不用

## 1. poi-tl（⭐现在国内首选，强烈推荐）

底层：Apache POI，Apache2.0开源免费可商用 模板语法：{{name}}，直接在Word/WPS里写标签，**不用改xml、不用解压docx**

✅ 能力：文本、图片、表格循环、条件if隐藏、嵌套子文档、页眉页脚、文本框、自定义插件；样式完全保留模板里的字体、行距、缩进

✅ 优点：上手最简单、文档清晰、社区活跃、SpringBoot友好；专门做word模板引擎，定位就是模板渲染

❌ 缺点：复杂到极致的自定义DOM操作不如原生POI/docx4j；不支持老doc

```xml
<dependency>
    <groupId>com.deepoove</groupId>
    <artifactId>poi-tl</artifactId>
    <version>1.12.2</version>
</dependency>
```

> 适合：合同、证明、报告单、带循环表格、图片的业务模板（绝大多数后台需求）

## 2. EasyPoi（老项目常用，和EasyExcel同一家）

底层：POI封装 模板语法：{{name}}，表格循环 `$fe:list` 这种标记

✅ 优点：同时支持Excel+Word模板，一套框架学两样；注解驱动

❌ 缺点：Word部分维护弱、坑多（中文行距、缩进、表格样式容易错乱），新版本迭代慢，很多人踩坑；

**新项目优先poi-tl**

```xml
<dependency>
    <groupId>cn.afterturn</groupId>
    <artifactId>easypoi-spring-boot-starter</artifactId>
    <version>4.5.0</version>
</dependency>
```

## 3. FreeMarker + docx xml（经典老方案）

原理：docx本质是zip包，解压取出 `document.xml`，改成ftl模板，用freemarker渲染xml，再重新打包成docx

✅ 优点：逻辑能力极强，if/for/复杂表达式随便写，无额外 heavy 依赖

❌ 致命缺点：**模板制作极其麻烦**，改一次Word就要重新解压、改xml；WPS/Word稍微改一下格式，xml结构变了模板直接炸；调试地狱

> 适合：模板几乎不会改动、开发愿意维护xml；**不适合业务频繁改模板的场景**

## 4. 原生 Apache POI

底层原生API

✅ 自由度最高，随便操作段落、表格、图片、页眉、域

❌ 缺点：**没有模板能力**，要自己写代码遍历替换、自己实现循环；代码巨多，维护成本高；适合动态生成，不适合“先做好模板再填数据”场景

## 5. docx4j

底层：OpenXML标准，JAXB解析docx底层xml结构，不依赖POI

✅ 对OOXML标准支持完整，适合深度定制docx底层、复杂合并、文档解析

❌ 缺点：模板渲染需要自己封装，上手陡峭，学习成本高；不是模板引擎，适合专业文档处理，业务开发很少直接拿来做模板填充

## 6. Aspose.Words for Java

商业收费库（有水印，商用必须买授权）

✅ 天花板级能力：doc/docx、pdf互转、复杂域、邮件合并、宏、分页、复杂报表、批量导出稳定性极强

❌ 缺点：贵、闭源；**严禁无授权商用**

> 适合：对文档兼容性、格式要求极高、预算充足的项目（政务、标书系统）

## 7. XDocReport

基于POI + FreeMarker，专门做docx模板

✅ 支持模板、图片、循环，自带IDE模板设计器

❌ 国内社区小、资料少，国内用的不多

## 8. 其他非主流方案

* Hutool-poi Word：简单文本生成，**几乎没有模板循环能力**，只适合简单文字，不适合模板报表
* LibreOffice/OpenOffice：Java调用命令行，html转word；不是模板渲染，环境依赖大、稳定性差，不推荐

## 📋选型速查表

| 方案           | 是否直接在Word写标签 | 循环表格     | 图片填充 | 维护活跃度 | 推荐场景                          |
| -------------- | -------------------- | ------------ | -------- | ---------- | --------------------------------- |
| poi-tl         | ✅ 直接写{{}}         | ✅            | ✅        | 高         | ✅新项目首选，合同/报告单/业务模板 |
| EasyPoi        | ✅                    | ✅            | ✅        | 低         | 老项目，同时还要导出Excel         |
| FreeMarker xml | ❌ 需要解压改xml      | ✅            | ✅        | 稳定       | 模板长期不变、复杂逻辑            |
| 原生POI        | ❌ 代码硬写           | 需要自己封装 | ✅        | 高         | 动态生成，不是模板填充            |
| docx4j         | ❌                    | 自己封装     | ✅        | 中         | 底层深度文档操作                  |
| Aspose.Words   | ✅（邮件合并）        | ✅            | ✅        | 高         | 商业付费、高兼容强需求            |

## ✅ 生产选型一句话建议

1. **新项目、业务模板（证明、合同、病历、实习报告、审批单）** → **poi-tl（优先）**
2. 老项目已经在用EasyPoi、同时大量Excel导出 → 继续EasyPoi
3. 模板几乎不改动、需要复杂if逻辑、不想引入poi-tl → freemarker xml（权衡维护成本）
4. 要兼容doc、大量word转pdf、预算充足 → Aspose
5. 只是纯代码拼文档，没有固定模板 → 原生POI / docx4j

## 补充踩坑提醒

1. 所有方案基本都只稳支持 `.docx`，老 `.doc` 二进制格式尽量避开
2. poi-tl / EasyPoi 循环标签：**不要在Word里拆分标签**，{{#list}} 和 {{/list}} 必须完整
3. 导出后直接response输出流，不要先生成本地文件，避免磁盘堆积
4. 大量批量导出：异步任务+下载链接，防止接口超时

## 网上的实例

https://cnblogs.com/Tom-shushu/p/14279357.html

https://www.cnblogs.com/wangpeng00700/p/8418594.html

##### 1、第一步：PDF制作模板

因为PDF常用的软件不让支持编辑，我们就先使用WPS以Word的形式进行编辑制作出与客户需求一样的样式，然后直接另存为 .pdf 的形式如下图所示：

a.Word里面制作模板

![img](POI.assets/1398504-20210114192329327-1191579322.jpg)

b.更改名字为 .pdf 形式

![img](POI.assets/1398504-20210114192451128-1274038122.jpg)

c.这时需要用到一个叫：Adobe Acrobat DC的软件（可以白嫖7天^\_^），具体操作如下：

用Adobe Acrobat DC打开我们刚才改过名字的PDF文件，点击右下角的“更多工具”按钮

![img](POI.assets/1398504-20210114192837265-1550425325.jpg)

到下面这个页面再点击“准备表单”按钮

![img](POI.assets/1398504-20210114193039106-1753027743.jpg)

d.接下来就需要详细的配置你的数据源了

![img](POI.assets/1398504-20210114193158128-1287464560.jpg)

数据源即：你代码中实体类中对应的数据（注意字段一定要一一对应），配置完毕就可以保存进行下面的代码编写工作了。

##### 2、代码的编写

假定我们实体类什么的都已经编写完成、数据通过前端传入获取、模板位置在E盘根目录下名字为：车辆维修审批单.pdf

导入jar包：

```xml
<!-- PDF导出-->
<!-- https://mvnrepository.com/artifact/com.itextpdf/itextpdf -->
<dependency>
    <groupId>com.itextpdf</groupId>
    <artifactId>itextpdf</artifactId>
    <version>5.5.13</version>
</dependency>
```

实现生成PDF、数据插入、导出

```java
@RegisterToSMP(serviceDisplay = "预览页面PDF下载")      
@RequestMapping(value = "/DM/gwclwxsq/qygl/exportPDF$m=query.service",method =RequestMethod.POST) 
public String exportPdf(@RequestBody GwclwxsqBean gwclwxsqBean , HttpServletResponse response) throws UnsupportedEncodingException {            
    // 1.指定解析器
    System.setProperty("javax.xml.parsers.DocumentBuilderFactory",
                       "com.sun.org.apache.xerces.internal.jaxp.DocumentBuilderFactoryImpl");
    String filename="车辆维修审批单.pdf";
    String path="e:/";
    response.setContentType("application/pdf");
    response.setHeader("Content-Disposition", "attachment;fileName="
                       + URLEncoder.encode(filename, "UTF-8"));
    OutputStream os = null;
    PdfStamper ps = null;
    PdfReader reader = null;
    try {
        os = response.getOutputStream();
        // 2 读入pdf表单
        reader = new PdfReader(path+ "/"+filename);
        // 3 根据表单生成一个新的pdf
        ps = new PdfStamper(reader, os);
        // 4 获取pdf表单
        AcroFields form = ps.getAcroFields();
        // 5给表单添加中文字体 这里采用系统字体。不设置的话，中文可能无法显示
        BaseFont bf = BaseFont.createFont("C:/WINDOWS/Fonts/SIMSUN.TTC,1",
                                          BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        form.addSubstitutionFont(bf);
        // 6查询数据================================================
        Map<String, String> data = new HashMap<String, String>();
        data.put("commitTime", gwclwxsqBean.getCommitTime());
        data.put("driver", gwclwxsqBean.getDriver());
        data.put("carId", gwclwxsqBean.getCarId());
        data.put("carType", gwclwxsqBean.getCarType());
        data.put("repairAddress", gwclwxsqBean.getRepairAddress());
        data.put("repairCost",gwclwxsqBean.getRepairCost());
        data.put("project", gwclwxsqBean.getProject());
        data.put("fwbzzxfzrYj", gwclwxsqBean.getFwbzzxfzrYj());
        data.put("fgldspYj", gwclwxsqBean.getFgldspYj());
        data.put("remarks", gwclwxsqBean.getRemarks());           
        // 7遍历data 给pdf表单表格赋值
        for (String key : data.keySet()) {
            form.setField(key,data.get(key).toString());
        }
        ps.setFormFlattening(true);       
        log.info("*******************PDF导出成功***********************");
    } catch (Exception e) {　　　　　　　　　 
        log.error("*******************PDF导出失败***********************");
        e.printStackTrace();
    } finally {
        try {
            ps.close();
            reader.close();
            os.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    return null;
}
```

##### 3、测试

![img](POI.assets/1398504-20210114194435452-2121875291.jpg)

![img](POI.assets/1398504-20210114194503768-1956434477.jpg)
