import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

// `jest` on its own needs the Angular test environment bootstrapped here.
// `ng test` (via @angular-builders/jest) has already done it, so ignore the
// "base providers already set" error in that path.
try {
  setupZoneTestEnv();
} catch {
  /* already initialised by the Angular CLI test builder */
}
