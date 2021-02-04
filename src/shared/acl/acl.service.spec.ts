import { Test, TestingModule } from '@nestjs/testing';
import { ROLE } from './../../auth/constants/role.constant';
import { IsResourceOwner } from './acl-rule.constant';
import { BaseAclService } from './acl.service';
import { Action } from './action.constant';

class MockAclService extends BaseAclService {
  public canDo(
    role: ROLE,
    actions: Action[],
    isResourceOwner?: IsResourceOwner,
  ) {
    super.canDo(role, actions, isResourceOwner);
  }

  public getAcl() {
    return this.acl;
  }
}

describe('AclService', () => {
  let service: MockAclService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockAclService],
    }).compile();

    service = module.get<MockAclService>(MockAclService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('canDo', () => {
    it('should add acl rule', () => {
      service.canDo(ROLE.USER, [Action.Read]);
      const acl = service.getAcl();
      expect(acl).toContainEqual({ role: ROLE.USER, actions: [Action.Read] });
    });

    it('should add acl rule with custom rule', () => {
      const customResourceRule = () => true;
      service.canDo(ROLE.USER, [Action.Read], customResourceRule);
      const acl = service.getAcl();
      expect(acl).toContainEqual({
        role: ROLE.USER,
        actions: [Action.Read],
        isResourceOwner: customResourceRule,
      });
    });
  });

  describe('forUser', () => {
    const user = {
      id: 6,
      username: 'foo',
      roles: [ROLE.USER],
    };

    const admin = {
      id: 7,
      username: 'admin',
      roles: [ROLE.ADMIN],
    };

    it('should return canDoAction method', () => {
      const userAcl = service.forUser(user);
      expect(userAcl.canDoAction).toBeDefined();
    });

    it('should return false when no role sepcific rules found', () => {
      service.canDo(ROLE.USER, [Action.Read]);
      const userAcl = service.forUser(admin);
      expect(userAcl.canDoAction(Action.Read)).toBeFalsy();
    });

    it('should return false when no action sepcific rules found', () => {
      service.canDo(ROLE.USER, [Action.Read]);
      const userAcl = service.forUser(user);
      expect(userAcl.canDoAction(Action.Create)).toBeFalsy();
    });

    it('should return true when role has action permission', () => {
      service.canDo(ROLE.USER, [Action.Read]);
      const userAcl = service.forUser(user);
      expect(userAcl.canDoAction(Action.Read)).toBeTruthy();
    });

    it('should return true when isResourceOwner is true', () => {
      const customOwnerRule = () => true;
      service.canDo(ROLE.USER, [Action.Manage], customOwnerRule);
      const userAcl = service.forUser(user);
      expect(userAcl.canDoAction(Action.Read)).toBeTruthy();
    });

    it('should return false when isResourceOwner is false', () => {
      const customOwnerRule = () => false;
      service.canDo(ROLE.USER, [Action.Manage], customOwnerRule);
      const userAcl = service.forUser(user);
      expect(userAcl.canDoAction(Action.Read)).toBeFalsy();
    });
  });
});
