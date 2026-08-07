import { Loaded } from '@mikro-orm/core';
import { DomainMember } from '../entities/iam-domain-member.entity';
import { Domain } from '../entities/iam-domain.entity';
import { DomainRole } from '../entities/iam-domain-role.entity';

// Domain type
export type DomainLoadedParty = Loaded<Domain, 'party'>
export type DomainLoadedPartyAndRoles = Loaded<Domain, 'party' | 'roles'>
export type DomainLoadedPartyAndRolesAndMembers = Loaded<Domain, 'party' | 'roles' | 'members.user.party'>;

// Domain member
export type DomainMemberLoadedUserAndRole = Loaded<DomainMember, 'user.party'>;
export type DomainMemberLoadedUserAndRoleAndDomain = Loaded<DomainMember, 'user.party' | 'domain.party'>;
export type DomainMemberLoadedDomain= Loaded<DomainMember, 'domain.party'>;

// Domain role
export type DomainRoleLoadedMembers = Loaded<DomainRole, 'members.user.party'>;
