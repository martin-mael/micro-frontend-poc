import { useAuthentication } from '@fulll/mui-auth';

export const Logout = () => {
  const { logout } = useAuthentication();
  return (
    <button
      onClick={() => {
        logout?.();
      }}
    >
      Logout
    </button>
  );
};
