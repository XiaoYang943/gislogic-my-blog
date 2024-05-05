---
title: 消息队列-Kafka-原理
article: false
category:
  - 中间件
  - Kafka
---
## Kafka原理

###  leader和follower

* Kafka中的leader和follower是相对分区有意义，不是相对broker
* Kafka在创建topic的时候，会尽量分配分区的leader在不同的broker中，其实就是负载均衡
* leader职责：读写数据
* follower职责：同步数据、参与选举（leader crash之后，会选举一个follower重新成为分区的leader
* 注意和ZooKeeper区分
	* ZK的leader负责读、写，follower可以读取
	* Kafka的leader负责读写、follower不能读写数据（确保每个消费者消费的数据是一致的），Kafka一个topic有多个分区leader，一样可以实现数据操作的负载均衡

### AR\ISR\OSR

* AR表示一个topic下的所有副本
* ISR：In Sync Replicas，正在同步的副本（可以理解为当前有几个follower是存活的）
* OSR：Out of Sync Replicas，不再同步的副本
* AR = ISR + OSR

### leader选举

* Controller：controller是kafka集群的老大，是针对Broker的一个角色
	* Controller是高可用的，是用过ZK来进行选举
* Leader：是针对partition的一个角色
	* Leader是通过ISR来进行快速选举
* 如果Kafka是基于ZK来进行选举，ZK的压力可能会比较大。例如：某个节点崩溃，这个节点上不仅仅只有一个leader，是有不少的leader需要选举。通过ISR快速进行选举。

* leader的负载均衡

	* 如果某个broker crash之后，就可能会导致partition的leader分布不均匀，就是一个broker上存在一个topic下不同partition的leader
	* 通过以下指令，可以将leader分配到优先的leader对应的broker，确保leader是均匀分配的

	```shell
	bin/kafka-leader-election.sh --bootstrap-server node1.itcast.cn:9092 --topic test --partition=2 --election-type preferred
	```

	

### Kafka读写流程

* 写流程
	* 通过ZooKeeper找partition对应的leader，leader是负责写的
	* producer开始写入数据
	* ISR里面的follower开始同步数据，并返回给leader ACK
	* 返回给producer ACK
* 读流程
	* 通过ZooKeeper找partition对应的leader，leader是负责读的
	* 通过ZooKeeper找到消费者对应的offset
	* 然后开始从offset往后顺序拉取数据
	* 提交offset（自动提交——每隔多少秒提交一次offset、手动提交——放入到事务中提交）

### Kafka的物理存储

* Kafka的数据组织结构
	* topic
	* partition
	* segment
		* .log数据文件
		* .index（稀疏索引）
		* .timeindex（根据时间做的索引）
* 深入了解读数据的流程
	* 消费者的offset是一个针对partition全局offset
	* 可以根据这个offset找到segment段
	* 接着需要将全局的offset转换成segment的局部offset
	* 根据局部的offset，就可以从（.index稀疏索引）找到对应的数据位置
	* 开始顺序读取

### 消息传递的语义性

Flink里面有对应的每种不同机制的保证，提供Exactly-Once保障（二阶段事务提交方式）

* At-most once：最多一次（只管把数据消费到，不管有没有成功，可能会有数据丢失）
* At-least once：最少一次（有可能会出现重复消费）
* Exactly-Once：仅有一次（事务性性的保障，保证消息有且仅被处理一次）

### Kafka的消息不丢失

* broker消息不丢失：因为有副本relicas的存在，会不断地从leader中同步副本，所以，一个broker crash，不会导致数据丢失，除非是只有一个副本。
* 生产者消息不丢失：ACK机制（配置成ALL/-1）、配置0或者1有可能会存在丢失
* 消费者消费不丢失：重点控制offset
	* At-least once：一种数据可能会重复消费
	* Exactly-Once：仅被一次消费

### 数据积压

* 数据积压指的是消费者因为有一些外部的IO、一些比较耗时的操作（Full GC——Stop the world），就会造成消息在partition中一直存在得不到消费，就会产生数据积压
* 在企业中，我们要有监控系统，如果出现这种情况，需要尽快处理。虽然后续的Spark Streaming/Flink可以实现背压机制，但是数据累积太多一定对实时系统它的实时性是有说影响的

### 数据清理&配额限速

* 数据清理
	* Log Deletion（日志删除）：如果消息达到一定的条件（时间、日志大小、offset大小），Kafka就会自动将日志设置为待删除（segment端的后缀名会以 .delete结尾），日志管理程序会定期清理这些日志
		* 默认是7天过期
	* Log Compaction（日志合并）
		* 如果在一些key-value数据中，一个key可以对应多个不同版本的value
		* 经过日志合并，就会只保留最新的一个版本
* 配额限速
	* 可以限制Producer、Consumer的速率
	* 防止Kafka的速度过快，占用整个服务器（broker）的所有IO资源