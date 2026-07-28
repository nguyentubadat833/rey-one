import { CLS_KEYS } from '@/utils/types/tokens';
import { FilterDef, Dictionary, EntityManager } from '@mikro-orm/core';
import { ClsServiceManager } from 'nestjs-cls';

export const tenantFilterConfig: Dictionary<FilterDef> = {
  tenant: {
    name: 'tenant',
    cond: (
      _args: Dictionary,
      _type: 'read' | 'update' | 'delete', // FilterProcessOption bằng union type 
      _em: EntityManager,
    ): Dictionary => {
      const cls = ClsServiceManager.getClsService();
      const domainId = cls?.get<string>(CLS_KEYS.DOMAIN_ID);

      if (!domainId) {
        return {};
      }

      return { domain: domainId };
    },
    default: true,
  },
};