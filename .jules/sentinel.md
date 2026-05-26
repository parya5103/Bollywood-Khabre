## 2024-05-17 - Fix Hardcoded Fallback Credentials and Secrets
**Vulnerability:** The admin login route and authentication middleware were falling back to hardcoded secrets (`admin`, `cinepulse2026`, `super_secret_jwt_key_2026`) when environment variables were absent.
**Learning:** This "fail-open" pattern allows attackers to potentially bypass authentication if the production server environment is misconfigured or fails to load `.env`. Hardcoded fallbacks are extremely dangerous and render environment isolation moot.
**Prevention:** Implement "fail-secure" practices. Check for the presence of required environment variables early (e.g., during startup or at the start of a route handler) and fail loudly (return a 500 error or crash the app) if they are missing. Never hardcode credentials in source code.
## 2026-05-20 - Fix ReDoS and DoS vulnerabilities in API queries
**Vulnerability:** The `newsRoutes.js` endpoints passed `q` and `category` parameters directly into `new RegExp(param, 'i')` without sanitization, and the `limit` parameter was unbounded.
**Learning:** This could allow a malicious user to crash the backend with a Regular Expression Denial of Service (ReDoS) payload, or exhaust server memory/DB resources by requesting a massive amount of records via `?limit=999999`.
**Prevention:** Always sanitize/escape user inputs before creating dynamic regular expressions. Add bounds checking to pagination and limit parameters to prevent data exhaustion attacks.
## 2025-05-26 - Add missing rate limit and input validation to admin login
**Vulnerability:** Admin authentication endpoint (`/api/admin/login`) lacked both rate limiting and input type validation for credentials.
**Learning:** Custom authentication endpoints created without frameworks like Passport or explicit middleware are prone to omitting basic protections like rate limiting and input validation, making them vulnerable to brute-force attacks and unexpected data types causing runtime errors.
**Prevention:** Always implement an in-memory or Redis-based rate limiter on authentication endpoints. Use robust input validation libraries (e.g. Joi, Zod) or strict type-checking before processing credentials.
