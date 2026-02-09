---
url: /Java/Java开发技巧/03.高效编程/6_替换jar包中单个class文件.md
---

# 替换jar包中单个class文件

正式环境问题紧急修复，只修改了一个类中的方法，直接替换单个class。

## 操作步骤

1、将本地要进行替换的java类，编译成.class文件；

2、 将服务器中的xxx.jar包下载下来，放在单独文件夹下，使用cmd或者git终端工具进入命令行，查看要替

换的.class文件在xxx.jar包中所在的具体路径，

命令如下：

```bash
 jar -tvf archive-manage-service.jar | grep PigeonholeCaseInfoSynHandlerImpl.class
```

3、通过第2步中获取到的路径，将xxxdemo.jar中指定的.class解压出来，

命令如下：

```bash
jar -xvf archive-manage-service.jar  BOOT-INF/classes/cn/com/chnsys/handler/impl/PigeonholeCaseInfoSynHandlerImpl.class
```

4、将第一步中的新的class文件替换到解压出来的文件夹中。

5、将替换后的.class重新打进xxxdemo.jar中即可。

命令如下：

```bash
jar -uvf archive-manage-service.jar  BOOT-INF/classes/cn/com/chnsys/handler/impl/PigeonholeCaseInfoSynHandlerImpl.class
```

只替换一个文件：`jar -uvf xxx.jar com/test.class`

替换文件夹中多个文件：`jar -uvf xxx.jar com/demo`

## 补充

替换 BOOT-INF/lib 下的jar包里的class

https://www.cnblogs.com/Marlo/p/15674097.html

https://wenku.baidu.com/view/10fabd6f7cd5360cba1aa8114431b90d6c858928.html

## 反编译软件

1. IDEA 反编译插件（Jadx Class Decompiler）
2. XJad
3. jd-gui
