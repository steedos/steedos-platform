/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-06 11:54:55
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-07-26 14:04:56
 * @Description: 
 */
const normalizeLink = (to, location = window.location) => {
  to = to || "";

  if (to && to[0] === "#") {
    to = location.pathname + location.search + to;
  } else if (to && to[0] === "?") {
    to = location.pathname + to;
  }

  const idx = to.indexOf("?");
  const idx2 = to.indexOf("#");
  let pathname = ~idx
    ? to.substring(0, idx)
    : ~idx2
    ? to.substring(0, idx2)
    : to;
  let search = ~idx ? to.substring(idx, ~idx2 ? idx2 : undefined) : "";
  let hash = ~idx2 ? to.substring(idx2) : location.hash;

  if (!pathname) {
    pathname = location.pathname;
  } else if (pathname[0] != "/" && !/^https?\:\/\//.test(pathname)) {
    let relativeBase = location.pathname;
    const paths = relativeBase.split("/");
    paths.pop();
    let m;
    while ((m = /^\.\.?\//.exec(pathname))) {
      if (m[0] === "../") {
        paths.pop();
      }
      pathname = pathname.substring(m[0].length);
    }
    pathname = paths.concat(pathname).join("/");
  }

  return pathname + search + hash;
};

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
        action.blank === false ? FlowRouter.go(to) : window.open(to);
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
        FlowRouter.go(to);
      }
    }
  }
}

Template.amis_action.helpers({
  objectName: ()=>{
    var tplData = Template.instance().data;
    return tplData.button.object || tplData.button.object_name
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
  var rootName = ".steedos-button-"+ (button.object  || tplData.button.object_name)+"-"+button.name;
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
    const rootUrl = __meteor_runtime_config__.ROOT_URL;
    const defData = lodash.defaultsDeep({}, {data: data} , {
        data: {
            context: {
                rootUrl: Meteor.isCordova ? (rootUrl.endsWith("/") ? rootUrl.substr(0, rootUrl.length-1) : rootUrl) : '',
                tenantId: Creator.USER_CONTEXT.spaceId,
                userId: Creator.USER_CONTEXT.userId,
                authToken: Creator.USER_CONTEXT.user.authToken
            }
        }
      });
    schema = lodash.defaultsDeep(defData , schema);
    // console.log(`amisAction`, schema)
    return amis.embed(rootName, schema, {}, Object.assign(getEvn(), env));
  })
})
