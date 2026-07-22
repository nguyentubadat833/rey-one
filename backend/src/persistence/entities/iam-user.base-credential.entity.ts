import { AppError } from "@/utils/errors/app.error";
import { ChangeSetType, defineEntity, EventArgs, p } from "@mikro-orm/core";
import { hash, verify } from "argon2";
import { User } from "./iam-user.entity";

const BaseCredentialEntitySchema = defineEntity({
    name: "IAMBaseCredential",
    tableName: 'iam_base_credential',
    properties: {
        id: p.bigint().primary().autoincrement(),
        email: p.string().unique().nullable(),
        phone: p.string().unique().nullable(),
        password: p.string().hidden().lazy().ref(),
        user: () => p.oneToOne(User).inversedBy(user => user.baseCredential).eager()
    }
})

export class BaseCredential extends BaseCredentialEntitySchema.class {
    async verifyPassword(password: string) {
        const passwordHashed = await this.password.loadOrFail();

        return verify(passwordHashed, password);
    }
}

BaseCredentialEntitySchema.setClass(BaseCredential)
BaseCredentialEntitySchema.addHook('beforeCreate', saveHandler)
BaseCredentialEntitySchema.addHook('beforeUpdate', saveHandler)

async function saveHandler(args: EventArgs<BaseCredential>) {
    const changeSetType: ChangeSetType | undefined = args.changeSet?.type;

    if (!changeSetType) return;

    const entity = args.entity

    const changeSetPassword = args.changeSet?.payload.password;
    if (typeof changeSetPassword === 'string') {
        const hashed = await hash(changeSetPassword);
        entity.password.set(hashed);
    }

    if (changeSetType === ChangeSetType.CREATE) {
        if (!entity.email || !entity.phone) {
            throw AppError.withMessage('PROPERTY_REQUIRED', 'Email and password are required')
        }
    }

    if (changeSetType === ChangeSetType.UPDATE) {
        if (args.changeSet?.payload.email || args.changeSet?.payload.phone) {
            throw AppError.withMessage('PROPERTY_IMMUTABLE', 'Email and phone are immutable')
        }
    }
}
