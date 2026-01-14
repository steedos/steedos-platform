import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';

export const AppView = () => {
  const { appId } = useParams();
  const navigate = useNavigate();

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
          if (typeof data.default_tab === 'object' && data.default_tab.path) {
            navigate(data.default_tab.path);
            return;
          }
          // If default_tab is a string, construct the path
          if (typeof data.default_tab === 'string') {
            navigate(`/app/${appId}/${data.default_tab}`);
            return;
          }
        }
        
        // Fallback: Check if data exists and has at least one item with a path
        if (data?.children.length > 0 && data.children[0].path) {
          const children = _.sortBy(data.children, ['index']);
          navigate(children[0].path);
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