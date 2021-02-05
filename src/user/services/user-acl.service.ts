import { Injectable } from '@nestjs/common';
import { ROLE } from './../../auth/constants/role.constant';
import { Action } from './../../shared/acl/action.constant';
import { User } from '../entities/user.entity';
import { BaseAclService } from '../../shared/acl/acl.service';

@Injectable()
export class UserAclService extends BaseAclService {
  constructor() {
    super();
    this.canDo(ROLE.ADMIN, [Action.Manage]);
    this.canDo(ROLE.USER, [Action.Read, Action.Update], this.isResourceOwner);
  }

  isResourceOwner(subject: User, user: User): boolean {
    return subject.id === user.id;
  }
}
