import { Test, TestingModule } from '@nestjs/testing';
import { ToolsRepository } from './tools.repository';

describe('ToolsRepository', () => {
  let provider: ToolsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ToolsRepository],
    }).compile();

    provider = module.get<ToolsRepository>(ToolsRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
