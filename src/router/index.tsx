import { RouterProvider } from 'react-router-dom';

import { router } from './router';

export default function Router() {
  return <RouterProvider router={router} />;
}
