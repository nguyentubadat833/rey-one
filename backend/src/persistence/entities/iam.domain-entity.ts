import { AppError } from '@/utils/errors/app.error';
import { defineEntity, p } from '@mikro-orm/core';
import { APP_PERMISSIONS, AppPermission } from '@rey-one/shared';
import { DomainRole } from './iam.domain-role-entity';
import { User } from './iam.user-entity';

const DomainEntitySchema = defineEntity({
  name: 'IAMDomain',
  tableName: 'iam_domain',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    name: p.string().unique(),
    active: p.boolean().default(true),
    roles: () => p.oneToMany(DomainRole).mappedBy(role => role.domain).orphanRemoval().lazy().ref(),
    permissions: p.enum(APP_PERMISSIONS).array().default([])
  },
});

export class Domain extends DomainEntitySchema.class {

  static ensureStatus(domain: Domain) {
    if (!domain.active) {
      throw AppError.withMessage('INVALID_STATUS', "Invalid domain status")
    }
  }

  ensurePermissionsValid(permissions: AppPermission[]) {
    const invalid = permissions.filter((p) => !this.permissions.includes(p));
    if (invalid.length > 0) {
      throw new AppError('INVALID_PERMISSION', `Permissions not available in domain: ${invalid.join(', ')}`);
    }
  }

  ensureStatus() {
    Domain.ensureStatus(this)
  }
}

DomainEntitySchema.setClass(Domain);

// DomainEntitySchema.addHook('beforeCreate', validateChangeSetRoles);
// DomainEntitySchema.addHook('beforeUpdate', validateChangeSetRoles)

// function validateChangeSetRoles(args: EventArgs<UserGroup>) {
//   const entity = args.entity;
//   const changeSet = args.changeSet;

//   if (!changeSet) return;

//   if (changeSet.payload.roles) {
//     entity.roles.forEach((role) => {
//       entity.ensurePermissionsValid(role.permissions);
//     });
//   }
// }