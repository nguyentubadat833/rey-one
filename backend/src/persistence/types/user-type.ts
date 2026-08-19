import { Loaded } from '@mikro-orm/core';
import { User } from '../entities/user.entity';
import { UserScopeSchema } from '@rey-one/shared';
import z from 'zod';

export type IdentifierType = { id: string } | { username: string } | { email: string } | { phone: string };

export type UserScope =  z.infer<typeof UserScopeSchema> 
export type UserLoadedInfo = Loaded<User, 'info'>
export type UserLoadedDomain = Loaded<User, 'domain.info'>
export type UserLoadedInfoAndDomain = Loaded<User, 'domain.info' | 'info'>