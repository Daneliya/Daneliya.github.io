---
url: /Java/解决方案/工具类/PDF转换.md
---

# PDF转换

## POI

[java word转pdf在linux系统上可行\_documents4j linux-CSDN博客](https://blog.csdn.net/Pander_king/article/details/126637932)

## Documents4j

documents4j需要MS Office

依赖

```xml
<dependency>
    <groupId>com.documents4j</groupId>
    <artifactId>documents4j-local</artifactId>
    <version>1.1.1</version>
</dependency>
<dependency>
    <groupId>com.documents4j</groupId>
    <artifactId>documents4j-transformer-msoffice-word</artifactId>
    <version>1.1.1</version>
</dependency>
```

代码

```java
public static void main(String[] args) {
    long startTime = System.currentTimeMillis();

    wordToPdf("docx");

    long endTime = System.currentTimeMillis();
    long totalTime = endTime - startTime;
    System.out.println("程序运行时间：" + totalTime + "毫秒");
}

/**
 * 将之前对应的word文件转换成pdf，然后预览pdf文件
 *
 * @param suffix
 */
public static void wordToPdf(String suffix) {
    // 原始文档
    File inputWord = new File("C:/Users/xxl/Desktop/Generative.docx");
    // 转换之后的pdf文件
    File outputFile = new File("C:/Users/xxl/Desktop/Generative.pdf");
    try {
        InputStream docxInputStream = new FileInputStream(inputWord);
        OutputStream outputStream = new FileOutputStream(outputFile);
        IConverter converter = LocalConverter.builder().build();
        if (suffix.equals("doc")) {
            converter.convert(docxInputStream).as(DocumentType.DOC).to(outputStream).as(DocumentType.PDF).execute();
        } else if (suffix.equals("docx")) {
            converter.convert(docxInputStream).as(DocumentType.DOCX).to(outputStream).as(DocumentType.PDF).execute();
        } else if (suffix.equals("txt")) {
            converter.convert(docxInputStream).as(DocumentType.TEXT).to(outputStream).as(DocumentType.PDF).execute();
        }
        outputStream.close();
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

在Linux上使用会报错

```
2024-09-07 21:34:01.068 ERROR 35706 --- [nio-8081-exec-2] o.a.c.c.C.[.[.[/].[dispatcherServlet]    : Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception [Request processing failed; nested exception is java.lang.IllegalStateException: class com.documents4j.conversion.msoffice.MicrosoftWordBridge could not be created by a (File, long, TimeUnit) constructor] with root cause

java.io.IOException: error=2, 没有那个文件或目录

```

这是因为Linux缺少微软的office

### Linux安装Libreoffice

安装：https://blog.csdn.net/a1275302036/article/details/134806486

离线安装：https://blog.csdn.net/nothing\_may/article/details/122175775

首先在官网下载对应的压缩包：[libreoffice压缩包下载链接](https://www.libreoffice.org/download/download-libreoffice/)

解压压缩包（我直接放到opt下解压）

```sh
tar -zxvf LibreOffice_7.1.8_Linux_x86-64_rpm.tar.gz
```

cd到解压的包中的RPMS目录下进行下载

```sh
# 下载
yum localinstall *.rpm
# 启动
/opt/libreoffice7.1/program/soffice --headless --accept="  socket,host=127.0.0.1,port=8100;urp;"- -nofirststartwizard &
```

### 启动报错

#### 报错1

```sh
/opt/libreoffice7.1/program/soffice.bin: error while loading shared libraries: libSM.so.6: cannot open shared object file: No such file or directory
```

这是因为缺少了libSM.so.6包

下载libSM.so.6包：[libSM.so.6压缩包下载地址](https://pkgs.org/download/libSM.so.6)

把包放到系统上直接安装

```sh
yum localinstall libSM-1.2.3-1.el8.x86_64.rpm
```

#### 报错2

```
/opt/libreoffice7.1/program/soffice.bin: error while loading shared libraries: libcairo.so.2: cannot open shared object file: No such file or directory
```

解决

```
yum install -y cairo
```

#### 报错3

```
/opt/libreoffice7.1/program/soffice.bin: error while loading shared libraries: libcups.so.2: cannot open shared object file: No such file or directory
```

解决

```sh
yum install cups-libs
```

https://blog.csdn.net/nothing\_may/article/details/122175775

https://blog.csdn.net/Y\_hanxiong/article/details/124392435

https://www.cnblogs.com/lwjQAQ/p/16505854.html

### 测试

```sh
soffice --headless --convert-to pdf /home/tools/Generative.docx --outdir /home/tools/ 
```

https://blog.csdn.net/apache\_z/article/details/104970280

[Java使用documents4j在linux环境实现word转pdf，并解决中文乱码 - hello龙兄 - 博客园 (cnblogs.com)](https://www.cnblogs.com/qq545505061/p/18345179)

[java 使用documents4j将word转pdf - 快乐小洋人 - 博客园 (cnblogs.com)](https://www.cnblogs.com/1399z3blog/p/17832438.html)

https://blog.csdn.net/qq\_37240161/article/details/124150883

## Aspose

aspose是收费软件，pom依赖无法直接下载

下载：https://blog.csdn.net/cheng137666/article/details/111677549

## docx4j

[使用docx4j 实现word转pdf（linux乱码处理）\_linux导入windows docx4j-CSDN博客](https://blog.csdn.net/winsanity/article/details/122623499)

## Freemarker

[通过FreeMarker生成word文档docx转pdf(二) - 曾经已是追忆 - 博客园 (cnblogs.com)](https://www.cnblogs.com/hehanhan/p/15735637.html)

## jodconverter

[Word转PDF简单示例，分别在windows和centos中完成转换\_documents4j-transformer-msoffice-word-CSDN博客](https://blog.csdn.net/m0_60155232/article/details/134371176)

## 参考资料

https://blog.csdn.net/aley/article/details/127914145

https://blog.csdn.net/wgq2020/article/details/134568346
