---
url: /常用框架/EasyExcel/3_EasyExcel入门之导出Excel.md
---

# EasyExcel入门之导入Excel

### 简单导出

```java
/**
 * 最简单的写
 * <p>
 * 1. 创建excel对应的实体对象 参照{@link DemoData}
 * <p>
 * 2. 直接写即可
 */
@Test
public void simpleWrite() {
    // 注意 simpleWrite在数据量不大的情况下可以使用（5000以内，具体也要看实际情况），数据量大参照 重复多次写入

    // 写法1 JDK8+
    // since: 3.0.0-beta1
    String fileName = TestFileUtil.getPath() + "simpleWrite" + System.currentTimeMillis() + ".xlsx";
    // 这里 需要指定写用哪个class去写，然后写到第一个sheet，名字为模板 然后文件流会自动关闭
    // 如果这里想使用03 则 传入excelType参数即可
    EasyExcel.write(fileName, ExportExcelEntity.class)
        .sheet("模板")
        .doWrite(() -> {
            // 分页查询数据
            return data();
        });

    // 写法2
    fileName = TestFileUtil.getPath() + "simpleWrite" + System.currentTimeMillis() + ".xlsx";
    // 这里 需要指定写用哪个class去写，然后写到第一个sheet，名字为模板 然后文件流会自动关闭
    // 如果这里想使用03 则 传入excelType参数即可
    EasyExcel.write(fileName, ExportExcelEntity.class).sheet("模板").doWrite(data());

    // 写法3
    fileName = TestFileUtil.getPath() + "simpleWrite" + System.currentTimeMillis() + ".xlsx";
    // 这里 需要指定写用哪个class去写
    try (ExcelWriter excelWriter = EasyExcel.write(fileName, ExportExcelEntity.class).build()) {
        WriteSheet writeSheet = EasyExcel.writerSheet("模板").build();
        excelWriter.write(data(), writeSheet);
    }
}
```

### 重复多次写入(写到单个或者多个Sheet)

```java
/**
 * 重复多次写入
 * <p>
 * 1. 创建excel对应的实体对象 参照{@link ComplexHeadData}
 * <p>
 * 2. 使用{@link ExcelProperty}注解指定复杂的头
 * <p>
 * 3. 直接调用二次写入即可
 */
@Test
public void repeatedWrite() {
    // 方法1: 如果写到同一个sheet
    String fileName = TestFileUtil.getPath() + "repeatedWrite" + System.currentTimeMillis() + ".xlsx";
    // 这里 需要指定写用哪个class去写
    try (ExcelWriter excelWriter = EasyExcel.write(fileName, ExportExcelEntity.class).build()) {
        // 这里注意 如果同一个sheet只要创建一次
        WriteSheet writeSheet = EasyExcel.writerSheet("模板").build();
        // 去调用写入,这里我调用了五次，实际使用时根据数据库分页的总的页数来
        for (int i = 0; i < 5; i++) {
            // 分页去数据库查询数据 这里可以去数据库查询每一页的数据
            List<ExportExcelEntity> data = data();
            excelWriter.write(data, writeSheet);
        }
    }

    // 方法2: 如果写到不同的sheet 同一个对象
    fileName = TestFileUtil.getPath() + "repeatedWrite" + System.currentTimeMillis() + ".xlsx";
    // 这里 指定文件
    try (ExcelWriter excelWriter = EasyExcel.write(fileName, ExportExcelEntity.class).build()) {
        // 去调用写入,这里我调用了五次，实际使用时根据数据库分页的总的页数来。这里最终会写到5个sheet里面
        for (int i = 0; i < 5; i++) {
            // 每次都要创建writeSheet 这里注意必须指定sheetNo 而且sheetName必须不一样
            WriteSheet writeSheet = EasyExcel.writerSheet(i, "模板" + i).build();
            // 分页去数据库查询数据 这里可以去数据库查询每一页的数据
            List<ExportExcelEntity> data = data();
            excelWriter.write(data, writeSheet);
        }
    }

    // 方法3 如果写到不同的sheet 不同的对象
    fileName = TestFileUtil.getPath() + "repeatedWrite" + System.currentTimeMillis() + ".xlsx";
    // 这里 指定文件
    try (ExcelWriter excelWriter = EasyExcel.write(fileName).build()) {
        // 去调用写入,这里我调用了五次，实际使用时根据数据库分页的总的页数来。这里最终会写到5个sheet里面
        for (int i = 0; i < 5; i++) {
            // 每次都要创建writeSheet 这里注意必须指定sheetNo 而且sheetName必须不一样。这里注意DemoData.class 可以每次都变，我这里为了方便 所以用的同一个class
            // 实际上可以一直变
            WriteSheet writeSheet = EasyExcel.writerSheet(i, "模板" + i).head(ExportExcelEntity.class).build();
            // 分页去数据库查询数据 这里可以去数据库查询每一页的数据
            List<ExportExcelEntity> data = data();
            excelWriter.write(data, writeSheet);
        }
    }

}
```

### 指定列或排除列

```Java
@GetMapping("download/exclude")
public void downloadExcludeColumn(HttpServletResponse response) throws IOException {
    response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    response.setCharacterEncoding("utf-8");
    String fileName = URLEncoder.encode("测试", StandardCharsets.UTF_8).replaceAll("\\+", "%20");
    response.setHeader("Content-disposition", "attachment;filename*=utf-8''" + fileName + ".xlsx");

    // 根据用户传入字段，假设我们要忽略 userName
    Set<String> excludeColumnFiledNames = new HashSet<>();
    excludeColumnFiledNames.add("userName");
    // 忽略某些列，使其不导出 excludeColumnFiledNames
    EasyExcel.write(response.getOutputStream(), ExportExcelEntity.class).excludeColumnFiledNames(excludeColumnFiledNames).sheet("模板").doWrite(FakerUtil.generateStudentList(1000));
    
    // 根据用户传入字段，例如只导出userName和mobile列
    Set<String> includeColumnFiledNames = new HashSet<>();
    includeColumnFiledNames.add("userName");
    includeColumnFiledNames.add("mobile");
    // 只导出选中列 includeColumnFiledNames
    EasyExcel.write(response.getOutputStream(), ExportExcelEntity.class).includeColumnFiledNames(includeColumnFiledNames).sheet("模板").doWrite(FakerUtil.generateStudentList(1000));
}
```

其他涉及导出格式问题参考官方文档

复杂导出

https://segmentfault.com/a/1190000041261830#item-3-3
