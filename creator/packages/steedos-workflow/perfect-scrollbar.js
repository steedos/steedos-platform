/**
 * keepnox:perfect-scrollbar 是根据window.onwheel 是否等于 undefined 来决定用wheel事件还是mousewheel。
 * 在 IE 浏览器中，只能通过 addEventListener() 方法支持 wheel 事件 (IE9及以上)。 在 DOM 对象中没有 onwheel 属性。
 * creator项目中的workflow模块中IE 11 浏览器不能正常触发mousewheel事件，此处手动将window.onwheel值设置为null，使其在IE中也通过wheel事件来处理滚动条。
 */
window.onwheel = null;