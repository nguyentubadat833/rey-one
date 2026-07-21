import { EntityManager, Dictionary } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

export class DatabaseSeeder extends Seeder {
  run(em: EntityManager, context?: Dictionary | undefined) {

    // const group = em.create(UserGroup, {
    //   name: `group_${Date.now()}`,
    //   permissions: ['commerce:payment:notification', 'commerce:payment:online'],
    // });

    // const now = Date.now()

    // const role1 = `role_${now}`;
    // const role2 = `role_${now + 1}`;

    // group.roles.push({
    //     name: role1,
    //     permissions: ['commerce:payment:notification'],
    //     id: now.toString()
    // });

    // group.roles.push({
    //     name: role2,
    //     permissions: ['commerce:order:cancel'],
    //     id: (now + 1).toString()
    // });

    // em.flush().then(() => {
    //   group.roles = group.roles.filter((role) => role.id !== now.toString());
    //   em.flush().then(() => {
    //     console.log(group);
    //   });
    // });
  }
}
