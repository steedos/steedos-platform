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
const debounceTimers = new Map();

socket.on(SocketEvents.metadataChange, (data) => {
  // 生成唯一 key 的逻辑
  const getKey = () => {
    if (data.type === 'object_fields' || data.type === 'object_listviews') {
      return `objects-${data.objectName}`;
    }
    return `${data.type}-${data.name}`;
  };

  // 处理函数
  const handleRequest = () => {
    if (data.type === 'apps') {
      window.$(`.btn-reload-global-header-${data.name}`).trigger('click');
      window.$(`.btn-reload-app-menu-${data.name}`).trigger('click');
      setTimeout(() => {
        window.$(".btn-reload-app-dashboard").trigger('click');
      }, 1000);
      return;
    }

    let objectName = '';
    if(data.type === 'objects'){
      objectName = data.name;
    }else if(data.type === 'object_actions'){
      objectName = data.objectName;
    }else if(data.type === 'object_fields'){
      objectName = data.objectName;
    }else if(data.type === 'object_listviews'){
      objectName = data.objectName;
    } 
    const shouldReloadView = () => {
      return window.location.pathname.endsWith(`/${objectName}`) || window.location.pathname.includes(`/${objectName}/view`);
    };
    window.getUISchema(objectName, true).then(() => {
      if (shouldReloadView()) {
        window.navigate(window.location.pathname, { 
          state: { reloadKey: Date.now() } 
        });
      }
    });
  };

  if (data.type === 'apps') {
    // apps 类型不防抖，直接执行
    handleRequest();
  } else {
    const key = getKey();
    clearTimeout(debounceTimers.get(key)); // 清除之前的定时器
    debounceTimers.set(key, setTimeout(handleRequest, 200)); // 设置新的定时器
  }
});

socket.on(SocketEvents.notificationChange, (data)=>{
  if(data.message){
    window.SteedosUI.notification.info({
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