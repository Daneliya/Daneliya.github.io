---
url: /Java/解决方案/工具类/Jsoup爬虫.md
---

# Jsoup 爬虫

## 简述

Java中支持的爬虫框架有很多，比如WebMagic、Spider、Jsoup等。本文主要介绍Jsoup，并实现简单的爬虫程序。

Jsoup拥有十分方便的api来处理html文档，比如参考了DOM对象的文档遍历方法，参考了CSS选择器的用法等等，因此我们可以使用Jsoup快速地掌握爬取页面数据的技巧。

## 京东搜索爬虫

【狂神说Java】Jsoup爬虫入门实战：https://www.bilibili.com/video/BV1La4y1x7Wm

HtmlParseUtil.class   工具类

```java
public class HtmlParseUtil {
    public static void main(String[] args) throws IOException {
        new HtmlParseUtil().parseJD("hello").forEach(System.out::println);
    }

    public List<Content> parseJD(String keywords) throws IOException {
        // 获取请求  https://search.jd.com/Search?keyword=java
        // 前提，需要联网！  ajax需要模拟浏览器才能获取到！

        String url = "https://search.jd.com/Search?keyword=" + keywords;
        // 解析网页。（Jsoup返回Document就是浏览器Document对象）
        Document document = Jsoup.parse(new URL(url), 30000);
        // 所有你在js可以使用的方法，这里都能用！
        Element element = document.getElementById("J_goodsList");
        // 获取所有的li元素
        Elements elements = element.getElementsByTag("li");
        
        ArrayList<Content> goodsList = new ArrayList<>();
        
        // 获取元素中的内容，这里 el 就是每一个 li 标签了！
        for (Element el : elements) {
            // 关于这种图片特别多的网站，所有的图片都是延迟加载的！
            // src 拿不到图片，通过 element.html() 打印可以看到在 source-data-lazy-img（2021-01-15测试发现在 data-lazy-img） 下
            String img = el.getElementsByTag("img").eq(0).attr("data-lazy-img");//img标签，第一个元素，src属性
            String price = el.getElementsByClass("p-price").eq(0).text();
            String title = el.getElementsByClass("p-name").eq(0).text();
            
            Content content = new Content();
            
            content.setTitle(title);
            content.setPrice(price);
            content.setImg(img);
            
            goodsList.add(content);
        }
        return goodsList;
    }
}
```

Content.class      实体对象

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Content {
    private String title;
    private String img;
    private String price;
    // 拓展属性
}
```

## 开发

1、引入依赖

```xml
<dependency>
    <groupId>org.jsoup</groupId>
    <artifactId>jsoup</artifactId>
    <version>1.10.3</version>
</dependency>
```

或

```xml
<dependency>
    <groupId>us.codecraft</groupId>
    <artifactId>webmagic-core</artifactId>
    <version>0.7.3</version>
    <exclusions>
        <exclusion>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-log4j12</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<dependency>
    <groupId>us.codecraft</groupId>
    <artifactId>webmagic-extension</artifactId>
    <version>0.7.3</version>
</dependency>
```

2、业务代码

组装成     `List<Map>`

```java
@org.junit.Test
public void getShanDongGov() throws IOException {
    String url =  "http://edu.shandong.gov.cn";
    //String url =  "http://www.nhc.gov.cn/wjw/xinw/xwzx.shtml";
    Document document = null;
    try {
        document = Jsoup.parse(new URL(url), 30000);
    } catch (IOException e) {
        e.printStackTrace();
    }

    String[] classArr = {"bt-content-2-left", "bt-content-2-right", "bt-content-4-left"};//工作动态（包括最新文件与政策解读）、公示公告、战线联播
    ArrayList<Map> array = new ArrayList<>();
    for (String string : classArr) {
        Elements elementsByClass = document.getElementsByClass(string);
        for (Element element : elementsByClass) {

            String span = element.select("span[class=hover]").text();//区域标题
            Map<String, Object> map = new HashMap<>();
            if (span.equals("最新文件") || span.equals("政策解读")){//最新文件与政策解读
                String[] idArr2 = {"con-one-1", "con-one-2"};
                for (String s : idArr2) {
                    map = new HashMap<>();
                    Elements li = element.getElementById(s).select("li");
                    ArrayList<List> list = new ArrayList<>();
                    for (Element element1 : li) {
                        ArrayList<String> element_list = new ArrayList<>();
                        String title = element1.select("a").attr("title");//标题
                        String href = element1.select("a").attr("href");//链接
                        String date = element1.select("span").text();//链接
                        element_list.add(title);
                        element_list.add(href);
                        element_list.add(date);
                        list.add(element_list);
                    }
                    if (s.equals("con-one-1")){
                        map.put("title", "最新文件");
                    } else {
                        map.put("title", "政策解读");
                    }
                    map.put("data", list);
                    array.add(map);
                }
            }else{//页面通用
                //Elements jrgz_list = element.getElementsByClass("jrgz_list");//动态链接列表
                ArrayList<List> list = new ArrayList<>();
                Elements li = element.getElementsByTag("li");
                for (Element element2 : li) {
                    ArrayList<String> element_list = new ArrayList<>();
                    String title = element2.select("a").attr("title");//标题
                    String href = element2.select("a").attr("href");//链接
                    String date = element2.select("span").text();//链接
                    element_list.add(title);
                    if (href.length() > 4 && href.substring(0,4).equals("http")){
                        element_list.add(href);
                    }else{//战线联播的url需要组装
                        element_list.add(url + href);
                    }
                    element_list.add(date);
                    list.add(element_list);
                }
                map.put("title", span);
                map.put("data", list);
                array.add(map);
            }
        }
    }
    System.out.println(array.toString());
}
```

使用对象接收

```java
public List<StuLeaveEntity> getShanDongGov(Map<String, Object> params) {
    String url = "http://edu.shandong.gov.cn";
    Document document = null;
    try {
        document = Jsoup.parse(new URL(url), 30000);
    } catch (IOException e) {
        e.printStackTrace();
    }

    String[] classArr = {"bt-content-2-left", "bt-content-2-right", "bt-content-4-left"};//工作动态（包括最新文件与政策解读）、公示公告、战线联播
    List<StuLeaveEntity> StuLeaveEntity = new ArrayList<StuLeaveEntity>();

    for (String string : classArr) {
        Elements elementsByClass = document.getElementsByClass(string);
        for (Element element : elementsByClass) {
            String span = element.select("span[class=hover]").text();//区域标题
            if (span.equals("最新文件") || span.equals("政策解读")) {//最新文件与政策解读
                String[] idArr2 = {"con-one-1", "con-one-2"};
                for (String s : idArr2) {
                    Elements li = element.getElementById(s).select("li");
                    for (Element element1 : li) {
                        String title = element1.select("a").attr("title");//标题
                        String href = element1.select("a").attr("href");//链接
                        String date = href.substring(href.indexOf("art/") + 4, href.indexOf("/art_")).replace("/", "-");
                        //String spanDate = element1.select("span").text();//日期

                        StuLeaveEntity stuLeaveEntity = new StuLeaveEntity();
                        stuLeaveEntity.setTheme("<a href=" + href + " target = \"_blank\">" + title + "</a>");
                        stuLeaveEntity.setType("政府新闻");
                        stuLeaveEntity.setStuName("山东省教育厅");
                        if (s.equals("con-one-1")){
                            stuLeaveEntity.setDeptName("最新文件");
                        } else {
                            stuLeaveEntity.setDeptName("政策解读");
                        }

                        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                        Date parse = null;
                        try {
                            parse = sdf.parse(date);
                        } catch (ParseException e) {
                            e.printStackTrace();
                        }
                        stuLeaveEntity.setApplyTime(parse);
                        StuLeaveEntity.add(stuLeaveEntity);
                    }
                }
            } else {//页面通用
                Elements li = element.getElementsByTag("li");
                for (Element element2 : li) {
                    String title = element2.select("a").attr("title");//标题
                    String href = element2.select("a").attr("href");//链接
                    String date = href.substring(href.indexOf("art/") + 4, href.indexOf("/art_")).replace("/", "-");
                    //String spanDate = element2.select("span").text();//日期

                    StuLeaveEntity stuLeaveEntity = new StuLeaveEntity();
                    stuLeaveEntity.setType("政府新闻");
                    if (href.length() > 4 && href.substring(0, 4).equals("http")) {
                        stuLeaveEntity.setTheme("<a href=" + href + " target = \"_blank\">" + title + "</a>");
                    } else {//战线联播的url需要组装
                        stuLeaveEntity.setTheme("<a href=" + url + href + " target = \"_blank\">" + title + "</a>");
                    }
                    stuLeaveEntity.setStuName("山东省教育厅");
                    stuLeaveEntity.setDeptName(span);

                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                    Date parse = null;
                    try {
                        parse = sdf.parse(date);
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
                    stuLeaveEntity.setApplyTime(parse);
                    StuLeaveEntity.add(stuLeaveEntity);
                }
            }
        }
    }
    return StuLeaveEntity;
}
```

## 参考资料

select用法详解：https://blog.csdn.net/zhangconglin/article/details/50483733

从元素中提取属性、文本和HTML：https://jsoup.org/cookbook/extracting-data/attributes-text-html

案例：https://zhuanlan.zhihu.com/p/37952801

方法：https://www.cnblogs.com/jycboy/p/jsoupdoc.html

https://blog.csdn.net/qq\_40947563/article/details/88604605

https://blog.csdn.net/mrlin6688/article/details/81675551

https://blog.csdn.net/bei\_FengBoby/article/details/90214999
