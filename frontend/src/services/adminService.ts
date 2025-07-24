import { AxiosInstance } from 'axios';

export interface IFilteredAdminActionsLogParams {
  limit?: number;
  offset?: number;
  order?: 'asc' | 'desc';
  search?: string;
  actionTypeFilter?: string;
}

export const getFilteredAdminActionsLog = async (
  axiosInstance: AxiosInstance,
  params: IFilteredAdminActionsLogParams = {},
) => {
  const {
    limit = 10,
    offset = 0,
    order = 'desc',
    search = '',
    actionTypeFilter = '',
  } = params;

  const response = await axiosInstance.get(
    `/admin/getFilteredAdminActionsLog`,
    {
      params: {
        limit,
        offset,
        order,
        search,
        actionTypeFilter,
      },
    },
  );

  return response.data;
};

export const banUser = async (
  axiosInstance: AxiosInstance,
  username: string,
  reason: string,
) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('reason', reason);

  const response = await axiosInstance.post('/admin/banUser', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
