<!--
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-08 09:38:56
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-06-21 10:07:45
 * @Description: 
-->

# 附件上传、下载服务

## 下载说明

添加环境变量process.env.STEEDOS_CFS_DOWNLOAD_PUBLIC，用于记录不需要认证的collectionName；
如：STEEDOS_CFS_DOWNLOAD_PUBLIC=avatars,images,files
默认值为avatars