// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SocketCommands = {
  subscribe: "subscribe",
  unsubscribe:"unsubscribe"
}

const SocketEvents = {
  metadataChange: 's:metadata:change',
  notificationChange: 's:notification-change'
}

const SocketRoomParts = {
  space: 'space',
  me: 'me',
  notificationChange: 'notification-change'
}

// 连接到服务器
const socket = window.io("/", {
  path: "/socket.io"
});

// 监听连接事件
socket.on("connect", () => {});

socket.on("connection-init", ()=>{
  console.log('emit', SocketCommands.subscribe, SocketRoomParts.space);
  socket.emit(SocketCommands.subscribe, {
    roomParts: SocketRoomParts.space
  });
  console.log('emit', SocketCommands.subscribe, SocketRoomParts.me);
  socket.emit(SocketCommands.subscribe, {
    roomParts: SocketRoomParts.me,
    individual: true
  });

  console.log('emit', SocketCommands.subscribe, SocketRoomParts.notificationChange);
  socket.emit(SocketCommands.subscribe, {
    roomParts: SocketRoomParts.notificationChange,
    individual: true
  });
})

// 监听自定义事件（根据服务器提供的接口）
socket.on(SocketEvents.metadataChange, (data) => {
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

socket.on(SocketEvents.notificationChange, (data)=>{
  if(data.message){
    window.SteedosUI.notification.open({
      message: data.message.name,
      description: data.message.body
    })
  }
  window.$('.btn-reload-global-header-notifications').trigger('click');
})

socket.on("connect_error", (err) => {
  console.log("连接错误:", err);
});

// 断开连接时
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

window.socket = socket;