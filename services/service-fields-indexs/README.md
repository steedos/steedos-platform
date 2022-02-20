## 功能说明
- 用于字段创建索引


steedos-config.yml 中配置 cron.build_index 以启用维护字段索引服务。值为Cron-style Scheduling
cron:
  build_index: "45 * * * * *"