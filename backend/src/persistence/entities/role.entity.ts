import { defineEntity, p } from '@mikro-orm/core';
import { APP_PERMISSIONS } from '@rey-one/shared';
import { Domain } from './domain.entity';
import { BaseEntitySchema } from './base.entity';
import { User } from './user.entity';
import slugify from 'slugify';
import randomstring from 'randomstring';

export const RoleEntitySchema = defineEntity({
  name: 'RoleEntity',
  tableName: 'role',
  // filters: tenantFilterConfig,
  extends: BaseEntitySchema,
  properties: {
    id: p
      .string()
      .length(14)
      .primary()
      .onCreate((role) => generateId(role.name)),
    name: p.string(),
    active: p.boolean().default(true),
    permissions: p.enum(APP_PERMISSIONS).array().default([]),

    domain: () => p.manyToOne(Domain).nullable(),
    users: () =>
      p
        .oneToMany(User)
        .mappedBy((user) => user.role)
        .ref(),
  },
});

export class Role extends RoleEntitySchema.class {}
RoleEntitySchema.setClass(Role);

// DomainRoleEntitySchema.addHook('beforeCreate', handlerSave);
// DomainRoleEntitySchema.addHook('beforeUpdate', handlerSave);

export function generateId(name: string) {
  const slug = slugify(name.slice(0, 7), {
    lower: true,
    strict: true,
    locale: 'vi',
    trim: true,
  });

  const suffix = randomstring.generate({
    length: 7,
    charset: 'alphabetic',
  });
  return `${slug}-${suffix}`.toUpperCase();
}

// async function handlerSave(args: EventArgs<DomainRole>) {
//   const changeSetType: ChangeSetType | undefined = args.changeSet?.type;

//   if (!changeSetType) return;

//   if (changeSetType === ChangeSetType.UPDATE && args.changeSet?.payload.domain) {
//     throw AppError.withMessage('PROPERTY_IMMUTABLE', 'Domain is immutable');
//   }

//   if (args.changeSet?.payload.permissions) {
//     const permissions = args.entity.permissions;

//     // const domain = await args.entity.domain.loadOrFail();
//     args.entity.permissions = Array.from(new Set(permissions));
//     args.entity.domain.ensurePermissionsValid(args.entity.permissions);
//   }
// }
