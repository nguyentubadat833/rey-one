import { AppError } from '@/utils/errors/app.error';
import { defineEntity, EventArgs, p } from '@mikro-orm/core';
import { APP_PERMISSIONS, AppPermission } from '@rey-one/shared';
import { User } from './iam.user-entity';
import slugify from 'slugify';

const UserRoleSchema = defineEntity({
  name: 'IAMUserRole',
  embeddable: true,
  properties: {
    id: p.string(),
    name: p.string(),
    permissions: p.enum(APP_PERMISSIONS).array().default([]),
  },
});

const UserGroupEntitySchema = defineEntity({
  name: 'IAMUserGroup',
  tableName: 'iam_user_group',
  properties: {
    id: p.string().primary().onCreate(group => generateId(group.name)),
    name: p.string().unique(),
    active: p.boolean().default(true),
    users: () => p.oneToMany(User).mappedBy(user => user.group).lazyRef(),
    permissions: p.enum(APP_PERMISSIONS).array().default([]),
    roles: p
      .embedded(UserRoleSchema)
      .array()
      .onCreate(() => []),
  },
});

export class UserGroup extends UserGroupEntitySchema.class {
  ensurePermissionsValid(permissions: AppPermission[]) {
    const invalid = permissions.filter((p) => !this.permissions.includes(p));
    if (invalid.length > 0) {
      throw new AppError('USER_PERMISSIONS_EXCEED_GROUP', `Permissions not available in group: ${invalid.join(', ')}`);
    }
  }
}

class UserRole extends UserRoleSchema.class { }

UserGroupEntitySchema.setClass(UserGroup);
UserRoleSchema.setClass(UserRole);

UserGroupEntitySchema.addHook('beforeCreate', validateChangeSetRoles);
UserGroupEntitySchema.addHook('beforeUpdate', validateChangeSetRoles)

function validateChangeSetRoles(args: EventArgs<UserGroup>) {
  const entity = args.entity;
  const changeSet = args.changeSet;

  if (!changeSet) return;

  if (changeSet.payload.roles) {
    entity.roles.forEach((role) => {
      entity.ensurePermissionsValid(role.permissions);
    });
  }
}

export function generateId(name: string) {
  const slug = slugify(name, {
    strict: true,
  })
    .slice(0, 7)
    .trim()
    .replace(/-+$/, '')
    .toUpperCase()

  const suffix = crypto.randomUUID().slice(0, 7).toUpperCase();

  return `${slug}-${suffix}`;
}
