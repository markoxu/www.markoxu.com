# 2020阿里天池大赛 - 大规模硬盘故障预测

## 大赛概况

在大规模数据中心中，硬盘使用规模已经达到百万级别。盘类故障问题频发，会导致服务器甚至整个IT基础设施稳定性、可靠性的下降，最终对业务SLA带来负面影响。近十年,工业界和学术界开展了很多关于硬盘故障预测相关的工作，但对工业级大规模生产环境下的硬盘故障预测的研究却很少。大规模生产环境业务错综复杂、数据噪声大以及不确定因素多，因此，能否提前准确预测硬盘故障已经成为大规模数据中心和云计算时代工业界需要研究和解决的重要问题之一。本次竞赛聚焦解决大规模生产系统中的硬盘故障预测问题，需解决数据噪声、正负样本不均衡等技术问题，同时也要保障预测算法长期稳定有效。

## 问题描述

给定一段连续采集(天粒度)的硬盘状态监控数据（Self-Monitoring, Analysis, and Reporting Technology; often written as SMART)以及故障标签数据，参赛者需要自己提出方案，按天粒度判断每块硬盘是否会在未来30日内发生故障。例如，可以将预测故障问题转化为传统的二分类问题，通过分类模型来判断哪些硬盘会坏；或者可以转化为排序问题，通过Learning to rank的方式判断硬盘的损坏严重程度等。

初赛会提供训练数据集，供参赛选手训练模型并验证模型效果使用。同时，也将提供测试集，选手需要对测试集中的硬盘按天粒度进行预测，判断该硬盘是否会在未来30天内发生故障，并将模型判断出的结果上传至竞赛平台，平台会根据提交的预测结果，来评估模型预测的效果。

在复赛中，面对进一步的问题和任务，选手需要提交一个docker镜像，镜像中需要包含用来进行故障预测所需的所有内容，也即完整预测处理解决方案脚本。其中，镜像中的预测脚本需要能够根据输入的测试集文件（文件夹）位置，来对测试集中的硬盘故障预测，并把预测结果以指定的CSV文件格式输出到指定位置。

## 数据描述

训练集包含如下两张表信息, 具体信息如下：

1)表1: disk_sample_smart_log_*.csv为SMART LOG数据表，共514列。每列的含义如下：

|        列名        | 字段类型 |            描述             |
| :----------------: | :------: | :-------------------------: |
|   serial_number    |  string  |       硬盘序列号代号        |
|    manufacturer    |  string  |       硬盘的厂商代号        |
|       model        |  string  |        硬盘型号代号         |
| smart_n_normalized | integer  | SMART ID=n的归一化SMART数据 |
|     smart_nraw     | integer  |  SMART ID=n的SMART原始数据  |
|         dt         |  string  |          采集日期           |

注释：

disk_sample_smart_log_2017.zip, disk_sample_smart_log_2018_Q1.zip, 

disk_sample_smart_log_2018_Q2.zip, disk_sample_smart_log_test_a.csv.zip 中的表字段和 disk_sample_smart_log_*.csv 一致。

2)表2: disk_sample_fault_tag.csv为故障标签表，共5列。每列含义如下：

|     列名      | 字段类型 |        描述        |
| :-----------: | :------: | :----------------: |
| manufacturer  |  string  |   硬盘的厂商代号   |
|     model     |  string  |    硬盘型号代号    |
| serial_number |  string  |   硬盘序列号代号   |
|  fault_time   |  string  |   硬盘的故障时间   |
|      tag      | integer  | 硬盘的故障类型代号 |

初赛训练集数据范围20170731 至 20180731。初赛A榜的测试集为disk_sample_smart_log_test_a.csv，数据范围为20180801～20180831整月的SMARTLOG数据，选手根据测试集数据按时间维度，每天预测硬盘是否会在未来30天内发生故障，例如: 8月1号的预测结果可以根据8月1号当天数据及历史数据来判断未来30天内哪些硬盘会出现故障，8月N号的预测结果可以根据8月N号当天数据及历史数据来判断未来30天内哪些硬盘会出现故障，以此类推。初赛测试集不提供故障label。

复赛阶段，测试集的数据格式和初赛阶段相同，但是测试集数据不会提供给参赛选手。选手需要在docker代码中从指定的数据集目录中读取测试集内容，进行特征工程和模型预测，最后输出的格式和初赛一致，输出每天预测未来30天会坏的硬盘的集合(docker代码中需包含本地训练好的模型)。复赛的测试集数据范围为20180901～20180930, 选手需要同时针对model=1, model=2两个型号进行预测, 建议将model 1、2的数据融合在一起用一个模型进行预测。
注：代码必须包含仿线上真实故障预测逻辑，即从9月1日开始按照时间顺序每天根据历史数据(含当天)构造特征，并将疑似坏盘的预测结果输出到规定文件当中，不允许出现’取30天预测结果中概率值最大的预测日作为输出’的情况；

## 提交格式

初赛阶段，将模型在测试集上的预测文件保存为csv格式，并打包成zip压缩文件进行提交。形式如下：

```
A,1,disk_1,2018-08-15
A,1,disk_123,2018-08-16
A,1,disk_1,2018-08-17
A,2,disk_456,2018-08-14
```

注：

1）预测为正常盘的结果无需写到上传文件中。单块盘可能存在多个预测结果，但在评估过程中只考虑每块盘的最早一次预测为故障的日期。例如, 硬盘disk_1分别在2018-08-15和2018-08-19两次被预测出未来30天内可能会发生故障，但在模型评估时只会选用2018-08-15那天的预测结果。

2）在复赛中，参赛选手需要提交docker镜像，具体的提交方式及规范请参见镜像提交说明。

3） 预测结果保存为csv文件格式，保存的csv文件无header，无index; 第一列为manufacturer，只能含有‘A’，第二列为model标签，初赛A榜阶段暂时只能全部选取model=1的部份。

## 评价指标

本次竞赛采用F1-Score作为评价指标, 根据具体场景化的预测内容，定义相关术语和详细指标如下：

- Precision

$n_{pp}$: 评估窗口内被预测出未来30天会坏的盘数

$n_{tpp}$: 评估窗口内第一次预测故障的日期后30天内确实发生故障的盘数

$$Precision=\frac{n_{tpp}}{n_{pp}}$$

- Recall

$n_{pr}$: 评估窗口内所有的盘故障数

$n_{tpr}$: 评估窗口内故障盘被提前30天发现的数量

$$Recall=\frac{n_{tpr}}{n_{pr}}$$

- F1-Score

$$F_{score}=2\times\frac{Precision\times Recall}{Precision+Recall}$$

注：初赛评估窗口范围为20180801-20180831，复赛评估窗口范围为20180901-20180930。

*Last updated* *on* **2020-12-05** *by* **MarkoXu**