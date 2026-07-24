import { Loaded } from '@mikro-orm/core';
import { DomainMember } from '../entities/iam-domain.member.entity';

export type DomainMemberLoadedUser = Loaded<DomainMember, 'user.party'>;
