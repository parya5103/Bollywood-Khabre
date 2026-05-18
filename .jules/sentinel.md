## 2024-05-17 - Fix Hardcoded Fallback Credentials and Secrets
**Vulnerability:** The admin login route and authentication middleware were falling back to hardcoded secrets (`admin`, `cinepulse2026`, `super_secret_jwt_key_2026`) when environment variables were absent.
**Learning:** This "fail-open" pattern allows attackers to potentially bypass authentication if the production server environment is misconfigured or fails to load `.env`. Hardcoded fallbacks are extremely dangerous and render environment isolation moot.
**Prevention:** Implement "fail-secure" practices. Check for the presence of required environment variables early (e.g., during startup or at the start of a route handler) and fail loudly (return a 500 error or crash the app) if they are missing. Never hardcode credentials in source code.

## 2024-05-18 - NoSQL Regular Expression Injection (ReDoS)

**Vulnerability:** Found unescaped user input (`category` and `q` query parameters) being directly passed to `new RegExp()` in the MongoDB `Article.find()` queries within `backend/src/routes/newsRoutes.js`.
**Learning:** This exposes the application to NoSQL Regular Expression Denial of Service (ReDoS) and regex injection. Attackers could send specially crafted strings like `(((a+)*)*)+$` to stall the event loop or leak data using complex regular expressions. Since the backend handles unauthenticated news fetching, this represents a significant DoS vector.
**Prevention:** Always escape user-provided strings before using them to construct a `RegExp` object. Utilize a robust regex escaping function to safely replace characters with special meaning in regex contexts (`[.*+?^${}()|[\]\\]`).
