import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

export const AppView = () => {
  const { appId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Using axios to make the request
        const response = await axios.get(
          `/service/api/apps/${appId}/menus`
        );
        
        const data = response.data; // Axios stores response data in .data property
        
        // Check if data exists and has at least one item with a path
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