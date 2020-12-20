import { Test, TestingModule } from '@nestjs/testing';
import { BaseAclService } from './acl.service';

class MockAclService extends BaseAclService {}

describe('AclService', () => {
  let service: BaseAclService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockAclService],
    }).compile();

    service = module.get<MockAclService>(MockAclService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
