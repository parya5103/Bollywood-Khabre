## 2024-05-17 - Fix Hardcoded Fallback Credentials and Secrets
**Vulnerability:** The admin login route and authentication middleware were falling back to hardcoded secrets (`admin`, `cinepulse2026`, `super_secret_jwt_key_2026`) when environment variables were absent.
**Learning:** This "fail-open" pattern allows attackers to potentially bypass authentication if the production server environment is misconfigured or fails to load `.env`. Hardcoded fallbacks are extremely dangerous and render environment isolation moot.
**Prevention:** Implement "fail-secure" practices. Check for the presence of required environment variables early (e.g., during startup or at the start of a route handler) and fail loudly (return a 500 error or crash the app) if they are missing. Never hardcode credentials in source code.## 2024-05-17 - Missing Rate Limiting on Admin Login
**Vulnerability:** The `/api/admin/login` endpoint lacked rate limiting, making it susceptible to brute-force and credential stuffing attacks.
**Learning:** Even internal or "hidden" admin endpoints must be protected against automated attacks. Without rate limiting, an attacker could continuously guess passwords until successful.
**Prevention:** Always apply rate limiting middleware (like `express-rate-limit`) to authentication endpoints, establishing clear thresholds for acceptable login attempt frequencies.
