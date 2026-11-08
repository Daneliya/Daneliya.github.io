---
url: /Java/Java开发技巧/03.高效编程/3_反射Reflection.md
---

# 反射Reflection

通过反射可以获取到任意对象的任意方法、属性，也可以构造出任意对象，可跳过private等修饰符设定的权限，在Spirng、MyBtais等框架中大量使用。

## 通过反射获取Class对象

创建Student对象，包含成员变量和构造方法，其中有一个构造方法是私有的

```java
public class Student {

    private String sid;
    private String sname;
    public Integer age;

    public Student() {
        System.out.println("调用无参构造方法创建了一个学生对象");
    }

    public Student(String sid) {
        this.sid = sid;
        System.out.println("调用带一个参数的构造方法创建了一个学生对象");
    }

    public Student(String sid, String sname) {
        this.sid = sid;
        this.sname = sname;
        System.out.println("调用带二个参数的构造方法创建了一个学生对象");
    }

    private Student(Integer age) {
        System.out.println("调用Student类私有的构造方法创建一个学生对象");
        this.age = age;
    }
}
```

通过反射获取Class对象有3种方法，如下所示：

```java
public static void main(String[] args) throws ClassNotFoundException {
    // 1.方法一 
    Class class1 = new Student().getClass(); 
    System.out.println(class1.getName()); 

    // 2.方法二 
    Class class2 = Student.class;
    System.out.println(class2.getName());

    // 3.方法三 Class.forname
    Class class3 = Class.forName("com.xk857.demo.Student");
    System.out.println(class3);

    // 4.比较3个对象，发现获取的是同一个对象
    System.out.println(class1 == class2);
    System.out.println(class1 == class3);
}
```

## 通过反射操作构造函数

| 功能                                   | 函数                                 |
| :------------------------------------- | :----------------------------------- |
| 获取所有公共的构造方法                 | getConstructors()                    |
| 获取所有构造方法（包含私有、默认的等） | getDeclaredConstructors()            |
| 获取单个“公共”的构造方法               | getConstructor(Type.class……)         |
| 获取单个构造方法（可以是私有的等）     | getDeclaredConstructor(Type.class……) |
| 调用构造方法                           | newInstance(param……)                 |
| 绕过访问修饰符权限                     | setAccessible(true)                  |

案例如下，可自行增加换行或其他输出，使其在控制台打印更加明显。

```java
@Test
public void test1() throws ClassNotFoundException, …… {
    Class class3 = Class.forName("com.xk857.demo.Student");

    // 1.获取所有公共的构造方法
    Constructor[] constructors = class3.getConstructors();
    for (Constructor constructor : constructors) {
        System.out.println(constructor);
    }

    // 2.所有构造方法（包含私有、默认的等）
    constructors = class3.getDeclaredConstructors();
    for (Constructor constructor : constructors) {
        System.out.println(constructor);
    }

    // 3.获取单个公共”的构造方法
    Constructor constructor1 = class3.getConstructor(String.class, String.class);
    System.out.println(constructor1+"\n");

    // 4.获取单个公共”的构造方法
    Constructor declaredConstructor = class3.getDeclaredConstructor(Integer.class);
    System.out.println(declaredConstructor+"\n");

    // 绕过访问修饰符权限，使private修饰的构造方法也能被调用
    declaredConstructor.setAccessible(true);
    // 通过newInstance创建对象
    Student student = (Student) declaredConstructor.newInstance(12);
}
```

## 通过反射操作变量

| 功能                                     | 函数                         |
| :--------------------------------------- | :--------------------------- |
| 获取所有公共属性                         | getFields()                  |
| 获取所有属性（包含私有、默认的等）       | getDeclaredFields()          |
| 获取单个"公共"字段                       | getField(字段名称)           |
| 获取单个字段（包含私有、默认的等）       | getDeclaredField(字段名称)   |
| 先通过反射获取对象，然后给对象设置属性值 | field.set(对象实例, 属性值); |
| 绕过访问修饰符权限                       | field.setAccessible(true)    |

案例如下，可自行增加换行或其他输出，使其在控制台打印更加明显。

```java
@Test
public void test2() throws ClassNotFoundException, ……{
    Class class3 = Class.forName("com.xk857.demo.Student");

    // 1.获取所有公有字段
    Field[] fields = class3.getFields();
    Arrays.stream(fields).forEach(System.out::println);

    // 2.获取所有字段（包含私有）
    fields = class3.getDeclaredFields();
    Arrays.stream(fields).forEach(System.out::println);

    // 3.获取单个字段
    Field field = class3.getField("age");
    System.out.println(field);

    // 4.获取单个字段（包含私有）
    field = class3.getDeclaredField("sname");

    // 5.获取到Student对象，通过反射设置private修饰的sname属性
    Student student = (Student) class3.getConstructor().newInstance();
    field.setAccessible(true);
    field.set(student, "张三");
    System.out.println(student.getSname());
}
```

## 通过反射操作成员方法

给Student添加两个hello方法，一个公有一个私有。

```java
public class Student {

    private String sid;
    private String sname;
    public Integer age;

    private void setSname(String sname) {
        this.sname = sname;
    }

    public void hello() {
        System.out.println("你好！我是" + this.sname);
    }

    private void hello(String name) {
        System.out.println(name + "你好！我是" + this.sname);
    }
}
```

| 功能                                                         | 函数                                            |
| :----------------------------------------------------------- | :---------------------------------------------- |
| 获取所有公有方法，包含了父类的方法也包含Object类的wait、notify等方法 | getMethods()                                    |
| 获取所有方法，包括私有但不包括继承                           | getDeclaredMethods()                            |
| 获取单个公共方法                                             | getMethod(方法名称)                             |
| 获取任意方法（不包含父类）                                   | getDeclaredMethod("方法名称", 参数类型.class……) |
| 执行方法                                                     | method.invoke(对象实例, 传递参数值……);          |

案例如下，可自行增加换行或其他输出，使其在控制台打印更加明显。

```java
@Test
public void test3() throws ClassNotFoundException, …… {
    Class class3 = Class.forName("com.xk857.demo.Student");
    Student student = (Student) class3.getConstructor().newInstance();

    // 1.获取所有公有方法，包含了父类的方法也包含Object类的wait、notify等方法
    Method[] methods = class3.getMethods();
    Arrays.stream(methods).forEach(System.out::println);
    System.out.println();

    // 2.获取所有方法，包括私有但不包括继承
    methods = class3.getDeclaredMethods();
    Arrays.stream(methods).forEach(System.out::println);

    // 3.获取单个公共方法，并执行
    Method method = class3.getMethod("hello");
    method.invoke(student);

    // 4.获取私有的方法并执行
    method = class3.getDeclaredMethod("hello", String.class);
    method.setAccessible(true);
    method.invoke(student, "张三");
}
```
