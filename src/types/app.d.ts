declare namespace App {
  // 将null添加到所有属性
  type RecordNullable<T> = {
    [K in keyof T]?: T[K] | null;
  };
  type colorPrimary = {
    name: string;
    color: string;
  };
  namespace Service {
    interface ServiceConfigItem {
      baseURL: string;
      proxyPattern: string;
    }

    // service返回参数
    type Response<T = any> = {
      code: number;
      msg: string;
      data: T;
    };
  }
}

declare namespace ModalProp {
  import { MutableRefObject } from 'react';

  type OperateAction = 'create' | 'edit' | 'delete';

  interface OperateModalProp<T> {
    mRef: MutableRefObject<{ open: (type: OperateAction, data: T) => void } | undefined>;
    update: () => void;
  }

  interface AdminProp {
    admin?: Api.SystemManage.Admin;
    roles: Api.SystemManage.Role[];
  }
}
