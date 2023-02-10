try {
  // 加载 tailwind
  // if(typeof BigInt === 'undefined') {
  //     let tailwindStyle = document.createElement("link");
  //     tailwindStyle.setAttribute("rel", "stylesheet");
  //     tailwindStyle.setAttribute("type", "text/css");
  //     tailwindStyle.setAttribute("href", Steedos.absoluteUrl("/tailwind/tailwind.css"));
  //     document.getElementsByTagName("head")[0].appendChild(tailwindStyle);
  // }else{
  //   let tailwindScript = document.createElement("script");
  //   tailwindScript.setAttribute("src", Steedos.absoluteUrl('/tailwind/tailwind.js'));
  //   document.getElementsByTagName("head")[0].appendChild(tailwindScript);
  // }

  const head = document.head || document.getElementsByTagName('head')[0]

  let tailwindBase = document.createElement("link");
  tailwindBase.setAttribute("rel", "stylesheet");
  tailwindBase.setAttribute("type", "text/css");
  tailwindBase.setAttribute("href", Steedos.absoluteUrl("/tailwind/tailwind-base.css"));

  if (head.firstChild) {
    head.insertBefore(tailwindBase, head.firstChild)
  } else {
    head.appendChild(tailwindBase)
  }

  let tailwindStyle = document.createElement("link");
  tailwindStyle.setAttribute("rel", "stylesheet");
  tailwindStyle.setAttribute("type", "text/css");
  tailwindStyle.setAttribute("href", Steedos.absoluteUrl("/tailwind/tailwind-steedos.css"));
  head.appendChild(tailwindStyle)
} catch (error) {
  console.error(error)
};