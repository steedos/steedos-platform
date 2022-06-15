<!--
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-13 20:19:50
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-06-14 11:26:57
 * @Description: 
-->

# virus-scan

扫描上传文件，判断是否有安全隐患

## 如何使用

1、`.evn.local` 配置环境变量 `VIRUS_SCAN_HOST` 和 `VIRUS_SCAN_PORT`(可选，默认3310)

2、系统启用此软件包

环境变量配置扫描病毒的命令，如未配置`VIRUS_SCAN_HOST`则认为无需扫描