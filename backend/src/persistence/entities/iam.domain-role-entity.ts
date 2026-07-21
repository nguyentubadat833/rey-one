import { AppError } from "@/utils/errors/app.error";
import { ChangeSetType, defineEntity, EventArgs, p } from "@mikro-orm/core";
import { APP_PERMISSIONS } from "@rey-one/shared";
import { Domain } from "./iam.domain-entity";
import slugify from "slugify";
import { User } from "./iam.user-entity";

export const DomainRoleEntitySchema = defineEntity({
    name: 'IAMUserRole',
    tableName: 'iam_domain_role',
    properties: {
        id: p.string().length(20).primary().onCreate(domain => generateId(domain.name)),
        domain: () => p.manyToOne(Domain).ref(),
        name: p.string(),
        active: p.boolean().default(true),
        permissions: p.enum(APP_PERMISSIONS).array().default([]),
        users: () => p.oneToMany(User).mappedBy(user => user.domainRole).ref(),
    },
});

export class DomainRole extends DomainRoleEntitySchema.class { }

DomainRoleEntitySchema.setClass(DomainRole);
DomainRoleEntitySchema.addHook('beforeCreate', handlerSave)
DomainRoleEntitySchema.addHook('beforeUpdate', handlerSave)

export function generateId(name: string) {
    const slug = slugify(name.slice(0, 7), {
        lower: true,
        strict: true,
        locale: 'vi',
        trim: true,
    })

    const suffix = crypto.randomUUID().slice(0, 5)
    return `DMR-${slug}-${suffix}`.toUpperCase();
}

async function handlerSave(args: EventArgs<DomainRole>) {
    const changeSetType: ChangeSetType | undefined = args.changeSet?.type

    if (!changeSetType) return

    const domain = await args.entity.domain.loadOrFail()
        .catch((e) => {
            throw AppError.withMessage("OBJECT_NOT_FOUND", "Domain not found", e)
        })

    domain.ensureStatus()

    if (args.changeSet?.payload.permissions) {
        domain.ensurePermissionsValid(args.entity.permissions)
    }

    if (changeSetType === ChangeSetType.UPDATE) {
        if (args.changeSet?.payload.domain) {
            throw AppError.withMessage("PROPERTY_IMMUTABLE", "Domain is immutable")
        }
    }
}