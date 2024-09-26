import axiosInstance from '@/lib/api';

export const share = async (data: any): Promise<any> => {
  const response = await axiosInstance.post('/api/share-data/get', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};
