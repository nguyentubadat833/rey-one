import { Loaded } from '@mikro-orm/core';
import { User } from '../entities/user.entity';

export type IdentifierType = { id: string } | { username: string } | { email: string } | { phone: string };
export type UserLoadedRole = Loaded<User, 'role'>
export type UserLoadedRoleWithDomainAndInfo = Loaded<User, 'role.domain.info' | 'info'>;