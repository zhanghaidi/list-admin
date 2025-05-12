import { useEffect, useMemo, useState } from 'react';

import { fetchSlice } from '@/api/slice';
import SliceViewer, { type Marker } from '@/components/SliceViewer';
import { getImageUrl } from '@/utils';

import styles from './Viewer.module.scss';

const getLabelData = async (src: string): Promise<Marker[]> => {
  try {
    const response = await fetch(`${src}test.json?t=${Date.now()}`);

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('e', error);
  }

  return [];
};

export default function Viewer() {
  const pathname = window.location.hash;
  const id = Number(pathname.split('/').pop() ?? 0);

  const [sliceData, setSliceData] = useState<Api.ResourceManage.Slice>();
  const [labelData, setLabelData] = useState<Marker[]>([]);

  useEffect(() => {
    const getSliceData = async () => {
      const data = await fetchSlice(id);
      setSliceData(data);
      const labelData = await getLabelData(getImageUrl(data.scene));
      setLabelData(labelData);
    };

    getSliceData();
  }, [id]);

  const size = useMemo(() => {
    if (!sliceData) return [];
    return sliceData.size.split(',').map((item) => parseInt(item));
  }, [sliceData]);

  return (
    <div className={styles.main}>
      {sliceData && (
        <SliceViewer
          url={getImageUrl(sliceData?.scene)}
          data={sliceData}
          labels={labelData}
          size={{ width: size[0], height: size[1] }}
        />
      )}
    </div>
  );
}
