try {
  // 加载 tailwind
  if(typeof BigInt === 'undefined') {
      let tailwindStyle = document.createElement("link");
      tailwindStyle.setAttribute("rel", "stylesheet");
      tailwindStyle.setAttribute("type", "text/css");
      tailwindStyle.setAttribute("href", Steedos.absoluteUrl("/tailwind/tailwind.css"));
      document.getElementsByTagName("head")[0].appendChild(tailwindStyle);
  }else{
    let tailwindScript = document.createElement("script");
    tailwindScript.setAttribute("src", Steedos.absoluteUrl('/tailwind/tailwind.js'));
    document.getElementsByTagName("head")[0].appendChild(tailwindScript);
  }
} catch (error) {
  console.error(error)
};