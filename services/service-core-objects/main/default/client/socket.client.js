// 连接到服务器
const socket = window.io("http://192.168.3.59:6900", {
  path: "/socket.io"
});

// 监听连接事件
socket.on("connect", () => {
  console.log("Connected to server!");
});

// 监听自定义事件（根据服务器提供的接口）
socket.on("metadata:change", (data) => {
  console.log("Received:", data);
  if(data.type === 'apps'){
    window.$(`.btn-reload-global-header-${data.name}`).trigger('click');
    window.$(`.btn-reload-app-menu-${data.name}`).trigger('click');
    setTimeout(function(){
      window.$(".btn-reload-app-dashboard").trigger('click');
    }, 1000 * 1)
  }else if(data.type === 'objects'){
    window.getUISchema(data.name, true).then(()=>{
      if(window.location.pathname.includes(`/${data.name}/view`)){
        window.navigate(window.location.pathname, {state: {reloadKey: new Date().getTime()}})
      }
    })
  }else if(data.type === 'object_listviews'){
    window.getUISchema(data.objectName, true).then(()=>{
      if(window.location.pathname.endsWith(`/${data.objectName}`)){
        window.navigate(window.location.pathname, {state: {reloadKey: new Date().getTime()}})
      }
    })
  }
});

// 发送消息
socket.emit("event", { key: "value" });

// 断开连接时
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

window.socket = socket;