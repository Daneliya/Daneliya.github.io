---
url: /常用框架/SpringBoot/SpringBoot服务整合/4_SpringBoot整合Redis数据库.md
---

# SpringBoot整合Redis数据库

## SpringBoot整合Redis数据库

Redis是当下最流行的用于实现缓存机制的NoSQL数据库，其主要通过key-value存储，支持高并发访问。在实际工作中，Redis结合SpringData技术后可以方便地实现序列化对象的存储。SpringBoot很好地支持了Redis，可以在项目中使用SpringData进行Redis数据操作。

### 一、SpringBoot整合RedisTemplate操作Redis

RedisTemplate是SpringData提供的Redis操作模板，该操作模板主要以Jedis驱动程序为实现基础，进行数据操作封装，所以可以直接调用Redis中的各种数据处理命令进行数据库操作。

#### 1、引入依赖

修改项目中的pom.xml配置文件，追加Redis的依赖引用。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

#### 2、修改配置文件

修改application.yml配置文件，引入Redis相关配置项。

```yaml
spring: 
  redis:                    # Redis相关配置
    host: redis-server      # 主机名称
    port: 6379              # 端口号
    password: admin       # 认证密码
    timeout: 1000         # 连接超时时间
    database: 0         # 默认数据库
    pool:               # 连接池配置
      max-active: 10    # 最大连接数
      max-idle: 8       # 最大维持连接数
      min-idle: 2       # 最小维持连接数
      max-wait: 100     # 最大等待连接超时时间
```

#### 3、测试

在application.yml配置文件中定义完Redis的相关配置后，就可以通过程序来利用RedisTemplate模板进行数据处理了。下面直接编写一个测试类进行测试。

```java
@SpringBootTest(classes = SpringBootStartApplication.class)
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
public class TestRedisTemplate {
	@Autowired
	private RedisTemplate<String, String> redisTemplate;					// 引入RedisTemplate
	@Test
	public void testSet() {
		this.redisTemplate.opsForValue().set("皮卡丘", "java");				// 设置字符串信息
		System.out.println(this.redisTemplate.opsForValue().get("皮卡丘"));	// 根据key获取value
	}
}
```

本程序在测试类中直接注入了RedisTemplate模板对象，并且利用模板对象中提供的方法实现了key-value数据的保存与获取。

### 二、Redis对象序列化操作

在实际项目开发中，使用RedisTemplate操作Redis数据库不仅可以方便地进行命令的操作，还可以结合对象序列化操作，实现对象的保存。

#### 1、定义序列化配置类

定义对象的序列化配置类，以实现RedisSerializer接口。

```java
public class RedisObjectSerializer implements RedisSerializer<Object> {
	// 为了方便进行对象与字节数组的转换，所以应该首先准备出两个转换器
	private Converter<Object, byte[]> serializingConverter = new SerializingConverter();
	private Converter<byte[], Object> deserializingConverter = new DeserializingConverter();
	private static final byte[] EMPTY_BYTE_ARRAY = new byte[0]; // 做一个空数组，不是null

	@Override
	public byte[] serialize(Object obj) throws SerializationException {
		if (obj == null) { // 这个时候没有要序列化的对象出现，所以返回的字节数组应该就是一个空数组
			return EMPTY_BYTE_ARRAY;
		}
		return this.serializingConverter.convert(obj); // 将对象变为字节数组
	}

	@Override
	public Object deserialize(byte[] data) throws SerializationException {
		if (data == null || data.length == 0) { // 此时没有对象的内容信息
			return null;
		}
		return this.deserializingConverter.convert(data);
	}
}
```

#### 2、创建RedisTemplate配置类

要让建立的对象序列化管理类生效，还需要建立一个RedisTemplate的配置类。

```java
@Configuration
public class RedisConfig {
	@Bean
	public RedisTemplate<String, Object> getRedisTemplate(
			RedisConnectionFactory factory) {
		RedisTemplate<String, Object> redisTemplate = new RedisTemplate<String, Object>();
		redisTemplate.setConnectionFactory(factory);
		redisTemplate.setKeySerializer(new StringRedisSerializer()); 	// key的序列化类型
		redisTemplate.setValueSerializer(new RedisObjectSerializer()); 	// value的序列化类型
		return redisTemplate;
	}
}
```

#### 3、创建序列化对象

建立一个待序列化的VO类对象。

```java
@SuppressWarnings("serial")
public class Member implements Serializable {
	private String mid;
	private String name ;
	private Integer age;
	// setter、getter略
	public String getMid() {
		return mid;
	}
	public void setMid(String mid) {
		this.mid = mid;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Integer getAge() {
		return age;
	}
	public void setAge(Integer age) {
		this.age = age;
	}
}
```

#### 4、测试

建立测试类，实现对象信息保存。

```java
@SpringBootTest(classes = SpringBootStartApplication.class)
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
public class TestRedisTemplate {
	@Autowired
	private RedisTemplate<String, Object> redisTemplate;	// 引入RedisTemplate
	@Test 
	public void testGet() {									// 根据key取得数据
		System.out.println(this.redisTemplate.opsForValue().get("皮卡丘"));
	}
	@Test
	public void testSet() {
		Member vo = new Member() ;							// 实例化VO对象
		vo.setMid("pikaqiu");
		vo.setName("皮卡丘");
		vo.setAge(19);
		this.redisTemplate.opsForValue().set("皮卡丘", vo);	// 保存数据
	}
}

```

此时的程序可以使用String作为key类型，Object作为value类型，直接利用RedisTemplate可以将对象序列化保存在Redis数据库中，也可以利用指定的key通过Redis获取对应信息。

### 三、配置多个RedisTemplate

SpringBoot通过配置application.yml，只能够注入一个RedisTemplate对象。从事过实际开发的读者应该清楚，在实际的使用中有可能会在项目中连接多个Redis数据源，这时将无法依靠SpringBoot的自动配置实现，只能够由用户自己来创建RedisTemplate对象。

#### 1、修改配置文件

为了规范配置，需要在application.yml中进行两个Redis数据库连接的配置。

```yaml
myredis:                    # 自定义Redis连接配置
  redis-one:                # 第一个Redis连接
    host: redis-server-1    # Redis主机
    port: 6379              # 连接端口
    password: admin     # 认证信息
    timeout: 1000       # 连接超时时间
    database: 0         # 默认数据库
    pool:               # 连接池配置
      max-active: 10    # 最大连接数
      max-idle: 8       # 最大维持连接数
      min-idle: 2       # 最小维持连接数
      max-wait: 100     # 最大等待连接超时时间
  redis-two:  # 第二个Redis连接
    host: redis-server-2  # Redis主机
    port: 6379            # 连接端口
    password: admin       # 认证信息
    timeout: 1000         # 连接超时时间
    database: 1           # 默认数据库
    pool:                 # 连接池配置
      max-active: 10      # 最大连接数
      max-idle: 8         # 最大维持连接数
      min-idle: 2         # 最小维持连接数
      max-wait: 100       # 最大等待连接超时时间
```

#### 2、修改依赖

修改pom.xml配置文件。

```xml
<!--	<dependency>		// 取消掉spring-boot-starter-data-redis依赖库
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-redis</artifactId>
 </dependency> -->
<dependency>
    <groupId>org.springframework.data</groupId>
    <artifactId>spring-data-redis</artifactId>
</dependency>
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
</dependency>
```

#### 3、自定义的Redis配置类

编写自定义的Redis配置类。

```java
@Configuration
public class RedisConfig {	// 表示定义一个配置类
    
	@Resource(name="redisConnectionFactory") 
	private RedisConnectionFactory redisConnectionFactoryOne;
    
	@Resource(name="redisConnectionFactoryTwo") 
	private RedisConnectionFactory redisConnectionFactoryTwo;
    
	@Bean("redisConnectionFactoryTwo")
	public RedisConnectionFactory getRedisConnectionFactoryTwo(
			@Value("${myredis.redis-two.host}") String hostName,
			@Value("${myredis.redis-two.password}") String password,
			@Value("${myredis.redis-two.port}") int port,
			@Value("${myredis.redis-two.database}") int database,
			@Value("${myredis.redis-two.pool.max-active}") int maxActive,
			@Value("${myredis.redis-two.pool.max-idle}") int maxIdle,
			@Value("${myredis.redis-two.pool.min-idle}") int minIdle,
			@Value("${myredis.redis-two.pool.max-wait}") long maxWait) { // 负责建立Factory的连接工厂类
		JedisConnectionFactory jedisFactory = new JedisConnectionFactory();
		jedisFactory.setHostName(hostName);
		jedisFactory.setPort(port);
		jedisFactory.setPassword(password);
		jedisFactory.setDatabase(database); 
		JedisPoolConfig poolConfig = new JedisPoolConfig(); // 进行连接池配置
		poolConfig.setMaxTotal(maxActive);
		poolConfig.setMaxIdle(maxIdle);
		poolConfig.setMinIdle(minIdle);
		poolConfig.setMaxWaitMillis(maxWait);
		jedisFactory.setPoolConfig(poolConfig);
		jedisFactory.afterPropertiesSet(); // 初始化连接池配置
		return jedisFactory;
	}
    
	@Bean("redisConnectionFactory")	// 如果要与SpringBoot整合一定要提供一个指定名字的RedisConnectionFactory
	public RedisConnectionFactory getRedisConnectionFactoryOne(
			@Value("${myredis.redis-one.host}") String hostName,
			@Value("${myredis.redis-one.password}") String password,
			@Value("${myredis.redis-one.port}") int port,
			@Value("${myredis.redis-one.database}") int database,
			@Value("${myredis.redis-one.pool.max-active}") int maxActive,
			@Value("${myredis.redis-one.pool.max-idle}") int maxIdle,
			@Value("${myredis.redis-one.pool.min-idle}") int minIdle,
			@Value("${myredis.redis-one.pool.max-wait}") long maxWait) { // 建立Factory的连接工厂类
		JedisConnectionFactory jedisFactory = new JedisConnectionFactory();
		jedisFactory.setHostName(hostName);
		jedisFactory.setPort(port);
		jedisFactory.setPassword(password);
		jedisFactory.setDatabase(database);
		JedisPoolConfig poolConfig = new JedisPoolConfig(); // 进行连接池配置
		poolConfig.setMaxTotal(maxActive);
		poolConfig.setMaxIdle(maxIdle);
		poolConfig.setMinIdle(minIdle);
		poolConfig.setMaxWaitMillis(maxWait);
		jedisFactory.setPoolConfig(poolConfig);
		jedisFactory.afterPropertiesSet(); 								// 初始化连接池配置
		return jedisFactory;
	}
	@Bean("redisOne")
	public RedisTemplate<String, String> getRedisTemplateOne() { 
		RedisTemplate<String, String> redisTemplate = new RedisTemplate<String, String>();
		redisTemplate.setKeySerializer(new StringRedisSerializer()); 	// key的序列化类型
		redisTemplate.setValueSerializer(new RedisObjectSerializer()); 	// value的序列化类型
		redisTemplate.setConnectionFactory(this.redisConnectionFactoryOne);
		return redisTemplate; 
	}
	@Bean("redisTwo")
	public RedisTemplate<String, String> getRedisTemplateTwo() { 
		RedisTemplate<String, String> redisTemplate = new RedisTemplate<String, String>();
		redisTemplate.setKeySerializer(new StringRedisSerializer()); 	// key的序列化类型
		redisTemplate.setValueSerializer(new RedisObjectSerializer()); 	// value的序列化类型
		redisTemplate.setConnectionFactory(this.redisConnectionFactoryTwo);
		return redisTemplate; 
	}
}

```

#### 4、测试

编写测试类，使用两个RedisTemplate进行数据操作。

```java
@SpringBootTest(classes = SpringBootStartApplication.class)
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
public class TestRedisTemplate {
    
	@Resource(name="redisOne")
	private RedisTemplate<String,String> redisOne;
    
	@Resource(name="redisTwo")
	private RedisTemplate<String,String> redisTwo;
    
	@Test
	public void testSet() {
		this.redisOne.opsForValue().set("皮卡丘", "hello");	// 保存数据
		this.redisTwo.opsForValue().set("杰尼龟", "hello");	// 保存数据
	}
}
```

本程序利用RedisConfig程序类注入了两个RedisTemplate对象，因此该程序具备了两个Redis数据库的操作能力。
