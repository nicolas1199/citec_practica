import { Test, TestingModule } from '@nestjs/testing';
import { ValidezDeDocumentoService } from './validez-de-documento.service';

describe('ValidezDeDocumentoService', () => {
  let service: ValidezDeDocumentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidezDeDocumentoService],
    }).compile();

    service = module.get<ValidezDeDocumentoService>(ValidezDeDocumentoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
