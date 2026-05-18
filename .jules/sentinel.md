## 2024-05-18 - Missing Input Length Constraints in MongoDB Schema
**Vulnerability:** String fields in Mongoose schema `Article.js` lacked `maxlength` properties.
**Learning:** By omitting length restrictions, the application was susceptible to Denial of Service (DoS) from attackers submitting payloads with massive strings to exhaust memory/disk or degrade performance.
**Prevention:** Always add `maxlength` limits to String inputs in database schemas to bound resource consumption on the DB and server.
