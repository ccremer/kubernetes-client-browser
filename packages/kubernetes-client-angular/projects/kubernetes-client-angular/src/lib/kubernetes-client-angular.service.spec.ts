import { TestBed } from '@angular/core/testing';

import { KubernetesClientAngularService } from './kubernetes-client-angular.service';

describe('KubernetesClientAngularService', () => {
  let service: KubernetesClientAngularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KubernetesClientAngularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
