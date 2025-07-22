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
