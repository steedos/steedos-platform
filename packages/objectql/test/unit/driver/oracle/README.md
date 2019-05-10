# node连接oracle数据库准备条件

### 不同环境安装说明
- 不同操作系统平台安装情况不一样，如Windows,Linux,MacOs等
- 连接不同的Oracle数据库需要的安装情况不一样
- 数据库服务器在本地及在远程安装情况不一样

### 官网参考
- [安装Node-oracledb环境](https://oracle.github.io/node-oracledb/INSTALL.html)
- [使用Instant Client ZIP文件在Windows上安装Node-oracledb](https://oracle.github.io/node-oracledb/INSTALL.html#-36-node-oracledb-installation-on-windows-with-instant-client-zip-files)
- [Windows下ODPI-C安装Oracle客户端](https://oracle.github.io/odpi/doc/installation.html#windows)

### 案列说明

1. 在window10上连接远程服务器上10.2版本的Oracle相关安装说明

1.1 大致步骤
- 下载安装Visual Studio 2010完整开发工具（在64位机上下载32位的工具经测试是没问题的）
- 下载Visual Studio 2010 Service Pack 1（安装程序）
- 下载Microsoft Visual C ++ 2010 Service Pack 1可再发行组件包MFC安全更新。
- 适用于Microsoft Windows（x64）64位的即时客户端（使用版本12.1.0.2.0 ）下载
  - instantclient-basic-windows.x64-12.1.0.2.0.zip （72,416,242字节）
  - instantclient-sdk-windows.x64-12.1.0.2.0.zip （2,748,874字节）
- 将上一步骤下载的包解压缩到应用程序可访问的目录中并添加环境变量（参考：https://oracle.github.io/odpi/doc/installation.html#id1）

1.2 下载相关
-[visual studio 2010](https://my.visualstudio.com/Downloads?q=visual%20studio%202010&wt.mc_id=o~msft~vscom~older-downloads)
-[最新支持的Visual C ++下载](https://support.microsoft.com/en-us/help/2977003/the-latest-supported-visual-c-downloads#bookmark-vs2010)
-[适用于Microsoft Windows（x64）64位的即时客户端下载](https://www.oracle.com/technetwork/topics/winx64soft-089540.html)


1.3 参考博客
- [NodeJs连接Oracle数据库](http://www.cnblogs.com/stone_w/p/4794747.html)
- [nodejs 使用官方oracledb库连接数据库 教程](https://www.cnblogs.com/rysinal/p/7779055.html)



