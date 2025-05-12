import BaseLayout from '@/layout';
import { GuardRoute } from '@/router/guard/GuardRouter';

export const LayoutGuard = () => {
  return (
    <GuardRoute>
      <BaseLayout />
    </GuardRoute>
  );
};
