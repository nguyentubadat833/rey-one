import { UserLoadedRoleWithDomainAndInfo } from '@/persistence/types/user-type'
import { nullToUndefined } from '@/utils/mappers/falsy-value-mapper'
import { UserAuthResponse } from '@rey-one/shared'

export class UserMapper {
   static userToUserAuth(user: UserLoadedRoleWithDomainAndInfo) {
        const role = user.role.getEntity()
        const domain = role.domain?.getEntity()
        return {
            id: user.id,
            code: user.code,
            name: user.info.name,
            username: nullToUndefined(user.username),
            email: nullToUndefined(user.email),
            phone: nullToUndefined(user.phone),
            role: { id: role.id, name: role.name },
            domain: domain ? { id: domain.id, name: domain.info.name } : undefined
        } satisfies UserAuthResponse
    }
}
