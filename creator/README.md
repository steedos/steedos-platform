# 华炎Creator快速开发平台

Creator是华炎公司整合近20年的业务系统开发经验，推出的一套快速开发平台。IT人员的核心任务不再是编码，而是转变为和业务人员沟通业务需求，并转化为业务模型。只需要业务模型确定了，Creator即可自动生成手机、平板、电脑三合一的业务系统，包含完整的数据浏览、管理、统计分析功能。

![界面效果图](https://www.steedos.com/cn/help/creator/images/mac_ipad_iphone_home.png)

最重要的是，当业务人员提出需求变更时，也只需简单的调整业务模型即可完成，不再需要繁重的编码、调试、测试、发布等一整套复杂的流程。

我们的数据统计显示，Creator可以节约软件开发成本80%，周期更可以缩短到1周以内。

  - 列表: 快速浏览、查询业务数据
  - 查看: 查看业务数据的详细信息，以及相关的子表数据
  - 编辑: 编辑业务数据，管理员可设定用户可修改的字段
  - 搜索: 可执行多关键词组合检索，可一次性在所有业务对象中搜索数据
  - 统计: 用户可创建列表、分组报表、二维表进行统计分析，并可自动生成图形化报表
  - 附件: 可以管理具体的业务对象的附件，附件支持版本控制
  - 讨论，可以针对具体的业务数据进行讨论和回复
  - 任务: 可以针对具体的业务数据创建待办任务
  - 数据导入: 如果您的Excel表格中已经有初始业务数据，可以快速导入系统中
  - 修改历史: 自动记录用户对业务数据的修改历史
  - 回收站: 系统内置回收站功能，对于误删除的记录可以一键恢复

[了解更多](https://www.steedos.com/cn/help/creator/)

## 本地运行Creator服务

### 准备工作：Meteor的安装

Meteor 支持Windows 7/Windows Server 2008 R2 以上系统。Windows具体安装如下：

- 首先，确保你已经“以管理员身份运行终端命令行工具”；
- 然后，在终端命令行输入以下命令后，直接回车；

    ```
    @powershell -NoProfile -ExecutionPolicy unrestricted -Command “iex ((new-object net.webclient).DownloadString(‘https://chocolatey.org/install.ps1‘))” && SET PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin
    ```

- 最后，使用管理员终端命令行命令行运行此命令，完成Meteor的安装。
    ```
    choco install meteor
    ```

注：OSX / LINUX系统安装参照 https://www.meteor.com/install 来安装。

### Github代码仓库下载Creator相关代码

- 浏览器访问  https://github.com/steedos/creator ；
- 点击“Clone or download”将代码下载到本地（可提前下载Github客户端）；
- 下载完成后可在指定下载文件夹位置看到Creator相应代码。

### 运行本地Creator代码

- 打开终端命令行工具，在代码存储文件夹下，执行start.bat文件；
- start.bat文件执行成功后，浏览器跳转 http://127.0.0.1:5000 ，访问本地运行的Creator服务；
- 点击“企业注册”，注册系统账号，使用Creator相关功能。
