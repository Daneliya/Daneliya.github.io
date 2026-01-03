---
url: /常用框架/EasyExcel/2_EasyExcel入门之导入Excel.md
---

# EasyExcel入门之导出Excel

### 一、创建监听器

```java
/**
 * 监听器
 * 有个很重要的点 DemoDataListener 不能被spring管理，要每次读取excel都要new,然后里面用到spring可以构造方法传进去
 *
 * @author xxl
 * @date 2024/5/27 23:23
 */
@Slf4j
public class DemoDataListener implements ReadListener<ExportExcelEntity> {

    /**
     * 每隔5条存储数据库，实际使用中可以100条，然后清理list ，方便内存回收
     */
    private static final int BATCH_COUNT = 100;
    /**
     * 缓存的数据
     */
    private List<ExportExcelEntity> cachedDataList = ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);

    /**
     * 假设这个是一个DAO，当然有业务逻辑这个也可以是一个service。当然如果不用存储这个对象没用。
     */
    //private DemoDAO demoDAO;
    public DemoDataListener() {
        // 这里是demo，所以随便new一个。实际使用如果到了spring,请使用下面的有参构造函数
        //demoDAO = new DemoDAO();
    }

    /**
     * 如果使用了spring,请使用这个构造方法。每次创建Listener的时候需要把spring管理的类传进来
     *
     * @param demoDAO
     */
//    public DemoDataListener(DemoDAO demoDAO) {
//        this.demoDAO = demoDAO;
//    }

    /**
     * 这个每一条数据解析都会来调用
     *
     * @param data    one row value. Is is same as {@link AnalysisContext#readRowHolder()}
     * @param context
     */
    @Override
    public void invoke(ExportExcelEntity data, AnalysisContext context) {
//        log.info("解析到一条数据:{}", JSON.toJSONString(data));
        log.info("解析到一条数据:{}", data);
        cachedDataList.add(data);
        // 达到BATCH_COUNT了，需要去存储一次数据库，防止数据几万条数据在内存，容易OOM
        if (cachedDataList.size() >= BATCH_COUNT) {
            saveData();
            // 存储完成清理 list
            cachedDataList = ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);
        }
    }

    /**
     * 所有数据解析完成了 都会来调用
     *
     * @param context
     */
    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {
        // 这里也要保存数据，确保最后遗留的数据也存储到数据库
        saveData();
        log.info("所有数据解析完成！");
    }

    /**
     * 加上存储数据库
     */
    private void saveData() {
        log.info("{}条数据，开始存储数据库！", cachedDataList.size());
//        demoDAO.save(cachedDataList);
        log.info("存储数据库成功！");
    }

    @Override
    public void onException(Exception exception, AnalysisContext context) {
        log.error("解析失败，但是继续解析下一行:{}", exception.getMessage());
        // 如果是某一个单元格的转换异常 能获取到具体行号
        // 如果要获取头的信息 配合invokeHeadMap使用
        if (exception instanceof ExcelDataConvertException) {
            ExcelDataConvertException excelDataConvertException = (ExcelDataConvertException) exception;
            log.error("第{}行，第{}列解析异常，数据为:{}", excelDataConvertException.getRowIndex(), excelDataConvertException.getColumnIndex(), excelDataConvertException.getCellData());
            // TODO 实际业务处理参考：将异常保存到数据库后配合消息队列或其他方法进行消息投递，告知用户哪里错了。
        }
    }

}

```

### 二、Controller层

```java
/**
 * 上传、导入
 *
 * @param file
 * @return
 * @throws IOException
 */
@PostMapping("/upload")
@ResponseBody
public String upload(MultipartFile file) throws IOException {
    EasyExcel.read(file.getInputStream(), ExportExcelEntity.class, new DemoDataListener()).sheet().doRead();
    // 如果配置了数据持久层
    //EasyExcel.read(file.getInputStream(), ExportExcelEntity.class, new DemoDataListener(demoService)).sheet().doRead();
    return "success";
}
```
