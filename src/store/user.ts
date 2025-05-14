import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  token: string;
  refreshToken: string;
  userInfo: Api.Auth.UserInfo;
  collapsed: boolean;
  isDark: boolean;
  colorPrimary: App.colorPrimary;
  updateToken: (token: string) => void;
  updateRefreshToken: (refreshToken: string) => void;
  updateUserInfo: (userInfo: Api.Auth.UserInfo) => void;
  updateTheme: (isDark: boolean) => void;
  updateColorPrimary: (colorPrimary: App.colorPrimary) => void;
  updateCollapsed: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: '',
      refreshToken: '',
      userInfo: {
        id: 0,
        username: '',
        nickName: '',
        realName: '',
        avatar: '',
        menuList: [],
        buttons: [],
        roleId: 0
      },
      collapsed: false,
      isDark: false,
      colorPrimary: {
        color: '#1677ff',
        name: '拂晓蓝'
      },
      updateToken: (token) => set({ token }),
      updateRefreshToken: (refreshToken) => set({ refreshToken }),
      updateUserInfo: (userInfo) => set({ userInfo }),
      updateTheme: (isDark) => set({ isDark }),
      updateColorPrimary: (colorPrimary) => set({ colorPrimary }),
      updateCollapsed: () => set((state) => ({ collapsed: !state.collapsed }))
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        isDark: state.isDark,
        colorPrimary: state.colorPrimary
      })
    }
  )
);

export default useUserStore;
