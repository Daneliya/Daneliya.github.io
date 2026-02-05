---
url: /数据库/01.MySQL/Mysql索引.md
---

# Mysql索引

## 索引介绍

MySQL 索引是一种数据结构，用于加快数据库查询的速度和性能。通过使用索引，MySQL 可以直接定位到满足查询条件的数据行，而无需逐行扫描整个表。

> MySQL 索引类似于书籍的索引，通过存储指向数据行的指针，可以快速定位和访问表中的特定数据。
>
> 打个比方，如果合理的设计且使用索引的 MySQL 是一辆兰博基尼的话，那么没有设计和使用索引的 MySQL 就是一个人力三轮车。
>
> 拿汉语字典的目录页（索引）打比方，我们可以按拼音、笔画、偏旁部首等排序的目录（索引）快速查找到需要的字。

索引分单列索引和组合索引：

* 单列索引，即一个索引只包含单个列，一个表可以有多个单列索引。
* 组合索引，即一个索引包含多个列。

创建索引时，你需要确保该索引是应用在 SQL 查询语句的条件(一般作为 WHERE 子句的条件)。

实际上，索引也是一张表，该表保存了主键与索引字段，并指向实体表的记录。

索引虽然能够提高查询性能，但也需要注意以下几点：

* 索引需要占用额外的存储空间。
* 对表进行插入、更新和删除操作时，索引需要维护，可能会影响性能。
* 过多或不合理的索引可能会导致性能下降，因此需要谨慎选择和规划索引。

## 添加索引

在mysql中有多种索引，有普通索引，全文索引，唯一索引，多列索引。

### 普通索引

使用 **CREATE INDEX** 语句可以创建普通索引。

```
CREATE INDEX index_name
ON table_name (column1 [ASC|DESC], column2 [ASC|DESC], ...);
```

* `CREATE INDEX`: 用于创建普通索引的关键字。
* `index_name`: 指定要创建的索引的名称。索引名称在表中必须是唯一的。
* `table_name`: 指定要在哪个表上创建索引。
* `(column1, column2, ...)`: 指定要索引的表列名。你可以指定一个或多个列作为索引的组合。这些列的数据类型通常是数值、文本或日期。
* `ASC`和`DESC`（可选）: 用于指定索引的排序顺序。默认情况下，索引以升序（ASC）排序。

假设有一个名为 students 的表，包含 id、name 和 age 列，在 name 列上创建一个普通索引。

```
CREATE INDEX idx_name ON students (name);
```

### 唯一索引

在 MySQL 中，你可以使用 **CREATE UNIQUE INDEX** 语句来创建唯一索引。

唯一索引确保索引中的值是唯一的，不允许有重复值。

```
CREATE UNIQUE INDEX index_name
ON table_name (column1 [ASC|DESC], column2 [ASC|DESC], ...);
```

* `CREATE UNIQUE INDEX`: 用于创建唯一索引的关键字组合。
* `index_name`: 指定要创建的唯一索引的名称。索引名称在表中必须是唯一的。
* `table_name`: 指定要在哪个表上创建唯一索引。
* `(column1, column2, ...)`: 指定要索引的表列名。你可以指定一个或多个列作为索引的组合。这些列的数据类型通常是数值、文本或日期。
* `ASC`和`DESC`（可选）: 用于指定索引的排序顺序。默认情况下，索引以升序（ASC）排序。

以下是一个创建唯一索引的实例： 假设我们有一个名为 employees的 表，包含 id 和 email 列，现在我们想在email列上创建一个唯一索引，以确保每个员工的电子邮件地址都是唯一的。

```
CREATE UNIQUE INDEX idx_email ON employees (email);
```

### 全文索引

```
CREATE FULLTEXT INDEX index_name ON t_dept(name);
```

### 多列索引

```
CREATE INDEX index_name_no ON t_dept(name,no);
```

## 索引失效

[索引失效的情况及解决(超详细)-CSDN博客](https://blog.csdn.net/sy_white/article/details/122112440)

参考资料

https://www.xysycx.cn/articles/2020/12/05/1607146183637.html

https://zhuanlan.zhihu.com/p/293553628

https://www.runoob.com/mysql/mysql-index.html

## 索引下推

https://cloud.tencent.com/developer/article/2398503
https://blog.csdn.net/weixin\_43310500/article/details/135090387
