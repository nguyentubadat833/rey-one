import { defineEntity } from "@mikro-orm/core";

export const BaseEntitySchema = defineEntity({
  name: 'BaseEntity',
  abstract: true,
  properties: (p) => ({
    createdAt: p.datetime().onCreate(() => new Date()).fieldName('created_at'),
    updatedAt: p.datetime().onCreate(() => new Date()).onUpdate(() => new Date()).fieldName('updated_at'),
  })
});