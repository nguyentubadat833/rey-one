import { Role } from '@/persistence/entities/role.entity';
import { RoleSummaryDto } from '../dtos/role-dto';

export class RoleMapper {
  static roleToRoleSummary(role: Role) {
    return {
      id: role.id,
      name: role.name,
      active: role.active,
    } satisfies RoleSummaryDto;
  }
}
