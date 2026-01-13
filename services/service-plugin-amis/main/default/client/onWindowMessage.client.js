/*
 * @Author: steedos
 * @Date: 2022-03-24 14:39:44
 * @Description: 基于steedos builder 实现 Amis组件的动态注册
 */


window.addEventListener('message', function (event) {
    const { data } = event;
    if (data.type === 'builder.assetsLoaded') {
        window.assetsLoaded = true;
    }
    // Handle route changes to update active menu items
    if (data.type === 'ROUTE_CHANGE') {
        // AMIS navigation components use isCurrentUrl to determine active state
        // They check this when the location changes, so we trigger a popstate event
        // to force them to re-evaluate the active state based on current pathname
        setTimeout(() => {
            // Trigger popstate event which AMIS nav components listen to
            const popStateEvent = new PopStateEvent('popstate', {
                state: window.history.state
            });
            window.dispatchEvent(popStateEvent);
        }, 50);
    }
})