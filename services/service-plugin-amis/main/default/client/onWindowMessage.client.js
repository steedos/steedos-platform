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
        // Dispatch a custom event that AMIS navigation components can listen to
        // This ensures menu items are highlighted correctly after navigation or page refresh
        const event = new CustomEvent('steedos:route-change', {
            detail: {
                path: data.path,
                search: data.search,
                hash: data.hash
            }
        });
        window.dispatchEvent(event);
        
        // Additionally, trigger a location change event that AMIS components may be listening to
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            window.dispatchEvent(new Event('popstate'));
        }, 50);
    }
})