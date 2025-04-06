(window.webpackJsonp=window.webpackJsonp||[]).push([[68],{1789:function(a,t,v){"use strict";v.r(t);var s=v(3),_=Object(s.a)({},(function(){var a=this,t=a._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[t("h2",{attrs:{id:"jvm体系结构"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#jvm体系结构"}},[a._v("#")]),a._v(" JVM体系结构")]),a._v(" "),t("p",[t("img",{attrs:{src:v(443),alt:"img"}})]),a._v(" "),t("p",[a._v("方法区和堆是所有线程共享的内存区域；")]),a._v(" "),t("p",[a._v("而java栈、本地方法栈和程序计数器是运行时数据区线程私有的内存区域。")]),a._v(" "),t("p",[a._v("垃圾回收，指的是堆内存的垃圾回收；方法区是特殊的堆，JVM调优99%是调堆（Heap）。")]),a._v(" "),t("ol",[t("li",[a._v("Java堆（Heap）：是Java虚拟机所管理的内存中最大的一块。Java堆是被所有线程共享的一块内\n存区域，在虚拟机启动时创建。此内存区域的唯一目的就是存放对象实例，几乎所有的对象实\n例都在这里分配内存。")]),a._v(" "),t("li",[a._v("方法区（Method Area）：方法区（Method Area）与Java堆一样，是各个线程共享的内存区\n域，它用于存储已被虚拟机加载的类信息、常量、静态变量、即时编译器编译后的代码等数\n据。")]),a._v(" "),t("li",[a._v("程序计数器（Program Counter Register）：程序计数器（Program Counter Register）是一块\n较小的内存空间，它的作用可以看做是当前线程所执行的字节码的行号指示器。")]),a._v(" "),t("li",[a._v("JVM栈（JVM Stacks）：与程序计数器一样，Java虚拟机栈（Java Virtual Machine Stacks）也是\n线程私有的，它的生命周期与线程相同。虚拟机栈描述的是Java方法执行的内存模型：每个方\n法被执行的时候都会同时创建一个栈帧（Stack Frame）用于存储局部变量表、操作栈、动态\n链接、方法出口等信息。每一个方法被调用直至执行完成的过程，就对应着一个栈帧在虚拟机\n栈中从入栈到出栈的过程。")]),a._v(" "),t("li",[a._v("本地方法栈（Native Method Stacks）：本地方法栈（Native Method Stacks）与虚拟机栈所发\n挥的作用是非常相似的，其区别不过是虚拟机栈为虚拟机执行Java方法（也就是字节码）服\n务，而本地方法栈则是为虚拟机使用到的Native方法服务。")])]),a._v(" "),t("h2",{attrs:{id:"类的生命周期"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#类的生命周期"}},[a._v("#")]),a._v(" 类的生命周期")]),a._v(" "),t("p",[a._v("类从被加载到虚拟机内存中开始，到GC卸载出内存为止，它的整个生命周期包括：")]),a._v(" "),t("p",[t("code",[a._v("加载")]),a._v("、"),t("code",[a._v("连接")]),a._v("、"),t("code",[a._v("初始化")]),a._v("、"),t("code",[a._v("使用")]),a._v("和"),t("code",[a._v("卸载")]),a._v("，其中"),t("strong",[a._v("前三部是类的加载的过程")]),a._v("，如下图；")]),a._v(" "),t("p",[t("img",{attrs:{src:v(444),alt:"687474703a2f2f737466165787437676c6106e67"}})]),a._v(" "),t("ol",[t("li",[a._v("加载：查找并加载类的二进制数据，在Java堆中也创建一个java.lang.Class类的对象。")]),a._v(" "),t("li",[a._v("连接：连接又包含三块内容：验证、准备、初始化。\n"),t("ul",[t("li",[a._v("1）验证：文件格式、元数据、字节码、符号引用验证；")]),a._v(" "),t("li",[a._v("2）准备：为类的静态变量分配内存，并将其初始化为默认值；")]),a._v(" "),t("li",[a._v("3）解析：把类中的符号引用转换为直接引用。")])])]),a._v(" "),t("li",[a._v("初始化：为类的静态变量赋予正确的初始值。")]),a._v(" "),t("li",[a._v("使用：new出对象程序中使用。")]),a._v(" "),t("li",[a._v("卸载：执行垃圾回收。")])]),a._v(" "),t("p",[a._v("注意，加载、验证、准备、初始化、卸载这五个阶段发生的顺序是确定的，而解析阶段则不一定，它在某些情况下可以在初始化阶段之后开始。另外这7个阶段通常都是互相交叉的混合式进行的，通常会在一个阶段执行的过程中调用或激活另外一个阶段。")]),a._v(" "),t("p",[t("img",{attrs:{src:v(445),alt:"745698ec-c029-42a2-9203-3966b3a69f45"}})]),a._v(" "),t("h2",{attrs:{id:"jvm加载类的过程"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#jvm加载类的过程"}},[a._v("#")]),a._v(" JVM加载类的过程")]),a._v(" "),t("p",[a._v("JVM加载一个类的过程一般分为三个阶段：加载、连接和初始化。")]),a._v(" "),t("p",[a._v("JVM加载一个类时，首先通过类加载器找到类的字节码然后进行验证、准备和解析，最后执行类的静态代码块和静态变量的赋值操作。")]),a._v(" "),t("p",[t("img",{attrs:{src:v(446),alt:"JVM如何加载一个类"}})]),a._v(" "),t("h3",{attrs:{id:"一个类什么时候进入jvm"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#一个类什么时候进入jvm"}},[a._v("#")]),a._v(" 一个类什么时候进入JVM？")]),a._v(" "),t("ol",[t("li",[a._v("虚拟机启动时，执行main()方法的时候；")]),a._v(" "),t("li",[a._v("new对象的时候；")]),a._v(" "),t("li",[a._v("读取静态字段或静态方法的时候。")])]),a._v(" "),t("h3",{attrs:{id:"谁来负责将class文件加载到内存"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#谁来负责将class文件加载到内存"}},[a._v("#")]),a._v(" 谁来负责将Class文件加载到内存？")]),a._v(" "),t("ol",[t("li",[t("strong",[a._v("类装载器")]),a._v("负责加载Class文件，Class文件在文件开头特定的文件标识（CA FE BA BE）；")]),a._v(" "),t("li",[a._v("类装载器只负责加载，是否可以允许由执行引擎（Execution Engine）决定。")])]),a._v(" "),t("h3",{attrs:{id:"class文件存在内存哪个位置"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#class文件存在内存哪个位置"}},[a._v("#")]),a._v(" class文件存在内存哪个位置？")]),a._v(" "),t("p",[a._v("类加载器从class文件抽取类信息放在"),t("code",[a._v("方法区")]),a._v("；")]),a._v(" "),t("p",[a._v("类信息包括：方法代码，变量名，方法名，访问权限，返回值等等。")]),a._v(" "),t("h3",{attrs:{id:"class对象存储在哪里"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#class对象存储在哪里"}},[a._v("#")]),a._v(" Class对象存储在哪里？")]),a._v(" "),t("p",[t("strong",[a._v("堆")]),a._v("。每当加载器从class文件加载一个类时都会加载类信息到方法区，同时生成class对象，Class对象new对象各对象实例。")]),a._v(" "),t("h2",{attrs:{id:"参考资料"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#参考资料"}},[a._v("#")]),a._v(" 参考资料")]),a._v(" "),t("p",[t("a",{attrs:{href:"https://www.yuque.com/u21195183/jvm",target:"_blank",rel:"noopener noreferrer"}},[a._v("JVM从入门到精通 (yuque.com)"),t("OutboundLink")],1)]),a._v(" "),t("p",[t("a",{attrs:{href:"https://blog.csdn.net/weixin_50280576/article/details/113742011",target:"_blank",rel:"noopener noreferrer"}},[a._v("JVM 学习笔记（一）内存结构_codeali csdn jvm内存结构-CSDN博客"),t("OutboundLink")],1)])])}),[],!1,null,null,null);t.default=_.exports},443:function(a,t,v){a.exports=v.p+"assets/img/jvmstructure001.645747e7.png"},444:function(a,t,v){a.exports=v.p+"assets/img/jvmstructure002.8343b3bc.png"},445:function(a,t,v){a.exports=v.p+"assets/img/745698ec-c029-42a2-9203-3966b3a69f45.80f3ef6b.png"},446:function(a,t,v){a.exports=v.p+"assets/img/jvmstructure003.3d701ba1.png"}}]);