import { getHelmetConfig, getCorsConfig, getCurrentEnvironment } from './helmet.config';

describe('Helmet Configuration', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  describe('getCurrentEnvironment', () => {
    it('should return "production" when NODE_ENV is production', () => {
      process.env.NODE_ENV = 'production';
      expect(getCurrentEnvironment()).toBe('production');
    });

    it('should return "development" when NODE_ENV is development', () => {
      process.env.NODE_ENV = 'development';
      expect(getCurrentEnvironment()).toBe('development');
    });

    it('should return "development" when NODE_ENV is not set', () => {
      delete process.env.NODE_ENV;
      expect(getCurrentEnvironment()).toBe('development');
    });

    it('should return "development" for any other NODE_ENV value', () => {
      process.env.NODE_ENV = 'test';
      expect(getCurrentEnvironment()).toBe('development');
    });
  });

  describe('getHelmetConfig', () => {
    describe('Development Configuration', () => {
      it('should return valid helmet configuration for development', () => {
        const config = getHelmetConfig('development');

        expect(config).toBeDefined();
        expect(config.contentSecurityPolicy).toBeDefined();
        expect(config.noSniff).toBe(true);
        expect(config.hidePoweredBy).toBe(true);
      });

      it('should include localhost in connectSrc for development', () => {
        const config = getHelmetConfig('development');
        const csp = config.contentSecurityPolicy;

        expect(csp).toBeDefined();
        if (csp && typeof csp === 'object' && 'directives' in csp) {
          const directives = csp.directives;
          expect(directives?.connectSrc).toContain('http://localhost:4200');
          expect(directives?.connectSrc).toContain('http://127.0.0.1:4200');
          expect(directives?.connectSrc).toContain('ws://localhost:4200');
          expect(directives?.connectSrc).toContain('ws://127.0.0.1:4200');
        }
      });

      it('should allow unsafe-inline styles in development', () => {
        const config = getHelmetConfig('development');
        const csp = config.contentSecurityPolicy;

        if (csp && typeof csp === 'object' && 'directives' in csp) {
          const directives = csp.directives;
          expect(directives?.styleSrc).toContain("'unsafe-inline'");
        }
      });

      it('should not enable HSTS in development', () => {
        const config = getHelmetConfig('development');
        expect(config.hsts).toBe(false);
      });

      it('should not include upgradeInsecureRequests in development', () => {
        const config = getHelmetConfig('development');
        const csp = config.contentSecurityPolicy;

        if (csp && typeof csp === 'object' && 'directives' in csp) {
          const directives = csp.directives;
          expect(directives?.upgradeInsecureRequests).toBeUndefined();
        }
      });
    });

    describe('Production Configuration', () => {
      it('should return valid helmet configuration for production', () => {
        const config = getHelmetConfig('production');

        expect(config).toBeDefined();
        expect(config.contentSecurityPolicy).toBeDefined();
        expect(config.noSniff).toBe(true);
        expect(config.hidePoweredBy).toBe(true);
      });

      it('should include production frontend URL in connectSrc', () => {
        const config = getHelmetConfig('production');
        const csp = config.contentSecurityPolicy;

        if (csp && typeof csp === 'object' && 'directives' in csp) {
          const directives = csp.directives;
          expect(directives?.connectSrc).toContain(
            'https://bills-tracker-frontend-delta.vercel.app',
          );
        }
      });

      it('should not include localhost in production connectSrc', () => {
        const config = getHelmetConfig('production');
        const csp = config.contentSecurityPolicy;

        if (csp && typeof csp === 'object' && 'directives' in csp) {
          const directives = csp.directives;
          expect(directives?.connectSrc).not.toContain('http://localhost:4200');
          expect(directives?.connectSrc).not.toContain('ws://localhost:4200');
        }
      });

      it('should enable HSTS in production', () => {
        const config = getHelmetConfig('production');

        expect(config.hsts).toBeDefined();
        expect(config.hsts).not.toBe(false);

        if (typeof config.hsts === 'object') {
          expect(config.hsts.maxAge).toBe(31536000); // 1 year
          expect(config.hsts.includeSubDomains).toBe(true);
          expect(config.hsts.preload).toBe(true);
        }
      });

      it('should include upgradeInsecureRequests in production', () => {
        const config = getHelmetConfig('production');
        const csp = config.contentSecurityPolicy;

        if (csp && typeof csp === 'object' && 'directives' in csp) {
          const directives = csp.directives;
          expect(directives?.upgradeInsecureRequests).toBeDefined();
        }
      });
    });

    describe('Common Security Headers', () => {
      it.each(['development', 'production'] as const)(
        'should set frameAncestors to none in %s',
        (env) => {
          const config = getHelmetConfig(env);
          const csp = config.contentSecurityPolicy;

          if (csp && typeof csp === 'object' && 'directives' in csp) {
            const directives = csp.directives;
            expect(directives?.frameAncestors).toContain("'none'");
          }
        },
      );

      it.each(['development', 'production'] as const)(
        'should set objectSrc to none in %s',
        (env) => {
          const config = getHelmetConfig(env);
          const csp = config.contentSecurityPolicy;

          if (csp && typeof csp === 'object' && 'directives' in csp) {
            const directives = csp.directives;
            expect(directives?.objectSrc).toContain("'none'");
          }
        },
      );

      it.each(['development', 'production'] as const)(
        'should set defaultSrc to self in %s',
        (env) => {
          const config = getHelmetConfig(env);
          const csp = config.contentSecurityPolicy;

          if (csp && typeof csp === 'object' && 'directives' in csp) {
            const directives = csp.directives;
            expect(directives?.defaultSrc).toContain("'self'");
          }
        },
      );

      it.each(['development', 'production'] as const)('should enable noSniff in %s', (env) => {
        const config = getHelmetConfig(env);
        expect(config.noSniff).toBe(true);
      });

      it.each(['development', 'production'] as const)(
        'should hide powered by header in %s',
        (env) => {
          const config = getHelmetConfig(env);
          expect(config.hidePoweredBy).toBe(true);
        },
      );

      it.each(['development', 'production'] as const)(
        'should set frameguard to deny in %s',
        (env) => {
          const config = getHelmetConfig(env);
          expect(config.frameguard).toEqual({ action: 'deny' });
        },
      );

      it.each(['development', 'production'] as const)(
        'should disable DNS prefetch in %s',
        (env) => {
          const config = getHelmetConfig(env);
          expect(config.dnsPrefetchControl).toEqual({ allow: false });
        },
      );

      it.each(['development', 'production'] as const)('should set referrer policy in %s', (env) => {
        const config = getHelmetConfig(env);
        expect(config.referrerPolicy).toEqual({
          policy: 'strict-origin-when-cross-origin',
        });
      });
    });

    describe('Environment Variable Support', () => {
      it('should use default URL when FRONTEND_URL_PROD is not set', () => {
        const config = getHelmetConfig('production');
        const csp = config.contentSecurityPolicy;

        if (csp && typeof csp === 'object' && 'directives' in csp) {
          const directives = csp.directives;
          expect(directives?.connectSrc).toContain(
            'https://bills-tracker-frontend-delta.vercel.app',
          );
        }
      });
    });
  });

  describe('getCorsConfig', () => {
    describe('Development Configuration', () => {
      it('should return valid CORS configuration for development', () => {
        const config = getCorsConfig('development');

        expect(config).toBeDefined();
        expect(config.origin).toBeDefined();
        expect(config.credentials).toBe(true);
        expect(config.methods).toBeDefined();
        expect(config.allowedHeaders).toBeDefined();
      });

      it('should include localhost origins for development', () => {
        const config = getCorsConfig('development');

        expect(config.origin).toEqual(['http://localhost:4200', 'http://127.0.0.1:4200']);
      });

      it('should allow credentials in development', () => {
        const config = getCorsConfig('development');
        expect(config.credentials).toBe(true);
      });

      it('should allow standard HTTP methods in development', () => {
        const config = getCorsConfig('development');
        expect(config.methods).toEqual(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']);
      });

      it('should allow standard headers in development', () => {
        const config = getCorsConfig('development');
        expect(config.allowedHeaders).toEqual([
          'Content-Type',
          'Authorization',
          'X-Requested-With',
        ]);
      });
    });

    describe('Production Configuration', () => {
      it('should return valid CORS configuration for production', () => {
        const config = getCorsConfig('production');

        expect(config).toBeDefined();
        expect(config.origin).toBeDefined();
        expect(config.credentials).toBe(true);
      });

      it('should include production frontend URL', () => {
        const config = getCorsConfig('production');

        expect(config.origin).toEqual(['https://bills-tracker-frontend-delta.vercel.app']);
      });

      it('should not include localhost in production', () => {
        const config = getCorsConfig('production');
        const origins = config.origin as string[];

        expect(origins).not.toContain('http://localhost:4200');
        expect(origins).not.toContain('http://127.0.0.1:4200');
      });

      it('should allow credentials in production', () => {
        const config = getCorsConfig('production');
        expect(config.credentials).toBe(true);
      });

      it('should allow standard HTTP methods in production', () => {
        const config = getCorsConfig('production');
        expect(config.methods).toEqual(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']);
      });
    });

    describe('Consistency with Helmet CSP', () => {
      it('should use same origins as Helmet CSP in development', () => {
        const corsConfig = getCorsConfig('development');
        const helmetConfig = getHelmetConfig('development');
        const csp = helmetConfig.contentSecurityPolicy;

        if (csp && typeof csp === 'object' && 'directives' in csp) {
          const directives = csp.directives;
          const connectSrc = directives?.connectSrc || [];

          // CORS origins should be included in CSP connectSrc
          const corsOrigins = corsConfig.origin as string[];
          corsOrigins.forEach((origin) => {
            expect(connectSrc).toContain(origin);
          });
        }
      });

      it('should use same origins as Helmet CSP in production', () => {
        const corsConfig = getCorsConfig('production');
        const helmetConfig = getHelmetConfig('production');
        const csp = helmetConfig.contentSecurityPolicy;

        if (csp && typeof csp === 'object' && 'directives' in csp) {
          const directives = csp.directives;
          const connectSrc = directives?.connectSrc || [];

          // CORS origins should be included in CSP connectSrc
          const corsOrigins = corsConfig.origin as string[];
          corsOrigins.forEach((origin) => {
            expect(connectSrc).toContain(origin);
          });
        }
      });
    });
  });
});
