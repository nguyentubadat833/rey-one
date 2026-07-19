import { defineEntity, p } from "@mikro-orm/core";
import { OAUTH_PROVIDERS } from "@rey-one/shared";
import { User } from "./iam.user-entity";

const OAuthCredentialEntitySchema = defineEntity({
    name: 'IAMOAuthCredential',
    tableName: 'iam_oauth_credential',
    properties: {
        id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
        user: () => p.manyToOne(User).joinColumn('user_id').owner(),
        provider: p.enum(() => OAUTH_PROVIDERS),
        providerAccountId: p.string().length(255).fieldName('provider_account_id')
    },
    uniques: [
        {
            properties: ['user', 'provider']
        }
    ] 
})

export class OAuthCredential extends OAuthCredentialEntitySchema.class { }

OAuthCredentialEntitySchema.setClass(OAuthCredential);