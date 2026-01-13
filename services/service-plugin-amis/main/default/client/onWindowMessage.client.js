/*
 * @Author: steedos
 * @Date: 2022-03-24 14:39:44
 * @Description: 基于steedos builder 实现 Amis组件的动态注册
 */

// Delay before triggering popstate event to ensure AMIS components are ready
const MENU_UPDATE_DELAY = 100;

window.addEventListener('message', function (event) {
    const { data } = event;
    
    // Validate event origin for security - only process messages from same origin
    if (event.origin !== window.location.origin) {
        return;
    }
    
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
            // Use fallback for older browsers that don't support PopStateEvent constructor
            let popStateEvent;
            try {
                popStateEvent = new PopStateEvent('popstate', {
                    state: window.history.state
                });
            } catch (e) {
                // Fallback for older browsers
                popStateEvent = new Event('popstate');
            }
            window.dispatchEvent(popStateEvent);
        }, MENU_UPDATE_DELAY);
    }
})