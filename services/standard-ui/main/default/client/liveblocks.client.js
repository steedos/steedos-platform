// 创建一个 MutationObserver 实例
const observer = new MutationObserver((mutationsList) => {
    console.log('MutationObserver 运行中...');
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (node.matches('[data-radix-popper-content-wrapper]')) {
              if (node.getAttribute('role') !== 'dialog') {
                node.setAttribute('role', 'dialog');
              }
              
            } 
          }
        });
      }
    }
  });
  
  const config = { childList: true, subtree: false };
  
  observer.observe(document.body, config);