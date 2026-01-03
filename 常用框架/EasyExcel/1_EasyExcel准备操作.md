---
url: /常用框架/EasyExcel/1_EasyExcel准备操作.md
---

# EasyExcel准备操作

## EasyExcel准备操作

### 引入EasyExcel依赖

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>easyexcel</artifactId>
    <version>3.0.1</version>
</dependency>
```

### 创建对象实体类

```java
@Data
@ContentRowHeight(20)
@HeadRowHeight(40)
@ColumnWidth(40)
public class ExportExcelEntity {

    @ExcelProperty(value = "用户名", index = 0)
    private String userName;

    @ColumnWidth(30)
    @ExcelProperty(value = "手机号", index = 1)
    private String mobile;

    @ColumnWidth(60)
    @ExcelProperty(value = "地址", index = 2)
    private String place;

    @ColumnWidth(60)
    @ExcelProperty(value = "身份证", index = 3)
    private String idCard;

    public ExportExcelEntity(String userName, String mobile, String place) {
        this.userName = userName;
        this.mobile = mobile;
        this.place = place;
    }

    public ExportExcelEntity(String userName, String mobile, String place, String idCard) {
        this.userName = userName;
        this.mobile = mobile;
        this.place = place;
        this.idCard = idCard;
    }
}
```

## 生成测试数据

为了后面方面测试导出性能，使用 javafaker 生成大量测试数据。

### 引入javafaker依赖

```xml
<dependency>
    <groupId>com.github.javafaker</groupId>
    <artifactId>javafaker</artifactId>
    <version>0.17.2</version>
</dependency>
```

### 增加配置

`resources`下新建`zh-CN.yml`配置文件

```yaml
# coding: utf-8
zh-CN:
  faker:
    address:
      city: [海门, 鄂尔多斯, 招远, 舟山, 齐齐哈尔, 盐城, 赤峰, 青岛, 乳山, 金昌, 泉州, 莱西, 日照, 胶南, 南通, 拉萨, 云浮, 梅州, 文登, 上海, 攀枝花, 威海, 承德, 厦门, 汕尾, 潮州, 丹东, 太仓, 曲靖, 烟台, 福州, 瓦房店, 即墨, 抚顺, 玉溪, 张家口, 阳泉, 莱州, 湖州, 汕头, 昆山, 宁波, 湛江, 揭阳, 荣成, 连云港, 葫芦岛, 常熟, 东莞, 河源, 淮安, 泰州, 南宁, 营口, 惠州, 江阴, 蓬莱, 韶关, 嘉峪关, 广州, 延安, 太原, 清远, 中山, 昆明, 寿光, 盘锦, 长治, 深圳, 珠海, 宿迁, 咸阳, 铜川, 平度, 佛山, 海口, 江门, 章丘, 肇庆, 大连, 临汾, 吴江, 石嘴山, 沈阳, 苏州, 茂名, 嘉兴, 长春, 胶州, 银川, 张家港, 三门峡, 锦州, 南昌, 柳州, 三亚, 自贡, 吉林, 阳江, 泸州, 西宁, 宜宾, 呼和浩特, 成都, 大同, 镇江, 桂林, 张家界, 宜兴, 北海, 西安, 金坛, 东营, 牡丹江, 遵义, 绍兴, 扬州, 常州, 潍坊, 重庆, 台州, 南京, 滨州, 贵阳, 无锡, 本溪, 克拉玛依, 渭南, 马鞍山, 宝鸡, 焦作, 句容, 北京, 徐州, 衡水, 包头, 绵阳, 乌鲁木齐, 枣庄, 杭州, 淄博, 鞍山, 溧阳, 库尔勒, 安阳, 开封, 济南, 德阳, 温州, 九江, 邯郸, 临安, 兰州, 沧州, 临沂, 南充, 天津, 富阳, 泰安, 诸暨, 郑州, 哈尔滨, 聊城, 芜湖, 唐山, 平顶山, 邢台, 德州, 济宁, 荆州, 宜昌, 义乌, 丽水, 洛阳, 秦皇岛, 株洲, 石家庄, 莱芜, 常德, 保定, 湘潭, 金华, 岳阳, 长沙, 衢州, 廊坊, 菏泽, 合肥, 武汉, 大庆]
      building_number: ['#####', '####', '###', '##', '#']
      street_suffix: [巷, 街, 路, 桥, 侬, 旁, 中心, 栋]
      postcode: ['######']
      state: [北京市, 上海市, 天津市, 重庆市, 黑龙江省, 吉林省, 辽宁省, 内蒙古, 河北省, 新疆, 甘肃省, 青海省, 陕西省, 宁夏, 河南省, 山东省, 山西省, 安徽省, 湖北省, 湖南省, 江苏省, 四川省, 贵州省, 云南省, 广西省, 西藏, 浙江省, 江西省, 广东省, 福建省, 海南省, 香港, 澳门]
      state_abbr: [京, 沪, 津, 渝, 黑, 吉, 辽, 蒙, 冀, 新, 甘, 青, 陕, 宁, 豫, 鲁, 晋, 皖, 鄂, 湘, 苏, 川, 黔, 滇, 桂, 藏, 浙, 赣, 粤, 闽, 琼, 港, 澳]
      street_name:
        - "#{Name.last_name}#{street_suffix}"
      street_address:
        - "#{street_name}#{building_number}号"
      default_country: [中国]


    name:
      last_name: [徐, 王, 曲, 解, 张, 陈, 刑, 贾, 胡, 岳]
      first_name: [绍齐, 博文, 梓晨, 胤祥, 瑞霖, 明哲, 天翊, 凯瑞, 健雄, 耀杰, 潇然, 子涵, 越彬, 钰轩, 智辉, 致远, 俊驰, 雨泽, 烨磊, 晟睿, 文昊, 修洁, 黎昕, 远航, 旭尧, 鸿涛, 伟祺, 荣轩, 越泽, 浩宇, 瑾瑜, 皓轩, 擎苍, 擎宇, 志泽, 子轩, 睿渊, 弘文, 哲瀚, 雨泽, 楷瑞, 建辉, 晋鹏, 天磊, 绍辉, 泽洋, 鑫磊, 鹏煊, 昊强, 伟宸, 博超, 君浩, 子骞, 鹏涛, 炎彬, 鹤轩, 越彬, 风华, 靖琪, 明辉, 伟诚, 明轩, 健柏, 修杰, 志泽, 弘文, 峻熙, 嘉懿, 煜城, 懿轩, 烨伟, 苑博, 伟泽, 熠彤, 鸿煊, 博涛, 烨霖, 烨华, 煜祺, 智宸, 正豪, 昊然, 明杰, 立诚, 立轩, 立辉, 峻熙, 弘文, 熠彤, 鸿煊, 烨霖, 哲瀚, 鑫鹏, 昊天, 思聪, 展鹏, 笑愚, 志强, 炫明, 雪松, 思源, 智渊, 思淼, 晓啸, 天宇, 浩然, 文轩, 鹭洋, 振家, 乐驹, 晓博, 文博, 昊焱, 立果, 金鑫, 锦程, 嘉熙, 鹏飞, 子默, 思远, 浩轩, 语堂, 聪健, 明, 文, 果, 思, 鹏, 驰, 涛, 琪, 浩, 航, 彬]
      name:
        - "#{last_name}#{first_name}"
      name_with_middle: # Chinese names don't have middle names
        - "#{name}"

    phone_number:
      formats: ['###-########', '####-########', '###########']
    cell_phone:
      formats:
        - '13#########'
        - '145########'
        - '147########'
        - '150########'
        - '151########'
        - '152########'
        - '153########'
        - '155########'
        - '156########'
        - '157########'
        - '158########'
        - '159########'
        - '170########'
        - '171########'
        - '172########'
        - '173########'
        - '175########'
        - '176########'
        - '177########'
        - '178########'
        - '18#########'

    university:
      prefix: ["东", "南", "西", "北", "东南", "东北", "西南", "西北", "中国"]
      suffix: ["理工大学", "技术大学", "艺术大学", "体育大学", "经贸大学", "农业大学", "科技大学", "大学"]
      name:
        - "#{University.prefix}#{University.suffix}"

```

生成数据方法

```java
    /**
     * faker 指定汉语，默认英语
     */
    private static Faker FAKER = new Faker(Locale.CHINA);

    /**
     * 随机生成一定数量学生
     *
     * @param number 数量
     * @return 学生
     */
    public static List<ExportExcelEntity> listStudentList(final int number) {
        return Stream.generate(() -> new ExportExcelEntity(
                        FAKER.name().fullName(),
                        FAKER.phoneNumber().cellPhone(),
                        FAKER.address().city() + FAKER.address().streetAddress(),
                        FAKER.idNumber().validSvSeSsn()))
                .limit(number)
                .collect(Collectors.toList());
    }
```
