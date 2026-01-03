---
url: /常用框架/EasyExcel/4_EasyExcel入门之填充Excel.md
---

# EasyExcel入门之填充Excel

### 一、简单填充

```java
/**
 * 简单的填充
 */
@GetMapping("/simpleFill")
public void simpleFill() {
    // 模板注意 用{} 来表示你要用的变量 如果本来就有"{","}" 特殊字符 用"\{","\}"代替
    String templateFileName =
            TestFileUtil.getPath() + "demo" + File.separator + "fill" + File.separator + "simple.xlsx";

    // 方案1 根据对象填充
    String fileName = TestFileUtil.getPath() + "simpleFill" + System.currentTimeMillis() + ".xlsx";
    // 这里 会填充到第一个sheet， 然后文件流会自动关闭
    ExportExcelEntity fillData = new ExportExcelEntity();
    fillData.setUserName("张三");
    fillData.setMobile("13999999999");
    EasyExcel.write(fileName).withTemplate(templateFileName).sheet().doFill(fillData);

    // 方案2 根据Map填充
    fileName = TestFileUtil.getPath() + "simpleFill" + System.currentTimeMillis() + ".xlsx";
    // 这里 会填充到第一个sheet， 然后文件流会自动关闭
    Map<String, Object> map = MapUtils.newHashMap();
    map.put("name", "张三");
    map.put("number", "13999999999");
    EasyExcel.write(fileName).withTemplate(templateFileName).sheet().doFill(map);
}
```

### 二、列表填充

```java
/**
 * 列表填充
 */
@GetMapping("/listFill")
public void listFill() {
    // 模板注意 用{} 来表示你要用的变量 如果本来就有"{","}" 特殊字符 用"\{","\}"代替
    // 填充list 的时候还要注意 模板中{.} 多了个点 表示list
    // 如果填充list的对象是map,必须包涵所有list的key,哪怕数据为null，必须使用map.put(key,null)
    String templateFileName =
            TestFileUtil.getPath() + "demo" + File.separator + "fill" + File.separator + "list.xlsx";

    // 方案1 一下子全部放到内存里面 并填充
    String fileName = TestFileUtil.getPath() + "listFill" + System.currentTimeMillis() + ".xlsx";
    // 这里 会填充到第一个sheet， 然后文件流会自动关闭
    EasyExcel.write(fileName).withTemplate(templateFileName).sheet().doFill(FakerUtil.generateStudentList(1000));

    // 方案2 分多次 填充 会使用文件缓存（省内存）
    fileName = TestFileUtil.getPath() + "listFill" + System.currentTimeMillis() + ".xlsx";
    ExcelWriter excelWriter = EasyExcel.write(fileName).withTemplate(templateFileName).build();
    WriteSheet writeSheet = EasyExcel.writerSheet().build();
    excelWriter.fill(FakerUtil.generateStudentList(1000), writeSheet);
    excelWriter.fill(FakerUtil.generateStudentList(1000), writeSheet);
}
```

其他填充方式参考官方文档
