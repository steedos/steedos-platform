import { Service, Context, ServiceBroker } from 'moleculer';
import { Injectable } from '@nestjs/common';
import { InjectBroker } from '@builder6/moleculer';

const project = require('../package.json');
const serviceName = project.name;

@Injectable()
export class AppMoleculer extends Service {
  constructor(
    @InjectBroker() broker: ServiceBroker,
  ) {
    super(broker);

    this.parseServiceSchema({
      namespace: "steedos",
      name: '@steedos/server',
      settings: {},
      actions: {
      },
      created: this.serviceCreated,
      started: this.serviceStarted,
      stopped: this.serviceStopped,
    });
  }

  serviceCreated() {
    console.log(`serviceCreated`, serviceName)

  }

  async serviceStarted() {

    console.log(`started 1`, serviceName)
    require('@steedos/objectql').getSteedosSchema(this.broker);
    console.log(`started 2`, serviceName)
    // 创建一个空的~packages-standard-objects 服务
    this.broker.createService({
        name: '~packages-standard-objects',
        mixins: [],
        settings: { packageInfo: {
                    path: './',
                }, },
        started: function() {
        },
        created: function(){
        }
    });
    console.log(`started 3`, serviceName)
    // 国际化
    this.broker.createService(require("@steedos/service-i18n"));
    console.log(`started 4`, serviceName)
    // 启动 元数据服务
    this.broker.createService(require("@steedos/service-metadata-server"));
    console.log(`started 5`, serviceName)

    this.broker.createService(require("@steedos/service-cachers-manager"));
    console.log(`started 6`, serviceName)

    this.broker.createService(require("@steedos/data-import"));
    console.log(`started 7`, serviceName)
    this.broker.createService(require("@steedos/service-core-objects"));
    console.log(`started 8`, serviceName)
    this.broker.createService(require("@steedos/service-objectql"));
    console.log(`started 9`, serviceName)
    // rest api
    this.broker.createService(require("@steedos/service-rest"));
    console.log(`started 10`, serviceName)
    //ApiGateway
    this.broker.createService(require('@steedos/service-api'));
    console.log(`started 11`, serviceName)
    
    this.broker.createService(require("@steedos/accounts/package.service"));

    this.broker.createService(require("@steedos/service-accounts"));
    console.log(`started 13`, serviceName)
    this.broker.createService(require("@steedos/service-pages"));
    console.log(`started 14`, serviceName)
    // this.broker.createService(require("@steedos/service-workflow"));

    this.broker.createService(require("@steedos/service-plugin-amis"));
    console.log(`started 15`, serviceName)
    // this.broker.createService(require("@steedos/service-files"));

    // this.broker.createService(require("@steedos/service-ancillary"));

    // 故障报告服务
    // this.broker.createService(require("@steedos/service-sentry"));

    

    // 启动 加载软件包服务
    this.broker.createService(require("@steedos/service-package-registry"));
    console.log(`started 16`, serviceName)
    // 启动 软件包安装、卸载、重载等操作
    this.broker.createService(require("@steedos/service-package-tool"));
    console.log(`started 17`, serviceName)

    this.broker.createService(require("@steedos/standard-permission"));
    this.broker.createService(require("@steedos/standard-ui"));

    console.log(`started 18`, serviceName)

    // if(this.settings.jwt.enable){
    // 	this.broker.createService(require("@steedos/service-identity-jwt"));
    // }

    // 启动 OIDC SSO 服务
    // if (this.settings.oidc.enable) {
    //     this.broker.createService(require("@steedos/ee_sso-oidc"));
    // }

    

    // 启动 steedos-server 服务
    // this.broker.createService(require("@steedos/service-steedos-server"));
    
    // 启动 本地 CDN
    // this.broker.createService(require("@steedos/unpkg"));

    // this.broker.createService(require("@steedos-builder/amis-editor"));

    // if (this.settings.saas.enable) {
    // 	this.broker.createService(require('@steedos/service-saas'));
    // }

    // 启动时间触发器服务
    // this.broker.createService(require("@steedos/workflow_time_trigger"));


    // await this.broker.waitForServices(["@steedos/service-project"]);
    
    // console.log(require('chalk').blue('pm-'.repeat(10)));
    // await this.broker.call('@steedos/service-project.addPackages', {
    // 	packages: [
    // 		{
    // 			name: '@steedos/service-charts',
    // 			enable: true
    // 		},
    // 		{
    // 			name: '@steedos/steedos-plugin-schema-bui lder',
    // 			enable: false
    // 		},
    // 	]
    // });
 }

  async serviceStopped() {}

}
