/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2025-02-07 14:36:24
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-15 19:35:22
 * @Description: 
 */
// GlobalLinkInterceptor.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GlobalLinkInterceptor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (event: any) => {
      const target = event.target.closest('a');
      if (target) {
        const href = target.getAttribute('href');
        const targetAttr = target.getAttribute('target');

        // 判断是否是内部链接
        const isInternal = href && href.startsWith('/');

        if (isInternal && targetAttr !== '_blank') {
          event.preventDefault();
          navigate(href);
        }
      }
    };
    console.log(`init...GlobalLinkInterceptor..`)
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [navigate]);

  return null;
};

export default GlobalLinkInterceptor;