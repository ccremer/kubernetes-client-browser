import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesClientAngularComponent } from './kubernetes-client-angular.component';

describe('KubernetesClientAngularComponent', () => {
  let component: KubernetesClientAngularComponent;
  let fixture: ComponentFixture<KubernetesClientAngularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesClientAngularComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesClientAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
