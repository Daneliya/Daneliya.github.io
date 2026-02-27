---
url: /Java/架构设计/分布式/02.分布式搜索/6_Spring Data Elasticsearch.md
---

# Spring Boot 整合 Spring Data Elasticsearch

## 1. 环境准备

### 1.1 版本兼容性

| Spring Boot 版本 | Elasticsearch 版本 | Spring Data Elasticsearch 版本 |
| :--------------- | :----------------- | :----------------------------- |
| 2.7.x            | 7.17.x             | 4.4.x                          |
| 3.0.x            | 8.5.x+             | 5.0.x                          |
| 3.1.x            | 8.7.x+             | 5.1.x                          |

本教程基于：

* Spring Boot 3.3.5
* Elasticsearch 8.8.2
* Java 21

## 2. 项目搭建

### 2.1 创建 Spring Boot 项目

使用 Spring Initializr 创建项目：

* https://start.spring.io/

**依赖选择：**

* Spring Web
* Spring Data Elasticsearch
* Lombok

### 2.2 Maven 依赖配置

pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.xxl</groupId>
        <artifactId>springboot_elasticsearch</artifactId>
        <version>1.0.0</version>
    </parent>

    <artifactId>springboot_starter_data_elasticsearch</artifactId>

    <properties>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <elasticsearch.version>8.15.0</elasticsearch.version>
        <lombok.version>1.18.36</lombok.version>
        <fastjson.version>1.2.72</fastjson.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
            <version>3.5.5</version>
        </dependency>
        <!-- mysql -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.33</version>
        </dependency>
        <!-- Spring Data Elasticsearch -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-elasticsearch</artifactId>
        </dependency>
        <!-- Elasticsearch Java Client -->
        <dependency>
            <groupId>co.elastic.clients</groupId>
            <artifactId>elasticsearch-java</artifactId>
            <version>8.11.0</version>
        </dependency>
        <!-- JSON 处理 -->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
        </dependency>
        <!-- lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <!-- 工具包 -->
        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-all</artifactId>
            <version>5.8.20</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### 2.3 配置文件

application.yml

```yaml [application.yml]
server:
  port: 8082
spring:
  application:
    name: springboot-elasticsearch
  datasource:
    url: jdbc:mysql://localhost:3306/es_db?useSSL=false
    username: root
    password: xxl666
    driver-class-name: com.mysql.jdbc.Driver
  elasticsearch:
    uris: 192.168.100.105:9200  # Elasticsearch 地址
    #    username: root      # 如果启用了安全认证
    #    password: 123456    # 如果启用了安全认证
    connection-timeout: 5000ms
    socket-timeout: 60000ms
logging:
  level:
    org.springframework.data.elasticsearch.client.WIRE: trace  # 查看请求日志
    com.xxl: debug
  pattern:
    dateformat: MM-dd HH:mm:ss:SSS
mybatis-plus:
  configuration:
    map-underscore-to-camel-case: true
  type-aliases-package: com.xxl.elasticsearch.pojo
# elasticsearch-java 配置
elasticsearch:
  index:
    product: products
    user: users
  enable-ssl: false  # 是否启用SSL
```

**application.properties 版本**

```properties
# Elasticsearch 配置
spring.elasticsearch.uris=localhost:8082
spring.elasticsearch.username=root
spring.elasticsearch.password=xxl666
spring.elasticsearch.connection-timeout=5000ms
spring.elasticsearch.socket-timeout=60000ms

# Spring Data Elasticsearch
spring.data.elasticsearch.repositories.enabled=true

# elasticsearch-java 配置
elasticsearch.index.product=products
elasticsearch.index.user=users
elasticsearch.enable-ssl=false

# 日志
logging.level.org.springframework.data.elasticsearch.client.WIRE=trace
logging.level.com.xxl=debug
```

## 3. 实体类设计

### 3.1 产品实体类

```java
package com.xxl.elasticsearch.starter.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.*;
import org.springframework.data.elasticsearch.core.geo.GeoPoint;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 产品实体类
 * 对应 Elasticsearch 中的 products 索引
 *
 * @author xxl
 * @date 2026/2/26 09:46
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true) // 告诉 Jackson 忽略未知的 _class 字段
@Document(indexName = "products", createIndex = true)
public class Product {

    /**
     * 产品ID
     */
    @Id
    private String id;

    /**
     * 产品名称 - 支持全文搜索
     * FieldType.Text 类型会被分词
     * fields 定义多字段映射
     */
    @MultiField(
            mainField = @Field(type = FieldType.Text, analyzer = "ik_max_word", searchAnalyzer = "ik_smart"),
            otherFields = {
                    @InnerField(suffix = "keyword", type = FieldType.Keyword),
                    @InnerField(suffix = "pinyin", type = FieldType.Text, analyzer = "pinyin")
            }
    )
    private String name;

    /**
     * 产品标题 - 简单文本字段
     */
    @Field(type = FieldType.Text, analyzer = "standard")
    private String title;

    /**
     * 产品描述 - 大文本字段
     */
    @Field(type = FieldType.Text, analyzer = "ik_max_word", searchAnalyzer = "ik_smart")
    private String description;

    /**
     * 价格 - 浮点型
     */
    @Field(type = FieldType.Double)
    private BigDecimal price;

    /**
     * 库存 - 整数型
     */
    @Field(type = FieldType.Integer)
    private Integer stock;

    /**
     * 分类 - 关键字类型，用于精确匹配
     */
    @Field(type = FieldType.Keyword)
    private String category;

    /**
     * 标签列表 - 数组类型
     */
    @Field(type = FieldType.Keyword)
    private List<String> tags;

    /**
     * 品牌 - 关键字类型
     */
    @Field(type = FieldType.Keyword)
    private String brand;

    /**
     * 创建时间 - 日期类型
     */
    @Field(type = FieldType.Date, format = DateFormat.date_hour_minute_second)
    private Date createTime;

    /**
     * 更新时间 - 日期类型
     */
    @Field(type = FieldType.Date, format = DateFormat.date_hour_minute_second)
    private Date updateTime;

    /**
     * 是否上架
     */
    @Field(type = FieldType.Boolean)
    private Boolean isActive;

    /**
     * 评分 - 嵌套对象类型
     */
    @Field(type = FieldType.Nested)
    private List<Rating> ratings;

    /**
     * 规格参数 - 对象类型
     */
    @Field(type = FieldType.Object)
    private Map<String, Object> specifications;

    /**
     * 地理位置信息
     */
    @GeoPointField
    private GeoPoint location;

    /**
     * 评分嵌套类
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Rating {
        @Field(type = FieldType.Text)
        private String username;

        @Field(type = FieldType.Integer)
        private Integer score;

        @Field(type = FieldType.Text)
        private String comment;

        @Field(type = FieldType.Date)
        private LocalDateTime ratingTime;
    }
}
```

### 3.2 地理坐标类

```java
package com.xxl.elasticsearch.starter.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 地理坐标类
 *
 * @author xxl
 * @date 2026/2/26 09:46
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeoPoint {
    private Double lat;
    private Double lon;
}
```

### 3.3 用户实体类

```java
package com.xxl.elasticsearch.starter.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 用户实体类
 *
 * @author xxl
 * @date 2026/2/26 09:46
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "users")
public class User {

    @Id
    private String id;

    @MultiField(
            mainField = @Field(type = FieldType.Text, analyzer = "ik_max_word"),
            otherFields = @InnerField(suffix = "keyword", type = FieldType.Keyword)
    )
    private String username;

    @Field(type = FieldType.Keyword)
    private String email;

    @Field(type = FieldType.Integer)
    private Integer age;

    @Field(type = FieldType.Keyword)
    private String gender;

    @Field(type = FieldType.Date, format = DateFormat.year_month_day)
    private LocalDate birthday;

    @Field(type = FieldType.Text)
    private String introduction;

    @Field(type = FieldType.Keyword)
    private List<String> interests;

    @Field(type = FieldType.Object)
    private Address address;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Address {
        @Field(type = FieldType.Text)
        private String province;

        @Field(type = FieldType.Text)
        private String city;

        @Field(type = FieldType.Text)
        private String detail;

        @GeoPointField
        private GeoPoint location;
    }
}
```

## 4. Repository 接口

### 4.1 基础 Repository 接口

```java
package com.xxl.elasticsearch.starter.repository;

import com.xxl.elasticsearch.starter.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * 产品Repository接口
 * 继承ElasticsearchRepository，提供基础的CRUD操作
 */
@Repository
public interface ProductRepository extends ElasticsearchRepository<Product, String> {

    // ============ 基础查询方法 ============

    /**
     * 根据名称查询（精确匹配）
     */
    List<Product> findByName(String name);

    /**
     * 根据名称模糊查询
     */
    List<Product> findByNameContaining(String name);

    /**
     * 根据名称或描述查询
     */
    List<Product> findByNameOrDescription(String name, String description);

    /**
     * 根据分类查询
     */
    List<Product> findByCategory(String category);

    /**
     * 根据品牌查询
     */
    List<Product> findByBrand(String brand);

    /**
     * 根据价格范围查询
     */
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    /**
     * 根据库存查询
     */
    List<Product> findByStockGreaterThan(Integer stock);

    /**
     * 查询上架商品
     */
    List<Product> findByIsActiveTrue();

    /**
     * 根据多个分类查询
     */
    List<Product> findByCategoryIn(List<String> categories);

    /**
     * 根据标签包含查询
     */
    List<Product> findByTagsContains(String tag);

    // ============ 分页查询 ============

    /**
     * 分页查询所有商品
     */
    Page<Product> findAll(Pageable pageable);

    /**
     * 根据名称分页查询
     */
    Page<Product> findByNameContaining(String name, Pageable pageable);

    /**
     * 根据分类分页查询
     */
    Page<Product> findByCategory(String category, Pageable pageable);

    /**
     * 根据品牌分页查询
     */
    Page<Product> findByBrand(String brand, Pageable pageable);

    /**
     * 根据价格范围分页查询
     */
    Page<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    // ============ 排序查询 ============

    /**
     * 根据价格升序查询
     */
    List<Product> findByOrderByPriceAsc();

    /**
     * 根据价格降序查询
     */
    List<Product> findByOrderByPriceDesc();

    /**
     * 根据创建时间降序查询
     */
    List<Product> findByOrderByCreateTimeDesc();

    // ============ 自定义查询 ============

    /**
     * 根据名称和分类查询
     */
    List<Product> findByNameAndCategory(String name, String category);

    /**
     * 根据名称和价格范围查询
     */
    List<Product> findByNameAndPriceBetween(String name, BigDecimal minPrice, BigDecimal maxPrice);

    /**
     * 统计某个分类的商品数量
     */
    long countByCategory(String category);

    /**
     * 删除某个品牌的商品
     */
    void deleteByBrand(String brand);
}
```

## 5. Service 层实现

### 5.1 基础 Service 接口

```java
package com.xxl.elasticsearch.starter.service;

import com.xxl.elasticsearch.starter.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * 产品 Service 接口
 */
public interface ProductService {

    // ============ CRUD 操作 ============

    /**
     * 保存或更新产品
     */
    Product save(Product product);

    /**
     * 批量保存产品
     */
    List<Product> saveAll(List<Product> products);

    /**
     * 根据ID查找产品
     */
    Product findById(String id);

    /**
     * 查找所有产品
     */
    List<Product> findAll();

    /**
     * 分页查找所有产品
     */
    Page<Product> findAll(Pageable pageable);

    /**
     * 根据ID删除产品
     */
    void deleteById(String id);

    /**
     * 删除所有产品
     */
    void deleteAll();

    // ============ 查询操作 ============

    /**
     * 根据名称搜索
     */
    List<Product> searchByName(String name);

    /**
     * 根据分类查询
     */
    List<Product> findByCategory(String category);

    /**
     * 根据价格范围查询
     */
    List<Product> findByPriceRange(BigDecimal minPrice, BigDecimal maxPrice);

    /**
     * 根据品牌查询
     */
    List<Product> findByBrand(String brand);

    /**
     * 根据标签查询
     */
    List<Product> findByTag(String tag);

    /**
     * 搜索上架商品
     */
    List<Product> findActiveProducts();

    // ============ 高级搜索 ============

    /**
     * 复杂条件搜索
     */
    Page<Product> complexSearch(String keyword,
                                List<String> categories,
                                BigDecimal minPrice,
                                BigDecimal maxPrice,
                                List<String> brands,
                                Pageable pageable);

    /**
     * 全文搜索
     */
    Page<Product> fullTextSearch(String keyword, Pageable pageable);

    /**
     * 自动补全
     */
    List<String> suggest(String prefix);

    // ============ 聚合操作 ============

    /**
     * 按分类统计
     */
    Map<String, Long> countByCategory();

    /**
     * 按品牌统计
     */
    Map<String, Long> countByBrand();

    /**
     * 价格分布统计
     */
    Map<String, Long> priceDistribution();

    // ============ 批量操作 ============

    /**
     * 批量更新库存
     */
    void bulkUpdateStock(Map<String, Integer> stockUpdates);

    /**
     * 批量更新价格
     */
    void bulkUpdatePrice(Map<String, BigDecimal> priceUpdates);
}
```

### 5.2 基础 Service 实现类

```java
package com.xxl.elasticsearch.starter.service.impl;

import com.xxl.elasticsearch.starter.entity.Product;
import com.xxl.elasticsearch.starter.repository.ProductRepository;
import com.xxl.elasticsearch.starter.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * 产品 Service 实现类
 *
 * @author xxl
 * @date 2026/2/26 09:57
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    @Transactional
    public Product save(Product product) {
        if (product.getId() == null) {
//            product.setCreateTime(LocalDateTime.now());
            product.setCreateTime(new Date());
        }
//        product.setUpdateTime(LocalDateTime.now());
        product.setUpdateTime(new Date());
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public List<Product> saveAll(List<Product> products) {
//        LocalDateTime now = LocalDateTime.now();
        Date now = new Date();
        products.forEach(product -> {
            if (product.getId() == null) {
                product.setCreateTime(now);
            }
            product.setUpdateTime(now);
        });
        return (List<Product>) productRepository.saveAll(products);
    }

    @Override
    public Product findById(String id) {
        Optional<Product> product = productRepository.findById(id);
        return product.orElseThrow(() ->
                new RuntimeException("Product not found with id: " + id));
    }

    @Override
    public List<Product> findAll() {
        Iterable<Product> products = productRepository.findAll();
        return StreamSupport.stream(products.spliterator(), false)
                .collect(Collectors.toList());
    }

    @Override
    public Page<Product> findAll(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    @Override
    @Transactional
    public void deleteById(String id) {
        productRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void deleteAll() {
        productRepository.deleteAll();
    }

    @Override
    public List<Product> searchByName(String name) {
        return productRepository.findByNameContaining(name);
    }

    @Override
    public List<Product> findByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    @Override
    public List<Product> findByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return productRepository.findByPriceBetween(minPrice, maxPrice);
    }

    @Override
    public List<Product> findByBrand(String brand) {
        return productRepository.findByBrand(brand);
    }

    @Override
    public List<Product> findByTag(String tag) {
        return productRepository.findByTagsContains(tag);
    }

    @Override
    public List<Product> findActiveProducts() {
        return productRepository.findByIsActiveTrue();
    }

    @Override
    public Page<Product> complexSearch(String keyword,
                                       List<String> categories,
                                       BigDecimal minPrice,
                                       BigDecimal maxPrice,
                                       List<String> brands,
                                       Pageable pageable) {
        // 这里调用自定义Repository的方法
        // 需要注入CustomProductRepository
        throw new UnsupportedOperationException("需要实现自定义Repository");
    }

    @Override
    public Page<Product> fullTextSearch(String keyword, Pageable pageable) {
        // 使用简单的方式实现
        return productRepository.findByNameContaining(keyword, pageable);
    }

    @Override
    public List<String> suggest(String prefix) {
        // 实现自动补全逻辑
        throw new UnsupportedOperationException("需要实现自动补全");
    }

    @Override
    public Map<String, Long> countByCategory() {
        // 实现聚合查询
        throw new UnsupportedOperationException("需要实现聚合查询");
    }

    @Override
    public Map<String, Long> countByBrand() {
        throw new UnsupportedOperationException("需要实现聚合查询");
    }

    @Override
    public Map<String, Long> priceDistribution() {
        throw new UnsupportedOperationException("需要实现聚合查询");
    }

    @Override
    @Transactional
    public void bulkUpdateStock(Map<String, Integer> stockUpdates) {
        stockUpdates.forEach((productId, stockDelta) -> {
            Optional<Product> productOpt = productRepository.findById(productId);
            productOpt.ifPresent(product -> {
                int newStock = product.getStock() + stockDelta;
                product.setStock(newStock);
//                product.setUpdateTime(LocalDateTime.now());
                product.setUpdateTime(new Date());
                productRepository.save(product);
            });
        });
    }

    @Override
    @Transactional
    public void bulkUpdatePrice(Map<String, BigDecimal> priceUpdates) {
        priceUpdates.forEach((productId, newPrice) -> {
            Optional<Product> productOpt = productRepository.findById(productId);
            productOpt.ifPresent(product -> {
                product.setPrice(newPrice);
//                product.setUpdateTime(LocalDateTime.now());
                product.setUpdateTime(new Date());
                productRepository.save(product);
            });
        });
    }
}
```

### 5.3 高级 Service（使用 ElasticsearchClient）

```java
package com.xxl.elasticsearch.starter.service;

import com.xxl.elasticsearch.starter.entity.Product;

import java.util.List;
import java.util.Map;

/**
 * 高级 Service
 *
 * @author xxl
 * @date 2026/2/27 16:57
 */
public interface ProductAdvancedService {

    /**
     * 使用ElasticsearchClient进行搜索
     */
    List<Product> searchWithClient(String keyword);

    /**
     * 批量索引文档
     */
    void bulkIndexProducts(List<Product> products);

    /**
     * 更新单个字段
     */
    void updateField(String id, String field, Object value);

    /**
     * 获取索引统计信息
     */
    Map<String, Object> getIndexStats();
}
```

### 5.4 高级 Service 实现

```java
package com.xxl.elasticsearch.starter.service.impl;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.BulkRequest;
import co.elastic.clients.elasticsearch.core.BulkResponse;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.UpdateResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import co.elastic.clients.elasticsearch.indices.IndicesStatsResponse;
import com.xxl.elasticsearch.starter.entity.Product;
import com.xxl.elasticsearch.starter.service.ProductAdvancedService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * 高级 Service
 *
 * @author xxl
 * @date 2026/2/26 09:59
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProductAdvancedServiceImpl implements ProductAdvancedService {

    private final ElasticsearchClient elasticsearchClient;

    /**
     * 使用ElasticsearchClient进行搜索
     */
    @Override
    public List<Product> searchWithClient(String keyword) {
        try {
            SearchResponse<Product> response = elasticsearchClient.search(
                    s -> s
                            .index("products")
                            .query(q -> q
                                            .bool(b -> b
                                                            .must(m -> m
                                                                            .match(t -> t
                                                                                    .field("description")
                                                                                    .query(keyword)
                                                                            )
//                                                    .multiMatch( t -> t
//                                                            .fields(List.of("name", "description"))
//                                                            .query(keyword)
//                                                    )
                                                            )
                                                            .filter(f -> f
                                                                    .term(t -> t
                                                                            .field("isActive")
                                                                            .value(true)
                                                                    )
                                                            )
                                            )
                            )
                            .size(100),
                    Product.class
            );

            return response.hits().hits().stream()
                    .map(Hit::source)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

        } catch (IOException e) {
            log.error("搜索失败", e);
            throw new RuntimeException("搜索失败", e);
        }
    }

    /**
     * 批量索引文档
     */
    @Override
    public void bulkIndexProducts(List<Product> products) {
        try {
            BulkRequest.Builder br = new BulkRequest.Builder();

            for (Product product : products) {
                br.operations(op -> op
                        .index(idx -> idx
                                .index("products")
                                .id(product.getId())
                                .document(product)
                        )
                );
            }

            BulkResponse response = elasticsearchClient.bulk(br.build());

            if (response.errors()) {
                log.error("批量索引存在错误");
                response.items().forEach(item -> {
                    if (item.error() != null) {
                        log.error("文档 {} 索引失败: {}", item.id(), item.error().reason());
                    }
                });
            }

        } catch (IOException e) {
            log.error("批量索引失败", e);
            throw new RuntimeException("批量索引失败", e);
        }
    }

    /**
     * 更新单个字段
     */
    @Override
    public void updateField(String id, String field, Object value) {
        try {
            UpdateResponse<Product> response = elasticsearchClient.update(
                    u -> u
                            .index("products")
                            .id(id)
                            .doc(Map.of(field, value)),
                    Product.class
            );

            log.info("更新成功，版本: {}", response.version());

        } catch (IOException e) {
            log.error("更新字段失败", e);
            throw new RuntimeException("更新字段失败", e);
        }
    }

    /**
     * 获取索引统计信息
     */
    @Override
    public Map<String, Object> getIndexStats() {
        try {
            IndicesStatsResponse response = elasticsearchClient.indices()
                    .stats(s -> s.index("products"));

            Map<String, Object> stats = new HashMap<>();
            stats.put("文档总数", response.indices().get("products").primaries().docs().count());
            stats.put("索引大小", response.indices().get("products").primaries().store().size());
            stats.put("分片数", response.indices().get("products").shards().size());

            return stats;

        } catch (IOException e) {
            log.error("获取索引统计失败", e);
            throw new RuntimeException("获取统计失败", e);
        }
    }
}
```

## 6. Controller 层实现

### 6.1 产品控制器

```java
package com.xxl.elasticsearch.starter.controller;

import com.xxl.elasticsearch.starter.entity.Product;
import com.xxl.elasticsearch.starter.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * 产品控制器
 * 处理产品相关的HTTP请求
 */
@Slf4j
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // ============ CRUD 接口 ============

    /**
     * 创建产品
     */
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        log.info("创建产品: {}", product.getName());
        Product savedProduct = productService.save(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    /**
     * 批量创建产品
     */
    @PostMapping("/batch")
    public ResponseEntity<List<Product>> batchCreateProducts(@RequestBody List<Product> products) {
        log.info("批量创建产品，数量: {}", products.size());
        List<Product> savedProducts = productService.saveAll(products);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProducts);
    }

    /**
     * 根据ID获取产品
     */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        log.info("获取产品，ID: {}", id);
        Product product = productService.findById(id);
        return ResponseEntity.ok(product);
    }

    /**
     * 获取所有产品
     */
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        log.info("获取所有产品");
        List<Product> products = productService.findAll();
        return ResponseEntity.ok(products);
    }

    /**
     * 分页获取产品
     */
    @GetMapping("/page")
    public ResponseEntity<Page<Product>> getProductsByPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createTime") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        log.info("分页获取产品，第 {} 页，每页 {} 条", page, size);

        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction)
                ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        Page<Product> products = productService.findAll(pageable);
        return ResponseEntity.ok(products);
    }

    /**
     * 更新产品
     */
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable String id,
            @RequestBody Product product) {

        log.info("更新产品，ID: {}", id);

        // 确保ID一致
        product.setId(id);
        Product updatedProduct = productService.save(product);

        return ResponseEntity.ok(updatedProduct);
    }

    /**
     * 删除产品
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        log.info("删除产品，ID: {}", id);
        productService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ============ 搜索接口 ============

    /**
     * 根据名称搜索
     */
    @GetMapping("/search/name")
    public ResponseEntity<List<Product>> searchByName(
            @RequestParam String name) {

        log.info("根据名称搜索: {}", name);
        List<Product> products = productService.searchByName(name);
        return ResponseEntity.ok(products);
    }

    /**
     * 根据分类查询
     */
    @GetMapping("/search/category")
    public ResponseEntity<List<Product>> searchByCategory(
            @RequestParam String category) {

        log.info("根据分类查询: {}", category);
        List<Product> products = productService.findByCategory(category);
        return ResponseEntity.ok(products);
    }

    /**
     * 根据价格范围查询
     */
    @GetMapping("/search/price-range")
    public ResponseEntity<List<Product>> searchByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {

        log.info("根据价格范围查询: {} - {}", minPrice, maxPrice);
        List<Product> products = productService.findByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(products);
    }

    /**
     * 根据品牌查询
     */
    @GetMapping("/search/brand")
    public ResponseEntity<List<Product>> searchByBrand(
            @RequestParam String brand) {

        log.info("根据品牌查询: {}", brand);
        List<Product> products = productService.findByBrand(brand);
        return ResponseEntity.ok(products);
    }

    /**
     * 根据标签查询
     */
    @GetMapping("/search/tag")
    public ResponseEntity<List<Product>> searchByTag(
            @RequestParam String tag) {

        log.info("根据标签查询: {}", tag);
        List<Product> products = productService.findByTag(tag);
        return ResponseEntity.ok(products);
    }

    /**
     * 查询上架商品
     */
    @GetMapping("/active")
    public ResponseEntity<List<Product>> getActiveProducts() {
        log.info("查询上架商品");
        List<Product> products = productService.findActiveProducts();
        return ResponseEntity.ok(products);
    }

    /**
     * 复杂条件搜索
     */
    @GetMapping("/search/complex")
    public ResponseEntity<Page<Product>> complexSearch(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) List<String> categories,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) List<String> brands,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.info("复杂条件搜索，关键字: {}", keyword);

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productService.complexSearch(
                keyword, categories, minPrice, maxPrice, brands, pageable);

        return ResponseEntity.ok(products);
    }

    /**
     * 全文搜索
     */
    @GetMapping("/search/full-text")
    public ResponseEntity<Page<Product>> fullTextSearch(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.info("全文搜索，关键字: {}", keyword);

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productService.fullTextSearch(keyword, pageable);

        return ResponseEntity.ok(products);
    }

    // ============ 聚合统计接口 ============

    /**
     * 按分类统计
     */
    @GetMapping("/stats/category")
    public ResponseEntity<Map<String, Long>> statsByCategory() {
        log.info("按分类统计");
        Map<String, Long> stats = productService.countByCategory();
        return ResponseEntity.ok(stats);
    }

    /**
     * 按品牌统计
     */
    @GetMapping("/stats/brand")
    public ResponseEntity<Map<String, Long>> statsByBrand() {
        log.info("按品牌统计");
        Map<String, Long> stats = productService.countByBrand();
        return ResponseEntity.ok(stats);
    }

    /**
     * 价格分布统计
     */
    @GetMapping("/stats/price-distribution")
    public ResponseEntity<Map<String, Long>> priceDistribution() {
        log.info("价格分布统计");
        Map<String, Long> distribution = productService.priceDistribution();
        return ResponseEntity.ok(distribution);
    }

    // ============ 批量操作接口 ============

    /**
     * 批量更新库存
     */
    @PostMapping("/bulk/stock")
    public ResponseEntity<Void> bulkUpdateStock(
            @RequestBody Map<String, Integer> stockUpdates) {

        log.info("批量更新库存，更新数量: {}", stockUpdates.size());
        productService.bulkUpdateStock(stockUpdates);
        return ResponseEntity.ok().build();
    }

    /**
     * 批量更新价格
     */
    @PostMapping("/bulk/price")
    public ResponseEntity<Void> bulkUpdatePrice(
            @RequestBody Map<String, BigDecimal> priceUpdates) {

        log.info("批量更新价格，更新数量: {}", priceUpdates.size());
        productService.bulkUpdatePrice(priceUpdates);
        return ResponseEntity.ok().build();
    }
}
```

### 6.2 高级搜索控制器

```java
package com.xxl.elasticsearch.starter.controller;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.xxl.elasticsearch.starter.entity.Product;
import com.xxl.elasticsearch.starter.service.ProductAdvancedService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * 高级搜索控制器
 *
 * @author xxl
 * @date 2026/2/26 10:42
 */
@Slf4j
@RestController
@RequestMapping("/api/advanced")
@RequiredArgsConstructor
public class AdvancedSearchController {

    private final ProductAdvancedService productAdvancedService;

    private final ElasticsearchClient elasticsearchClient;

    /**
     * 高级搜索
     */
    @GetMapping("/search")
    public ResponseEntity<List<Product>> advancedSearch(@RequestParam String keyword) {
        log.info("高级搜索，关键字: {}", keyword);
        List<Product> products = productAdvancedService.searchWithClient(keyword);
        return ResponseEntity.ok(products);
    }

    /**
     * 获取索引统计
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        log.info("获取索引统计");
        Map<String, Object> stats = productAdvancedService.getIndexStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * 聚合查询示例
     */
    @GetMapping("/aggregations")
    public ResponseEntity<?> getAggregations() {
        try {
            SearchResponse<Void> response = elasticsearchClient.search(
                    s -> s
                            .index("products")
                            .size(0)
                            .aggregations("category_agg", a -> a
                                    .terms(t -> t.field("category.keyword"))
                            )
                            .aggregations("price_stats", a -> a
                                    .stats(st -> st.field("price"))
                            ),
                    Void.class
            );

            return ResponseEntity.ok(response.aggregations());

        } catch (IOException e) {
            log.error("聚合查询失败", e);
            return ResponseEntity.internalServerError().body("聚合查询失败: " + e.getMessage());
        }
    }
}
```

## 7. 配置类

### 7.1 Elasticsearch 配置

```java
```

### 7.2 索引初始化配置

```java
package com.xxl.elasticsearch.starter.config;

import co.elastic.clients.elasticsearch.indices.CreateIndexRequest;
import co.elastic.clients.elasticsearch.indices.ExistsRequest;
import com.xxl.elasticsearch.starter.entity.Product;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.IndexOperations;

/**
 * 索引初始化配置
 *
 * @author xxl
 * @date 2026/2/26 10:43
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class IndexInitializer {

    private final ElasticsearchOperations elasticsearchOperations;

    private final co.elastic.clients.elasticsearch.ElasticsearchClient elasticsearchClient;

    /**
     * 应用启动时初始化索引
     */
    @Bean
    public CommandLineRunner initIndex() {
        return args -> {
            try {
                // 检查并创建产品索引
                IndexOperations indexOps = elasticsearchOperations.indexOps(Product.class);

                if (!indexOps.exists()) {
                    log.info("创建产品索引...");
                    indexOps.create();

                    // 创建映射
                    indexOps.putMapping(indexOps.createMapping(Product.class));

                    log.info("产品索引创建完成");
                } else {
                    log.info("产品索引已存在");
                }

                // 检查用户索引是否存在（使用ElasticsearchClient）
                boolean userIndexExists = elasticsearchClient.indices()
                        .exists(ExistsRequest.of(e -> e.index("users")))
                        .value();

                if (!userIndexExists) {
                    log.info("创建用户索引...");
                    elasticsearchClient.indices().create(CreateIndexRequest.of(c -> c.index("users")));
                    log.info("用户索引创建完成");
                } else {
                    log.info("用户索引已存在");
                }

            } catch (Exception e) {
                log.error("初始化索引失败", e);
            }
        };
    }
}
```

## 9. 测试类

springboot\_starter\_data\_elasticsearch.http

```json
### 1. 创建产品
POST http://localhost:8082/api/products
Content-Type: application/json

{
  "name": "Apple iPhone 15 Pro",
  "description": "苹果 iPhone 15 Pro 智能手机，搭载 A17 Pro 芯片",
  "price": 9999,
  "stock": 100,
  "category": "手机",
  "brand": "Apple",
  "tags": ["智能手机", "5G", "iOS"],
  "isActive": true
}


### 2. 批量创建产品
POST http://localhost:8082/api/products/batch
Content-Type: application/json

[
  {
    "name": "Samsung Galaxy S24 Ultra",
    "description": "三星 Galaxy S24 Ultra 智能手机，搭载 Snapdragon 8 Gen 3 芯片",
    "price": 8999,
    "stock": 80,
    "category": "手机",
    "brand": "Samsung",
    "tags": ["智能手机", "5G", "Android"],
    "isActive": true
  },
  {
    "name": "Huawei Mate 60 Pro",
    "description": "华为 Mate 60 Pro 智能手机，搭载麒麟 9000S 芯片",
    "price": 6999,
    "stock": 50,
    "category": "手机",
    "brand": "Huawei",
    "tags": ["智能手机", "5G", "HarmonyOS"],
    "isActive": true
  },
  {
    "name": "iPhone 14 Pro",
    "description": "A16仿生芯片，4800万像素主摄，灵动岛设计",
    "price": 7999,
    "stock": 100,
    "category": "手机",
    "brand": "Apple",
    "tags": ["苹果", "智能手机", "旗舰"],
    "isActive": true
  },
  {
    "name": "小米13 Ultra",
    "description": "徕卡四摄，2K AMOLED屏幕，骁龙8 Gen 2处理器",
    "price": 5999,
    "stock": 80,
    "category": "手机",
    "brand": "小米",
    "tags": ["小米", "徕卡", "影像旗舰"],
    "isActive": true
  },
  {
    "name": "华为MateBook 14",
    "description": "2K全面屏，第11代酷睿处理器，多屏协同",
    "price": 6999,
    "stock": 50,
    "category": "笔记本电脑",
    "brand": "华为",
    "tags": ["笔记本", "轻薄本", "办公"],
    "isActive": true
  },
  {
    "name": "联想拯救者Y9000P",
    "description": "RTX 4060显卡，i9处理器，2.5K 165Hz屏幕",
    "price": 9999,
    "stock": 30,
    "category": "游戏本",
    "brand": "联想",
    "tags": ["游戏本", "电竞", "高性能"],
    "isActive": true
  },
  {
    "name": "索尼PS5",
    "description": "8K游戏支持，光线追踪，超高速SSD",
    "price": 3899,
    "stock": 20,
    "category": "游戏主机",
    "brand": "索尼",
    "tags": ["游戏机", "主机", "PS5"],
    "isActive": true
  }
]


### 3. 根据ID获取产品
GET http://localhost:8082/api/products/{id}


### 4. 获取所有产品
GET http://localhost:8082/api/products


### 5. 分页获取产品
GET http://localhost:8082/api/products/page?page=0&size=10&sortBy=createTime&direction=desc


### 6. 更新产品
PUT http://localhost:8082/api/products/{id}
Content-Type: application/json

{
  "name": "Apple iPhone 15 Pro Max",
  "description": "苹果 iPhone 15 Pro Max 智能手机，搭载 A17 Pro 芯片，更大屏幕",
  "price": 10999,
  "stock": 90,
  "category": "手机",
  "brand": "Apple",
  "tags": ["智能手机", "5G", "iOS", "大屏幕"],
  "isActive": true
}


### 7. 删除产品
DELETE http://localhost:8082/api/products/{id}


### 8. 根据名称搜索
GET http://localhost:8082/api/products/search/name?name=iPhone


### 9. 根据分类查询
GET http://localhost:8082/api/products/search/category?category=手机


### 10. 根据价格范围查询
GET http://localhost:8082/api/products/search/price-range?minPrice=5000&maxPrice=10000


### 11. 根据品牌查询
GET http://localhost:8082/api/products/search/brand?brand=Apple


### 12. 根据标签查询
GET http://localhost:8082/api/products/search/tag?tag=5G


### 13. 查询上架商品
GET http://localhost:8082/api/products/active


### 14. 复杂条件搜索
GET http://localhost:8082/api/products/search/complex?keyword=手机&categories=手机&minPrice=6000&maxPrice=10000&brands=Apple&brands=Samsung&page=0&size=10


### 15. 全文搜索
GET http://localhost:8082/api/products/search/full-text?keyword=智能手机&page=0&size=10


### 16. 按分类统计
GET http://localhost:8082/api/products/stats/category


### 17. 按品牌统计
GET http://localhost:8082/api/products/stats/brand


### 18. 价格分布统计
GET http://localhost:8082/api/products/stats/price-distribution


### 19. 批量更新库存
POST http://localhost:8082/api/products/bulk/stock
Content-Type: application/json

{
  "{id1}": 80,
  "{id2}": 70
}


### 20. 批量更新价格
POST http://localhost:8082/api/products/bulk/price
Content-Type: application/json

{
  "{id1}": 9999,
  "{id2}": 8999
}


### 环境变量
// 可以在 http-client.env.json 文件中定义环境变量
// {
//   "dev": {
//     "baseUrl": "http://localhost:8082",
//     "productId": "your-product-id"
//   }
// }

// 然后使用 {{baseUrl}} 代替具体的 URL
// GET {{baseUrl}}/api/products/{{productId}}
```

springboot\_starter\_data\_elasticsearch\_advanced.http

```json
### 1. 高级搜索
GET http://localhost:8082/api/advanced/search?keyword=智能手机


### 2. 获取索引统计
GET http://localhost:8082/api/advanced/stats


### 3. 聚合查询示例
GET http://localhost:8082/api/advanced/aggregations


### 环境变量
// 可以在 http-client.env.json 文件中定义环境变量
// {
//   "dev": {
//     "baseUrl": "http://localhost:8082"
//   }
// }

// 然后使用 {{baseUrl}} 代替具体的 URL
// GET {{baseUrl}}/api/advanced/search?keyword=智能手机
```

## 错误问题

### 错误1：多余字段

```sh
com.fasterxml.jackson.databind.exc.UnrecognizedPropertyException: Unrecognized field "_class" (class com.xxl.elasticsearch.starter.entity.Product), not marked as ignorable (15 known properties: "brand", "price", "name", "isActive", "location", "stock", "title", "tags", "id", "description", "category", "createTime", "specifications", "updateTime", "ratings"])

at [Source: REDACTED (`StreamReadFeature.INCLUDE_SOURCE_IN_LOCATION` disabled); line: 1, column: 253] (through reference chain: com.xxl.elasticsearch.starter.entity.Product["_class"])
```

在实体类上添加 @JsonIgnoreProperties 注解，告诉 Jackson 忽略未知的 \_class 字段

```java
@JsonIgnoreProperties(ignoreUnknown = true) // 告诉 Jackson 忽略未知的 _class 字段
```

### 错误2：时间格式化

```
com.fasterxml.jackson.databind.exc.InvalidDefinitionException: Java 8 date/time type `java.time.LocalDateTime` not supported by default: add Module "com.fasterxml.jackson.datatype:jackson-datatype-jsr310" to enable handling
 at [Source: REDACTED (`StreamReadFeature.INCLUDE_SOURCE_IN_LOCATION` disabled); line: 1, column: 513] (through reference chain: com.xxl.elasticsearch.starter.entity.Product["createTime"])
```

原因：***jackson***&#x9ED8;认不支持java8的LocalDateTime时间类型，推荐使用Date类型，如果确实需要使用，需要添加一个时间模块

```xml
<dependency>
    <groupId>com.fasterxml.jackson.datatype</groupId>
    <artifactId>jackson-datatype-jsr310</artifactId>
    <version>2.12.3</version>
</dependency>
```

接着在需要的字段上添加注解或增加配置类

```java
@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
@JsonSerialize(using = LocalDateTimeSerializer.class)
@JsonDeserialize(using = LocalDateTimeDeserializer.class)
```

https://blog.csdn.net/HO1\_K/article/details/129675462

https://blog.csdn.net/Over\_young/article/details/136915354

## 参考资料

https://www.cnblogs.com/binlicoder/p/19395265

https://www.codeleading.com/article/6295301877/
