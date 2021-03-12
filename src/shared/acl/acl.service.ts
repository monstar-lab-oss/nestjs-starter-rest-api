import { AclRule, RuleCallback } from './acl-rule.constant';
import { Action } from './action.constant';
import { ROLE } from './../../auth/constants/role.constant';
import { Resource } from './resource.constant';
import { Actor } from './actor.constant';

export class BaseAclService {
  /**
   * ACL rules
   */
  protected aclRules: AclRule[] = [];

  /**
   * Set ACL rule for a role
   */
  protected canDo(
    role: ROLE,
    actions: Action[],
    ruleCallback?: RuleCallback,
  ): void {
    ruleCallback
      ? this.aclRules.push({ role, actions, ruleCallback })
      : this.aclRules.push({ role, actions });
  }

  /**
   * create user specific acl object to check ability to perform any action
   */
  public forActor = (actor: Actor): any => {
    return {
      canDoAction: (action: Action, resource?: Resource) => {
        let canDoAction = false;

        actor.roles.forEach((actorRole) => {
          //If already has access, return
          if (canDoAction) return true;

          //find all rules for given user role
          const aclRules = this.aclRules.filter(
            (rule) => rule.role === actorRole,
          );

          //for each rule, check action permission
          aclRules.forEach((aclRule) => {
            //If already has access, return
            if (canDoAction) return true;

            //check action permission
            const hasActionPermission =
              aclRule.actions.includes(action) ||
              aclRule.actions.includes(Action.Manage);

            //check for custom `ruleCallback` callback
            canDoAction =
              hasActionPermission &&
              (!aclRule.ruleCallback || aclRule.ruleCallback(resource, actor));
          });
        });

        return canDoAction;
      },
    };
  };
}
