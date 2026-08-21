import { defineEntity, EventArgs, p } from '@mikro-orm/core';
import { Domain } from './domain.entity';
import { User } from './user.entity';
import { PERMISSIONS } from '../types/role-type';
import { uuidv7 } from 'uuidv7';
import { DomainUserPermissionsSchema, SystemUserPermissionsSchema } from '@rey-one/shared';
import { AppError } from '@/utils/errors/app.error';

const RoleEntitySchema = defineEntity({
  name: 'RoleEntity',
  tableName: 'role',
  properties: {
    id: p.uuid().primary().onCreate(uuidv7),
    name: p.string().length(100),
    permissions: p.enum(PERMISSIONS).array().default([]),
    isActive: p.boolean().default(true).fieldName('is_active'),

    // Không thể thay đổi giá trị bởi ngừoi dùng, chỉ có thể set = true trong logic code
    // Nếu không có domain thì là isBosst là quyền cao nhất của hệ thống, nếu có domain thì quyền cao nhất của domain
    isBoss: p.boolean().default(false).fieldName('is_boss'),

    domain: () => p.manyToOne(Domain).nullable().eager(),
    users: () => p.oneToMany(User).mappedBy((user) => user.role),
  },
});

export class Role extends RoleEntitySchema.class {}
RoleEntitySchema.setClass(Role);

RoleEntitySchema.addHook('beforeCreate', saveHandler)
RoleEntitySchema.addHook('beforeUpdate', saveHandler)

async function saveHandler(args: EventArgs<Role>) {
  const entity = args.entity;
  const changePermissions = args.changeSet?.payload.permissions;

  if (changePermissions) {
    const domain = entity.domain;
    if (domain) {

      const parsePermissions = DomainUserPermissionsSchema.safeParse(entity.permissions);
      if (!parsePermissions.success) throw AppError.withMessage('INVALID_VALUE', 'Invalid domain permissions');
      domain.ensurePermissionsValid(parsePermissions.data);
      
    } else {

      const parsePermissions = SystemUserPermissionsSchema.safeParse(entity.permissions);
      if (!parsePermissions.success) throw AppError.withMessage('INVALID_VALUE', 'Invalid system permissions');

    }
  }
}
