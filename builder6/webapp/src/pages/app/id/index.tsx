import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';

export const AppView = () => {
  const { appId } = useParams();
  const navigate = useNavigate();

  const resolvePathTemplate = (path?: string, data?: Record<string, any>) => {
    if (!path || path.indexOf('${') < 0) {
      return path || '';
    }
    try {
      const currentAmis = (window as any).amisRequire?.('amis');
      const createObject = (window as any).BuilderAmisObject?.AmisLib?.createObject;
      if (currentAmis && createObject) {
        const settings = (window as any).Builder?.settings || {};
        const scope = {
          context: settings.context,
          global: {
            userId: settings.context?.userId,
            spaceId: settings.context?.tenantId,
            user: settings.context?.user,
          },
        };
        const resolved = currentAmis.evaluate(path, createObject(scope, data || {}));
        if (typeof resolved === 'string' && resolved) {
          return resolved;
        }
      }
    } catch (error) {
      console.warn('resolvePathTemplate failed:', error);
    }
    return path;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Using axios to make the request
        const response = await axios.get(
          `${import.meta.env.VITE_B6_ROOT_URL}/service/api/apps/${appId}/menus`,
          { withCredentials: true } // Include credentials if needed
        );
        
        const data = response.data; // Axios stores response data in .data property
        
        // Check if default_tab exists and navigate to it
        if (data?.default_tab) {
          // If default_tab is an object with a path, use it
          if (typeof data.default_tab === 'object' && data.default_tab !== null && data.default_tab.path) {
            navigate(resolvePathTemplate(data.default_tab.path, data.default_tab), { replace: true });
            return;
          }
          // If default_tab is a string, construct the path
          if (typeof data.default_tab === 'string') {
            navigate(`/app/${appId}/${data.default_tab}`, { replace: true });
            return;
          }
        }
        
        // Fallback: Check if data exists and has at least one item with a path
        if (data?.children.length > 0 && data.children[0].path) {
          const children = _.sortBy(data.children, ['index']);
          navigate(resolvePathTemplate(children[0].path, children[0]), { replace: true });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error (maybe show an error message or stay on current page)
        if (axios.isAxiosError(error)) {
          console.error('Axios error details:', {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            data: error.response?.data
          });
        }
      }
    };

    if (appId) {  // Only fetch if appId exists
      fetchData();
    }
  }, [appId, navigate]);

  return (
    <div>
      {/* Optional: Add loading state */}
    </div>
  );
}
