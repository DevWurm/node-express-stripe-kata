/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StripeService } from './stripe.service';

describe('StripeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StripeService]
    });
  });

  it('should ...', inject([StripeService], (service: StripeService) => {
    expect(service).toBeTruthy();
  }));
});
