declare namespace Api {
  // 公共参数
  namespace Common {
    // 分页
    interface Page {
      page: number;
      pageSize: number;
    }
    // 返回分页数据列表
    interface PageRecord extends Page {
      total: number;
      lastPage: number;
      list: T[];
    }
    // 返回不带分页数据列表
    type ListRecord = Pick<PageRecord, 'list'>;

    // 搜索参数
    type SearchParams = Page & App.RecordNullable;

    // ID请求参数
    interface IDParams {
      id: number;
    }
    // IDs请求参数
    interface IDsParams {
      ids: number[];
    }
    // 批量状态参数
    interface BatchStatusParams {
      ids: number[];
      status: number;
    }

    interface IDStatusParams {
      id: number;
      status: number;
    }

    // 批量排序
    interface SortParams {
      sort: Sort[];
    }
    interface Sort {
      id: number;
      value: number;
    }
  }

  // 登录
  namespace Auth {
    // 验证码
    interface Captcha {
      imgPath: string;
      captchaKey: string;
    }

    interface LoginToken {
      token: string;
      refreshToken: string;
    }

    interface UserInfo {
      id: number;
      username: string;
      nickName: string;
      realName: string;
      avatar: string;
      roleId: number;
      menuList: MenuTree[];
      buttons: string[];
    }

    interface LoginParams {
      username: string;
      password: string;
      captcha: string;
      captchaKey: string;
    }
  }

  // 系统管理
  namespace SystemManage {
    // 菜单
    interface Menu {
      id: number;
      parentId: number;
      name: string;
      path: string;
      icon: string;
      permission: string;
      component: string;
      sort: number;
      type: number;
      status: number;
      createdAt: string;
      permissionActions: [];
      child?: Menu[];
    }
    interface MenuCreate {
      name: string; // 菜单名称
      icon?: string; // 菜单图标
      type: number; // 0: 菜单 1：按钮
      status: number; // 1：正常 0：停用
      permission?: string; // 按钮权限标识
      parentId: number; // 父级菜单ID
      path?: string; // 菜单路径
      component?: string; // 组件名称
    }
    interface MenuUpdate extends MenuCreate {
      id: number;
    }

    // 菜单按钮
    interface MenuActions {
      id: number;
      action: string;
      describe: string;
    }

    // 角色
    interface Role {
      id: number;
      name: string;
      description: string;
      checkedKeys: number[];
      permissions: number[];
      createdAt: string;
    }
    interface RoleCreate {
      name: string;
      remark: string;
      checkedKeys: number[];
      permissions: number[];
    }
    interface RoleUpdate extends RoleCreate {
      id: number;
    }

    // 管理员
    interface Admin {
      id: number;
      username: string;
      nickName: string;
      realName: string;
      mobile: string;
      avatar: string;
      roleId: number;
      enable: number;
      Role: Role;
    }
    interface AdminCreate {
      username: string;
      nickName: string;
      realName: string;
      avatar: string;
      mobile: string;
    }
    interface AdminUpdate extends AdminCreate {
      id: number;
    }
  }

  // 资源管理
  namespace ResourceManage {
    // 分类
    interface CategoryNodes {
      id: number;
      name: string;
      parentId: number;
      status: number;
      path: string;
      sort?: number;
      child?: CategoryNodes[];
    }
    interface CategoryCreate {
      name: string;
      status: number;
      parentId?: number;
      thumb?: string;
      sort?: number;
    }
    interface CategoryUpdate extends CategoryCreate {
      id: number;
    }

    // 资源
    interface Resource {
      id: number;
      title: string;
      sort: number;
      thumb: string;
      enTitle: string;
      categoryId: number;
      content: string;
      bkAddress: string;
      views: number;
      status: number;
      createdAt: string;
      category?: CategoryNodes;
    }
    interface ResourceMove {
      ids: number[];
      categoryId: number;
    }
    // 模型
    interface Model extends Resource {
      scene: string;
      type: number;
      isGltf: number;
      categoryPath: string;
    }
    interface ModelCreate {
      sort: number;
      title: string;
      categoryId: number;
      thumb: string;
      enTitle: string;
      content: string;
      bkAddress: string;
      views: number;
      status: number;
    }
    interface ModelUpdate extends ModelCreate {
      id: number;
    }
    // 标本
    interface Specimen extends Resource {
      scene: string;
      isSliceType: number;
      isGltf: number;
      categoryPath: string;
    }
    interface SpecimenCreate {
      sort: number;
      title: string;
      categoryId: number;
      thumb: string;
      enTitle: string;
      content: string;
      bkAddress: string;
      views: number;
      status: number;
    }
    interface SpecimenUpdate extends SpecimenCreate {
      id: number;
    }
    // 切片
    interface Slice extends Resource {
      scene: string;
      size: string;
      modelId: number;
      purpose: string;
      method: string;
      eyeObserve: string;
      lowPower: string;
      highPower: string;
      dyeing: string;
      sliceId: number[];
      specimenId: number[];
      articleId: number[];
      categoryPath: string;
    }
    interface SliceCreate {
      sort: number;
      title: string;
      categoryId: number;
      thumb: string;
      enTitle: string;
      views: number;
      status: number;
      modelId: number;
      purpose: string;
      method: string;
      eyeObserve: string;
      lowPower: string;
      highPower: string;
      dyeing: string;
      sliceId: number[];
      specimenId: number[];
      articleId: number[];
    }
    interface SliceUpdate extends SliceCreate {
      id: number;
    }
    // 运动解剖
    interface Sport extends Resource {
      type: number;
      scene: string;
      isGltf: number;
      unit: number;
      start: number;
      end: number;
      joint: string;
      range: string;
      location: string[];
      categoryPath: string;
      camera: string;
    }
    interface SportCreate {
      sort: number;
      title: string;
      categoryId: number;
      type: number;
      thumb: string;
      enTitle: string;
      content: string;
      bkAddress: string;
      scene: string;
      views: number;
      status: number;
      camera: string;
    }
    interface SportUpdate extends SportCreate {
      id: number;
    }
    interface SportModelTree {
      id: number;
      name: string;
      parentId: number;
    }
    // 文章
    interface Article {
      id: number;
      sort: number;
      title: string;
      categoryId: number;
      thumb: string;
      description: string;
      content: string;
      status: number;
      category?: CategoryNodes;
      createdAt: string;
    }
    interface ArticleCreate {
      sort: number;
      title: string;
      thumb: string;
      content: string;
      description: string;
      status: number;
    }
    interface ArticleUpdate extends ArticleCreate {
      id: number;
    }
  }

  // 用户管理
  namespace UserManage {
    // 用户
    interface User {
      id: number;
      username: string;
      ip: string;
      nickName: string;
      realName: string;
      avatar: string;
    }

    interface UserCreate {
      username: string;
      ip: string;
      realName: string;
      avatar: string;
    }
    interface UserUpdate extends UserCreate {
      id: number;
    }
  }
  // 自测练习
  namespace ExerciseManger {
    // 练习
    interface Question {
      id: number;
      sort: number;
      listOrder: number;
      categoryId: number;
      categoryPath: string;
      title: string;
      type: string;
      is3D: number;
      resource: {
        id: number;
        type: string;
        image: string;
      };
      analysis: string;
      score: number;
      options: QuestionOption[];
      createdAt: string;
    }
    interface QuestionOption {
      id: number;
      content: string;
      isCorrect: boolean;
    }

    interface QuestionCreate {
      sort: number;
      listOrder: number;
      categoryId: number;
      title: string;
      type: string;
      Difficulty: string;
      image: string;
      is3D: number;
      resourceId: number;
      resourceType: string;
      analysis: string;
      options: QuestionOption[];
    }
    interface QuestionUpdate extends QuestionCreate {
      id: number;
    }
  }

  // 文件上传
  namespace UploadManage {
    // 文件上传参数
    interface UploadParams {
      type: string;
      module: string;
    }

    // 文件上传数据
    interface UploadResponse {
      name: string;
      path: string;
      url: string;
    }

    // 分片上传
    interface InitMultipartParams {
      filename: string;
    }
    interface InitMultipartResponse {
      uploadId: string;
      filePath: string;
    }
    interface UploadPartParams {
      uploadId: string;
      filePath: number;
      partNumber: number;
      file: File;
    }
    interface UploadPartResponse {
      etag: string;
    }
    interface CompleteMultipartParams {
      uploadId: string;
      filePath: string;
      filename: string;
      parts: parts[];
    }
    interface Parts {
      partNumber: number;
      etag: string;
    }
    interface CompleteMultipartResponse {
      name: string;
      path: string;
      url: string;
    }
  }
  namespace AnimalManger {
    interface Animal {
      id: number;
      sort: number;
      title: string;
      categoryId: number;
      thumb: string;
      enTitle: string;
      content: string;
      bkAddress: string;
      type: number;
      status: number;
      isGltf: number;
      scene: string;
      categoryPath: string;
      createdAt: string;
    }
    interface AnimalCreate {
      sort: number;
      title: string;
      categoryId: number;
      thumb: string;
      enTitle: string;
      content: string;
      bkAddress: string;
      status: number;
    }
    interface AnimalUpdate extends AnimalCreate {
      id: number;
    }
    interface AnimalCategory {
      id: number;
      sort: number;
      name: string;
      thumb: string;
      status: number;
      count: number;
      createdAt: string;
    }
    interface AnimalCategoryCreate {
      name: string;
      thumb: string;
      status: number;
    }
    interface AnimalCategoryUpdate extends AnimalCategoryCreate {
      id: number;
    }
  }
}
