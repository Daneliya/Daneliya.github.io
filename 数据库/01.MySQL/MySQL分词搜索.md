---
url: /数据库/01.MySQL/MySQL分词搜索.md
---

# MySQL分词搜索

https://www.cnblogs.com/huanzi-qch/p/15238604.html

```
select name from game WHERE MATCH (name) AGAINST ('刀剑危机')
select english_name from game WHERE MATCH (english_name) AGAINST ('Ac')
explain select english_name from game WHERE MATCH (english_name) AGAINST ('Ac')

show variables like '%token%';

set ngram_token_size=2
SET SESSION ngram_token_size = 1;

CREATE FULLTEXT INDEX index_name ON game (name) WITH PARSER ngram;
CREATE FULLTEXT INDEX index_english_name ON game (english_name) WITH PARSER ngram;


mysqld  --defaults-file="D:\Program Files\MySQL\MySQL Server 8.0\my.ini"
```

window安装的mysql8没有my.ini

https://blog.csdn.net/to\_perfect/article/details/107009110

https://blog.csdn.net/interestANd/article/details/115269428
