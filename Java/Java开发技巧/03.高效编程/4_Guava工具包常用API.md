---
url: /Java/Java开发技巧/03.高效编程/4_Guava工具包常用API.md
---

# Guava工具包常用API

Guava 是一套来自 Google 的核心 Java 库，其中包括新的集合类型（如 multimap 和 multiset）、不可变的集合、图库，以及并发、I/O、散列、缓存、基元、字符串等实用工具！它被广泛用于 Google 内部的大多数 Java 项目，也被许多其他公司广泛使用。它被广泛用于 Google 内部的大多数 Java 项目，也被许多其他公司广泛使用。 最为重要的是它能帮助我们拯救垃圾代码，guava内部使用的API都是经过处理优化的，背靠Google公司，因此我们可以放心大胆的使用它。

## 引用依赖

```xml
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>30.1.1-jre</version>
</dependency>
```

## 不可变集合

创建对象的不可变拷贝是一项很好的防御性编程技巧。优点如下：

* 当对象被不可信的库调用时，不可变形式是安全的
* 不可变对象被多个线程调用时，不存在竞态条件问题
* 不可变集合不需要考虑变化，因此可以节省时间和空间。
* 不可变对象因为有固定不变，可以作为常量来安全使用。

三种创建方式

```java
public void immutable() {
    List<Integer> list = new ArrayList<>();
    list.add(1);
    list.add(2);
    list.add(3);

    // 方式一：通过已经存在的方式创建
    ImmutableSet<Integer> immutableSet1 = ImmutableSet.copyOf(list);

    // 方式二：通过初始值直接创建集合
    ImmutableSet<Integer> immutableSet2 = ImmutableSet.of(1,2,3);

    // 方式三：通过追加的形式闯将
    ImmutableSet<Object> immutableSet3 = ImmutableSet.builder().add(1).addAll(Sets.newHashSet(2, 3)).add(4).build();

    // 使用方式和正常集合一样，add和remove等改变数据的方式不可用。

}
```

## Multiset可重复无序集合

`Set`：不重复的无序集合

`List`：可重复的有序集合

`Multiset`：`Guava` 提供的可重复无序集合，可以将它看成，没有元素顺序限制的`ArrayList`

### 使用方式

> 为了方便理解，我们对 `API` 进行不同角度的拆解辅助理解

从 `ArrayList` 角度理解

| 方法       | 说明                                                   |
| :--------- | :----------------------------------------------------- |
| add(T)     | 添加单个给定元素                                       |
| iterator() | 返回一个迭代器，包含 `Multiset` 所有元素，包括重复元素 |
| size()     | 元素总个数，包括重复元素                               |

从 `Map` 角度理解

| 方法          | 说明                                                   |
| :------------ | :----------------------------------------------------- |
| count(Object) | 返回指定元素的个数，例如传入“A”，则返回集合中“A”的个数 |
| entrySet()    | 返回 `Set>`，和 `Map`的\`\`entrySet`类似                |
| elementSet()  | 返回所有不重复元素的`Set`，和 `Map`的`KeySet\` 类似  |

### 实战演练

实战:使用 `Multiset` 集合类，实现统计篇文章中文字出现次数功能。

java

```java
private static final String text =
    "玉楼春·己卯岁元日" +
    "毛滂 〔宋代〕" +
    "一年滴尽莲花漏。碧井酴酥沉冻酒。晓寒料峭尚欺人，春态苗条先到柳。" +
    "佳人重劝千长寿。柏叶椒花芬翠袖。醉乡深处少相知，只与东君偏故旧。";

@Test
public void test01() {
    Multiset<Object> multiset = HashMultiset.create();
    // 将string转换成char数组
    char[] chars = text.toCharArray();
    Chars.asList(chars).stream().forEach(multiset::add);

    // 总共多少字符
    System.out.println("size:" + multiset.size());
    // 查询“人”出现了几次
    System.out.println("count:" + multiset.count('人'));
}
```

## 集合工具类

> `setls` 工具类的常用方法：并集 / 交集 / 差集 / 分解集合中的所有子集 / 求两个集合的笛卡尔积 `Lists` 工具类的常用方式：反转 / 拆分

`Set` 集合相关方法

```java
private static final Set set1 = Sets.newHashSet(1,2,3);
private static final Set set2 = Sets.newHashSet(3,4,5);

@Test
public void text02(){
    // 并集 [1, 2, 3, 4, 5]
    Set<Integer> set = Sets.union(set1, set2);

    // 交集 [3]
    Set<Integer>  intersection = Sets.intersection(set1, set2);

    // 差集：元素属于A不属于B [1, 2]
    Set<Integer> difference = Sets.difference(set1, set2);

    // 将set拆成所有可能性的子集合
    Set<Set<Integer>> powerSet = Sets.powerSet(set1);
    // [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
    System.out.println(JSON.toJSONString(powerSet));

    // 计算两个集合的笛卡尔积
    Set<List<Integer>> product = Sets.cartesianProduct(set1,set2);
    // [[1,3],[1,4],[1,5],[2,3],[2,4],[2,5],[3,3],[3,4],[3,5]]
    System.out.println(JSON.toJSONString(product));
}
```

`List` 集合

```java
@Test
public void text03() {
    ArrayList<Integer> list = Lists.newArrayList(1, 2, 3, 4, 5, 6, 7);

    // 拆分：每3个一组 [[1,2,3],[4,5,6],[7]]
    List<List<Integer>> partition = Lists.partition(list, 3);

    // 反转
    List<Integer> reverse = Lists.reverse(list);
}
```
