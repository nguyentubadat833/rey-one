import { AppError } from '@/utils/errors/app.error';
import { AppClsStore } from '@/utils/types/system';
import { FilterDef, Dictionary, EntityManager } from '@mikro-orm/core';
import { ClsServiceManager } from 'nestjs-cls';

export const tenantDomainFilterConfig: Dictionary<FilterDef> = {
  tenant: {
    name: 'tenant',
    cond: (
      _args: Dictionary,
      _type: 'read' | 'update' | 'delete', // FilterProcessOption bằng union type 
      _em: EntityManager,
    ): Dictionary => {
      const cls = ClsServiceManager.getClsService<AppClsStore>();
      const domainId = cls.get('domainId');

      if (!domainId) {
        throw new AppError('PROPERTY_REQUIRED', 'Tenant required domain id')
        // return {};
      }

      return { domain: domainId };
    },
    default: true,
  },
};