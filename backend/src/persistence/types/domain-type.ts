import { Loaded } from '@mikro-orm/core';
import { DomainMember } from '../entities/iam-domain.member.entity';

export type DomainMemberLoadedUserAndRole = Loaded<DomainMember, 'user.party' | 'role'>;