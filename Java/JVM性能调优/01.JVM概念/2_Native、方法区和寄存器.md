---
url: /Java/JVM性能调优/01.JVM概念/2_Native、方法区和寄存器.md
---

# Native、方法区和寄存器

## 1. native

凡是使用了native关键字的，说明Java的作用范围已经达不到了，它会去调用底层的C语言的库。

1. 进入本地方法栈。
2. 调用本地方法接口。JNI

JNI的作用：扩展Java的使用，融合不同的语言为Java所用。（最初是为了融合C、C++语言）

因为Java诞生的时候，C和C++非常火，想要立足，就有必要调用C、C++的程序。

所以Java在JVM内存区域专门开辟了一块标记区域Native Method Area Stack，用来登记native方法。
在最终执行（执行引擎执行）的时候，通过JNI来加载本地方法库中的方法。

1. 编写一个多线程启动方法。

   ```java
    public class Test {     
        public static void main(String[] args) {         
            new Thread(()->{},"MyThread").start();     
        } 
    }
   ```

2. 点进去查看start方法。

   ```java
    // Thread类中的start方法，底层是把线程加入到线程组，然后去调用本地方法start0 public class Thread implements Runnable {         
    public synchronized void start() {
        if (threadStatus != 0)
            throw new IllegalThreadStateException();
        group.add(this);
        boolean started = false;
        try {
            start0();
            started = true;
        } finally {
            try {
                if (!started) {
                    group.threadStartFailed(this);
                }
            } catch (Throwable ignore) { /* do nothing. If start0 threw a Throwable then                   it will be passed up the call stack */ }
        }
    }
    private native void start0();
    }
   ```

## 2. 方法区

Method Area方法区（此区域属于共享区间，所有定义的方法的信息都保存在该区域）
方法区是被所有线程共享，所有字段、方法字节码、以及一些特殊方法（如构造函数，接口代码）也在此定义。

**静态变量、常量、类信息（构造方法、接口定义）、运行时的常量池存在方法区中，但是实例变量存在堆内存中，和方法区无关。**

## 3. PC寄存器

程序计数器：Program Counter Register
每个线程都有一个程序计数器，是线程私有的，就是一个指针，指向方法区中的方法字节码（用来存储指向像一条指令的地址，也即将要执行的指令代码），在执行引擎读取下一条指令，是一个非常小的内存空间，几乎可以忽略不计。

#
