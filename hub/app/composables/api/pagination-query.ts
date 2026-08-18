import type { ApiResponse, PaginatedResponse, PaginationQuerySchema } from "@rey-one/shared";
import { useAsyncAPI } from ".";
import type z from "zod";

type PaginationQuery = z.infer<typeof PaginationQuerySchema>
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