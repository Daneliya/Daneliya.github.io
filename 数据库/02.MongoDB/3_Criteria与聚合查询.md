---
url: /数据库/02.MongoDB/3_Criteria与聚合查询.md
---

# Criteria与聚合查询

## 使用Criteria构造查询条件

请求实体

```java
@Data
public class SysUserRequest {

    private String userName;

    private String phoneNumber;

    private String beginTime;

    private String endTime;

    private Double lowestMoney;

    private Double highestMoney;

    private String TagScope;

    private String[] tags;

    private Integer pageNum = 1;

    private Integer pageSize = 10;

}
```

构造查询条件

```java
SysUserRequest sysUserRequest = new SysUserRequest();
sysUserRequest.setUserName("xxl");
sysUserRequest.setPhoneNumber("15500000000");
// 创建条件对象
Criteria criteria = new Criteria();
// 1. 全等于 (手机号全字匹配)
if (StringUtils.isNotBlank(sysUserRequest.getPhoneNumber())) {
    criteria.and("phone_number").is(sysUserRequest.getPhoneNumber());
}
// 2. 模糊查询 (名称模糊搜索)
if (StringUtils.isNotBlank(sysUserRequest.getUserName())) {
    criteria.and("name").regex(Pattern.compile("^.*" + sysUserRequest.getUserName() + ".*$", Pattern.CASE_INSENSITIVE));
}
// 3. 单个条件查询多个字段
if (StringUtils.isNotEmpty(sysUserRequest.getUserName())) {
    criteria.orOperator(
        Criteria.where("user_name").is(sysUserRequest.getUserName()),
        Criteria.where("nick_name").in(sysUserRequest.getUserName())
    );
}
// 4. 日期范围
if (StringUtils.isNotEmpty(sysUserRequest.getBeginTime()) && StringUtils.isNotEmpty(sysUserRequest.getEndTime())) {
    criteria.andOperator(Criteria.where("birthday").gte(sysUserRequest.getBeginTime()), Criteria.where("birthday").lte(sysUserRequest.getEndTime()));
}
// 5. 数值范围 (存款总金额)
if (sysUserRequest.getLowestMoney() != null && sysUserRequest.getHighestMoney() != null) {
    criteria.and("money").gte(sysUserRequest.getLowestMoney()).lte(sysUserRequest.getHighestMoney());
}
if (sysUserRequest.getTags() != null && !CollectionUtils.isEmpty(Arrays.asList(sysUserRequest.getTags()))) {
    if ("any".equals(sysUserRequest.getTagScope())) {
        // 6. 数组字段满足任一
        criteria.and("tags").in(sysUserRequest.getTags());
    } else if ("all".equals(sysUserRequest.getTagScope())) {
        //  7. 数组字段满足全部 (客户标签)
        criteria.and("tags").all(sysUserRequest.getTags());
    }
}

Query query = new Query();
query.addCriteria(criteria);
// 8. 查询返回指定字段 (自定义列表)
query.fields().include("user_name");
// 10. 分页
query.with(PageRequest.of(sysUserRequest.getPageNum() - 1, sysUserRequest.getPageSize(),
                          // 11. 排序
                          Sort.by(Sort.Order.desc("earliest_add_time"))));
// 分页（方式二，使用skip+limit）
query.with(Sort.by(Sort.Order.desc("birthday")))
    .skip((long) (sysUserRequest.getPageNum() - 1) * sysUserRequest.getPageSize())
    .limit(sysUserRequest.getPageSize());
// 执行查询
List<SysUser> list = mongoTemplate.find(query, SysUser.class);
// 12. 总记录数
long total = mongoTemplate.count(query, SysUser.class);
```

补充Criteria方法说明

| Criteria      | Mongodb | 说明                                                   |
| ------------- | ------- | ------------------------------------------------------ |
| and()         | $and    | 并且                                                   |
| andOperator() | $and    | 并且                                                   |
| orOperator()  | $or     | 或者                                                   |
| is()          | $is     | 等于                                                   |
| in()          | $in     | 是否被包含在数组或者list内                             |
| nin()         | $nin    | 不包含                                                 |
| gt()          | $gt     | 大于                                                   |
| gte()         | $gte    | 大于等于                                               |
| lt()          | $lt     | 小于                                                   |
| lte()         | $lte    | 小于等于                                               |
| regex()       | $regex  | 正则表达式用于模式匹配，基本上是用于文档中的发现字符串 |
| set()         | $set    | 给字段赋值，字段不存在，增加字段并赋值                 |

## Aggregation函数

> Aggregation官方SQL语法：[Aggregation Pipeline Stages — MongoDB Manual](https://www.mongodb.com/docs/v4.4/reference/operator/aggregation-pipeline/)

### 常用函数

1. Aggregation.group() : 聚合函数，将某个字段或者某个数组作为分组统计的依据,在group的基础上又扩展出以下函数：
   * sum() : 求和
   * max() : 获取最大值
   * min() : 获取最小值
   * avg() : 获取平均值
   * count() : 统计条目数
   * first () : 获取group by 后的某个字段的首个值
   * last() : 获取 group by 后的某个字段的最后一个值
   * push() : 在结果文档中插入值到一个数组中
   * addToSet() : 在结果文档中插入值到一个数组中，但不创建副本(作为集合)。
2. Aggregation.match() : 过滤函数，主要存储过滤数据的条件，输出符合条件的记录，相当于where条件。
   * is()：==相等
3. Aggregation.project(): 修改数据结构函数,将前面管道中的获取的字段进行重名,增加，修改字段等操作。
4. Aggregation.unwind()：将文档中的某一个数组类型字段拆分成多条，每条包含数组中的一个值。当preserveNullAndEmptyArrays为true时，将包括字段为null，空，或者缺失的数据;
5. Aggregation.sort(): 排序函数，将上级管道的内容按照某个字段进行排序并且输出。值为1升、-1降。sort一般放在group后,也就是说得到结果后再排序，如果先排序再分组没什么意义;
6. Aggregation.limit(): 限制输出函数，将聚合返回的内容限定在某个条目之内。通常作为页面大小
7. Aggregation.skip(): 跳过指定数量的条目再开始返回数据的函数，**通常和sort()，limit()配合，实现数据翻页查询等操作**。
8. Aggregation.lookup(): 连表查询，将被关联集合添加到执行操作的集合中。

### group、match

#### mongo语句

```sql
db.getCollection("sys_user").aggregate([
    {
        $match: {
            birthday: {
                $gte: ISODate('1900-01-01 00:00:00.014'),
                $lte: ISODate('2023-10-23 15:30:00.014')
            },
            userName: 'xxl'
        }
    },
    {
        $group: {
            _id: "$idNumber",
            sum: { $sum: 1 },
            userName: { $first: "$userName" },
            phoneNumber: { $first: "$phoneNumber" },
            birthday: { $first: "$birthday" }
        }
    },
    {
        $sort: { sum: -1 }
    },
		{
        $skip: 0
    },
    {
        $limit: 10
    }
])
```

#### java代码

```java
int page = 1;
int size = 10;
Date startTime = DateUtil.parse("1900-01-01 00:00:00");
Date endTime = new Date();
String userName = "xxl";

Aggregation aggregation = Aggregation.newAggregation(
    Aggregation.match(Criteria.where("birthday").gte(startTime).lte(endTime)),
    Aggregation.match(Criteria.where("userName").is(userName)),
    Aggregation.group("idNumber").count().as("sum")
    .first("userName").as("userName")
    .first("phoneNumber").as("phoneNumber")
    .first("birthday").as("birthday"),
    Aggregation.sort(Sort.by("sum").descending()),
    Aggregation.skip(page > 1 ? (page - 1) * size : 0),
    Aggregation.limit(size)
);

List<SysUser> results = mongoTemplate.aggregate(aggregation, "sys_user", SysUser.class).getMappedResults();
System.out.println(results);
```

### project筛选字段

#### mongo语句

```sql
db.getCollection("sys_user").aggregate([
    {
        $group: {
            _id: "$idNumber",
            sum: {
                $sum: "$money"
            },
            userName: {
                $first: "$userName"
            },
            phoneNumber: {
                $first: "$phoneNumber"
            },
            birthday: {
                $last: "$birthday"
            }
        }
    },
    {
        "$project": {
            "_id": 1,
            "sum": 1,
            "userName": 1,
            "phoneNumber": 1,
            "birth": "$birthday"
        }
    }
])
```

#### java代码

```java
Aggregation aggregation = Aggregation.newAggregation(
    Aggregation.group(new String[]{"_id"})
    .sum("money").as("sum")
    .first("userName").as("userName")
    .first("phoneNumber").as("phoneNumber")
    .last("birthday").as("birthday"),
    Aggregation.project("_id", "sum", "userName", "phoneNumber")
    .and("birthday").as("birth") // 重新命名字段
);
List<SysUser> results = mongoTemplate.aggregate(aggregation, "sys_user", SysUser.class).getMappedResults();
System.out.println(results);
```

### unwind拆分数组

#### mongo语句

```sql
db.getCollection('sys_user').aggregate([
    {
        $match: {
            userName: "xxl"
        }
    },
    {
        $unwind: {
            path: "$tags",
            includeArrayIndex: "arrayIndex"
        }
    }
])

# 原始数据
{
    "_id": ObjectId("658712b96a3c742d4070f6ca"),
    "userName": "xxl",
    "phoneNumber": "15285602889",
    "address": "北州市戴栋25802号",
    "idNumber": "790324-1128",
    "birthday": ISODate("1961-12-16T06:03:38.014Z"),
    "money": NumberInt("204"),
    "_class": "com.xxl.mongodb.result.SysUser",
    "tags": [
        "python",
        "c",
        "c#",
        "java"
    ],
    "child": {
        "userName": "xxl2",
        "phoneNumber": "110",
        "address": "洛杉矶",
        "idNumber": "911",
        "birthday": ISODate("2023-12-24T16:31:40.753Z"),
        "money": NumberInt("9999"),
        "_class": "com.xxl.mongodb.result.SysUser"
    }
}

# 查询出的数据
_id	userName	phoneNumber	address	idNumber	birthday	money	_class	tags	child	arrayIndex
658712b96a3c742d4070f6ca	xxl	15285602889	北州市戴栋25802号	790324-1128	1961-12-16 06:03:38.014	204	com.xxl.mongodb.result.SysUser	python	(Document) 7 Fields	0
658712b96a3c742d4070f6ca	xxl	15285602889	北州市戴栋25802号	790324-1128	1961-12-16 06:03:38.014	204	com.xxl.mongodb.result.SysUser	c	(Document) 7 Fields	1
658712b96a3c742d4070f6ca	xxl	15285602889	北州市戴栋25802号	790324-1128	1961-12-16 06:03:38.014	204	com.xxl.mongodb.result.SysUser	c#	(Document) 7 Fields	2
658712b96a3c742d4070f6ca	xxl	15285602889	北州市戴栋25802号	790324-1128	1961-12-16 06:03:38.014	204	com.xxl.mongodb.result.SysUser	java	(Document) 7 Fields	3
```

#### java代码

```java
Aggregation aggregation = Aggregation.newAggregation(
    Aggregation.match(new Criteria().and("userName").is("xxl")),
    Aggregation.unwind("tags", true)
);
List<SysUser> results = mongoTemplate.aggregate(aggregation, "sys_user", SysUser.class).getMappedResults();
System.out.println(results);
```

### lookup多表关联查询

```sql
// 创建新集合，增加关联数据
db.sys_user_label.insert({"user_name" : "xxl", "label_name" : "唱"})
db.sys_user_label.insert({"user_name" : "xxl", "label_name" : "跳"})
db.sys_user_label.insert({"user_name" : "xxl", "label_name" : "Rap"})
```

#### mongo语句

```sql
db.getCollection('sys_user').aggregate([
    {
        $lookup: {
            from: "sys_user_label",    // 被关联表名
            localField: "userName",    // 主表（mro_accounts）中用于关联的字段
            foreignField: "user_name", // 被关联表（mro_profiles）中用于关联的字段
            as: "label" 			   // 被关联的表的别名
        }
    }
])
```

#### java代码

```java
Aggregation aggregation = Aggregation.newAggregation(
    //分别对应from, localField, foreignField, as
    Aggregation.lookup("sys_user_label", "userName", "user_name", "label")
);
List<SysUser> results = mongoTemplate.aggregate(aggregation, "sys_user", SysUser.class).getMappedResults();
System.out.println(results);
```

## 参考资料

<https://blog.csdn.net/Java_Rookie_Xiao/article/details/125602833>

<https://www.programcreek.com/java-api-examples/index.php?api=org.springframework.data.mongodb.core.aggregation.Aggregation>

mongodb聚合在Java中的使用（包含mongo多表关联查询）：<https://www.cnblogs.com/wangzhebin/p/16494929.html>
