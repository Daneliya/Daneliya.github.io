---
url: /Java/Java开发技巧/02.函数式编程/1_Lambda表达式.md
---

# Lambda表达式

## 一、概述

Lambda是JDK8中一个语法糖。他可以对某些匿名内部类的写法进行简化。它是函数式编程思想的一个重要体现。让我们不用关注是什么对象。而是更关注我们对数据进行了什么操作。

## 二、核心原则

> 可推导可省略

## 三、省略规则

* 参数类型可以省略
* 方法体只有一句代码时大括号return和唯一一句代码的分号可以省略
* 方法只有一个参数时小括号可以省略
* 以上这些规则都记不住也可以省略不记

## 四、基本格式

```java
(参数列表)->{代码}
```

### 例一：创建线程

我们在创建线程并启动时可以使用匿名内部类的写法：

```java
new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("你知道吗 我比你想象的 更想在你身边");
    }
}).start();
```

可以使用Lambda的格式对其进行修改。修改后如下：

```java
new Thread(()->{
    System.out.println("你知道吗 我比你想象的 更想在你身边");
}).start();
```

### 例二：调用Operator方法

现有方法定义如下，其中IntBinaryOperator是一个接口。先使用匿名内部类的写法调用该方法。

```java
public static int calculateNum(IntBinaryOperator operator){
    int a = 10;
    int b = 20;
    return operator.applyAsInt(a, b);
}

public static void main(String[] args) {
    int i = calculateNum(new IntBinaryOperator() {
        @Override
        public int applyAsInt(int left, int right) {
            return left + right;
        }
    });
    System.out.println(i);
}
```

Lambda写法：

```java
public static void main(String[] args) {
    int i = calculateNum((int left, int right)->{
        return left + right;
    });
    System.out.println(i);
}
```

### 例三：调用Predicate方法

现有方法定义如下，其中IntPredicate是一个接口。先使用匿名内部类的写法调用该方法。

```java
public static void printNum(IntPredicate predicate){
    int[] arr = {1,2,3,4,5,6,7,8,9,10};
    for (int i : arr) {
        if(predicate.test(i)){
            System.out.println(i);
        }
    }
}
public static void main(String[] args) {
    printNum(new IntPredicate() {
        @Override
        public boolean test(int value) {
            return value%2==0;
        }
    });
}
```

Lambda写法：

```java
public static void main(String[] args) {
    printNum((int value)-> {
        return value%2==0;
    });
}
public static void printNum(IntPredicate predicate){
    int[] arr = {1,2,3,4,5,6,7,8,9,10};
    for (int i : arr) {
        if(predicate.test(i)){
            System.out.println(i);
        }
    }
}
```

### 例四：调用Function方法

现有方法定义如下，其中Function是一个接口。先使用匿名内部类的写法调用该方法。

```java
public static <R> R typeConver(Function<String,R> function){
    String str = "1235";
    R result = function.apply(str);
    return result;
}
public static void main(String[] args) {
    Integer result = typeConver(new Function<String, Integer>() {
        @Override
        public Integer apply(String s) {
            return Integer.valueOf(s);
        }
    });
    System.out.println(result);
}
```

Lambda写法：

```java
Integer result = typeConver((String s)->{
    return Integer.valueOf(s);
});
System.out.println(result);
```

### 例五：调用Consumer方法

现有方法定义如下，其中IntConsumer是一个接口。先使用匿名内部类的写法调用该方法。

```java
public static void foreachArr(IntConsumer consumer){
    int[] arr = {1,2,3,4,5,6,7,8,9,10};
    for (int i : arr) {
        consumer.accept(i);
    }
}
public static void main(String[] args) {
    foreachArr(new IntConsumer() {
        @Override
        public void accept(int value) {
            System.out.println(value);
        }
    });
}
```

Lambda写法：

```java
public static void main(String[] args) {
    foreachArr((int value)->{
        System.out.println(value);
    });
}
```
