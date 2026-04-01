import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminCreateUserComponent } from './admin-create-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../../../services/auth.service';

describe('AdminCreateUserComponent', () => {
  let component: AdminCreateUserComponent;
  let fixture: ComponentFixture<AdminCreateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AdminCreateUserComponent,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getToken: () => 'fake-token'
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCreateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // important
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});