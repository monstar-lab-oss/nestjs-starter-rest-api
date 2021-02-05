import { AclRule, IsResourceOwner } from './acl-rule.constant';
import { Action } from './action.constant';
import { ROLE } from 'src/auth/constants/role.constant';
import { Subject } from './subject.constant';

export class BaseAclService {
  protected acl: AclRule[] = [];

  /**
   * Set ACL rule for user role
   */
  protected canDo(
    role: ROLE,
    actions: Action[],
    isResourceOwner?: IsResourceOwner,
  ): void {
    isResourceOwner
      ? this.acl.push({ role, actions, isResourceOwner })
      : this.acl.push({ role, actions });
  }

  /**
   * create user specific acl object to check ability to perform any action
   */
  public forUser = (user: { id: number; roles: ROLE[] }): any => {
    return {
      canDoAction: (action: Action, subject: Subject) => {
        let canDoAction = false;
        user.roles.forEach((userRole) => {
          //If already has accress, return
          if (canDoAction) return true;

          //find acl rule for given user role
          const aclRule = this.acl.find((rule) => rule.role === userRole);

          //if acl rule found, check action permission
          const hasActionPermission =
            aclRule &&
            (aclRule.actions.includes(action) ||
              aclRule.actions.includes(Action.Manage));

          // check resource ownership rule
          canDoAction =
            hasActionPermission &&
            (!aclRule.isResourceOwner ||
              aclRule.isResourceOwner(subject, user));
        });

        return canDoAction;
      },
    };
  };
}
