---
title: JDBC-如何连接数据库
article: false
category:
  - Java
  - 数据库
  - JDBC
---
## JDBC概述
- **Java Database Connectivity**
- JDBC是一些接口，使用Java语言连接数据库
## 获取数据库连接
### 使用Driver类连接数据库
- 工程下新建lib文件夹，导入MySQL的driver驱动，驱动右键-BuildPath-AddPath，这样才能使用该驱动下的API
- 如果是Dynamic Web Project(动态的web项目)，则是把驱动jar放到WebContent(有的开发工具叫WebRoot)目录中的WEB-INF目录中的lib目录下即可
#### Driver方式一
```java
public class ConnectionTest {
	@Test
	public void testConnection1() throws SQLException {
		// 获取Driver的实现类对象
		Driver driver = new com.mysql.cj.jdbc.Driver();

		
		// url是想要连接的数据库，url在mysql-connector-java文件夹，docs文件夹，README.txt文件中，搜索url即可找到(约在2900行)
		// jdbc主协议，mysql子协议，ip地址，端口号，数据库名
		String url = "jdbc:mysql://localhost:3306/test";
		
		// 将用户名和密码封装到Properties中
		Properties info = new Properties();
		info.setProperty("user", "root");
		info.setProperty("password", "root");
		// 获取连接(所有驱动对应的方法都是接口，都需要导入包)
		Connection conn = driver.connect(url, info);
		
		System.out.println(conn);
	}
}
```
#### Driver方式二
- 对Driver方法一做了优化：
  - Driver方式一的new com.mysql.jdbc.Driver();的实现类是写死的,该方法仅仅是针对MySQL，可移植性较差
```java
public class ConnectionTest {
    public void testConnection2() {
		// 此处不同
        // 使用反射获取Driver的实现类对象
		Class clazz = Class.forName("com.mysql.cj.jdbc.Driver");
		Driver driver = (Driver) clazz.newInstance();
		
		String url = "jdbc:mysql://localhost:3306/test";
		Properties info = new Properties();
		info.setProperty("user", "root");
		info.setProperty("password", "root");
		Connection conn = driver.connect(url, info);
		System.out.println(conn);
	}
}
```
### 使用DriverManager类连接数据库
- 后续使用数据库连接池的<a href="#DataSource">DataSource</a>替代DriverManager，能提高数据库访问速度
#### DriverManager方式一
- 对Driver方式二做了优化：
	- 使用DriverManager类替换Driver
```java
public class ConnectionTest {
    public void testConnection3() {
        Class clazz = Class.forName("com.mysql.cj.jdbc.Driver");
        Driver driver = (Driver) clazz.newInstance();
        String url = "jdbc:mysql://localhost:3306/test";

        // 此处不同
        String user = "root";
        String password = "root";
        // 注册驱动
        DriverManager.registerDriver(driver);
        Connection conn = DriverManager.getConnection(url, user, password);
        System.out.println(conn);
    }
}
```
#### DriverManager方式二
- 对DriverManager方式一做了优化：
- 省略了注册驱动
```java
public class ConnectionTest {
    public void testConnection4() {
        // 此处不同
        Class.forName("com.mysql.cj.jdbc.Driver");
        // Driver.class源码Driver中有一个静态代码块(其中是注册的代码)，静态代码块随着类的加载而执行
        // 省略了注册驱动步骤
        
        String url = "jdbc:mysql://localhost:3306/test";
        String user = "root";
        String password = "root";
        Connection conn = DriverManager.getConnection(url, user, password);
        System.out.println(conn);
    }
}
```
#### DriverManager-finally
- finally:将四个基本信息写到[properties](http://localhost:8080/pages/1564cb/#properties) 配置文件中，从配置文件中读取，增强了代码健壮性。但是真实开发中，使用<a href="#数据库连接池">数据库连接池</a>完成连接操作
- 好处：
    1. 实现了数据和代码的分离(解耦)：若将项目从MySQL数据库改成Oracle数据库，则只需要修改properties文件即可
    2. 当部署项目打包时，若想修改配置信息，则直接修改properties文件，不需要修改类中的变量，防止类进行重新打包，节省了时间
::: tip
配置文件jdbc.properties：
1. 在src中新建file，配置文件习惯命名为jdbc.properties
2. driver类对象的名称没有固定写法 
3. 等号左右不要有空格，会造成歧义
- url:用于标识一个被注册的驱动程序，驱动程序管理器通过这个URL选择正确的驱动程序，从而建立到数据库的连接。
:::
```
user=root
password=root
url=jdbc:mysql://localhost:3306/test?
driverClass=com.mysql.cj.jdbc.Driver
```

```java
public class ConnectionTest {
   @Test
    public void testConnection5() throws IOException, ClassNotFoundException, SQLException {
        // 读取配置文件信息
        InputStream is = ConnectionTest.class.getClassLoader().getResourceAsStream("jdbc.properties");
        
        Properties pros = new Properties();
        pros.load(is);
        
        String user = pros.getProperty("user");
        String password = pros.getProperty("password");
        String url = pros.getProperty("url");
        String driverClass = pros.getProperty("driverClass");
        
        // 加载驱动
        Class.forName(driverClass);
        
        // 获取连接
        Connection conn = DriverManager.getConnection(url, user, password);
        System.out.println(conn);
    } 
}

```
### 资源的释放
- 释放ResultSet, PrepareStatement,Connection。
- 数据库连接（Connection）是非常稀有的资源，用完后必须马上释放，如果Connection不能及时正确的关闭将导致系统宕机。Connection的使用原则是**尽量晚创建，尽量早的释放。**
- 可以在finally中关闭，保证即使其他代码出现异常，资源也一定能被关闭。
### 数据库连接池(推荐使用)
<a name="数据库连接池"></a>

#### JDBC数据库连接池的必要性
- 传统的开发步骤：　
  - 在主程序（如servlet、beans）中建立数据库连接
  - 进行sql操作
  - 断开数据库连接
- 传统步骤存在的问题:
	1. 普通的JDBC数据库连接使用DriverManager来获取，每次向数据库建立连接的时候都要将Connection加载到内存中，再验证用户名和密码(得花费0.05s～1s的时间)。需要数据库连接的时候，就向数据库要求一个，执行完成后再断开连接。这样的方式将会消耗大量的资源和时间。**数据库的连接资源并没有得到很好的重复利用。**若同时有几百人甚至几千人在线，频繁的进行数据库连接操作将占用很多的系统资源，严重的甚至会造成服务器的崩溃。
	2. **对于每一次数据库连接，使用完后都得断开。**否则，如果程序出现异常而未能关闭，将会导致数据库系统中的内存泄漏，最终将导致重启数据库。（回忆：何为Java的内存泄漏？）
	3. **这种开发不能控制被创建的连接对象数**，系统资源会被毫无顾及的分配出去，如连接过多，也可能导致内存泄漏，服务器崩溃。 
#### 数据库连接池技术
- 技术逻辑：为数据库连接建立一个“缓冲池”。预先在缓冲池中放入一定数量的连接，当需要建立数据库连接时，只需从“缓冲池”中取出一个，使用完毕之后再放回去。
- 数据库连接池负责分配、管理和释放数据库连接，它**允许应用程序重复使用一个现有的数据库连接，而不是重新建立一个**。
- 数据库连接池在初始化时将创建一定数量的数据库连接放到连接池中，这些数据库连接的数量是由**最小数据库连接数来设定**的。无论这些数据库连接是否被使用，连接池都将一直保证至少拥有这么多的连接数量。连接池的**最大数据库连接数量**限定了这个连接池能占有的最大连接数，当应用程序向连接池请求的连接数超过最大连接数量时，这些请求将被加入到等待队列中。
#### 数据库连接池技术的优点
1. 资源重用
	- 由于数据库连接得以重用，避免了频繁创建，释放连接引起的大量性能开销。在减少系统消耗的基础上，另一方面也增加了系统运行环境的平稳性。
2. 更快的系统反应速度
   - 数据库连接池在初始化过程中，往往已经创建了若干数据库连接置于连接池中备用。此时连接的初始化工作均已完成。对于业务请求处理而言，直接利用现有可用连接，避免了数据库连接初始化和释放过程的时间开销，从而减少了系统的响应时间
3. 新的资源分配手段
   - 对于多应用共享同一数据库的系统而言，可在应用层通过数据库连接池的配置，实现某一应用最大可用数据库连接数的限制，避免某一应用独占所有的数据库资源
4. 统一的连接管理，避免数据库连接泄漏
	- 在较为完善的数据库连接池实现中，可根据预先的占用超时设定，强制回收被占用连接，从而避免了常规数据库连接操作中可能出现的资源泄露
#### 多种开源的数据库连接池
<a name="DataSource"></a> 

- JDBC 的数据库连接池使用 javax.sql.DataSource 来表示，DataSource 只是一个接口，该接口通常由服务器(Weblogic, WebSphere, Tomcat)提供实现，也有一些开源组织提供实现：
  - DBCP 是Apache提供的数据库连接池。tomcat 服务器自带dbcp数据库连接池。速度相对c3p0较快，但因自身存在BUG，Hibernate3已不再提供支持。
  - C3P0 是一个开源组织提供的一个数据库连接池，速度相对较慢，稳定性还可以。hibernate官方推荐使用
  - Proxool 是sourceforge下的一个开源项目数据库连接池，有监控连接池状态的功能，稳定性较c3p0差一点
  - BoneCP 是一个开源组织提供的数据库连接池，速度快
  - **Druid** 是阿里提供的数据库连接池，据说是集DBCP 、C3P0 、Proxool 优点于一身的数据库连接池，但是速度不确定是否有BoneCP快
- DataSource 通常被称为数据源，它包含连接池和连接池管理两个部分，习惯上也经常把DataSource 称为连接池
- **DataSource用来取代DriverManager来获取Connection，获取速度快，同时可以大幅度提高数据库访问速度。**
- 特别注意：
  - 数据源和数据库连接不同，数据源无需创建多个，它是产生数据库连接的工厂，因此**整个应用只需要一个数据源即可。**
  - 当数据库访问结束后，程序还是像以前一样关闭数据库连接：conn.close(); 但conn.close()并没有关闭数据库的物理连接，它仅仅把数据库连接**释放**，归还给了数据库连接池。
#### 德鲁伊连接池
- [properties](http://localhost:8080/pages/1564cb/#properties)
```java
// 将德鲁伊驱动放入lib-右键buildpath
// 在JDBCUtils中
private static DataSource source;
static {
	try {
		Properties pros = new Properties();
		InputStream is = ClassLoader.getSystemClassLoader().getSystemResourceAsStream("druid.properties");
		pros.load(is);
		source = DruidDataSourceFactory.createDataSource(pros);
	} catch (IOException e) {
		e.printStackTrace();
	}
}
public static Connection getConnection1() {
	Connection conn = source.getConnection();
	return conn;
}
```
```java
// src中新建文件druid.properties
url=jdbc:mysql:///test
username=root
password=root
driverClassName=com.mysql.cj.jdbc.Driver
```

## 实现CRUD操作
### 操作数据库的方式
  1. Statement：用于执行静态SQL语句并返回它所生成结果的对象。 (不推荐使用)
  2. **PrepatedStatement**：SQL语句被预编译并存储在此对象中，可以使用此对象多次高效地执行该语句。(**推荐使用**)
  3. CallableStatement：用于执行 SQL 存储过程
### PrepatedStatement
- 优点
	 1. 解决了Statement的拼串麻烦、SQL注入问题
	 2. 更高效地实现批量操作、方便插入BOLB字段
### JAVA和SQL对应数据类型转换表
| Java类型           | SQL类型                  |
| ------------------ | ------------------------ |
| boolean            | BIT                      |
| byte               | TINYINT                  |
| short              | SMALLINT                 |
| int                | INTEGER                  |
| long               | BIGINT                   |
| String             | CHAR,VARCHAR,LONGVARCHAR |
| byte   array       | BINARY  ,    VAR BINARY  |
| java.sql.Date      | DATE                     |
| java.sql.Time      | TIME                     |
| java.sql.Timestamp | TIMESTAMP                |
### 增删改(不需要返回值)
#### 向指定表中添加一条记录
- 向customer表中添加一条记录
```java
public class PreparedStatementUpdateTest {
	@Test
	public void testInsert() {
		// 获取连接
		Connection conn = null;
		PreparedStatement ps = null;
		try {
			// 读取配置文件信息
			InputStream is = ConnectionTest.class.getClassLoader().getResourceAsStream("jdbc.properties");
			
			Properties pros = new Properties();
			pros.load(is);
			
			String user = pros.getProperty("user");
			String password = pros.getProperty("password");
			String url = pros.getProperty("url");
			String driverClass = pros.getProperty("driverClass");
			
			// 加载驱动
			Class.forName(driverClass);
			
			conn = DriverManager.getConnection(url, user, password);
			System.out.println(conn);
			
			// 向表中添加数据
			// ?是占位符
			String sql = "insert into customers(name,email,birth)values(?,?,?)";
			// 预编译sql语句
			ps = conn.prepareStatement(sql);
			
			// 填充占位符
			// 注意：跟数据库交互时，索引都是从1开始
			ps.setString(1,"hyy");
			ps.setString(2,"123@qq.com");
			ps.setString(3,"99943");
			
			// 执行操作
			ps.execute();
		} catch (SQLException e) {
			e.printStackTrace();
		}finally {
			// 资源的关闭，需要关闭数据库连接、preparedStatement
			try {
				// 需要判断，当获取连接时，若报异常，则对象拿不到，然而finally会执行，避免调close，避免空指针问题
				if(ps != null) {
                    // 关闭preparedStatement
					ps.close();
				}
			} catch (SQLException e) {
				e.printStackTrace();
			}
			try {
				if(conn != null) {
                    // 关闭数据库连接
					conn.close();
				}
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		// 关闭之后，因为涉及到资源的关闭，不需要throws了，把方法throws删掉，把关闭之前的代码全选右键-surround with-try/catch block
		// 然后加finally，把关闭操作移入
		// 然后给ps和conn设置默认值null
		// 鼠标移入两个关闭操作分别进行try/catch
		// sqlyog的刷新表快捷键:alt f5
	}
}
```
#### 修改指定表的一条记录(使用util封装的方法)
- 修改customers表的一条记录(使用util封装的方法)
- 增删改的操作大致分为以下五步，其中只有sql语句不同，以及填充占位符操作不同，但是可控，所以再次封装
    1. 获取数据库连接
    2. 预编译sql语句，返回PreparedStatement实例
    3. 填充占位符
    4. 执行
    5. 资源的关闭
- 关闭资源时[重载](http://localhost:8081/pages/1564cb/#重载)了方法
```java
// src下新建包，新建JDBCUtils类
public class JDBCUtils {
	// 封装数据库连接操作
	public static Connection getConnection() throws Exception {
		// 读取配置文件信息
		// 封装时，最好不要出现其他的类,将ConnectionTest.class.getClassLoader()改为ClassLoader.getSystemClassLoader(),同样能获得系统类加载器
		InputStream is = ClassLoader.getSystemClassLoader().getResourceAsStream("jdbc.properties");
		
		Properties pros = new Properties();
		pros.load(is);
		
		String user = pros.getProperty("user");
		String password = pros.getProperty("password");
		String url = pros.getProperty("url");
		String driverClass = pros.getProperty("driverClass");
		
		// 加载驱动
		Class.forName(driverClass);
		
		// 获取连接
		Connection conn = DriverManager.getConnection(url, user, password);
		
		return conn;
	}
	// 封装数据库关闭连接和关闭PreparedStatement的操作
	// ps导入包时不要导入mysql的，导入通用的
	public static void  closeResource(Connection conn,PreparedStatement ps) {
		// 资源的关闭，关闭数据库连接，关闭preparedStatement
		try {
			if(ps != null) {
				ps.close();
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		try {
			if(conn != null) {
				conn.close();
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	// 此处是方法的重载
	public static void  closeResource(Connection conn,PreparedStatement ps,ResultSet rs) {
		try {
			if(ps != null) {
				ps.close();
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		try {
			if(conn != null) {
				conn.close();
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		try {
			if(rs != null) {
				rs.close();
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}
```
```java
public class PreparedStatementUpdateTest {
    @Test
	public void testUpdate(){
		Connection conn = null;
		PreparedStatement ps = null;
		try {
			conn = JDBCUtils.getConnection();
			String sql = "update customers set name = ? where id = ?";
			ps = conn.prepareStatement(sql);
			ps.setObject(1,"修改");
			ps.setObject(2,"1");
			ps.execute();
			// 可以删除其他的，只生成这一种异常，进行捕获
		} catch (Exception e) {
			e.printStackTrace();
		}finally {
			JDBCUtils.closeResource(conn, ps);
		}
	}
}	
```
#### 通用的增删改操作
- 通用的增删改操作
```java
public class PreparedStatementUpdateTest {
	// 将要变化的放到参数中
	// 不清楚占位符个数和类型，所以用可变类型参数
	public void addDelUpdate(String sql,Object ...args) {
		Connection conn = null;
		PreparedStatement ps = null;
		try {
			conn = JDBCUtils.getConnection();
			ps = conn.prepareStatement(sql);

			// 可变形参的个数应该与sql中的占位符个数相同
			for(int i = 0; i < args.length;i++) {
				// sql操作索引从1开始，所以是i+1，数组索引从0开始，所以是i
				ps.setObject(i + 1,args[i]);
			}
			ps.execute();
		} catch (Exception e) {
			e.printStackTrace();
		}
		JDBCUtils.closeResource(conn, ps);
	}

    // 测试封装好的增删改操作
	// 前提是要操作的表是要在配置文件jdbc.properties中数据库中的表
	@Test
	public void testAddDelUpdate() {
		String sql = "delete from customers where id = ? ";
		addDelUpdate(sql,18);
	}
}
```
#### 批量插入
- 批量插入
- 向goods表中插入20000条数据
##### 较慢的方法
```java
public class InsertTest {
	@Test
	public void testInsert() {
		Connection conn = null;
		PreparedStatement ps = null;
		try {
			long start = System.currentTimeMillis();
			
			conn = JDBCUtils.getConnection();
			String sql = "insert into goods(name)values(?)";
			ps = conn.prepareStatement(sql);
			for(int i = 1; i <= 20000; i++) {
				ps.setObject(1, "name_" + i);
				ps.execute();
			}
			
			long end = System.currentTimeMillis();
			
			// 58118
			System.out.println("花费的时间为:" + (end - start));
		} catch (Exception e) {
			e.printStackTrace();
		}finally {
			JDBCUtils.closeResource(conn, ps);
		}
	}
}
```
##### 较快的方法
 - 优化：减少跟磁盘的io:`addBatch()`、`executeBatch()`、`clearBatch()`
 - mysql服务器默认是关闭批处理的，需要配置一个参数，让mysql开启批处理的支持
 - ?rewriteBatchedStatements=true 写在jdbc.properties配置文件的url后面
 - 若mysql驱动版本是5.1.37之前的版本，则需要更换新驱动
```java
public class InsertTest {
	@Test
	// 测试之间先在mysql中清空之前的20000条数据:TRUNCATE TABLE goods;
	public void testInsert2() {
		Connection conn = null;
		PreparedStatement ps = null;
		try {
			long start = System.currentTimeMillis();
			
			conn = JDBCUtils.getConnection();
			String sql = "insert into goods(name)values(?)";
			ps = conn.prepareStatement(sql);
			for(int i = 1; i <= 20000; i++) {
				ps.setObject(1, "name_" + i);
				// 此处不同，填充占位符后，不要马上执行
				// 先攒sql
				ps.addBatch();
				// 适当更改此处也可以提高效率
				if(i % 500 == 0) {
					// 攒够500条记录后，执行一次
					ps.executeBatch();
					// 清空batch
					ps.clearBatch();
				}
				ps.execute();
			}
			
			long end = System.currentTimeMillis();
			
			System.out.println("花费的时间为:" + (end - start));
		} catch (Exception e) {
			e.printStackTrace();
		}finally {
			JDBCUtils.closeResource(conn, ps);
		}
	}
}
```
##### finally方法
- `setAutoCommit(false);`取消自动提交事务
- `commit();`手动提交<a href="#setAutoCommit">事务</a>

```java
public class InsertTest {
    @Test
	public void testInsert3() {
		Connection conn = null;
		PreparedStatement ps = null;
		try {
			long start = System.currentTimeMillis();
			
			conn = JDBCUtils.getConnection();
			
			// 此处不同，设置不允许自动提交数据
			conn.setAutoCommit(false);

			String sql = "insert into goods(name)values(?)";
			ps = conn.prepareStatement(sql);
			for(int i = 1; i <= 20000; i++) {
				ps.setObject(1, "name_" + i);
				ps.addBatch();
				if(i % 500 == 0) {
					ps.executeBatch();
					ps.clearBatch();
				}
				ps.execute();
			}
			
			// 此处不同，统一提交数据
			conn.commit();

			long end = System.currentTimeMillis();
			
			System.out.println("花费的时间为:" + (end - start));
		} catch (Exception e) {
			e.printStackTrace();
		}finally {
			JDBCUtils.closeResource(conn, ps);
		}
	}
}
```
#### 向指定数据表中插入Blob类型的字段
- 向数据表customers中插入Blob类型的字段
```java
public class BlobTest {
	@Test
	public void testInsert() throws Exception {
		Connection conn = JDBCUtils.getConnection();
		String sql = "insert into customers(name,email,birth,photo)values(?,?,?,?)";
		PreparedStatement ps = conn.prepareStatement(sql);
		ps.setObject(1, "hyy");
		ps.setObject(2, "135@qq.com");
		ps.setObject(3, "99943");
		
		// 此处和之前不同
		// 图片放在当前工程中，相对路径
		FileInputStream is = new FileInputStream(new File("baidu.jpeg"));
		ps.setBlob(4, is);
		
		ps.execute();
		
		JDBCUtils.closeResource(conn, ps);
	}	
}
```
### 查
- 与增删改不同，查询操作有返回值，在SQL软件中，返回的是一张表(结果集)，结果集在Java是对象
- 对查询操作封装为通用，目的是对不同的表进行通用查询
#### ResultSet和ResultSetMetaData
##### ResultSet
- 查询需要调用PreparedStatement的`executeQuery()`方法，查询结果是一个结果集(ResultSet) 对象
- ResultSet 对象以逻辑表格的形式封装了执行数据库操作的结果集，ResultSet 接口由数据库厂商提供实现
- ResultSet 返回的实际上就是一张数据表。有一个指针指向数据表的第一条记录的前面。
- ResultSet 对象维护了一个指向当前数据行的**游标**，初始的时候，游标在第一行之前，可以通过 ResultSet 对象的 next() 方法移动到下一行。
- 调用`next()`方法检测下一行是否有效。若有效，该方法返回 true，且指针下移。
- 当指针指向一行时, 可以通过调用 `getXxx(int index)` 或 `getXxx(int columnName)` 获取每一列的值。
  - 例如: getInt(1), getString("name")
  - **注意：Java与数据库交互涉及到的相关Java API中的索引都从1开始。**
##### ResultSetMetaData
- 可用于获取关于 ResultSet 对象中列的类型和属性信息的对象
- ResultSetMetaData meta = `rs.getMetaData();`
  - `getColumnName(int column)`获取指定列的名称
  - `getColumnLabel(int column)`获取指定列的别名
  - `getColumnCount()`返回当前 ResultSet 对象中的列数。 
  - `isNullable(int column)`指示指定列中的值是否可以为 null。 
#### 针对指定表的一般查询操作
```java
public class CustomerForQuery {
	@Test
	public void testQuery1() {
		Connection conn = null;
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
			conn = JDBCUtils.getConnection();
			String sql = "select id,name,email,birth from customers where id = ?";
			ps = conn.prepareStatement(sql);
			ps.setObject(1,1);
            // 此处不同，此时需要返回结果集，所以使用executeQuery方法
			rs = ps.executeQuery();

			// 判断结果集的下一条是否有数据
			if(rs.next()) {
				// 有数据，返回true，指针下移
				//获取当前这条数据的各个字段值
				int id = rs.getInt(1);
				String name = rs.getString(2);
				String email = rs.getString(3);
				String date = rs.getString(4);
				
				// 方式一：不建议，因为拼串麻烦
				// System.out.println("id = " + id + ",name = " + name + ",email = " + email + ",date = " + date + " ");
				
				// 方式二：将数据封装到数组中,不建议，因为数组中要求类型相同
				// Object[] data = new Object[] {id,name,email,date};
				
				// 方式三：将数据封装到类的对象中(通常取名为bean)，建议使用
				Customer customer = new Customer(id,name,email,date);
				System.out.println(customer);
			}
			// 没有数据，返回false，指针不下移
		} catch (Exception e) {
			e.printStackTrace();
		}finally {
			// 关闭资源，此时resultSet也需要关闭，所以修改JDBCUtils文件，新增关闭conn、ps、rs的重载方法
            // 重载的目的就是方便开发者选择合适的方法(方法名相同时，参数个数不同)
			JDBCUtils.closeResource(conn, ps, rs);
		}
	}
}
```java
// src下新建名为bean的包，新建Customer类(通常根据表名命名)
/*
 * 编程思想：
 * ORM(对象关系映射，object relational mapping)
 * 一个数据表对应一个java类，表中的一条记录对应java类的一个对象，表中的一个字段对应java类的一个属性
 * 对应关系详见JAVA和SQL对应数据类型转换表
 * */
public class Customer {
	private int id;
	private String name;
	private String email;
	private String date;
	// 生成构造器，shift alt s-field-deselect all-generate
	public Customer() {
		super();
	}
	// 生成构造器，shift alt s-field-generate
	public Customer(int id, String name, String email, String date) {
		super();
		this.id = id;
		this.name = name;
		this.email = email;
		this.date = date;
	}
	// 生成构造器，shift alt s-get set-select all-generate
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	// 生成构造器，shift alt s-toString-select all-generate
	@Override
	public String toString() {
		return "Customer [id=" + id + ", name=" + name + ", email=" + email + ", date=" + date + "]";
	}
}
```
#### 针对指定表的通用查询操作
```java
- 针对customers表的通用查询操作
- 因为sql语句中字段个数不同，则结果集处理的if中会随之不同，所以封装
```java
public class CustomerForQuery {
    public Customer queryForCustomers(String sql,Object ...args){
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            conn = JDBCUtils.getConnection();
            ps = conn.prepareStatement(sql);
            for(int i = 0; i < args.length; i++) {
                ps.setObject(i + 1, args[i]);
            }
            rs = ps.executeQuery();

            // 此处不同
            // 获取结果集的元数据，为了拿到结果集的列数
            ResultSetMetaData rsmd = rs.getMetaData();
            // 通过结果集的元数据获取结果集的列数
            int columnCount = rsmd.getColumnCount();
            // 因为查一条数据，所以可以用if，查多条要用while
            if(rs.next()) {
                // 针对Customer表，造一个Customer对象
                Customer cust = new Customer();
                // 处理结果集一行数据中的每一个列
                for(int i = 0 ;i < columnCount; i++) {
                    // 拿到一条记录的每个值
                    Object columnValue = rs.getObject(i + 1);
                    // 想要给cust对象指定的某个属性赋值为columnValue，必须要确定属性
                    // 该属性由结果集中的列名决定
                    
                    // 反射的应用：获取每个列的列名
                    String columnName = rsmd.getColumnName(i + 1);

                    // 通过反射，赋值
                    Field field = Customer.class.getDeclaredField(columnName);
                    // 该属性有可能是私有的，所以设置该属性能够被访问
                    field.setAccessible(true);
                    // 赋值
                    field.set(cust, columnValue);
                }
                return cust;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            JDBCUtils.closeResource(conn, ps, rs);
        }
        return null;
    }
    // 测试queryForCustomers
    @Test
    public void testQueryForCustomers() {
        String sql = "select id,name,email from customers where id = ?";
        Customer customer = queryForCustomers(sql,13);
        System.out.println(customer);
    }
}
```
#### 针对不同表的通用查询操作，返回一条记录
- 针对不同表的通用查询操作，返回表中的一条记录
```java
public class PreparedStatementQueryTest {
	// <T>，泛型参数，泛型方法
	public <T> T getInstance(Class<T> clazz,String sql,Object ...args) {
		Connection conn = null;
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
			conn = JDBCUtils.getConnection();
			ps = conn.prepareStatement(sql);
			for(int i = 0; i < args.length; i++) {
				ps.setObject(i + 1, args[i]);
			}
			rs = ps.executeQuery();
			ResultSetMetaData rsmd = rs.getMetaData();
			int columnCount = rsmd.getColumnCount();
			if(rs.next()) {

				// 这里与之前的针对指定表的查询操作不同，此时不清楚针对哪个表，而是通用
				// 要使用反射，还得添加形参clazz：需要造哪个类的对象
				// 要提供一个空参的、public权限的构造器
				// Java9之后的版本舍弃了clazz.newInstance()
                // T t = clazz.newInstance();
				T t = clazz.getDeclaredConstructor().newInstance(); 

				for(int i = 0 ;i < columnCount; i++) {
					Object columnValue = rs.getObject(i + 1);
					String columnName = rsmd.getColumnName(i + 1);
					Field field = Customer.class.getDeclaredField(columnName);
					field.setAccessible(true);
					field.set(t, columnValue);
				}
				return t;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}finally {
			JDBCUtils.closeResource(conn, ps, rs);
		}
		return null;
	}
	
	// 测试返回一条数据
	@Test
	public void testGetInstance() {
		String sql = "select id,name,email from customers where id = ?";
		// 此处便可以查询该数据库下的任意的表
		Customer customer = getInstance(Customer.class,sql,12);
		System.out.println(customer);
	}
}
```
#### 针对不同表的通用查询操作，返回多条记录
- 针对不同表的通用查询操作，返回表中的多条记录
```java
public class PreparedStatementQueryTest {
    // 
	public <T> List<T> getForList(Class<T> clazz,String sql,Object ...args) {
		Connection conn = null;
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
			conn = JDBCUtils.getConnection();
			ps = conn.prepareStatement(sql);
			for(int i = 0; i < args.length; i++) {
				ps.setObject(i + 1, args[i]);
			}
			rs = ps.executeQuery();
			ResultSetMetaData rsmd = rs.getMetaData();
			int columnCount = rsmd.getColumnCount();
            
			// 此处和之前返回一条数据不同，创建集合对象，用来return
			ArrayList<T> list = new ArrayList<T>();
			// 此处和之前返回一条数据不同，返回多条数据时使用while
			while(rs.next()) {
				T t = clazz.getDeclaredConstructor().newInstance(); 

				for(int i = 0 ;i < columnCount; i++) {
					Object columnValue = rs.getObject(i + 1);
					String columnName = rsmd.getColumnName(i + 1);
					Field field = Customer.class.getDeclaredField(columnName);
					field.setAccessible(true);
					field.set(t, columnValue);
				}

				// 此处和之前返回一条数据不同，返回多条数据时是返回一个集合，且在while循环结束之后return
				list.add(t);
			}
			return list;
		} catch (Exception e) {
			e.printStackTrace();
		}finally {
			JDBCUtils.closeResource(conn, ps, rs);
		}
		return null;
	}
	
	// 测试返回多条数据
	@Test
	public void testGetForList() {
		String sql = "select id,name,email from customers where id < ?";
		List<Customer> list = getForList(Customer.class,sql,12);
		// 因为没查birth，所以birth是null	
		list.forEach(System.out::println);
	}
}
```
## 数据库事务(Transaction,Tx)
<a name="setAutoCommit"></a>  

- 事务：一组逻辑操作单元(一个或多个DML操作),使数据从一种状态变换到另一种状态。
- 事务处理（事务操作）:保证所有事务都作为一个工作单元来执行(即一个事务中的多个DML操作要么都执行要么都不执行)，即使出现了故障，都不能改变这种执行方式。
- 当在一个事务中执行多个操作时：
    1. 要么所有的事务都**被提交(commit)**，那么这些修改就永久地保存下来
    2. 要么数据库管理系统将放弃所作的所有修改，整个事务**回滚(rollback)**到最初状态。
- 为确保数据库中数据的**一致性**，数据的操纵应当是离散的成组的逻辑单元：当它全部完成时，数据的一致性可以保持，而当这个单元中的一部分操作失败，整个事务应全部视为错误，所有从起始点以后的操作应全部回退到开始状态。 
### 引出事务
```java
public class TransactionTest {
	// 前文通用的增刪改操作
	public void addDelUpdate(String sql,Object ...args) {
		Connection conn = null;
		PreparedStatement ps = null;
		try {
			conn = JDBCUtils.getConnection();
			ps = conn.prepareStatement(sql);
			// 可变形参的个数应该与sql中的占位符个数相同
			for(int i = 0; i < args.length;i++) {
				// 注意，sql操作索引从1开始，所以是i+1，数组索引从0开始，所以是i
				ps.setObject(i + 1,args[i]);
			}
			ps.execute();
		} catch (Exception e) {
			e.printStackTrace();
		}
		JDBCUtils.closeResource(conn, ps);
	} 
	
	@Test 
	public void testAddUpdate() {
		// 一条记录值减少100，增加到另一条记录值上，值增加100。
		// 该过程涉及到两次修改操作，且要么都执行，要么都不执行。该过程涉及到事务，是两个DML操作，这两个DML操作构成了一个事务
		// update user_table set balance = balance - 100 where user = 'AA'
		// update user_table set balance = balance + 100 where user = 'BB'
		/*
		 * String sql1 = "update user_table set balance = balance - 100 where user = ?";
		 * addDelUpdate(sql1,"AA");
		 * 
		 * String sql2 = "update user_table set balance = balance + 100 where user = ?";
		 * addDelUpdate(sql2,"BB");
		 * 
		 * System.out.println("操作成功");
		 */
		
		String sql1 = "update user_table set balance = balance - 100 where user = ?";
		addDelUpdate(sql1,"AA");
		
		// 模拟网络异常，控制台会报错:by zero
		System.out.println(10 / 0);
		// 测试结果为AA减少了100，但是BB没有增加100，操作失败
		// 此时应该回滚
		// 想要回滚，必须要保证addDelUpdate(sql1,"AA");操作没有被提交(提交的情况分为三种，都要满足，都要不执行提交)
		
		// 现在是两个DML操作，根据编写的代码，会创建两个连接，第一个连接完成第一个DML操作后，连接关闭了，第二个也是如此。
		// 但是这样因为连接关闭了，所以第一个DML操作无法回滚了，任务失败。
		// 所以使用同一个连接，完成这两个DML操作，即执行第一个DML操作时，创建连接，完成DML1，继续完成DML2，再关闭，这样一来，即使因为DML1完成后，因为其他原因导致DML2无法完成而导致整个任务失败，最后也能通过回滚，重头再来
		
		String sql2 = "update user_table set balance = balance + 100 where user = ?";
		addDelUpdate(sql2,"BB");
		
		System.out.println("操作成功");
	}
	
	// 优化代码
	// 考虑数据库事务的情况下的通用的增删改操作
	// 不同的是要传入一个连接，而不需要在方法内部创建连接
	public void addDelUpdate(Connection conn,String sql,Object ...args) {
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement(sql);
			for(int i = 0; i < args.length;i++) {
				ps.setObject(i + 1,args[i]);
			}
			ps.execute();
		} catch (Exception e) {
			e.printStackTrace();
		}
		// 此处不同，关闭资源，不要关闭conn，只关闭ps
		JDBCUtils.closeResource(null, ps);
	} 
	
	@Test
	public void testAddUpdateWithTransaction() {
		// 此处不同
		// 获取连接
		Connection conn = null;
		try {
			conn = JDBCUtils.getConnection();
			
			String sql1 = "update user_table set balance = balance - 100 where user = ?";
			addDelUpdate(conn,sql1,"AA");
			
			String sql2 = "update user_table set balance = balance + 100 where user = ?";
			addDelUpdate(conn,sql2,"BB");
			 
			System.out.println("操作成功");
		} catch (Exception e) {
			e.printStackTrace();
		}finally {
			// 此处不同
			// 关闭资源，只关闭conn，ps已经关闭了
			JDBCUtils.closeResource(conn, null);
			// 但是此时只满足了一个条件，即将两个DML操作用同一个连接串起来
			// 而DML操作默认情况下，一旦执行，都会自动提交，所以继续优化
		}
	}
	
	@Test
	public void testAddUpdateWithTransactionFinally() {
		Connection conn = null;
		try {
			conn = JDBCUtils.getConnection();
			
			// 此处不同
			// 取消DML操作的自动提交
			conn.setAutoCommit(false);
			
			String sql1 = "update user_table set balance = balance - 100 where user = ?";
			addDelUpdate(conn,sql1,"AA");
			
			// 模拟网络异常
			System.out.println(10 / 0);
			
			String sql2 = "update user_table set balance = balance + 100 where user = ?";
			addDelUpdate(conn,sql2,"BB");
			
			// 此处不同
			// 提交数据
			conn.commit();
			System.out.println("操作成功");
		} catch (Exception e) {
			e.printStackTrace();
			
			// 此处不同
			// 若模拟网络异常，抛出异常了，则回滚
			// rollback()会有异常，不抛出，直接try-catch
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
		}finally {
			// 此处不同
			// 当使用数据库连接池技术时，从连接池中取出来的连接使用时，根据事务的约定，先取消其自动提交
			// 使用完该连接后，根据数据库连接池的约定，将该连接返回到连接池中，所以此处需要将该连接恢复到默认状态，即开启自动提交
			try {
				conn.setAutoCommit(true);
			} catch (SQLException e) {
				e.printStackTrace();
			}
			
			JDBCUtils.closeResource(conn, null);
		}
	}
	// 前文的:针对不同表的通用查询操作，返回表中的一条记录,并考虑事务后优化
	public <T> T getInstance(Connection conn,Class<T> clazz,String sql,Object ...args) {
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
			ps = conn.prepareStatement(sql);
			for(int i = 0; i < args.length; i++) {
				ps.setObject(i + 1, args[i]);
			}
			rs = ps.executeQuery();
			ResultSetMetaData rsmd = rs.getMetaData();
			int columnCount = rsmd.getColumnCount();
			if(rs.next()) {
				T t = clazz.getDeclaredConstructor().newInstance(); 
				for(int i = 0 ;i < columnCount; i++) {
					Object columnValue = rs.getObject(i + 1);
					String columnName = rsmd.getColumnName(i + 1);
					Field field = Customer.class.getDeclaredField(columnName);
					field.setAccessible(true);
					field.set(t, columnValue);
				}
				return t;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}finally {
			JDBCUtils.closeResource(null, ps, rs);
		}
		return null;
	}
	// 前文的：针对不同表的通用查询操作，返回表中的多条记录,并考虑事务后优化
	public <T> List<T> getForList(Connection conn,Class<T> clazz,String sql,Object ...args) {
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
			ps = conn.prepareStatement(sql);
			for(int i = 0; i < args.length; i++) {
				ps.setObject(i + 1, args[i]);
			}
			rs = ps.executeQuery();
			ResultSetMetaData rsmd = rs.getMetaData();
			int columnCount = rsmd.getColumnCount();
			ArrayList<T> list = new ArrayList<T>();
			while(rs.next()) {
				T t = clazz.getDeclaredConstructor().newInstance(); 
				for(int i = 0 ;i < columnCount; i++) {
					Object columnValue = rs.getObject(i + 1);
					String columnName = rsmd.getColumnName(i + 1);
					Field field = Customer.class.getDeclaredField(columnName);
					field.setAccessible(true);
					field.set(t, columnValue);
				}
				list.add(t);
			}
			return list;
		} catch (Exception e) {
			e.printStackTrace();
		}finally {
			JDBCUtils.closeResource(null, ps, rs);
		}
		return null;
	}
}
```
###  JDBC事务处理
- 数据一旦提交，就不可回滚
- 什么时候提交事务？
    1. **当一个连接对象被创建时，默认情况下是自动提交事务**：每次执行一个 SQL 语句时，如果执行成功，就会向数据库自动提交，而不能回滚。
    2. **关闭数据库连接，数据就会自动的提交。**如果多个操作，每个操作使用的是自己单独的连接，则无法保证事务。即同一个事务的多个操作必须在同一个连接下。
		- 当SQL软件被关闭时，数据库连接即关闭了
    3. DLL操作一旦执行，都会自动提交，且不可控制
    4. DML默认情况下，一旦执行，都会自动提交
		- 但是可以通过sql语句:`set autocommit = false`来取消DML操作的自动提交
- JDBC控制事务的API：
    1. 不允许自动提交事务: **`Connection.setAutoCommit(false);`**
    2. 在所有的SQL语句都成功执行后，提交事务:**`Connection.commit();`**
    3. 在出现异常时,回滚事务:**`rollback();`**
::: tips
若此时 Connection 没有被关闭，还可能被重复使用，则需要恢复其自动提交状态 setAutoCommit(true)。尤其是在使用数据库连接池技术时，执行close()方法前，建议恢复自动提交状态。
:::
### 事务的ACID属性
1. 原子性（Atomicity）
原子性是指事务是一个不可分割的工作单位，事务中的操作要么都发生，要么都不发生。 

2. 一致性（Consistency）
事务必须使数据库从一个一致性状态变换到另外一个一致性状态。

3. **隔离性（Isolation）**
- 事务的隔离性是指一个事务的执行不能被其他事务干扰，即一个事务内部的操作及使用的数据对并发的其他事务是隔离的，并发执行的各个事务之间不能互相干扰。
	- 当某个表同时被多个DML操作，当还没有处理完毕时，另外一个事务就开始处理了，此时便出现了高并发操作，不安全。但是将表锁住，则低并发，其他事务等待时间较长，也不好。所以出现了隔离级别
4. 持久性（Durability）
持久性是指一个事务一旦被提交，它对数据库中数据的改变就是永久性的，接下来的其他操作和数据库故障不应该对其有任何影响。
#### 数据库的并发问题
- 对于同时运行的多个事务, 当这些事务访问数据库中相同的数据时, 如果没有采取必要的隔离机制, 就会导致各种并发问题:
  - **脏读**: 对于两个事务 T1, T2, T1 读取了已经被 T2 更新但还**没有被提交**的字段。之后, 若 T2 回滚, T1读取的内容就是临时且无效的。
  - **不可重复读**: 对于两个事务T1, T2, T1 读取了一个字段, 然后 T2 **更新**了该字段。之后, T1再次读取同一个字段, 值就不同了。
	- 类似于库存数量，刷新后，库存变少了(后台更新了)
  - **幻读**: 对于两个事务T1, T2, T1 从一个表中读取了一个字段, 然后 T2 在该表中**插入**了一些新的行。之后, 如果 T1 再次读取同一个表, 就会多出几行。
	- 类似于商品是否上架，刷新后，有新商品了(后台插入了)
- **数据库事务的隔离性**: 数据库系统必须具有隔离并发运行各个事务的能力, 使它们不会相互影响, 避免各种并发问题。

- 一个事务与其他事务隔离的程度称为隔离级别。数据库规定了多种事务隔离级别, 不同隔离级别对应不同的干扰程度, **隔离级别越高, 数据一致性就越好, 但并发性越弱。**
- 回滚是回滚到最近一次DML操作的提交之后。数据一旦提交，就不可以回滚
#### 数据库的四种隔离级别
| 隔离级别 | 描述 | 存在的并发问题 | 使用情况 | 数据库支持情况 |
| :-----| :----: | :----: | :----: |
| READ UNCOMMITIED(读未提交数据) | 允许事务读取未被其他事务提交的变更 | 脏读、不可重复读、幻读 | 解决不了脏读，基本不使用 | MySQL支持 |
| READ COMMITTED(读已提交数据) | 只允许事务读取已经被其他事务提交的变更 | 不可重复读、幻读 | 可以接受，推荐使用 | Oracle支持(默认)、MySQL支持 |
| REPEATABLE READ | 确保事务可以多次从一个字段中读取相同的值，在这个事务持续期间，禁止其他事务对这个字段进行更新| 幻读 | 可以接受 | MySQL支持(默认) |
| SERIALIZABLE(串行化) | 确保事务可以从一个表中读取相同的行，在这个事务持续期间，禁止其他事务对这个字段执行插入、更新和删除操作| 不存在并发问题 |性能十分低下，且不适用于一些情况(库存在后台已经更新了，但是只能关闭浏览器(取消这个事务的持续)，再打开浏览器前端才会更新数量) | Oracle支持、MySQL支持 |
#### 在MySql中设置隔离级别
1. 命令行中设置
- cmd-mysql
- 查看当前的隔离级别:`SELECT @@tx_isolation;`
- 设置当前 mySQL 连接的隔离级别:`set  transaction isolation level read committed;`
- 设置数据库系统的全局的隔离级别:`set global transaction isolation level read committed;`
2. 代码中设置
```java
public class TransactionTest {
	public void setTransactionLevel() throws Exception {
		Connection conn = JDBCUtils.getConnection();

		// 获取事务的隔离级别
		System.out.println(conn.getTransactionIsolation());
		// Ctrl+Connnection可查看
		// TRANSACTION_NONE             = 0;
		// TRANSACTION_READ_UNCOMMITTED = 1;
		// TRANSACTION_READ_COMMITTED   = 2;
		// TRANSACTION_REPEATABLE_READ  = 4;

		// 设置事务的隔离级别
		conn.setTransactionIsolation(2);
		// 重启MySQL服务后，会恢复到默认的隔离级别4
	}
}

```
## DAO
- DAO：Data Access Object访问数据信息的类和接口，包括了对数据的CRUD（Create、Retrival、Update、Delete），而不包含任何业务相关的信息。有时也称作：**BaseDAO**
- 作用：为了实现功能的模块化，更有利于代码的维护和升级。
### BaseDAO，封装通用的方法
```java
// BaseDAO.java
// 封装了针对数据表的通用的增删改查
public abstract class BaseDAO {
	// 前文的：通用的增删改操作(考虑了事务)
	public void update(Connection conn,String sql,Object ...args) {
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement(sql);
			for(int i = 0; i < args.length;i++) {
				ps.setObject(i + 1,args[i]);
			}
			ps.execute();
		} catch (Exception e) {
			e.printStackTrace();
		}
		JDBCUtils.closeResource(null, ps);
	} 
	// 前文的：通用的查询操作，返回一条数据(考虑了事务)
	public <T> T getInstance(Connection conn,Class<T> clazz,String sql,Object ...args) {
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
			ps = conn.prepareStatement(sql);
			for(int i = 0; i < args.length; i++) {
				ps.setObject(i + 1, args[i]);
			}
			rs = ps.executeQuery();
			ResultSetMetaData rsmd = rs.getMetaData();
			int columnCount = rsmd.getColumnCount();
			if(rs.next()) {
				T t = clazz.getDeclaredConstructor().newInstance(); 
				for(int i = 0 ;i < columnCount; i++) {
					Object columnValue = rs.getObject(i + 1);
					String columnName = rsmd.getColumnName(i + 1);
					Field field = Customer.class.getDeclaredField(columnName);
					field.setAccessible(true);
					field.set(t, columnValue);
				}
				return t;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}finally {
			JDBCUtils.closeResource(null, ps, rs);
		}
		return null;
	}
	
	// 前文的：针对不同表的通用查询操作，返回表中的多条记录,并考虑事务后优化
	public <T> List<T> getForList(Connection conn,Class<T> clazz,String sql,Object ...args) {
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
			ps = conn.prepareStatement(sql);
			for(int i = 0; i < args.length; i++) {
				ps.setObject(i + 1, args[i]);
			}
			rs = ps.executeQuery();
			ResultSetMetaData rsmd = rs.getMetaData();
			int columnCount = rsmd.getColumnCount();
			ArrayList<T> list = new ArrayList<T>();
			while(rs.next()) {
				T t = clazz.getDeclaredConstructor().newInstance(); 
				for(int i = 0 ;i < columnCount; i++) {
					Object columnValue = rs.getObject(i + 1);
					String columnName = rsmd.getColumnName(i + 1);
					Field field = Customer.class.getDeclaredField(columnName);
					field.setAccessible(true); 
					field.set(t, columnValue);
				}
				list.add(t);
			}
			return list;
		} catch (Exception e) {
			e.printStackTrace();
		}finally {
			JDBCUtils.closeResource(null, ps, rs);
		}
		return null;
	}
	
	// 用于查询特殊值的通用方法
	// 实现select * from 表名
	// 流程：一般都是void，但是返回值的类型因为不同的表而不同，想到使用Object，然而Object还需要强制转换，所以使用泛型
	@SuppressWarnings("unchecked")
	public <E> E getValue(Connection conn,String sql,Object ...args) {
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
			ps = conn.prepareStatement(sql);
			for(int i = 0; i < args.length;i++) {
				ps.setObject(i + 1,args[i]);
			}
			rs = ps.executeQuery();
			if(rs.next()) {
				// select * from 表名只查到一列数据
				// 使用泛型后return，并强制转换为泛型
				return (E) rs.getObject(1);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}finally {
			JDBCUtils.closeResource(null, ps, rs); 
		}
		// try中有可能出现异常，所以return null
		return null;
		
	}
}
```
### 针对特定表的DAO接口
```java
/*
 * 此接口用于规范针对于特定的customers表的常用操作
 * 方法都是抽象方法
 * */
public interface CustomerDAO {
	// 将cust对象添加到数据库
	void insert(Connection conn,Customer cust);
	
	// 根据指定的id删除表中的一条记录
	void deleteById(Connection conn,int id);
	
	// 针对内存中的cust对象，修改数据表中指定的记录
	void update(Connection conn,Customer cust);
	
	// 根据指定的id查询得到对应的customer对象
	void getCustomerById(Connection conn,int id);
	
	// 查询表中所有记录构成的集合
	List<Customer> getAll(Connection conn);
	
	// 返回数据表中的数据条数
	Long getCount(Connection conn);
}
```
### 针对特定表的实现类
```java
/*
 * customer只是针对customer表的，若还有其他表的操作，要提供一组一组的...DAO和...DAOImpl
 * CustomerDAO中抽象功能的具体的实现类(Implement)
 * 该类继承BaseDAO，实现CustomerDAO
 * 鼠标移入CustomerDAOImpl，重写方法，这些方法是实现这些功能的具体代码，方法体中可以使用BaseDAO中封装的方法
 * */
public class CustomerDAOImpl extends BaseDAO implements CustomerDAO{

	@Override
	public void insert(Connection conn, Customer cust) {
		// 具体的实现方法名是BaseDAO中的方法，ctrl+1选择BaseDAO
		String sql = "insert into customers(name,email,birth)values(?,?,?)";
		update(conn, sql, cust.getName(),cust.getEmail(),cust.getDate());
	}

	@Override
	public void deleteById(Connection conn, int id) {
	}

	@Override
	public void update(Connection conn, Customer cust) {
	}

	@Override
	public void getCustomerById(Connection conn, int id) {
	}

	@Override
	public List<Customer> getAll(Connection conn) {
		return null;
	}

	@Override
	public Long getCount(Connection conn) {
		return null;
	}
}
```
### 实现类的单元测试
```java
/*
 * 创建一个com.test5.dao.junit包，用来测试dao
 * 创建一个Junit Test Case类-选择要测试的类-选择要测试的方法-finish则会批量产生单元测试*/
public class CustomerDAOImplTest {
	
	// 以下每个测试都要用到CustomerDAOImpl的对象
	CustomerDAOImpl dao = new CustomerDAOImpl();
	
	@Test
	public void testInsert() {
		Connection conn = null;
		try {
			conn = JDBCUtils.getConnection();
			Customer cust = new Customer(1,"hyy","135@qq.com");
			dao.insert(conn, cust);
			System.out.println("添加成功");
		} catch (Exception e) {
			e.printStackTrace();
		}finally {
			JDBCUtils.closeResource(conn, null);
		}
	}

	@Test
	public void testDeleteById() {
	}

	@Test
	public void testUpdateConnectionCustomer() {
	}

	@Test
	public void testGetCustomerById() {
	}

	@Test
	public void testGetAll() {
	}

	@Test
	public void testGetCount() {
	}
}

```

## Apache-DBUtils包实现CRUD操作
- commons-dbutils 是 Apache 组织提供的一个开源 JDBC工具类库，它是对JDBC的简单封装，学习成本极低，并且使用dbutils能极大简化jdbc编码的工作量，同时也不会影响程序的性能