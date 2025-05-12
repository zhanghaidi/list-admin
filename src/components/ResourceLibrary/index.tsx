import { CaretUpOutlined, SearchOutlined } from '@ant-design/icons';
import { Modal, Input, message } from 'antd';
import clsx from 'clsx';
import React, { useState, useEffect, useRef } from 'react';
// import { useInfiniteScroll } from 'ahooks'

import { fetchGetCategory } from '@/api/category';
import { fetchGetModelList, fetchGetSpecimenList, fetchGetSliceList, fetchGetVideoList } from '@/api/resource';
import imageLoadFailed from '@/assets/images/image-error.png';
import { bodyNoScroll, bodyYesScroll, getImageUrl } from '@/utils';

import styles from './index.module.less';
import { ListPlaceholder } from './placeholder';

interface ResourceLibraryModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (type: string, data: any) => void;
  mediaType: string;
}

const resourceTypeLabels = ['医学模型', '真实标本', '全景切片', '医学视频'];

const ResourceLibraryModal: React.FC<ResourceLibraryModalProps> = ({ isOpen, onCancel, onSubmit, mediaType }) => {
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [currentResourceType, setCurrentResourceType] = useState(0);
  const [categories, setCategories] = useState<Api.ResourceManage.CategoryNodes[]>([]);
  const [subCategories, setSubCategories] = useState<Api.ResourceManage.CategoryNodes[] | null>(null);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(-1);
  const [currentSubCategoryIndex, setCurrentSubCategoryIndex] = useState(-1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [noMore, setNoMore] = useState(false);
  const resourceListEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    switch (mediaType) {
      case 'model':
        setCurrentResourceType(0);
        break;
      case 'specimen':
        setCurrentResourceType(1);
        break;
      case 'slice':
        setCurrentResourceType(2);
        break;
      case 'video':
        setCurrentResourceType(3);
        break;
      default:
        setCurrentResourceType(0);
        break;
    }

    if (isOpen) {
      initialize();
    } else {
      resetState();
    }
  }, [isOpen, currentResourceType, currentCategoryIndex, currentSubCategoryIndex]);

  const initialize = async () => {
    await fetchCategories();
    setDataList([]);
    await fetchResources();
  };

  const resetState = () => {
    resourceListEl.current?.scrollTo(0, 0);
    setShowTypeMenu(false);
    setSearchKeyword('');
    setLoading(false);
    setLoadingMore(false);
    setNoMore(false);
  };

  const fetchCategories = async () => {
    // const resourceType = ['model', 'specimen', 'slice', 'video'][currentResourceType] as
    //   | 'model'
    //   | 'specimen'
    //   | 'slice'
    //   | 'video'
    try {
      const response = await fetchGetCategory();
      setCategories(response.list);
    } catch (error) {
      message.error('获取分类失败: ' + error);
    }
  };

  const fetchResources = async (isLoadMore = false) => {
    if (loadingMore || loading) return;
    try {
      setLoadingMore(isLoadMore);
      setLoading(!isLoadMore);

      const parentId = currentCategoryIndex === -1 ? undefined : categories[currentCategoryIndex]?.id;
      const childId = subCategories
        ? currentSubCategoryIndex === -1
          ? undefined
          : subCategories[currentSubCategoryIndex]?.id
        : undefined;

      const params = {
        keywords: searchKeyword,
        categoryId: parentId,
        children_id: childId,
        pageSize: 100,
      };

      const res = await (async () => {
        switch (currentResourceType) {
          case 0:
            return fetchGetModelList(params);
          case 1:
            return fetchGetSpecimenList(params);
          case 2:
            return fetchGetSliceList(params);
          case 3:
            return fetchGetVideoList(params);
          default:
            return fetchGetModelList(params);
        }
      })();

      const response = res.list;
      setDataList((prevData) => (isLoadMore ? [...prevData, ...response] : response));
      setNoMore(response.length === 0);
    } catch (error) {
      message.error('获取资源列表失败: ' + error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleCategoryClick = (index: number) => {
    setCurrentCategoryIndex(index);
    setSubCategories(index === -1 ? null : (categories[index]?.child ?? null));
    setCurrentSubCategoryIndex(-1);
  };

  const handleSubCategoryClick = (index: number) => {
    setCurrentSubCategoryIndex(index);
  };

  const handleSearch = () => {
    fetchResources();
  };

  const handleResourceClick = (index: number) => {
    const resourceType = ['model', 'specimen', 'slice', 'video'][currentResourceType] as
      | 'model'
      | 'specimen'
      | 'slice'
      | 'video';
    onSubmit(resourceType, dataList[index]);
    onCancel();
  };

  // const loadMore = useCallback(() => {
  //   if (!noMore && !loadingMore) {
  //     fetchResources(true)
  //   }
  // }, [noMore, loadingMore])

  // useInfiniteScroll({
  //   target: resourceListEl,
  //   onScroll: loadMore,
  //   isNoMore: () => noMore,
  //   distance: 100
  // })

  return (
    <Modal className={styles.modal} open={isOpen} footer={null} onCancel={onCancel}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div
            className={clsx(styles.type, { [styles.active]: showTypeMenu })}
            onClick={() => setShowTypeMenu(!showTypeMenu)}
          >
            <span>{resourceTypeLabels[currentResourceType]}</span>
            <CaretUpOutlined />
            <div className={clsx(styles.options, { [styles.active]: showTypeMenu })}>
              {resourceTypeLabels.map((label, index) => (
                <div
                  className={clsx(styles.item, index === currentResourceType && styles.active)}
                  key={'option' + index}
                  onClick={() => setCurrentResourceType(index)}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
          <div className={clsx(styles.category, 'scrollBox')} onMouseMove={bodyYesScroll} onMouseLeave={bodyNoScroll}>
            <div
              className={clsx(styles.item, { [styles.active]: currentCategoryIndex === -1 })}
              onClick={() => handleCategoryClick(-1)}
            >
              全部{resourceTypeLabels[currentResourceType]}
            </div>
            {categories.map((item, index) => (
              <div
                key={item.id}
                className={clsx(styles.item, { [styles.active]: currentCategoryIndex === index })}
                onClick={() => handleCategoryClick(index)}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.header}>
            <div className={styles.search}>
              <Input
                placeholder="输入搜索关键字"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onPressEnter={handleSearch}
              />
              <SearchOutlined onClick={handleSearch} />
            </div>
          </div>
          <div
            className={clsx(styles['secondary-category'], {
              [styles.expand]: true,
            })}
          >
            <div className={styles.list}>
              <div
                className={clsx(styles.item, {
                  [styles.active]: currentSubCategoryIndex === -1,
                })}
                onClick={() => handleSubCategoryClick(-1)}
              >
                全部
              </div>
              {subCategories &&
                subCategories.map((item, index) => (
                  <div
                    key={item.id}
                    className={clsx(styles.item, {
                      [styles.active]: currentSubCategoryIndex === index,
                    })}
                    onClick={() => handleSubCategoryClick(index)}
                  >
                    {item.name}
                  </div>
                ))}
            </div>
          </div>
          <div
            ref={resourceListEl}
            className={clsx(styles.main, 'scrollBox')}
            onMouseMove={bodyYesScroll}
            onMouseLeave={bodyNoScroll}
          >
            {dataList.map((item, index) => (
              <div key={item.id} className={styles.resource} onClick={() => handleResourceClick(index)}>
                <img
                  className={styles.thumb}
                  src={getImageUrl(item.thumb)}
                  alt=""
                  onError={(e) => (e.currentTarget.src = imageLoadFailed)}
                  loading="lazy"
                />
                <div className={styles.name}>{item.title}</div>
              </div>
            ))}
            <ListPlaceholder
              loading={loadingMore}
              noMore={noMore && !loading}
              empty={dataList.length === 0 && !loading}
              textStyle={{ color: '#999' }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ResourceLibraryModal;
