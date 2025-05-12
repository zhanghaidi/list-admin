import { Avatar } from 'antd';
import React from 'react';

import { getImageUrl } from '@/utils';

interface UserAvatarNicknameProps {
  avatar: string;
  nickName: string;
}

const UserAvatarNickname: React.FC<UserAvatarNicknameProps> = ({ avatar, nickName }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Avatar size={38} src={getImageUrl(avatar)} />
      <span>{nickName}</span>
    </div>
  );
};

export default UserAvatarNickname;
