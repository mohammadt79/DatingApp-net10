import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AccountService } from './account.service';

describe('AccountService', () => {
  let service: AccountService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [AccountService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AccountService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('marks the first login as a first-time user without flipping the current session greeting', () => {
    service.login({ username: 'alice', password: 'password123' }).subscribe();

    const req = httpMock.expectOne('http://localhost:5001/api/account/login');
    expect(req.request.method).toBe('POST');

    req.flush({ userName: 'alice', token: 'abc123' });

    expect(localStorage.getItem('hasLoggedInBefore')).toBe('true');
    expect(service.hasLoggedInBefore()).toBeFalse();
    expect(service.isLoggedIn()).toBeTrue();
    expect(service.currentUser()).toBe('alice');
  });
});
