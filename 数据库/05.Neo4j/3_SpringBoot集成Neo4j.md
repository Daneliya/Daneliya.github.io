---
url: /数据库/05.Neo4j/3_SpringBoot集成Neo4j.md
---

# SpringBoot集成Neo4j

## 集成原生Neo4J

```xml
<dependency>
    <groupId>org.neo4j.driver</groupId>
    <artifactId>neo4j-java-driver</artifactId>
    <version>4.4.12</version>
</dependency>
```

代码

```java
public static void main(String[] args) {
    Driver driver = GraphDatabase.driver("bolt://localhost:7687", AuthTokens.basic("neo4j", "Yinlidong1995."));
    Session session = driver.session();
    session.run("CREATE (n:Part {name: {name},title: {title}})",
                parameters("name", "Arthur001", "title", "King001"));
    Result result = session.run("MATCH (a:Part) WHERE a.name = {name} " +
                                "RETURN a.name AS name, a.title AS title",
                                parameters("name", "Arthur001"));
    while (result.hasNext()) {
        Record record = result.next();
        System.out.println(record.get("title").asString() + " " + record.get("name").asString());
    }
    session.close();
    driver.close();
}
```

## SpringBoot集成Neo4J

## 参考资料

https://zhuanlan.zhihu.com/p/450327256
