import { Test, TestingModule } from '@nestjs/testing';
import { EditableController } from './editable.controller';

describe('EditableController', () => {
  let controller: EditableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EditableController],
    }).compile();

    controller = module.get<EditableController>(EditableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
