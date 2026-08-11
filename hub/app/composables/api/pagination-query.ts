import type { ApiResponse, PaginatedResponse, PaginationQuery } from "@rey-one/shared";
import { useAsyncAPI } from ".";

type Response<T> = ApiResponse<PaginatedResponse<T>>

export function createPaginationQuery<T>(path: string, limit = 30) {
  const paginationParams = reactive<PaginationQuery>({
    page: 1,
    limit
  });
  
  const totalRows = ref<number>();
  const data = ref<T[]>([])

  return {
    fetch: () =>
      useAsyncAPI<Response<T>>(path, {
        query: paginationParams,
        watch: [paginationParams],
        onResponse({response}){
          const result = response._data as Response<T>
          totalRows.value = result.data.total
          data.value = result.data.data
        }
      }),
    paginationParams,
    totalRows,
    data,

    updatePage: (page: number) => {
      paginationParams.page = page
    },
  };
}