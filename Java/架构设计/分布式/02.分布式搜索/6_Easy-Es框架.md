---
url: /Java/架构设计/分布式/02.分布式搜索/6_Easy-Es框架.md
---

# Easy-Es ORM框架

## 一、框架介绍

> 官方文档：https://www.easy-es.cn/

Easy-Es是一个针对Elasticsearch的ORM框架，由Dromara社区孵化，致力于简化Elasticsearch的使用，让开发者能够像使用MyBatis-Plus一样轻松操作Elasticsearch。

Easy-Es基于Elasticsearch官方的RestHighLevelClient进行增强，保持了底层的扩展性，同时提供了更加简洁易用的API，让开发者能够更专注于业务逻辑的开发。

## 二、特性

* **无侵入**：只做增强不做改变，引入它不会对现有工程产生影响，如丝般顺滑
* **损耗小**：启动即会自动注入基本 CURD，性能基本无损耗，直接面向对象操作
* **强大的 CRUD 操作**：内置通用 Mapper，仅仅通过少量配置即可实现大部分 CRUD 操作，更有强大的条件构造器，满足各类使用需求
* **支持 Lambda 形式调用**：通过 Lambda 表达式，方便的编写各类查询条件，无需再担心字段写错段
* **支持主键自动生成**：支持2 种主键策略，可自由配置，完美解决主键问题
* **支持 ActiveRecord 模式**：支持 ActiveRecord 形式调用，实体类只需继承 Model 类即可进行强大的 CRUD 操作
* **支持自定义全局通用操作**：支持全局通用方法注入（ Write once, use anywhere ）
* **内置分页插件**：基于ElasticsearchClient 物理分页，开发者无需关心具体操作，且无需额外配置插件，写分页等同于普通 List 查询,且保持和PageHelper插件同样的分页返回字段,无需担心命名影响
* **MySQL功能全覆盖**：MySQL中支持的功能通过EE都可以轻松实现
* **支持ES高阶语法**：支持高亮搜索,分词查询,权重查询,Geo地理位置查询,IP查询,聚合查询等高阶语法
* **良好的拓展性**：底层仍使用ElasticsearchClient,可保持其拓展性,开发者在使用EE的同时,仍可使用ElasticsearchClient的功能

### 功能结构

![EasyEsFun](/assets/5fad565b-8b4e-4274-ab59-a74c3492ac9d.D4FlyRsa.png)

## 三、Spring Boot使用流程

### 1. 引入依赖

在`pom.xml`文件中添加Easy-Es依赖：

```xml
<dependency>
    <groupId>org.dromara.easy-es</groupId>
    <artifactId>easy-es-boot-starter</artifactId>
    <version>${Latest Version}</version>
</dependency>
```

### 2. 配置文件

在`application.yml`或`application.properties`中添加Elasticsearch相关配置：

```yaml
easy-es:
  enable: true # 是否启用Easy-Es
  address: 127.0.0.1:9200 # ES集群地址，多个地址用逗号分隔
  schema: http # 协议，默认为http
  username: elastic # 用户名，如无则不填
  password: 123456 # 密码，如无则不填
  connection-timeout: 10000 # 连接超时时间，单位毫秒
  socket-timeout: 30000 #  socket超时时间，单位毫秒
  request-timeout: 30000 # 请求超时时间，单位毫秒
  max-retry-timeout-millis: 30000 # 最大重试时间，单位毫秒
  keep-alive: true # 是否保持连接
  connection-request-timeout: 500 # 连接请求超时时间，单位毫秒
  max-conn-total: 100 # 最大连接数
  max-conn-per-route: 100 # 每个路由的最大连接数
  ping-enabled: true # 是否启用ping
  ping-timeout: 1000 # ping超时时间，单位毫秒
  logger-enabled: false # 是否启用日志
```

### 3. 实体类定义

创建一个实体类，使用Easy-Es的注解来映射Elasticsearch索引：

```java
import org.dromara.easyes.annotation.IndexName;
import org.dromara.easyes.annotation.Mapping;
import org.dromara.easyes.annotation.Field;
import org.dromara.easyes.annotation.Id;
import org.dromara.easyes.common.enums.FieldType;

@IndexName(value = "document") // 索引名
public class Document {
    @Id // 主键
    private String id;
    
    @Field(value = "title", type = FieldType.TEXT, analyzer = "ik_max_word") // 标题，使用ik分词器
    private String title;
    
    @Field(value = "content", type = FieldType.TEXT, analyzer = "ik_max_word") // 内容，使用ik分词器
    private String content;
    
    @Field(value = "author", type = FieldType.KEYWORD) // 作者，不分词
    private String author;
    
    @Field(value = "create_time", type = FieldType.DATE) // 创建时间
    private String createTime;
    
    // getter和setter方法
    // ...
}
```

### 4. Mapper接口定义

创建一个Mapper接口，继承Easy-Es的BaseMapper：

```java
import org.dromara.easyes.core.core.BaseMapper;

public interface DocumentMapper extends BaseMapper<Document> {
    // 可以在这里添加自定义方法
}
```

### 5. 启动类配置

在启动类上添加`@EsMapperScan`注解，指定Mapper接口的扫描路径：

```java
import org.dromara.easyes.starter.register.EsMapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EsMapperScan("com.example.mapper") // 指定Mapper接口的扫描路径
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### 6. 使用示例

#### 注入Mapper

```java
@Autowired
private DocumentMapper documentMapper;
```

#### 新增文档

```java
Document document = new Document();
document.setTitle("Easy-Es使用指南");
document.setContent("Easy-Es是一个简单易用的Elasticsearch ORM框架...");
document.setAuthor("张三");
document.setCreateTime("2023-01-01 12:00:00");
int count = documentMapper.insert(document);
System.out.println("新增成功，影响行数：" + count);
```

#### 查询文档

```java
// 根据ID查询
Document document = documentMapper.selectById("1");
System.out.println("查询结果：" + document.getTitle());

// 条件查询
LambdaEsQueryWrapper<Document> wrapper = new LambdaEsQueryWrapper<>();
wrapper.like(Document::getTitle, "Easy-Es")
       .eq(Document::getAuthor, "张三")
       .orderByDesc(Document::getCreateTime);
List<Document> documents = documentMapper.selectList(wrapper);
System.out.println("查询结果数量：" + documents.size());

// 分页查询
LambdaEsQueryWrapper<Document> pageWrapper = new LambdaEsQueryWrapper<>();
pageWrapper.like(Document::getContent, "框架");
PageInfo<Document> pageInfo = documentMapper.pageQuery(pageWrapper, 1, 10);
System.out.println("总记录数：" + pageInfo.getTotal());
System.out.println("总页数：" + pageInfo.getPages());
System.out.println("当前页数据：" + pageInfo.getList().size());
```

#### 更新文档

```java
// 根据ID更新
Document document = new Document();
document.setId("1");
document.setTitle("Easy-Es使用指南（更新版）");
int count = documentMapper.updateById(document);
System.out.println("更新成功，影响行数：" + count);

// 条件更新
LambdaEsUpdateWrapper<Document> updateWrapper = new LambdaEsUpdateWrapper<>();
updateWrapper.eq(Document::getAuthor, "张三")
             .set(Document::getTitle, "Easy-Es使用指南（批量更新版）");
int updateCount = documentMapper.update(updateWrapper);
System.out.println("批量更新成功，影响行数：" + updateCount);
```

#### 删除文档

```java
// 根据ID删除
int count = documentMapper.deleteById("1");
System.out.println("删除成功，影响行数：" + count);

// 条件删除
LambdaEsQueryWrapper<Document> deleteWrapper = new LambdaEsQueryWrapper<>();
deleteWrapper.eq(Document::getAuthor, "张三");
int deleteCount = documentMapper.delete(deleteWrapper);
System.out.println("批量删除成功，影响行数：" + deleteCount);
```

## 四、高级功能

### 高亮搜索

```java
LambdaEsQueryWrapper<Document> wrapper = new LambdaEsQueryWrapper<>();
wrapper.like(Document::getContent, "框架")
       .highLight(Document::getContent); // 高亮content字段
List<Document> documents = documentMapper.selectList(wrapper);
// 处理高亮结果
for (Document doc : documents) {
    // 高亮内容会存储在对应的字段中
    System.out.println("高亮标题：" + doc.getTitle());
    System.out.println("高亮内容：" + doc.getContent());
}
```

### 聚合查询

```java
LambdaEsQueryWrapper<Document> wrapper = new LambdaEsQueryWrapper<>();
// 按作者分组，统计每个作者的文档数量
wrapper.groupBy(Document::getAuthor);
// 执行聚合查询
List<Map<String, Object>> result = documentMapper.selectMaps(wrapper);
for (Map<String, Object> map : result) {
    System.out.println("作者：" + map.get("author") + "，文档数量：" + map.get("count"));
}
```

### 嵌套查询

```java
LambdaEsQueryWrapper<Document> wrapper = new LambdaEsQueryWrapper<>();
// 嵌套查询，查询标题包含"Easy-Es"且内容包含"ORM"的文档
wrapper.nested(i -> i.like(Document::getTitle, "Easy-Es"))
       .nested(i -> i.like(Document::getContent, "ORM"));
List<Document> documents = documentMapper.selectList(wrapper);
System.out.println("嵌套查询结果数量：" + documents.size());
```

## 五、总结

Easy-Es作为一个针对Elasticsearch的ORM框架，提供了丰富的功能和简洁的API，让开发者能够更轻松地操作Elasticsearch。它的零侵入设计、自动化索引管理、智能化查询判断等特性，大大降低了使用Elasticsearch的门槛，同时保持了良好的扩展性和性能。

无论是简单的CRUD操作，还是复杂的高亮搜索、聚合查询、嵌套查询等高级功能，Easy-Es都能轻松应对，是Elasticsearch开发的得力助手。
