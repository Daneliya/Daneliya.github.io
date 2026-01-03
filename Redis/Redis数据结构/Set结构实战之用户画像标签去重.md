---
url: /Redis/Redis数据结构/Set结构实战之用户画像标签去重.md
---

# Set结构实战之用户画像标签去重

用户画像是根据用户基本属性、社会属性、行为属性、心理属性等真实信息而抽象出的一个标签化的、虚拟的用户模型。“用户画像”的实质是对 “人”的数字化。

* 应用场景有很多，比如个性化推荐、精准营销、金融风控、精细化运营等等， 举个例子来理解用户画像的实际应用价值，我们经常用手机网购，淘宝里面的千人千面
* 通过“标签 tag”来对用户的多维度特征进行提炼和标识，那每个人的用户画像就需要存储，set集合就适合去重
* 用户画像不止针对某个人，也可以某一人群或行业的画像
* 利用redis可以很好的去重

案例

```java
@Test
public void setAction1() {
    BoundSetOperations operations = redisTemplate.boundSetOps("user:tags:1");
    operations.add("car", "student", "rich", "guangdong", "dog", "rich");

    Set<String> set1 = operations.members();
    System.out.println(set1);
    operations.remove("dog");

    Set<String> set2 = operations.members();
    System.out.println(set2);
}
```

结果

```
[guangdong, student, car, dog, rich]
[car, guangdong, rich, student]
```
