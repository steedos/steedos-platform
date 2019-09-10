import { expect } from 'chai';
import { SteedosSchema, SteedosDatabaseDriverType } from '../../src';

describe('Test Object.enable_xxx', () => {
    it('Object.enable_audit cannot be true', async () => {
        let hasError = false
        try {
            new SteedosSchema({
                datasources: {
                    default: {
                        driver: SteedosDatabaseDriverType.Mongo, 
                        url: 'mongodb://127.0.0.1/steedos',
                        objects: {
                            enable_audit: {
                                name: 'SQ1',
                                enable_audit: true,
                                fields: {
                                    name: {
                                        type: 'text',
                                        label: '名称'
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } catch (error) {
            if(error.message.startsWith('not support, please set enable_audit')){
                hasError = true
            }
        }

        expect(hasError).to.equal(false)
    });
    it('Object.enable_instances cannot be true', async () => {
        let hasError = false
        try {
            new SteedosSchema({
                datasources: {
                    default: {
                        driver: SteedosDatabaseDriverType.Mongo, 
                        url: 'mongodb://127.0.0.1/steedos',
                        objects: {
                            enable_instances: {
                                name: 'SQ1',
                                enable_instances: true,
                                fields: {
                                    name: {
                                        type: 'text',
                                        label: '名称'
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } catch (error) {
            if(error.message.startsWith('not support, please set enable_instances')){
                hasError = true
            }
        }

        expect(hasError).to.equal(false)
    });
    it('Object.enable_trash cannot be true', async () => {
        let hasError = false
        try {
            new SteedosSchema({
                datasources: {
                    default: {
                        driver: SteedosDatabaseDriverType.Mongo, 
                        url: 'mongodb://127.0.0.1/steedos',
                        objects: {
                            enable_trash: {
                                name: 'SQ1',
                                enable_trash: true,
                                fields: {
                                    name: {
                                        type: 'text',
                                        label: '名称'
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } catch (error) {
            if(error.message.startsWith('not support, please set enable_trash')){
                hasError = true
            }
        }

        expect(hasError).to.equal(false)
    });
    it('Object.enable_share cannot be true', async () => {
        let hasError = false
        try {
            new SteedosSchema({
                datasources: {
                    default: {
                        driver: SteedosDatabaseDriverType.Mongo, 
                        url: 'mongodb://127.0.0.1/steedos',
                        objects: {
                            enable_share: {
                                name: 'SQ1',
                                enable_share: true,
                                fields: {
                                    name: {
                                        type: 'text',
                                        label: '名称'
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } catch (error) {
            if(error.message.startsWith('not support, please set enable_share')){
                hasError = true
            }
        }

        expect(hasError).to.equal(false)
    });

    it('Object.enable_share default is false', async () => {
        
        let schema = new SteedosSchema({
            datasources: {
                default: {
                    driver: SteedosDatabaseDriverType.Mongo, 
                    url: 'mongodb://127.0.0.1/steedos',
                    objects: {
                        enable_share_test: {
                            name: 'SQ1',
                            fields: {
                                name: {
                                    type: 'text',
                                    label: '名称'
                                }
                            }
                        }
                    }
                }
            }
        })
        await schema.getDataSource().init();
        let enable_share_test = schema.getObject('enable_share_test')
        let enable_share_test_config = enable_share_test.toConfig()
        expect(enable_share_test.enable_share).to.equal(false) && expect(enable_share_test_config.enable_share).to.equal(false)
    });
  });