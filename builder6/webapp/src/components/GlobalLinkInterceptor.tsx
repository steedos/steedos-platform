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

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [navigate]);

  return null;
};

export default GlobalLinkInterceptor;