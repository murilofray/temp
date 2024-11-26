import { TestBed } from '@angular/core/testing';

import { DocumentoAlunoService } from './documento-aluno.service';

describe('DocumentoAlunoService', () => {
  let service: DocumentoAlunoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentoAlunoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
