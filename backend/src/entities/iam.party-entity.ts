import { defineEntity, p } from "@mikro-orm/core";
import { PARTY_TYPES } from "@rey-one/shared";

const PartyEntitySchema = defineEntity({
    name: 'IAMParty',
    tableName: 'iam_party',
    properties: {
        id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
        type: p.enum(() => PARTY_TYPES),
        name: p.string().length(255),
        taxCode: p.string().length(50).unique().nullable().fieldName('tax_code'),
        email: p.string().length(255).nullable(),
        phone: p.string().length(30).nullable(),
        website: p.string().length(255).nullable(),
        address: p.string().length(255).nullable(),
    },
})

export class Party extends PartyEntitySchema.class {}

PartyEntitySchema.setClass(Party);