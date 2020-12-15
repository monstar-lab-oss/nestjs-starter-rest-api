import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { ROLE } from '../constants/role.constant';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ROLE[]): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, roles);
