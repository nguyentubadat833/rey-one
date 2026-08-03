import { PaginatedResponse } from "@rey-one/shared";

export class ResponseMapper {
  static toPaginatedResponse<T>(data: T[], total: number, page: number, limit: number): PaginatedResponse<T> {
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }
}
