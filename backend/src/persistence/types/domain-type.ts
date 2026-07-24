import { Loaded } from '@mikro-orm/core';
import { DomainMember } from '../entities/iam-domain.member.entity';
import { Domain } from '../entities/iam-domain.entity';

export type DomainLoadedRoleAndMember = Loaded<Domain, 'roles' | 'members.user.party'>;
export type DomainMemberLoadedUserAndRole = Loaded<DomainMember, 'user.party'>;