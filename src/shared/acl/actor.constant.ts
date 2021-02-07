import { ROLE } from './../../auth/constants/role.constant';

/**
 * The actor who is perfoming the action
 */
export interface Actor {
  id: number;

  roles: string[];
}
