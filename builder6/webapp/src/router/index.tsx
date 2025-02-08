
import { useEffect, useMemo } from 'react';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
  createMemoryRouter,
  useLocation,
} from 'react-router-dom';

import LoggedIn from '../components/LoggedIn';
import Signup from '../pages/Signup';
import Login from '../pages/Login';
import Logout from '../pages/Logout';
import Home from '../pages/Home';
import UpdatePassword from '../pages/updatePassword';
import CreateTenant from '../pages/CreateTenant';
import SelectSpace from '../pages/SelectSpace';
import Preference from '../pages/Preference';
import Loading from '../components/Loading';
import VerifyEmail from '../pages/VerifyEmail';
import VerifyMobile from '../pages/VerifyMobile';
import {AppHome} from '../pages/app';

import { AppLayout } from '../components/AppLayout';

import { ObjectListView } from '../pages/object/listview';
import { ObjectDetail } from '../pages/object/detail';

const routes = [
  {
    path: '/logout',
    element: <Logout />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <LoggedIn>
        <Home />
      </LoggedIn>
    ),
  },
  {
    path: '/create-space',
    element: (
      <LoggedIn>
        <CreateTenant />
      </LoggedIn>
    ),
  },
  {
    path: '/select-space',
    element: (
      <LoggedIn>
        <SelectSpace />
      </LoggedIn>
    ),
  },
  {
    path: '/update-password',
    element: (
      <LoggedIn>
        <UpdatePassword />
      </LoggedIn>
    ),
  },
  {
    path: '/verify/email',
    element: (
      <LoggedIn>
        <VerifyEmail />
      </LoggedIn>
    ),
  },
  {
    path: '/verify/mobile',
    element: (
      <LoggedIn>
        <VerifyMobile />
      </LoggedIn>
    ),
  },
  {
    path: '/preference',
    element: (
      <LoggedIn>
        <Preference />
      </LoggedIn>
    ),
  },
  {
    path: '/home',
    element: (
      <LoggedIn>
        <Home />
      </LoggedIn>
    ),
  },
  {
    path: '/home/:spaceId',
    element: (
      <LoggedIn>
        <Home />
      </LoggedIn>
    ),
  },
  {
    path: '/app/:appId',
    element: (
      <LoggedIn>
        <AppLayout>
          <AppHome />
        </AppLayout>
      </LoggedIn>
    ),
  },
  {
    path: '/app/:appId/:objectName/grid/:listviewId',
    element: (
      <LoggedIn>
        <AppLayout>
          <ObjectListView/>
        </AppLayout>
      </LoggedIn>
    ),
  },
  {
    path: '/app/:appId/:objectName/view/:recordId',
    element: (
      <LoggedIn>
        <AppLayout>
          <ObjectDetail/>
        </AppLayout>
      </LoggedIn>
    ),
  },
]


const SteedosRouter = () => {

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router}></RouterProvider>;
};

export { SteedosRouter };
