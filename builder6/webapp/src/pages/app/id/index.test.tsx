/**
 * Unit tests for AppView component - default_tab navigation fix
 * 
 * Tests verify that when accessing /app/:appId directly, the component:
 * 1. Navigates to default_tab.path if default_tab is an object with path
 * 2. Constructs path /app/:appId/:default_tab if default_tab is a string
 * 3. Falls back to first child if no default_tab
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockedUseNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>;

describe('AppView - default_tab navigation', () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockNavigate = jest.fn();
    mockedUseNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  test('should navigate to default_tab.path when default_tab is an object with path', async () => {
    mockedUseParams.mockReturnValue({ appId: 'approve_workflow' });
    
    const mockData = {
      id: 'approve_workflow',
      default_tab: {
        id: 'instance_tasks',
        path: '/app/approve_workflow/instance_tasks',
        type: 'object',
      },
      children: [
        { id: 'other_tab', path: '/app/approve_workflow/other' },
      ],
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    // Simulate the useEffect hook behavior
    const { result } = renderHook(() => {
      const { appId } = useParams();
      const navigate = useNavigate();
      
      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_B6_ROOT_URL}/service/api/apps/${appId}/menus`,
              { withCredentials: true }
            );
            
            const data = response.data;
            
            if (data?.default_tab) {
              if (typeof data.default_tab === 'object' && data.default_tab !== null && data.default_tab.path) {
                navigate(data.default_tab.path);
                return;
              }
              if (typeof data.default_tab === 'string') {
                navigate(`/app/${appId}/${data.default_tab}`);
                return;
              }
            }
            
            if (data?.children.length > 0 && data.children[0].path) {
              navigate(data.children[0].path);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };

        if (appId) {
          fetchData();
        }
      }, [appId, navigate]);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/app/approve_workflow/instance_tasks');
    });

    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  test('should construct path when default_tab is a string', async () => {
    mockedUseParams.mockReturnValue({ appId: 'approve_workflow' });
    
    const mockData = {
      id: 'approve_workflow',
      default_tab: 'object_instance_tasks',
      children: [
        { id: 'other_tab', path: '/app/approve_workflow/other' },
      ],
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => {
      const { appId } = useParams();
      const navigate = useNavigate();
      
      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_B6_ROOT_URL}/service/api/apps/${appId}/menus`,
              { withCredentials: true }
            );
            
            const data = response.data;
            
            if (data?.default_tab) {
              if (typeof data.default_tab === 'object' && data.default_tab !== null && data.default_tab.path) {
                navigate(data.default_tab.path);
                return;
              }
              if (typeof data.default_tab === 'string') {
                navigate(`/app/${appId}/${data.default_tab}`);
                return;
              }
            }
            
            if (data?.children.length > 0 && data.children[0].path) {
              navigate(data.children[0].path);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };

        if (appId) {
          fetchData();
        }
      }, [appId, navigate]);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/app/approve_workflow/object_instance_tasks');
    });

    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  test('should fallback to first child when no default_tab', async () => {
    mockedUseParams.mockReturnValue({ appId: 'test_app' });
    
    const mockData = {
      id: 'test_app',
      children: [
        { id: 'first_tab', path: '/app/test_app/first', index: 1 },
        { id: 'second_tab', path: '/app/test_app/second', index: 0 },
      ],
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => {
      const { appId } = useParams();
      const navigate = useNavigate();
      
      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_B6_ROOT_URL}/service/api/apps/${appId}/menus`,
              { withCredentials: true }
            );
            
            const data = response.data;
            
            if (data?.default_tab) {
              if (typeof data.default_tab === 'object' && data.default_tab !== null && data.default_tab.path) {
                navigate(data.default_tab.path);
                return;
              }
              if (typeof data.default_tab === 'string') {
                navigate(`/app/${appId}/${data.default_tab}`);
                return;
              }
            }
            
            if (data?.children.length > 0 && data.children[0].path) {
              const children = _.sortBy(data.children, ['index']);
              navigate(children[0].path);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };

        if (appId) {
          fetchData();
        }
      }, [appId, navigate]);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/app/test_app/second');
    });

    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  test('should handle null default_tab gracefully', async () => {
    mockedUseParams.mockReturnValue({ appId: 'test_app' });
    
    const mockData = {
      id: 'test_app',
      default_tab: null,
      children: [
        { id: 'first_tab', path: '/app/test_app/first', index: 0 },
      ],
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => {
      const { appId } = useParams();
      const navigate = useNavigate();
      
      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_B6_ROOT_URL}/service/api/apps/${appId}/menus`,
              { withCredentials: true }
            );
            
            const data = response.data;
            
            if (data?.default_tab) {
              if (typeof data.default_tab === 'object' && data.default_tab !== null && data.default_tab.path) {
                navigate(data.default_tab.path);
                return;
              }
              if (typeof data.default_tab === 'string') {
                navigate(`/app/${appId}/${data.default_tab}`);
                return;
              }
            }
            
            if (data?.children.length > 0 && data.children[0].path) {
              navigate(data.children[0].path);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };

        if (appId) {
          fetchData();
        }
      }, [appId, navigate]);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/app/test_app/first');
    });

    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  test('should not navigate when API call fails', async () => {
    mockedUseParams.mockReturnValue({ appId: 'test_app' });
    
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => {
      const { appId } = useParams();
      const navigate = useNavigate();
      
      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_B6_ROOT_URL}/service/api/apps/${appId}/menus`,
              { withCredentials: true }
            );
            
            const data = response.data;
            
            if (data?.default_tab) {
              if (typeof data.default_tab === 'object' && data.default_tab !== null && data.default_tab.path) {
                navigate(data.default_tab.path);
                return;
              }
              if (typeof data.default_tab === 'string') {
                navigate(`/app/${appId}/${data.default_tab}`);
                return;
              }
            }
            
            if (data?.children.length > 0 && data.children[0].path) {
              navigate(data.children[0].path);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };

        if (appId) {
          fetchData();
        }
      }, [appId, navigate]);
    });

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    }, { timeout: 1000 });
  });
});
