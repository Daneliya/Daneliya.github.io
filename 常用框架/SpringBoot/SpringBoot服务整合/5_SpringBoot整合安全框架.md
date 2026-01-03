---
url: /常用框架/SpringBoot/SpringBoot服务整合/5_SpringBoot整合安全框架.md
---

# SpringBoot整合安全框架

## SpringBoot整合安全框架

Shiro是Apache推出的新一代认证与授权管理开发框架，可以方便地与第三方的认证机构进行整合。下面将直接采用自定义缓存类来实现多个Redis数据库信息的保存。

![Image00233](/assets/Image00233.B8pqeQ3a.jpg)

### SpringBoot整合Shiro开发框架

SpringBoot与Shiro的整合处理，本质上和Spring与Shiro的整合区别不大，但开发者需要注意以下3点：

1. SpringBoot可以自动导入一系列的开发包，但是这些开发包里面不包含对Shiro的支持，所以还需要配置shiro的开发依赖库。
2. SpringBoot不提倡使用spring-shiro.xml文件进行配置，需要将配置文件转为Bean的形式（需要考虑缓存的调度时间问题）。
3. Shiro在进行一些Session管理以及缓存配置时要用到shiro-quartz依赖包，该依赖包使用的是QuartZ-1.X版本，而现在能找到的都是QuartZ-2.x版本。因此，如果不使用SpringBoot，那么这样的使用差别不大；如果使用了SpringBoot集成，就会产生后台的异常信息。

#### 引入依赖

修改pom.xml配置文件，追加Shiro的相关依赖包。

定义版本属性

```xml
<druid.version>1.1.1</druid.version>
<shiro.version>1.3.2</shiro.version>
<thymeleaf-extras-shiro.version>1.2.1</thymeleaf-extras-shiro.version>
<quartz.version>2.3.0</quartz.version>
```

定义配置依赖管理

```xml
<dependency>
    <groupId>com.github.theborakompanioni</groupId>
    <artifactId>thymeleaf-extras-shiro</artifactId>
    <version>${thymeleaf-extras-shiro.version}</version>
</dependency>
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-spring</artifactId>
    <version>${shiro.version}</version>
</dependency>
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-core</artifactId>
    <version>${shiro.version}</version>
</dependency>
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-ehcache</artifactId>
    <version>${shiro.version}</version>
</dependency>
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-web</artifactId>
    <version>${shiro.version}</version>
</dependency>
<dependency>
    <groupId>org.quartz-scheduler</groupId>
    <artifactId>quartz</artifactId>
    <version>${quartz.version}</version>
</dependency>
```

修改pom.xml配置文件，追加依赖库配置。

```xml
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-spring</artifactId>
</dependency>
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-core</artifactId>
</dependency>
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-ehcache</artifactId>
</dependency> 
<dependency>
    <groupId>org.quartz-scheduler</groupId>
    <artifactId>quartz</artifactId>
</dependency>
```

#### 创建配置类

建立ShiroConfig的配置程序类，将所有Shiro的配置项都写在此配置类中。

```java
@Configuration
public class ShiroConfig {
	public static final String LOGOUT_URL = "/logout.action" ;			// 退出路径
	public static final String LOGIN_URL = "/loginPage" ;				// 登录路径
	public static final String UNAUTHORIZED_URL = "/unauth" ;			// 未授权错误页
	public static final String SUCCESS_URL = "/pages/back/welcome" ;	// 登录成功页
	
	@Resource(name = "redisConnectionFactory")
	private RedisConnectionFactory redisConnectionFactoryAuthentication;
	@Resource(name = "redisConnectionFactoryAuthorization")
	private RedisConnectionFactory redisConnectionFactoryAuthorization;
	@Resource(name = "redisConnectionFactoryActiveSessionCache")
	private RedisConnectionFactory redisConnectionFactoryActiveSessionCache; 
	
	
	@Bean
	public MemberRealm getRealm() {										// 定义Realm
		MemberRealm realm = new MemberRealm();
		realm.setCredentialsMatcher(new DefaultCredentialsMatcher());	// 配置缓存
		realm.setAuthenticationCachingEnabled(true);
		realm.setAuthenticationCacheName("authenticationCache");
		realm.setAuthorizationCachingEnabled(true);
		realm.setAuthorizationCacheName("authorizationCache");
		return realm;
	}
	@Bean(name = "lifecycleBeanPostProcessor")
	public LifecycleBeanPostProcessor getLifecycleBeanPostProcessor() {	// Shiro实现控制器处理
		return new LifecycleBeanPostProcessor();
	}
	@Bean
	@DependsOn("lifecycleBeanPostProcessor")
	public DefaultAdvisorAutoProxyCreator getDefaultAdvisorAutoProxyCreator() {
		DefaultAdvisorAutoProxyCreator daap = new DefaultAdvisorAutoProxyCreator();
		daap.setProxyTargetClass(true);
		return daap;
	}
	@Bean
	public CacheManager getCacheManager(
			@Qualifier("redisConnectionFactory")
			RedisConnectionFactory redisConnectionFactoryAuthentication ,
			@Qualifier("redisConnectionFactoryAuthorization")
			RedisConnectionFactory redisConnectionFactoryAuthorization ,
			@Qualifier("redisConnectionFactoryActiveSessionCache")
			RedisConnectionFactory redisConnectionFactoryActiveSessionCache
			) {															// 缓存配置
		RedisCacheManager cacheManager = new RedisCacheManager();		// 缓存集合
		Map<String,RedisConnectionFactory> map = new HashMap<>() ;
		map.put("authenticationCache", redisConnectionFactoryAuthentication) ;
		map.put("authorizationCache", redisConnectionFactoryAuthorization) ;
		map.put("activeSessionCache", redisConnectionFactoryActiveSessionCache) ;
		cacheManager.setConnectionFactoryMap(map);
		return cacheManager;
	}
	@Bean
	public SessionIdGenerator getSessionIdGenerator() { 				// SessionID生成
		return new JavaUuidSessionIdGenerator();
	}
	@Bean
	public SessionDAO getSessionDAO(SessionIdGenerator sessionIdGenerator) {
		EnterpriseCacheSessionDAO sessionDAO = new EnterpriseCacheSessionDAO();
		sessionDAO.setActiveSessionsCacheName("activeSessionCache");
		sessionDAO.setSessionIdGenerator(sessionIdGenerator);
		return sessionDAO;
	}
	@Bean
	public RememberMeManager getRememberManager() {						// 记住我
		CookieRememberMeManager rememberMeManager = new CookieRememberMeManager();
		SimpleCookie cookie = new SimpleCookie("MLDNJAVA-RememberMe");
		cookie.setHttpOnly(true); 
		cookie.setMaxAge(3600);
		rememberMeManager.setCookie(cookie);
		return rememberMeManager;
	}
	@Bean
	public DefaultQuartzSessionValidationScheduler getQuartzSessionValidationScheduler(
			DefaultWebSessionManager sessionManager) {
		DefaultQuartzSessionValidationScheduler sessionValidationScheduler = new DefaultQuartzSessionValidationScheduler();
		sessionValidationScheduler.setSessionValidationInterval(100000);
		sessionValidationScheduler.setSessionManager(sessionManager);
		return sessionValidationScheduler;
	}
	
	@Bean
	public AuthorizationAttributeSourceAdvisor getAuthorizationAttributeSourceAdvisor(
			DefaultWebSecurityManager securityManager) {
		AuthorizationAttributeSourceAdvisor aasa = new AuthorizationAttributeSourceAdvisor();
		aasa.setSecurityManager(securityManager);
		return aasa; 
	}

	@Bean
	public ShiroDialect shiroDialect() { 							// 追加配置，启动Thymeleaf模版支持
		return new ShiroDialect();
	}
	@Bean
	public DefaultWebSessionManager getSessionManager(SessionDAO sessionDAO) { // Session管理
		DefaultWebSessionManager sessionManager = new DefaultWebSessionManager();
		sessionManager.setDeleteInvalidSessions(true);
		sessionManager.setSessionValidationSchedulerEnabled(true);
		sessionManager.setSessionDAO(sessionDAO);
		SimpleCookie sessionIdCookie = new SimpleCookie("mldn-session-id");
		sessionIdCookie.setHttpOnly(true);
		sessionIdCookie.setMaxAge(-1);
		sessionManager.setSessionIdCookie(sessionIdCookie);
		sessionManager.setSessionIdCookieEnabled(true);
		return sessionManager;
	}
	@Bean
	public DefaultWebSecurityManager getSecurityManager(Realm memberRealm, CacheManager cacheManager,
			SessionManager sessionManager, RememberMeManager rememberMeManager) {// 缓存管理
		DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();
		securityManager.setRealm(memberRealm);
		securityManager.setCacheManager(cacheManager);
		securityManager.setSessionManager(sessionManager);
		securityManager.setRememberMeManager(rememberMeManager);
		return securityManager;
	}
	public FormAuthenticationFilter getLoginFilter() { 		// 在ShiroFilterFactoryBean中使用
		FormAuthenticationFilter filter = new FormAuthenticationFilter();
		filter.setUsernameParam("mid");
		filter.setPasswordParam("password");
		filter.setRememberMeParam("rememberMe");
		filter.setLoginUrl(LOGIN_URL);						// 登录提交页面
		filter.setFailureKeyAttribute("error");
		return filter;
	}
	public LogoutFilter getLogoutFilter() { 				// 在ShiroFilterFactoryBean中使用
		LogoutFilter logoutFilter = new LogoutFilter();
		logoutFilter.setRedirectUrl("/");					// 首页路径，登录注销后回到的页面
		return logoutFilter;
	}
	@Bean
	public ShiroFilterFactoryBean getShiroFilterFactoryBean(DefaultWebSecurityManager securityManager) {
		ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
		shiroFilterFactoryBean.setSecurityManager(securityManager);	// 设置 SecurityManager
		shiroFilterFactoryBean.setLoginUrl(LOGIN_URL);		// 设置登录页路径
		shiroFilterFactoryBean.setSuccessUrl(SUCCESS_URL);	// 设置跳转成功页
		shiroFilterFactoryBean.setUnauthorizedUrl(UNAUTHORIZED_URL);	// 授权错误页
		Map<String, Filter> filters = new HashMap<String, Filter>();
		filters.put("authc", this.getLoginFilter());
		filters.put("logout", this.getLogoutFilter());
		shiroFilterFactoryBean.setFilters(filters);
		Map<String, String> filterChainDefinitionMap = new HashMap<String, String>();
		filterChainDefinitionMap.put("/logout.page", "logout");
		filterChainDefinitionMap.put("/loginPage", "authc");	// 定义内置登录处理
		filterChainDefinitionMap.put("/pages/**", "authc");
		filterChainDefinitionMap.put("/*", "anon");
		shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);
		return shiroFilterFactoryBean;
	}
}
```

在本配置程序之中，最为重要的一个配置方法就是`getQuartzSessionValidationScheduler()`，这也是SpringBoot整合Shiro中最为重要的一点。之所以重新配置，主要原因是SpringBoot整合Shiro时的定时调度组件版本落后，所以才需要由用户自定义一个`SessionValidationScheduler`接口子类。

#### 页面使用

在使用Shiro的过程中，除了需要对控制层与业务层的拦截过滤之外，对于页面也需要有所支持，而SpringBoot本身不提倡使用JSP页面，所以就需要引入一个支持Shiro处理的Thymeleaf命名空间。

```
<html xmlns:th="http://www.thymeleaf.org" xmlns:shiro="http://www.pollix.at/thymeleaf/shiro">
```

配置完命名空间之后，Shiro就可以使用`\<shiro:hasRole/>`、`\<shiro:principal/>`这样的标签来进行Shiro操作。

### SpringBoot基于Shiro整合OAuth统一认证

在实际项目开发过程中，随着项目功能不断推出，会出现越来越多的子系统。这样就需要使用统一的登录认证处理。在一个良好的系统设计中一般都会存在有一个单点登录，而OAuth正是现在最流行的单点登录协议。

![Image00240](/assets/Image00240.3I-u8h1r.jpg)

#### 引入依赖

修改pom.xml配置文件，引入oltu相关依赖包。

```xml
<oltu.version>1.0.2</oltu.version>
...
<dependency>
    <groupId>org.apache.oltu.oauth2</groupId>
    <artifactId>org.apache.oltu.oauth2.client</artifactId>
    <version>${oltu.version}</version>
</dependency>
<dependency>
    <groupId>org.apache.oltu.oauth2</groupId>
    <artifactId>org.apache.oltu.oauth2.authzserver</artifactId>
    <version>${oltu.version}</version>
</dependency>
<dependency>
    <groupId>org.apache.oltu.oauth2</groupId>
    <artifactId>org.apache.oltu.oauth2.resourceserver</artifactId>
    <version>${oltu.version}</version>
</dependency>
```

修改pom.xml配置文件，在SpringBoot项目中引入相关依赖。

```xml
<dependency>
    <groupId>org.apache.oltu.oauth2</groupId>
    <artifactId>org.apache.oltu.oauth2.client</artifactId>
</dependency>
<dependency>
    <groupId>org.apache.oltu.oauth2</groupId>
    <artifactId>org.apache.oltu.oauth2.authzserver</artifactId>
</dependency>
<dependency>
    <groupId>org.apache.oltu.oauth2</groupId>
    <artifactId>org.apache.oltu.oauth2.resourceserver</artifactId>
</dependency>
```

#### 修改配置文件

对于OAuth整合的处理里面，最为重要的就是为项目指明OAuth的相关处理路径，修改application.yml信息，配置OAuth相关属性。

```yaml
oauth: 
  client:
    id: d0fde52c-538f-4e06-9c2f-363fe4321c7e               # 保存client_id的信息
    secret: 902be4ff-9a36-331d-9f71-afb604d07787      # 保存client_secret的信息
  token:        # 保存token访问地址
    url: http://www.server.com:80/enterpriseauth-oauth-server/accessToken.action
  memberinfo:     # 获得用户信息的访问地址（此地址要在accessToken获取之后获得）
    url: http://www.server.com:80/enterpriseauth-oauth-server/memberInfo.action
  redirect:   # 保存返回的地址（此地址要与之前的OAuthFilter对应上）
    uri: http://www.client.com:9090/shiro-oauth
  login:     # 定义登录访问路径地址
    url: http://www.server.com:80/enterpriseauth-oauth-server/authorize.action?client_id=d0fde52c-538f-4e06-9c2f-363fe4321c7e&response_type=code&redirect_uri=http://www.client.com:9090/shiro-oauth
```

#### 创建配置类

一旦项目中引入OAuth处理，则Realm一定会发生更改，定义一个新的OAuthRealm类（代替之前的MemberRealm程序类）。

```java
public class OAuthRealm extends AuthorizingRealm {
	@Resource
	private IMemberService memberService;
	private String clientId; 			// 应该由客户服务器申请获得
	private String clientSecret; 		// 应该由客户服务器申请获得
	private String redirectUri; 		// 返回地址
	private String accessTokenUrl; 		// 进行Token操作的地址定义
	private String memberInfoUrl; 		// 获得用户信息的路径

	@Override
	public boolean supports(AuthenticationToken token) {
		return token instanceof OAuthToken; // 只有该类型的Token可以执行此Realm
	}

	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
		// 此方法主要是实现用户的认证处理操作
		System.err.println("=========== 1、进行用户认证处理操作（doGetAuthenticationInfo()） ===========");
		OAuthToken oAuthToken = (OAuthToken) token; // 强制转型为自定义的OAuthToken，里面有code
		String authCode = (String) oAuthToken.getCredentials(); // 获取OAuth返回的Code数据
		String mid = this.getMemberInfo(authCode);
		return new SimpleAuthenticationInfo(mid, authCode, "memberRealm");
	}

	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
		// 此方法主要用于用户的授权处理操作，授权一定要在认证之后进行
		System.err.println("=========== 2、进行用户授权处理操作（doGetAuthorizationInfo()） ===========");
		SimpleAuthorizationInfo info = new SimpleAuthorizationInfo(); // 返回授权的信息
		String mid = (String) principals.getPrimaryPrincipal(); // 获得用户名
		Map<String, Set<String>> map = this.memberService.getRoleAndActionByMember(mid);
		info.setRoles(map.get("allRoles")); // 将所有的角色信息保存在授权信息中
		info.setStringPermissions(map.get("allActions")); // 保存所有的权限
		return info;
	}
	private String getMemberInfo(String code) { // 获取用户的信息
		String mid = null;
		try {
			OAuthClient oauthClient = new OAuthClient(new URLConnectionClient());
			OAuthClientRequest accessTokenRequest = OAuthClientRequest.tokenLocation(this.accessTokenUrl) // 设置Token的访问地址
					.setGrantType(GrantType.AUTHORIZATION_CODE).setClientId(this.clientId)
					.setClientSecret(this.clientSecret).setRedirectURI(this.redirectUri).setCode(code)
					.buildQueryMessage();
			// 构建了一个专门用于进行Token数据回应处理的操作类对象，获得Token的请求是POST
			OAuthJSONAccessTokenResponse oauthResponse = oauthClient.accessToken(accessTokenRequest,
					OAuth.HttpMethod.POST);
			String accessToken = oauthResponse.getAccessToken(); // 获得Token
			// 获得AccessToken设计目的是为了能够通过此Token获得mid的信息，所以此时应该继续构建第二次请求
			// 如果要想获得请求操作一定要设置有accessToken处理信息
			OAuthClientRequest memberInfoRequest = new OAuthBearerClientRequest(this.memberInfoUrl)
					.setAccessToken(accessToken).buildQueryMessage(); // 创建一个请求操作
			// 要进行指定用户信息请求的回应处理项
			OAuthResourceResponse resouceResponse = oauthClient.resource(memberInfoRequest, OAuth.HttpMethod.GET,
					OAuthResourceResponse.class); 
			mid = resouceResponse.getBody(); // 获取mid的信息
		} catch (Exception e) {
			e.printStackTrace();
		}
		return mid; 
	}
	public void setMemberInfoUrl(String memberInfoUrl) {
		this.memberInfoUrl = memberInfoUrl;
	}
	public void setClientId(String clientId) {
		this.clientId = clientId;
	}
	public void setClientSecret(String clientSecret) {
		this.clientSecret = clientSecret;
	}
	public void setRedirectUri(String redirectUri) {
		this.redirectUri = redirectUri;
	}
	public void setAccessTokenUrl(String accessTokenUrl) {
		this.accessTokenUrl = accessTokenUrl;
	}
}
```

#### 创建认证过滤器

此时基本的OAuth整合环境已经配置成功，随后还需要建立一个执行OAuth认证的过滤器，在这个过滤器中主要是要获取一个OAuth-Token信息（建立一个OAuthToken类，该类继承UsernamePasswordToken父类，里面保存有principal、authcode两个属性信息）。

```java
public class OAuthAuthenticatingFilter extends AuthenticatingFilter {
	private String authcodeParam = "code" ; // 由OAuth返回的地址上提供有参数
	private String failureUrl ;  // 定义一个失败的跳转页面
	@Override
	protected boolean onAccessDenied(ServletRequest request, ServletResponse response) throws Exception {
		// 随后需要在这个程序之中进行关于oauth登录处理的相关配置操作
		String error = request.getParameter("error") ; // 此处要求获得错误的提示信息
		if (!(error == null || "".equals(error))) {	// 现在出现有错误提示信息
			String errorDesc = request.getParameter("error_description") ; // 错误信息
			// 如果此时出现有错误信息，则直接跳转到错误页面
			WebUtils.issueRedirect(request, response,
					this.failureUrl + "?error=" + error + "&error_description" + errorDesc);
			return false ; // 后续的操作不再执行，直接跳转
		}
		Subject subject = super.getSubject(request, response) ; // 获得Subject
		if (!subject.isAuthenticated()) { // 用户现在未进行登录认证
			String code = request.getParameter(this.authcodeParam) ; // 需要接收返回的code数据
			if (code == null || "".equals(code)) {	// 此时一定是一个错误的处理操作
				super.saveRequestAndRedirectToLogin(request, response); // 跳转到登录页
				return false ;
			}
		}
		return super.executeLogin(request, response); // 执行登录处理逻辑
	}
	@Override
	protected boolean onLoginSuccess(AuthenticationToken token, Subject subject, ServletRequest request,
			ServletResponse response) throws Exception {			// 登录成功之后应该跳转到成功页面
		super.issueSuccessRedirect(request, response);				// 跳转到登录成功页面
		return false ;
	}
	@Override
	protected boolean onLoginFailure(AuthenticationToken token, AuthenticationException e, ServletRequest request,
			ServletResponse response) {								// 登录失败
		Subject subject = super.getSubject(request, response) ; 	// 获得当前用户Subject
		if (subject.isAuthenticated() || subject.isRemembered()) {	// 认证判断
			try { 													// 已经登录成功了就返回到首页上
				super.issueSuccessRedirect(request, response);
			} catch (Exception e1) {}
		} else { 													// 如果没有成功则直接跳转到失败页面
			try {
				WebUtils.issueRedirect(request, response, this.failureUrl);
			} catch (IOException e1) {}
		}
		return false ;
	} 
	public void setAuthcodeParam(String authcodeParam) {
		this.authcodeParam = authcodeParam;
	}
	public void setFailureUrl(String failureUrl) {
		this.failureUrl = failureUrl;
	}
	@Override
	protected AuthenticationToken createToken(ServletRequest request, ServletResponse response) throws Exception {
		OAuthToken token = new OAuthToken(request.getParameter(this.authcodeParam)) ;	// 要传入一个自定义的Token信息
		token.setRememberMe(true); 									// 设置记住我的功能
		return token ; 
	}
}
```

此时成功地实现了SpringBoot + Shiro + OAuth的整合处理，而这样的整合模式也是实际项目开发中的最佳组合。
