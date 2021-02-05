import { ROLE } from 'src/auth/constants/role.constant';
import { Action } from './action.constant';
import { Subject } from './subject.constant';

export type IsResourceOwner = (sub: Subject, user: { id: number }) => boolean;

export type AclRule = {
  //if rule for particular role or for all role
  role: ROLE;

  //list of actions permissible
  actions: Action[];

  //specific rule there or otherwise true
  isResourceOwner?: IsResourceOwner;
};
