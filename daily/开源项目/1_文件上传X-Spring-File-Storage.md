---
url: /daily/开源项目/1_文件上传X-Spring-File-Storage.md
---

# 文件上传X Spring File Storage

## 一、简介

文件操作是平时开发工作中最常接触的一个功能，虽然难度不大，但确实有点繁琐。数据流的开闭、读取很容易出错，尤其是在对接一些云对象存储平台，接一个云平台写一大堆SDK代码，看起来乱糟糟的。X Spring File Storage工具宣称一行代码将文件存储到本地。

> 官网：<https://x-file-storage.xuyanwu.cn/>

## 二、SpringBoot快速集成

### 引入依赖

`pom.xml` 引入本项目，这里默认是 `SpringBoot` 环境，其它环境参考 [脱离 SpringBoot 单独使用](https://x-file-storage.xuyanwu.cn/#/脱离SpringBoot单独使用)

```xml
<dependency>
    <groupId>org.dromara.x-file-storage</groupId>
    <artifactId>x-file-storage-spring</artifactId>
    <version>2.1.0</version>
</dependency>
```

再引入对应平台的依赖（以阿里云OSS为例）

```xml
<!-- 阿里云OSS -->
<dependency>
    <groupId>com.aliyun.oss</groupId>
    <artifactId>aliyun-sdk-oss</artifactId>
    <version>3.16.1</version>
</dependency>
```

### 增加配置

`application.yml` 配置文件中先添加以下基础配置

```yaml
dromara:
  x-file-storage: #文件存储配置
    default-platform: aliyun-oss-1 #默认使用的存储平台
    thumbnail-suffix: ".min.jpg" #缩略图后缀，例如【.min.jpg】【.png】
    #对应平台的配置写在这里，注意缩进要对齐
```

再添加对应平台的配置

```yaml
aliyun-oss:
  - platform: aliyun-oss-1 # 存储平台标识
    enable-storage: true  # 启用存储
    access-key: ??
    secret-key: ??
    end-point: ??
    bucket-name: ??
    domain: ?? # 访问域名，注意“/”结尾，例如：https://abc.oss-cn-shanghai.aliyuncs.com/
    base-path: test/ # 基础路径
local-plus:
  - platform: local-plus-1 # 存储平台标识
    enable-storage: true  #启用存储
    enable-access: true #启用访问（线上请使用 Nginx 配置，效率更高）
    domain: http://127.0.0.1:8080/file/ # 访问域名，例如：“http://127.0.0.1:8030/file/”，注意后面要和 path-patterns 保持一致，“/”结尾，本地存储建议使用相对路径，方便后期更换域名
    base-path: local-plus/ # 基础路径
    path-patterns: /file/** # 访问路径
    storage-path: D:/Temp/ # 存储路径
```

更多参数请参考 `org.dromara.x.file.storage.spring.SpringFileStorageProperties.SpringAliyunOssConfig`

注意配置每个平台前面都有个`-`号，单个平台可以配置多个`platform`

### 编码

在启动类上加上`@EnableFileStorage`注解

```java
@EnableFileStorage
@SpringBootApplication
public class SpringFileStorageTestApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringFileStorageTestApplication.class,args);
    }

}
```

## 三、开始使用

### 上传

#### 基本上传方式

支持 File、MultipartFile、byte\[]、InputStream、URL、URI、String、HttpServletRequest，大文件会自动分片上传。

```java
// 直接上传
fileStorageService.of(file).upload();

// 如果要用 byte[]、InputStream、URL、URI、String 等方式上传，暂时无法获取 originalFilename 属性，最好手动设置
fileStorageService.of(inputStream).setOriginalFilename("a.jpg").upload();

// 上传到指定路径下
fileStorageService.of(file)
        .setPath("upload/") // 保存到相对路径下，为了方便管理，不需要可以不写
        .upload();

// 关联文件参数并上传
fileStorageService.of(file)
        .setObjectId("0")   // 关联对象id，为了方便管理，不需要可以不写
        .setObjectType("0") // 关联对象类型，为了方便管理，不需要可以不写
        .putAttr("role","admin") //保存一些属性，可以在切面、保存上传记录、自定义存储平台等地方获取使用，不需要可以不写
        .putAttr("username","007")
        .upload();

// 上传到指定的存储平台
fileStorageService.of(file)
        .setPlatform("aliyun-oss-1")    // 使用指定的存储平台
        .upload();

// 对图片进行处理并上传，有多个重载方法。图片处理使用的是 https://github.com/coobird/thumbnailator
fileStorageService.of(file)
        .setThumbnailSuffix(".jpg") //指定缩略图后缀，必须是 thumbnailator 支持的图片格式，默认使用全局的
        .setSaveThFilename("thabc") //指定缩略图的保存文件名，注意此文件名不含后缀，默认自动生成
        .image(img -> img.size(1000,1000))  // 将图片大小调整到 1000*1000
        .thumbnail(th -> th.size(200,200))  // 再生成一张 200*200 的缩略图
        .upload();

// 其它更多方法以实际 API 为准
```

代码示例

```java
@RestController
public class FileDetailController {

    @Autowired
    private FileStorageService fileStorageService;//注入实列

    /**
     * 上传文件
     */
    @PostMapping("/upload")
    public FileInfo upload(MultipartFile file) {
        return fileStorageService.of(file).upload();
    }
    
    /**
     * 上传文件，成功返回文件 url
     */
    @PostMapping("/upload2")
    public String upload2(MultipartFile file) {
        FileInfo fileInfo = fileStorageService.of(file)
                .setPath("upload/") //保存到相对路径下，为了方便管理，不需要可以不写
                .setObjectId("0")   //关联对象id，为了方便管理，不需要可以不写
                .setObjectType("0") //关联对象类型，为了方便管理，不需要可以不写
                .putAttr("role","admin") //保存一些属性，可以在切面、保存上传记录、自定义存储平台等地方获取使用，不需要可以不写
                .upload();  //将文件上传到对应地方
        return fileInfo == null ? "上传失败！" : fileInfo.getUrl();
    }

    /**
     * 上传图片，成功返回文件信息
     * 图片处理使用的是 https://github.com/coobird/thumbnailator
     */
    @PostMapping("/upload-image")
    public FileInfo uploadImage(MultipartFile file) {
        return fileStorageService.of(file)
                .image(img -> img.size(1000,1000))  //将图片大小调整到 1000*1000
                .thumbnail(th -> th.size(200,200))  //再生成一张 200*200 的缩略图
                .upload();
    }

    /**
     * 上传文件到指定存储平台，成功返回文件信息
     */
    @PostMapping("/upload-platform")
    public FileInfo uploadPlatform(MultipartFile file) {
        return fileStorageService.of(file)
                .setPlatform("aliyun-oss-1")    //使用指定的存储平台
                .upload();
    }

    /**
     * 直接读取 HttpServletRequest 中的文件进行上传，成功返回文件信息
     * 使用这种方式有些注意事项，请查看文档 基础功能-上传 章节
     */
    @PostMapping("/upload-request")
    public FileInfo uploadPlatform(HttpServletRequest request) {
        return fileStorageService.of(request).upload();
    }
}
```

FileInfo 结果集

```json
{
    "id": null,
    "url": "http://127.0.0.1:8080/file/local-plus/6633532212876ccd660cd50f.xlsx",
    "size": 3750,
    "filename": "6633532212876ccd660cd50f.xlsx",
    "originalFilename": "yuanJiHuoDongDaoChu20240430052317.xlsx",
    "basePath": "local-plus/",
    "path": "",
    "ext": "xlsx",
    "contentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "platform": "local-plus-1",
    "thUrl": null,
    "thFilename": null,
    "thSize": null,
    "thContentType": null,
    "objectId": null,
    "objectType": null,
    "metadata": {},
    "userMetadata": {},
    "thMetadata": {},
    "thUserMetadata": {},
    "attr": {},
    "fileAcl": null,
    "thFileAcl": null,
    "hashInfo": {},
    "uploadId": null,
    "uploadStatus": null,
    "createTime": "2024-05-02T08:47:30.439+0000"
}
```

#### 直接上传HttpServletRequest

通过直接读取输入流进行上传，可以实现文件不落盘，边读取边上传，速度更快

需要先在配置文件中开启 `multipart` 懒加载，不然在 `Controller` 中拿到输入流是已经被读取过的

```yaml
spring.servlet.multipart.resolve-lazily: true
```

编码示例

```java
@RestController
public class FileDetailController {
    /**
     * 直接读取 HttpServletRequest 中的文件进行上传，成功返回文件信息
     */
    @PostMapping("/upload-request")
    public FileInfo uploadRequest(HttpServletRequest request) {
        return fileStorageService.of(request).upload();
    }

    /**
     * 这里演示了其它参数的获取方式
     */
    @PostMapping("/upload-request2")
    public FileInfo uploadRequest2(HttpServletRequest request) {
        HttpServletRequestFileWrapper wrapper = (HttpServletRequestFileWrapper) fileStorageService.wrapper(request);

        //获取指定参数，注意无法获取文件类型的参数
        String aaa = wrapper.getParameter("aaa");
        log.info("aaa：{}",aaa);

        //获取全部参数，注意无法获取文件类型的参数
        MultipartFormDataReader.MultipartFormData formData = wrapper.getMultipartFormData();
        Map<String, String[]> parameterMap = formData.getParameterMap();
        log.info("parameterMap：{}",parameterMap);
        
        //请求头还是通过 request 获取
        String auth = request.getHeader("Authorization");

        return fileStorageService.of(wrapper).upload();
    }

    /**
     * 注意这里是错误的用法，在方法上定义参数来接收请求中的参数，这样会导致输入流被提前读取
     */
    @PostMapping("/upload-request3")
    public FileInfo uploadRequest3(HttpServletRequest request,String aaa) {
        //包括但不限于下面这几种通过 request 获取参数的方式也是不行的，同样会导致输入流被提前读取
        String bbb = request.getParameter("bbb");
        Map<String, String[]> parameterMap = request.getParameterMap();
        
        //总之就是任何会导致输入流被提前读取的行为都是不可以的
        return fileStorageService.of(request).upload();
    }
}
```

#### 分片上传

一般情况下，使用上面的上传方式就已经足够使用了，大文件会在内部自动进行分片上传。
但是还存在着不足，例如无法多线程并行上传、无法断点续传等，现在可以参考以下方式使用手动分片上传来实现这些功能。

##### 手动分片上传-是否支持

```java
//当前默认的存储平台支付支持手动分片上传
MultipartUploadSupportInfo supportInfo = fileStorageService.isSupportMultipartUpload();
supportInfo.getIsSupport();//是否支持手动分片上传，正常情况下判断此参数就行了
supportInfo.getIsSupportListParts();//是否支持列举已上传的分片
supportInfo.getIsSupportAbort();//是否支持取消上传点击复制错误复制成功
```

##### 手动分片上传-初始化

又拍云 USS 比较特殊，需要传入分片大小，虽然已有默认值（1M），但为了方便使用还是单独设置一下（5MB）

```java
//是否为又拍云 USS
boolean isUpyunUss = fileStorageService.getFileStorage() instanceof UpyunUssFileStorage;
//手动分片上传-初始化
FileInfo fileInfo = fileStorageService.initiateMultipartUpload()
        .setPath("test/")   // 保存到相对路径下，为了方便管理，不需要可以不写
        .putMetadata(isUpyunUss, "X-Upyun-Multi-Part-Size", String.valueOf(5 * 1024 * 1024))// 设置 Metadata，不需要可以不写
        .init();点击复制错误复制成功
```

##### 手动分片上传-上传分片

这里支持多个线程同时上传，充分利用带宽

```java
int partNumber = 1;//分片号。每一个上传的分片都有一个分片号，一般情况下取值范围是1~10000
byte[] bytes = FileUtil.readBytes("C:\\001.part");//分片数据，和基本的上传方式一样，也支持各种数据源
FilePartInfo filePartInfo = fileStorageService.uploadPart(fileInfo, partNumber, bytes, (long) bytes.length).upload();点击复制错误复制成功
```

##### 手动分片上传-完成

```java
fileStorageService.completeMultipartUpload(fileInfo).complete();点击复制错误复制成功
```

##### 手动分片上传-列举已上传的分片

```java
FilePartInfoList partList = fileStorageService.listParts(fileInfo).listParts();点击复制错误复制成功
```

##### 手动分片上传-取消

```java
fileStorageService.abortMultipartUpload(fileInfo).abort();
```

#### 监听上传进度

```java
// 方式一
fileStorageService.of(file).setProgressListener(progressSize ->
    System.out.println("已上传：" + progressSize)
).upload();

// 方式二
fileStorageService.of(file).setProgressListener((progressSize,allSize) ->
    System.out.println("已上传 " + progressSize + " 总大小" + (allSize == null ? "未知" : allSize))
).upload();

// 方式三
fileStorageService.of(file).setProgressListener(new ProgressListener() {
    @Override
    public void start() {
    System.out.println("上传开始");
    }

    @Override
    public void progress(long progressSize,Long allSize) {
        System.out.println("已上传 " + progressSize + " 总大小" + (allSize == null ? "未知" : allSize));
    }

    @Override
    public void finish() {
        System.out.println("上传结束");
    }
}).upload();
```

### 保存上传记录

### 下载

#### 下载方式

```java
// 获取文件信息
FileInfo fileInfo = fileStorageService.getFileInfoByUrl("https://file.abc.com/test/a.jpg");

// 下载为字节数组
byte[] bytes = fileStorageService.download(fileInfo).bytes();

// 下载到文件
fileStorageService.download(fileInfo).file("C:\\a.jpg");

// 下载到 OutputStream 中
ByteArrayOutputStream out = new ByteArrayOutputStream();
fileStorageService.download(fileInfo).outputStream(out);

// 获取 InputStream 手动处理
fileStorageService.download(fileInfo).inputStream(in -> {
    //TODO 读取 InputStream
});

// 直接通过文件信息中的 url 下载，省去手动查询文件信息记录的过程
fileStorageService.download("https://file.abc.com/test/a.jpg").file("C:\\a.jpg");

// 下载缩略图
fileStorageService.downloadTh(fileInfo).file("C:\\th.jpg");
```

#### 监听下载进度

```java
// 方式一
fileStorageService.download(fileInfo).setProgressListener(progressSize ->
        System.out.println("已下载：" + progressSize)
).file("C:\\a.jpg");
        
// 方式二
fileStorageService.download(fileInfo).setProgressListener((progressSize,allSize) ->
        System.out.println("已下载 " + progressSize + " 总大小" + allSize)
).file("C:\\a.jpg");

// 方式三
fileStorageService.download(fileInfo).setProgressListener(new ProgressListener() {
    @Override
    public void start() {
        System.out.println("下载开始");
    }

    @Override
    public void progress(long progressSize,Long allSize) {
        System.out.println("已下载 " + progressSize + " 总大小" + allSize);
    }

    @Override
    public void finish() {
        System.out.println("下载结束");
    }
}).file("C:\\a.jpg");
```

### 删除

```java
//获取文件信息
FileInfo fileInfo = fileStorageService.getFileInfoByUrl("https://file.abc.com/test/a.jpg");

//直接删除
fileStorageService.delete(fileInfo);

//条件删除
fileStorageService.delete(fileInfo,info -> {
    //TODO 检查是否满足删除条件
    return true;
});

//直接通过文件信息中的 url 删除，省去手动查询文件信息记录的过程
fileStorageService.delete("https://file.abc.com/test/a.jpg");
```

### 判断文件是否存在

```java
//获取文件信息
FileInfo fileInfo = fileStorageService.getFileInfoByUrl("https://file.abc.com/test/a.jpg");

//判断文件是否存在
boolean exists = fileStorageService.exists(fileInfo);

//直接通过文件信息中的 url 判断文件是否存在，省去手动查询文件信息记录的过程
boolean exists2 = fileStorageService.exists("https://file.abc.com/test/a.jpg");
```

### 复制

复制分为 `同存储平台复制` 和 `跨存储平台复制`，默认会自动选择

`同存储平台复制` 直接调用每个存储平台提供的复制方法，速度快，不额外占用网络及本地硬盘空间

`跨存储平台复制` 是通过先下载再上传的方式实现的，正常情况下上传下载是同时进行的，不会过多占用内存，不占用硬盘空间，但是会占用网络带宽，速度受网络影响

`FTP` 、 `SFTP` 和 `FastDFS` 不支持 `同存储平台复制` ，默认会自动使用 `跨存储平台复制`

```java
// 上传源文件
FileInfo fileInfo = fileStorageService.of(new File("D:\\Desktop\\a.png")).thumbnail().upload();

// 复制到 copy 这个路径下（同存储平台复制）
FileInfo destFileInfo = fileStorageService.copy(fileInfo)
        .setPath("copy/")
        .copy();

//复制到同路径下不同文件名（同存储平台复制）
FileInfo destFileInfo = fileStorageService.copy(fileInfo)
        .setFilename("aaaCopy." + FileNameUtil.extName(fileInfo.getFilename()))
        .setThFilename("aaaCopy.min." + FileNameUtil.extName(fileInfo.getThFilename()))
        .copy();

//复制到其它存储平台（跨存储平台复制）
FileInfo destFileInfo = fileStorageService.copy(fileInfo)
        .setPlatform("local-plus-1")
        .setProgressListener((progressSize, allSize) ->
            log.info("文件复制进度：{} {}%", progressSize, progressSize * 100 / allSize))
        .copy();

//强制使用跨存储平台复制
FileInfo destFileInfo = fileStorageService.copy(fileInfo)
        .setCopyMode(Constant.CopyMode.CROSS)
        .setPath("copy/")
        .copy();

//是否支持同存储平台复制
boolean supportSameCopy = fileStorageService.isSupportSameCopy("aliyun-oss-1");
```

### 移动（重命名）

移动分为 `同存储平台移动` 和 `跨存储平台移动`，默认会自动选择

`同存储平台移动` 直接调用每个存储平台提供的移动方法，速度快，不额外占用网络及本地硬盘空间

`跨存储平台移动` 是通过先复制再删除源文件的方式实现的，`跨存储平台复制` 时速度受网络影响，详情见 [复制](https://x-file-storage.xuyanwu.cn/#/基础功能?id=复制) 章节

仅 `本地` 、 `FTP` 、`SFTP` 、`WebDAV` 、`七牛云 Kodo` 、`又拍云 USS` 支持 `同存储平台移动` ，其它不支持的存储平台默认会自动使用 `跨存储平台移动`

```java
// 上传源文件
FileInfo fileInfo = fileStorageService.of(new File("D:\\Desktop\\a.png")).thumbnail().upload();

// 移动到 move 这个路径下（同存储平台移动）
FileInfo destFileInfo = fileStorageService.move(fileInfo)
        .setPath("move/")
        .move();

//移动到同路径下不同文件名（同存储平台移动）
FileInfo destFileInfo = fileStorageService.move(fileInfo)
        .setFilename("aaaMove." + FileNameUtil.extName(fileInfo.getFilename()))
        .setThFilename("aaaMove.min." + FileNameUtil.extName(fileInfo.getThFilename()))
        .move();

//移动到其它存储平台（跨存储平台移动）
FileInfo destFileInfo = fileStorageService.move(fileInfo)
        .setPlatform("local-plus-1")
        .setProgressListener((progressSize, allSize) ->
            log.info("文件移动进度：{} {}%", progressSize, progressSize * 100 / allSize))
        .move();

//强制使用跨存储平台移动
FileInfo destFileInfo = fileStorageService.move(fileInfo)
        .setMoveMode(Constant.MoveMode.CROSS)
        .setPath("move/")
        .move();

//是否支持同存储平台移动
boolean supportSameMove = fileStorageService.isSupportSameMove("aliyun-oss-1");
```

> 上面代码可访问博主的仓库：[springboot\_chowder/springboot\_x\_file\_storage at main · Daneliya/springboot\_chowder (github.com)](https://github.com/Daneliya/springboot_chowder/tree/main/springboot_x_file_storage)

## 四、其它功能

X FIle Storage还有访问策略、签名生成、Metadata 和 UserMetadata上传、存储平台动态配置及自定义Client、文件适配器、MIME类型识别、哈希计算、切面增强等功能，详细可参考官方文档。
