/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-06 11:54:55
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-10-13 17:17:19
 * @Description: 
 */

const getEvn = ()=>{
  return {
    theme: "antd",
    getModalContainer: (props)=>{
      let div = document.querySelector("#amisModalContainer");
      if(!div){
          div = document.createElement('div');
          div.className="amis-scope";
          div.style.height='0px';
          div.id="amisModalContainer";
          document.body.appendChild(div)
      }
      return div;
    },
    notify: (type, msg)=>{
      if(msg.props?.schema.tpl){
        SteedosUI.message[type](msg.props?.schema.tpl)
      }else if(typeof msg == 'string'){
        SteedosUI.message[type](msg)
      }else{
        console.warn('notify', type, msg)
      }
    },
    confirm: (msg)=>{
      return new Promise((resolve, reject)=>{
        return SteedosUI.Modal.confirm({
          title: msg,
          onOk: ()=>{
            resolve(true);
          },
          okText: "确认",
          cancelText: "取消"
        })
      })
    },
    jumpTo: (to, action) => {
      if (to === "goBack") {
        return window.history.back();
      }

      to = normalizeLink(to);

      if (action && action.actionType === "url") {
        action.blank === false ? router.push(to) : window.open(to);
        return;
      }

      // 主要是支持 nav 中的跳转
      if (action && to && action.target) {
        window.open(to, action.target);
        return;
      }
      if (/^https?:\/\//.test(to)) {
        window.location.replace(to);
      } else {
        router.push(to);
      }
    }
  }
}

Template.amis_action.helpers({
  objectName: ()=>{
    var tplData = Template.instance().data;
    return tplData.button.object
  },
  name: ()=>{
    var tplData = Template.instance().data;
    return tplData.button.name
  },
  buttonClassName: ()=>{
    var tplData = Template.instance().data;
    return tplData.buttonClassName
  }
})

Template.amis_action.onRendered(()=>{
  var tplData = Template.instance().data;
  var button = tplData.button
  var className = tplData.buttonClassName
  var inMore = tplData.inMore
  var data = tplData.data
  var env = tplData.env
  var rootName = ".steedos-button-"+button.object+"-"+button.name;
  Promise.all([
    waitForThing(window, 'amis'),
  ]).then(()=>{
    var amis = amisRequire("amis/embed");
    var schema = button.amis_schema ? (_.isString(button.amis_schema) ?  JSON.parse(button.amis_schema) : button.amis_schema) : {
          type: "service",
          bodyClassName: 'p-0',
          body: [
              {
                  type: "button",
                  label: button.label
              }
          ],
          regions: [
            "body"
          ]
        };
    const defData = lodash.defaultsDeep({}, {data: data} , {
        data: {
            context: {
                rootUrl: __meteor_runtime_config__.ROOT_URL,
                tenantId: Creator.USER_CONTEXT.spaceId,
                userId: Creator.USER_CONTEXT.userId,
                authToken: Creator.USER_CONTEXT.user.authToken
            }
        }
      });
    schema = lodash.defaultsDeep(defData , schema);
    return amis.embed(rootName, schema, {}, Object.assign(getEvn(), env));
  })
})
