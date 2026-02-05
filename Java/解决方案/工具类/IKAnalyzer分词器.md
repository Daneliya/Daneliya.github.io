---
url: /Java/解决方案/工具类/IKAnalyzer分词器.md
---

# IKAnalyzer 分词器

需求：使用 Lucene 和 IKAnalyzer 从文章中提取频繁出现的关键字，并按出现次数倒序排列

### 引入依赖

```xml
<dependency>
    <groupId>org.apache.lucene</groupId>
    <artifactId>lucene-core</artifactId>
    <version>8.11.2</version>
</dependency>

<dependency>
    <groupId>org.apache.lucene</groupId>
    <artifactId>lucene-analyzers-common</artifactId>
    <version>8.11.2</version>
</dependency>

<!-- IKAnalyzer for Lucene 8.x -->
<dependency>
    <groupId>com.github.magese</groupId>
    <artifactId>ik-analyzer</artifactId>
    <version>8.5.0</version>
</dependency>
```

### 工具类代码

```java
import org.apache.lucene.analysis.TokenStream;
import org.apache.lucene.analysis.tokenattributes.CharTermAttribute;
import org.wltea.analyzer.lucene.IKAnalyzer;

import java.io.IOException;
import java.io.StringReader;
import java.util.*;

/**
 * 文本关键词提取工具类
 * <p>
 * 基于 Lucene 和 IKAnalyzer 实现，用于从文章中提取频繁出现的关键字，并按出现次数倒序排列
 * 该类内部含有一个List2Map方法，可将重复<String>集合转换为Map<String, Integer>格式
 * 并算出该<String>重复次数，放入相应的value中
 * </p>
 *
 * @author xxl
 * @date 2026/2/5 13:08
 */
public class LuceneUtil {

    /**
     * 测试文章内容
     */
    static String keyWord = "笑星潘长江当上\"男媒婆\"了，但这回可不是演小品——由他自编自导自演的都市喜剧《男媒婆》将于1月13日在北"
            + "京卫视首播。剧中，潘长江变身成为能说会道、古道热肠的\"新时代男媒婆\"丁二春，与\"台湾第一酒窝美女2\"张庭上演了一出\"屌丝逆袭\""
            + "的浪漫追爱记。李明启、李文启、冯远征、任程伟、马丽、徐等明星也齐齐上阵制造\"笑料\"《男媒婆》围绕着丁二春和他所开"
            + "办的\"全成热恋\"婚介所展开。人到中年的丁二春眼看来势汹涌的\"婚恋大潮\"商机不断，想凭借一张巧嘴开创事业和人生"
            + "\"第二春\"。婚介所开张大吉，顾客盈门，提出的要求却也千奇百怪，拜金女、宅男、小老板粉墨登场，展开了一系列令人捧腹"
            + "大笑又不失温情的精彩故事。剧中的一大看点是美女搭配\"丑男\"的搭配，张庭与潘长江成了一对欢喜冤家。张庭表示，剧中两人\""
            + "身高有差距、年龄有距离，相貌不对等\"。而潘长江谈到这种主角设定时认为：\"张庭以往的角色都特别独立、可爱，而'大女人'和'"
            + "小男人'正是我俩这对情侣的设定，所以张庭是非常合适的人选。\"此外，该剧也是潘长江继《能人冯天贵》、《清凌凌的水蓝莹莹的天》"
            + "第一、第二部之后第四次自导自演的喜剧作品。潘长江表示，全剧通过\"媒婆\"这个特殊职业的视角，展示着当代社会种种婚恋价值观，涵盖了"
            + "黄昏恋、拜金女、凤凰男等诸多引发热议的时代话题。(记者 尹春芳)免责声明：本文仅代表作者个人观点，与环球网无关。其原创性以及文中"
            + "陈述文字和内容未经本站证实，对本文以及其中全部或者部分内容、文字的真实性、完整性、及时性本站不作任何保证或承诺，请读者仅作参考，"
            + "并请自行核实相关内容。";

    /**
     * 默认返回关键字个数
     */
    private final static Integer NUM = 5;

    /**
     * 默认截取关键字的最小长度
     */
    private final static Integer QUANTITY = 1;

    /**
     * 从文章中提取关键词
     * <p>
     * 使用 IKAnalyzer 对文章进行分词，提取长度大于指定值的词
     * </p>
     *
     * @param article   待分析的文章内容
     * @param minLength 关键词最小长度
     * @return 提取的关键词列表
     * @throws IOException 分词过程中可能出现的IO异常
     */
    private static List<String> extract(String article, Integer minLength) throws IOException {
        List<String> keywordList = new ArrayList<>();

        // 使用 try-with-resources 自动管理资源
        try (IKAnalyzer analyzer = new IKAnalyzer(true);
             TokenStream tokenStream = analyzer.tokenStream("", new StringReader(article))) {

            // 重置 TokenStream
            tokenStream.reset();

            // 遍历分词结果
            while (tokenStream.incrementToken()) {
                CharTermAttribute charTermAttribute = tokenStream.getAttribute(CharTermAttribute.class);
                String keyword = charTermAttribute.toString();

                // 过滤长度小于指定值的词
                if (keyword.length() > minLength) {
                    keywordList.add(keyword);
                }
            }

            // 结束 TokenStream
            tokenStream.end();
        }

        return keywordList;
    }

    /**
     * 将关键词列表转换为词频映射
     * <p>
     * 统计每个关键词出现的次数
     * </p>
     *
     * @param keywordList 关键词列表
     * @return 关键词到出现次数的映射
     */
    private static Map<String, Integer> list2Map(List<String> keywordList) {
        Map<String, Integer> frequencyMap = new HashMap<>();

        // 统计每个关键词出现的次数
        for (String keyword : keywordList) {
            frequencyMap.put(keyword, frequencyMap.getOrDefault(keyword, 0) + 1);
        }

        return frequencyMap;
    }

    /**
     * 提取文章关键词并排序
     * <p>
     * 从文章中提取关键词，按出现次数倒序排列，返回指定数量的关键词
     * </p>
     *
     * @param article   待分析的文章内容
     * @param minLength 关键词最小长度
     * @param topN      返回的关键词数量
     * @return 按出现次数倒序排列的关键词数组
     * @throws IOException 分词过程中可能出现的IO异常
     */
    public static String[] getKeyWords(String article, Integer minLength, Integer topN) throws IOException {
        // 提取关键词
        List<String> keywordList = extract(article, minLength);

        // 统计词频
        Map<String, Integer> frequencyMap = list2Map(keywordList);

        // 按词频倒序排序
        ArrayList<Map.Entry<String, Integer>> sortedEntries = new ArrayList<>(frequencyMap.entrySet());
        Collections.sort(sortedEntries, new Comparator<Map.Entry<String, Integer>>() {
            @Override
            public int compare(Map.Entry<String, Integer> o1, Map.Entry<String, Integer> o2) {
                return o2.getValue().compareTo(o1.getValue());
            }
        });

        // 确保返回数量不超过实际关键词数量
        if (sortedEntries.size() < topN) {
            topN = sortedEntries.size();
        }

        // 构建返回结果
        String[] result = new String[topN];
        for (int i = 0; i < topN; i++) {
            result[i] = sortedEntries.get(i).getKey();
        }

        return result;
    }

    /**
     * 提取文章关键词（使用默认参数）
     * <p>
     * 使用默认的关键词最小长度和返回数量
     * </p>
     *
     * @param article 待分析的文章内容
     * @return 按出现次数倒序排列的关键词数组
     * @throws IOException 分词过程中可能出现的IO异常
     */
    public static String[] getKeyWords(String article) throws IOException {
        return getKeyWords(article, QUANTITY, NUM);
    }

    /**
     * 主方法，用于测试关键词提取功能
     *
     * @param args 命令行参数
     */
    public static void main(String[] args) {
        try {
            // 提取关键词
            String[] keywords = getKeyWords(keyWord);

            // 输出结果
            System.out.println("提取的关键词（按出现次数倒序）：");
            for (int i = 0; i < keywords.length; i++) {
                System.out.println((i + 1) + ". " + keywords[i]);
            }
        } catch (IOException e) {
            // 打印异常信息
            e.printStackTrace();
        }
    }
}
```
