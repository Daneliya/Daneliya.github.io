---
url: /Redis/Redis数据结构/Set结构实战之社交应用中的共同好友.md
---

# Set结构实战之社交应用中的共同好友

在社交应用中，有时需要获取共同好友、全部好友以及专属于某个人的好友，用户推荐算法中肯定会用到这些数据。

利用Redis中Set结构的API能够查询到两个Set结构交集、并集和差集的数据。

最为常见的用处除了用户推荐外，还有查询关注列表、粉丝列表、共同群聊。

案例

```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class SetAction {

    @Autowired
    private RedisTemplate redisTemplate;

    @Test
    public void setAction() {
        // 用户A
        BoundSetOperations operationsA = redisTemplate.boundSetOps("user:a");
        // 关注了用户A的用户
        operationsA.add("A", "B", "C", "D");
        System.out.println("老A的粉丝" + operationsA.members());

        BoundSetOperations operationsB = redisTemplate.boundSetOps("user:b");
        operationsB.add("A", "B", "F", "G", "O", "W");
        System.out.println("老B的粉丝" + operationsB.members());

        // 差集
        Set setA = operationsA.diff("user:b");
        System.out.println("A的专属用户" + setA);

        // 交集
        Set set = operationsA.intersect("user:b");
        System.out.println("共同好友" + set);

        // 并集
        Set union = operationsA.union("user:b");
        System.out.println("全部好友" + union);

        // 是否存在集合中
        Boolean c = operationsA.isMember("C");
        System.out.println("用户c是不是老王的粉丝" + c);
    }
}
```

结果输出

```
老A的粉丝[D, C, A, B]
老B的粉丝[F, B, O, W, A, G]
A的专属用户[D, C]
共同好友[A, B]
全部好友[C, B, F, D, O, G, W, A]
用户c是不是老王的粉丝true
```
