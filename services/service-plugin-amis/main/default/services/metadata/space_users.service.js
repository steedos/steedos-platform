/*
 * @Description: 提供amis选人组件需要的数据接口
 */

const objectql = require("@steedos/objectql");
const _ = require("lodash");
const clone = require("clone");


module.exports = {
    name: "amis-metadata-space_users",
    mixins: [],
    /**
     * Settings
     */
    settings: {

    },

    /**
     * Dependencies
     */
    dependencies: [],

    /**
     * Actions
     */
    actions: {
        getSpaceUsersOptions: {
            rest: {
                method: "GET",
                path: "/space_users/options"
            },
            async handler(ctx) {
                const options = await this.getSpaceUsersOptions(ctx);
                return { status: 0, data: { options } }
            }
        }
    },

    /**
     * Events
     */
    events: {

    },

    /**
     * Methods
     */
    methods: {
        /**
            1.当没有传入参数，即第一次请求接口时返回如下格式的数据：
            [
                {
                    "leftOptions": [
                        {
                            "label": "总公司",
                            "value": 1,
                            "defer": true
                        }
                    ],
                    "children": [
                        {
                            "ref": 1,
                            "defer": true
                        },
                        {
                            "ref": 2,
                            "defer": true
                        },
                        {
                            "ref": 3,
                            "defer": true
                        },
                        {
                            "ref": 4,
                            "defer": true
                        },
                        {
                            "ref": 5,
                            "defer": true
                        },
                        {
                            "ref": 6,
                            "defer": true
                        }
                    ]
                }
            ]
            2.当传入def参数值时，表示展开左侧组织树某个组织，此时返回如下格式的数据：
            [
                {
                    "label": "部门 A",
                    "value": 2
                },
                {
                    "label": "部门 B",
                    "value": 3,
                    "defer": true
                },
                {
                    "label": "部门 C",
                    "value": 4
                }
            ]
            2.当传入ref参数值时，表示点击左侧某个组织，按此组织过滤右侧人员列表，此时返回如下格式的数据：
            [
                {
                    "label": "用户 1",
                    "value": "user1"
                },
                {
                    "label": "用户 2",
                    "value": "user2"
                }
            ]
         */
        getSpaceUsersOptions: {
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const spaceId = userSession.spaceId;
                // 有 dep 值则是懒加载部门树，有 ref 值则是懒加载人员，否则按第一次加载返回第一个 option作为select的基本配置
                // 需要懒加载的项通过返回相关项的 defer 为 true 来标记。左右两部分都支持懒加载。
                // 参考 https://aisuda.bce.baidu.com/amis/zh-CN/components/form/select#%E4%BA%BA%E5%91%98%E7%82%B9%E9%80%89
                const dep = ctx.params.dep;
                const ref = ctx.params.ref;
                if(dep){
                    // 有 dep 值则是懒加载部门树，返回展开后的部门列表
                    const fields = "_id,name,children".split(",");
                    const filters = [['space', '=', spaceId], ['parent', '=', dep]];
                    const orgs = await objectql.getObject('organizations').find({filters: filters, fields: fields});
                    const reOptions = _.map(orgs, (org)=>{
                        return {
                            value: org._id,
                            label: org.name,
                            defer: !!(org.children && org.children.length)
                        }
                    });
                    return reOptions;
                }
                else if(ref){
                    // 有 ref 值则是懒加载人员，返回按ref值过滤后的人员列表
                    const fields = "_id,name".split(",");
                    const filters = [['space', '=', spaceId], ['organizations_parents', '=', ref]];
                    const sus = await objectql.getObject('space_users').find({filters: filters, fields: fields});
                    const reOptions = _.map(sus, (su)=>{
                        return {
                            value: su._id,
                            label: su.name
                        }
                    });
                    return reOptions;
                }
                else{
                    // 接口返回的选项中，第一个 option 是以下这种格式时，
                    // 也会把 options[0].leftOptions 当成 leftOptions
                    // options[0].children 当 options。
                    // 同时 options[0].leftDefaultValue 可以用来配置左侧选项的默认值。
                    const reOptions = [{
                        children: [],
                        leftOptions: [],
                        leftDefaultValue: ''
                    }];
                    const fields = "_id,name,children".split(",");
                    const filters = [['space', '=', spaceId], ['parent', '=', null]];
                    const rootOrgs = await objectql.getObject('organizations').find({filters: filters, fields: fields});
                    reOptions[0].leftOptions = _.map(rootOrgs, (org)=>{
                        return {
                            value: org._id,
                            label: org.name,
                            defer: !!(org.children && org.children.length)
                        }
                    });
                    reOptions[0].children = _.map(rootOrgs, (org)=>{
                        return {
                            ref: org._id,
                            defer: !!(org.children && org.children.length)
                        }
                    });
                    return reOptions;
                }
            }
        }
    }
};
