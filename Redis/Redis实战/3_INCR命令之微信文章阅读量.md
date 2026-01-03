---
url: /Redis/Redis实战/3_INCR命令之微信文章阅读量.md
---

# INCR命令之微信文章阅读量

在大型互联网公司的应用中，例如微博、知乎、抖音等，每个用户浏览、点赞、分享等动作都会产生大量的并发请求。对于这些高频次、高并发的操作，通常不会直接使用数据库来进行计数，因为数据库在这种场景下可能会成为性能瓶颈，甚至导致系统崩溃。

### INCR命令

大量的并发请求需要计数的场景下，通常会选择使用像Redis这样的内存数据库来处理这类操作。Redis提供了原子性的自增命令（如`INCR`），可以确保在并发环境下计数的准确性。同时，Redis的内存存储和快速的访问速度也使其非常适合处理大量、高频次的请求。

> INCR命令，它的全称是increment，用途就是计数器。每执行一次INCR命令，都将key的value自动加1。如果key不存在，那么key的值初始化为0，然后再执行INCR操作。

例如：文章id=100，做阅读计算如：

```shell
127.0.0.1:6379> incr article:100
(integer) 1
127.0.0.1:6379> incr article:100
(integer) 2
127.0.0.1:6379> incr article:100
(integer) 3
127.0.0.1:6379> incr article:100
(integer) 4
127.0.0.1:6379> get article:100
"4"
```

> 技术方案的缺陷：需要频繁的修改redis,耗费CPU，高并发修改redis会导致 redisCPU 100%

### 案例实战

编码实现文章的阅读量

```java
@RestController
@Slf4j
public class ViewController {

    @Autowired
    private RedisTemplate redisTemplate;

    @GetMapping(value = "/view")
    public void view(Integer id) {
        //redis key
        String key = "article:" + id;
        //调用redis的increment计数器命令
        long n = this.redisTemplate.opsForValue().increment(key);
        log.info("key={},阅读量为{}", key, n);
    }
}
```

### 问题

使用INCR命令实现文章阅读量都是在redis内存操作的，那如何同步到数据库呢？

如果不同步到数据库，就会出现数据丢失，请思考：如何把阅读量PV同步到mydql数据库?

#### 方式

1、使用 Redis 记录阅读量：
当文章被阅读时，使用 `INCR` 命令来增加 Redis 中的计数。

```
redisINCR article::readCount
```

2、异步同步到 MySQL

不要直接在处理阅读请求时同步到 MySQL，因为这样会增加请求的延迟。可以使用一个后台任务或工作队列来异步地处理这个同步过程。

例如，可以使用以下步骤：

a. 当 Redis 中的阅读量增加时，发布一个消息到消息队列（如 RabbitMQ、Kafka 等）或一个后台任务队列（如 Celery）。

b. 有一个后台消费者或任务监听这个消息队列。当收到消息时，它从 Redis 中读取当前的阅读量，并更新到 MySQL 数据库。

```
UPDATE articles SET read_count =  WHERE id = ;
```

c. 为了确保数据的一致性，你可以考虑在更新 MySQL 前使用事务，或在更新后设置一个标记（例如，`last_synced_at`）来表示该数据已经被同步。

3、处理失败和重试

后台同步过程可能会因为各种原因失败（例如，MySQL 数据库宕机）。需要有一种机制来处理这些失败，并在适当的时候重试。

4、定期同步

除了实时同步外，还可以设置一个定期任务（例如，每小时或每天）来检查 Redis 和 MySQL 中的数据是否一致，并进行必要的同步。

5、优化性能

当阅读量非常高时，每次从 Redis 中读取和更新 MySQL 可能会成为瓶颈。为了优化性能，你可以考虑以下策略：

a. 批量同步：不是每次阅读量增加都同步，而是积累一定数量的变化后再进行同步。

b. 使用 Redis 的事务或 Lua 脚本来减少网络往返次数。

c. 对于非常高流量的文章，可以考虑使用更复杂的架构，如分布式计数器或分片。

6、监控和报警

设置监控和报警机制来检测任何可能的同步问题或数据不一致。

使用Redis的事务或Lua脚本来减少网络往返次数？

Redis事务并不是传统意义上支持回滚的事务，而是指将多个命令打包成一个原子操作执行。尽管Redis事务不保证所有命令都成功执行，但它确保了打包的命令会按照顺序依次执行，不会被其他客户端的命令打断。然而，由于Redis的单线程特性，事务中的命令实际上仍然是一个接一个地执行，并没有并发优势。因此，对于记录阅读量的场景，事务可能不是最佳选择。

更推荐的方式是使用Redis的Lua脚本功能。Lua脚本可以在Redis服务器端执行，减少了客户端与服务器之间的网络往返次数。对于记录阅读量的操作，可以编写一个简单的Lua脚本，将增加阅读量的命令包含在内，然后在Redis服务器端执行这个脚本。

示例Lua脚本如下：

```lua
-- key为文章的唯一标识符
local key = KEYS[1]
-- 使用INCR命令增加阅读量
local readCount = redis.call('INCR', key)
-- 返回新的阅读量
return readCount
```

然后，在客户端调用这个Lua脚本：

```lua
-- 假设article:1是文章的唯一标识符
EVAL "$(cat script.lua)" 1 article:1
```

这样，所有增加阅读量的逻辑都在Redis服务器端执行，减少了网络延迟和开销。

批量写入？

批量写入是指将多个写入操作合并成一次批量操作，以减少网络传输和IO操作的次数。对于记录阅读量的场景，可以设计一个机制，比如定时任务或使用消息队列，来批量处理阅读量的增加。

具体实现可以如下：

1. 当用户访问文章时，不立即更新Redis中的阅读量，而是将这次访问记录到一个缓冲区或消息队列中。
2. 后台有一个定时任务或消费者进程，定时或实时地从这个缓冲区或消息队列中取出访问记录，并执行批量写入操作。
3. 在批量写入时，可以使用Redis的管道（Pipeline）功能，将多个`INCR`命令打包成一次网络请求发送给Redis服务器执行。

示例使用Redis的管道进行批量写入：

```java
import redis.clients.jedis.Jedis;
import redis.clients.jedis.Pipeline;
import redis.clients.jedis.Transaction;

public class RedisReadCountExample {
    public static void main(String[] args) {
        // 创建Redis连接
        Jedis jedis = new Jedis("localhost", 6379, 0); // 注意：这里的0是超时时间，不是db index，通常设置为2000或其他合适的值
        try {
            // 假设有10篇文章需要更新阅读量
            Pipeline pipe = jedis.pipelined();
            for (int i = 1; i <= 10; i++) {
                pipe.incr(String.format("article:%d:readCount", i));
            }
            // 执行管道中的命令并获取结果
            pipe.syncAndReturnAll();
        } finally {
            // 关闭连接
            if (jedis != null) {
                jedis.close();
            }
        }
    }
}
```

在上面的示例中，创建了一个Redis管道对象，并将10个`INCR`命令添加到管道中。最后，通过调用`execute()`方法，一次性将所有这些命令发送给Redis服务器执行，从而减少了网络传输的次数，提高了性能。
