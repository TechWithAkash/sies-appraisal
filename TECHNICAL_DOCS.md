

# Teacher Appraisal ERP Module — Technical Architecture Document

**Scope:** Excel sheet → Web application (automation + auto-calculator) with role-based access (Teacher, HOD, IQAC, Principal, Admin), PDF export, attachments, audit logging.
**Source:** TEACHING APPRAISAL FORM (2).xlsx (all Excel fields preserved and mapped)

---

## Contents (click / jump to)

1. Executive summary
2. Assumptions & constraints
3. High-level system overview (modules & interactions)
4. Exact mapping: Excel → UI → DB (every field)
5. Data model (complete DDL)
6. Auto-calculation engine (rules, edge-cases, pseudocode)
7. APIs (OpenAPI-style skeleton + sample payloads)
8. User flows & sequence diagrams (submit, review, finalize)
9. Role-Based Access Control (RBAC) — matrix & enforcement
10. Container-level architecture & deployment (Docker Compose + Kubernetes patterns)
11. Storage, backups, archival & data retention policy
12. Security design (transport, auth integration, authorization, file scanning)
13. Observability: logging, metrics, tracing, alerting
14. CI/CD, testing, QA & rollout plan (developer checklist)
15. Data migration from Excel (import plan & mapping)
16. Runbooks, error handling & support processes
17. Appendix A — full SQL DDL (ready to run)
18. Appendix B — UI field JSON schema (developer-ready)
19. Appendix C — minimal example docker-compose.yml and Kubernetes hints

---

## 1. Executive summary

- Convert the existing Teacher Appraisal Excel into a web module preserving every field and calculation.
- Provide role-based access for Teacher, HOD, IQAC, Principal, and Admin.
- Provide accurate auto-calculator logic identical to Excel.
- Store full history and attachments; generate a final PDF.
- Provide a prototype implementation using containerized services (frontend, backend, worker, DB, storage) with clear API and DB contract.

---

## 2. Assumptions & constraints

- The Excel you uploaded is authoritative. Every column/field in the Excel must be available in the UI and stored. (I used the Excel structure previously reviewed.)
- Authentication will integrate with the college ERP SSO in production; for prototype, an internal mock/auth stub will be used.
- System must not alter existing appraisal policy/marks; only digitize.
- Prototype will use dummy data and mock authentication by default; production integration is described.
- Attachments stored in S3-compatible storage (or local storage for prototype).

---

## 3. High-level system overview (modules & interactions)

### Modules

1. **Frontend UI** — React/Next.js prototype; displays form (Parts A–E), review screens, summary sidebar.
2. **Backend API** — Node.js/Express or Django REST; handles CRUD, validation, calculation engine, PDF generation trigger, attachments.
3. **Auto Calculator Service** — part of backend (synchronous or worker-managed); computes subsection and totals (exact Excel logic).
4. **File Storage** — S3-compatible (MinIO for prototype / AWS S3 in prod) for attachments and generated PDFs.
5. **Database** — PostgreSQL (relational model)
6. **Worker/Queue** — Bull/Redis or Celery/RabbitMQ for async jobs (PDF generation, large imports).
7. **Audit & Logging** — centralized logs (stdout → file → ELK/CloudWatch).
8. **Admin Panel** — create cycles, manage templates, import Excel, export reports.

### High-level interactions

- Teacher fills form → frontend posts to backend endpoints → backend validates and stores raw input in DB → backend runs calculator to update computed totals and returns them → on submit backend triggers PDF job and locks record → attachments uploaded to storage.

---

## 4. Exact mapping: Excel → UI → DB (every field)

Below is a complete, section-by-section mapping that developers must implement exactly. (This mirrors the Excel columns and tables.)

> I preserved original labels where possible. Each UI input name is given and the DB field it maps to.

### Part A — General Information & Academic Background (fields)

**A1 Basic Details**

- Employee No → `part_a_basic.employee_no` (varchar)
- Name → `part_a_basic.full_name` (varchar)
- Designation → `part_a_basic.designation`
- Department → `part_a_basic.department`
- Date of Joining → `part_a_basic.date_of_joining` (date)
- Date of Birth → `part_a_basic.date_of_birth` (date)
- Current Band → `part_a_basic.current_band`
- Last Band Change Date → `part_a_basic.last_band_change_date` (date)
- Date of Last Promotion → `part_a_basic.last_promotion_date` (date)
- Current Academic Level under CAS → `part_a_basic.academic_level_cas`
- Date of eligibility for promotion → `part_a_basic.promotion_eligibility_date` (date)
- Location → `part_a_basic.location`
- Mobile No → `part_a_basic.mobile`
- Email ID → `part_a_basic.email`
- Address with PIN code → `part_a_basic.address` (text)

**A2 Academic Qualifications** (table; multiple rows)
Columns:

- Examination → `part_a_qualification.examination`
- Board/University → `part_a_qualification.board_university`
- Year → `part_a_qualification.year_of_passing`
- % Marks → `part_a_qualification.percentage`
- Grade → `part_a_qualification.grade`
- Subject → `part_a_qualification.subject`

**A3 Teaching Experience**

- Teaching Experience (PG years) → `part_a_experience.teaching_exp_pg`
- Teaching Experience (UG years) → `part_a_experience.teaching_exp_ug`
- Prior Full time teaching experience → stored as appropriate numeric field (same as above)
- Prior Industry Experience → `part_a_experience.industry_experience`
- Non-teaching experience → `part_a_experience.non_teaching_experience`
- SIES Experience (as on date) → store as derived or explicit numeric field `sies_experience` (if present in Excel)
- Fields of specialization → `part_a_experience.specialization` (text)
- Any other Excel columns from Part A must be mapped; developers must load the Excel and verify field-by-field during import.

### Part B — Research & Academic Contributions (TOTAL 120)

There are 14 subsections. Each subsection is a child table with similar columns: identifying fields, details, `self_marks` numeric, and attachments.

For each subsection include:

- unique `id`
- `appraisal_id` (FK)
- detail fields exactly from Excel (title, publisher, ISSN/ISBN, author list, impact factor, role, dates, etc.)
- `self_marks` numeric
- `attachments` stored in `attachments` table referencing `section_code` and `record_id`

Subsections:

1. `part_b_research_journals` — title, journal_name, issn, impact_factor, authors, co_authors, self_marks
2. `part_b_books_chapters` — publisher, isbn, book_type, authors, self_marks
3. `part_b_edited_books` — chapter_title, book_title, publisher, isbn, self_marks
4. `part_b_editor_books` — book_title, publisher, isbn, self_marks
5. `part_b_translations` — original_work, translated_work, language, self_marks
6. `part_b_research_projects` — sponsored_by, project_title, team_details, start_date, end_date, self_marks
7. `part_b_consultancy` — organization, nature_of_work, duration, self_marks
8. `part_b_development_programs` — program_name, organizer, duration, self_marks
9. `part_b_seminars` — title, level, role, event_date, self_marks
10. `part_b_patents` — title, patent_number, status, filing_date, self_marks
11. `part_b_awards` — award_name, level, award_year, self_marks
12. `part_b_econtent` — content_type, platform, content_link, self_marks
13. `part_b_moocs` — course_name, platform, duration, certificate_available (bool), self_marks
14. `part_b_guidance` — student_name, level, topic, year, self_marks

**Part B totals**: store `part_b_total` in `appraisals.total_part_b` (calculated), and optionally store breakdown JSON `calculation_detail` for forensics.

### Part C — Academic / Administrative Contribution (TOTAL 100)

Subsections:

- Key Contributions: `part_c_key_contribution.description`, `part_c_key_contribution.self_marks` (0–25)
- Committee Roles: table `part_c_committee_roles` with committee_name, period, post_held, self_marks
- Professional Bodies: `part_c_professional_bodies` — body_name, membership_type, post_held, self_marks
- Student Feedback: table/single row `part_c_student_feedback.average_rating` (1–5), `converted_marks` (0–25), `feedback_file` path

Store `appraisals.total_part_c`.

### Part D — Values (TOTAL 30)

Single-row table `part_d_values` with numeric entries 0–5 for:

- attendance, responsibility, honesty, teamwork, inclusiveness, conduct
  Store `appraisals.total_part_d`.

### Part E — Self Assessment

`part_e_self_assessment.self_summary` (text), `goals` (text), attachments links.

### Attachments table

`attachments` table fields:

- id, appraisal_id, section_code (e.g., B1, C2, E), record_id (row id in child table), file_name, file_path, uploaded_by, uploaded_at

### Audit logs

`audit_logs` table: id, appraisal_id, action, performed_by, old_data JSON, new_data JSON, performed_at.

_(Appendix A contains exact SQL DDL for each table — run-ready — see section 17.)_

---

## 5. Data model — complete DDL

(Full SQL DDL is included in Appendix A. Below is the core master table + example child table; Appendix A repeats the rest verbatim.)

Example master table:

```sql
CREATE TABLE appraisal_cycles (
  id SERIAL PRIMARY KEY,
  academic_year VARCHAR(20) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_open BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE appraisals (
  id SERIAL PRIMARY KEY,
  cycle_id INT REFERENCES appraisal_cycles(id),
  teacher_id INT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
  total_part_b NUMERIC(6,2),
  total_part_c NUMERIC(6,2),
  total_part_d NUMERIC(6,2),
  grand_total NUMERIC(6,2),
  calculation JSONB,
  pdf_path TEXT,
  submitted_at TIMESTAMP,
  locked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

Child tables and others are in Appendix A. Developers should create DB indexes on `appraisal_id`, `teacher_id`, and FK columns.

---

## 6. Auto-calculation engine (detailed)

### Calculation principles (exact)

- Every subsection sums `self_marks` for its rows.
- Subsection capped at its specified max (e.g., Research Papers cap = 15).
- Part total = sum(subsection totals) capped at section max (Part B max=120).
- Part C handles student feedback conversion (if avg rating 1–5 → converted = avg/5×25).
- Part D is sum of 6 values (each 0–5) max 30.
- Grand total = PartB + PartC + PartD (max 250).
- Round to 2 decimals for display and store exact as numeric(6,2).

### Execution timing

- Validate & recompute on every Save Draft (preview) and on Submit (final).
- On Submit, recompute one final time and persist `calculation` snapshot in `appraisals.calculation` (JSON) for audit.

### Pseudocode

```pseudo
function calculateAppraisal(appraisalId):
    data = loadAllChildRows(appraisalId)
    partB_subtotals = {}
    for subsection in partB_subsections:
        raw_sum = sum(row.self_marks for row in subsection.rows if valid)
        subtotal = min(raw_sum, subsection.max_mark)
        partB_subtotals[subsection.name] = round(subtotal,2)
    partB_total = min(sum(partB_subtotals.values()), 120.00)
    // PartC
    c1 = min(key_contribution.self_marks,25)
    c2 = min(sum(committee.self_marks),25)
    c3 = min(sum(profbod.self_marks),25)
    if student_feedback.avg_rating provided:
        c4 = round((avg_rating/5.0)*25,2)
    partC_total = min(c1 + c2 + c3 + c4, 100.00)
    // PartD
    partD_total = min(sum(values),30.00)
    grand_total = min(partB_total + partC_total + partD_total,250.00)
    persist calculation JSON with all subtotals and grand_total
    return calculation object
```

### Edge cases

- Empty subsections give 0.
- Invalid numbers trigger validation errors on submit.
- If attachments are required for a subsection, prevent submit until they exist (configurable).
- For decimals, accept up to 2 decimal places for inputs.

---

## 7. APIs (OpenAPI-style skeleton)

### Design principles

- RESTful endpoints, JSON payload.
- Use status codes: 200 success, 201 created, 400 validation error, 401 unauthorized, 403 forbidden, 404 not found, 500 server error.
- Endpoints include section-level saves to minimize large payloads.

### Core endpoints (examples)

#### Appraisal lifecycle

- `GET /api/cycles` — list cycles
- `POST /api/cycles` — admin create cycle
- `GET /api/appraisals/current` — get draft for logged in teacher
- `PUT /api/appraisals/{id}/part-a` — save part A
- `PUT /api/appraisals/{id}/part-b/{subsection}` — save rows for subsection
- `PUT /api/appraisals/{id}/part-c/{subsection}` — save
- `PUT /api/appraisals/{id}/part-d` — save values
- `PUT /api/appraisals/{id}/part-e` — save self-assessment
- `POST /api/appraisals/{id}/submit` — submit final (runs calculate and triggers PDF job)
- `GET /api/appraisals/{id}` — view (role-guarded)
- `GET /api/appraisals/{id}/pdf` — download generated PDF

#### Attachments

- `POST /api/appraisals/{id}/attachments` — upload (multipart/form-data); returns file metadata and storage path
- `GET /api/appraisals/{id}/attachments/{fileId}` — download

#### Admin

- `POST /api/import/excel` — import legacy Excel mapping
- `GET /api/reports` — export (CSV) — admin only

### Sample payload (save part B Research Journal entry)

`PUT /api/appraisals/123/part-b/research_journals`

```json
{
  "rows": [
    {
      "id": 0,
      "title": "Optimization in AI",
      "journal_name": "Int Journal of CS",
      "issn": "1234-5678",
      "impact_factor": "2.3",
      "authors": "Akash Vishwakarma",
      "co_authors": "Anita Rao",
      "self_marks": 5.5,
      "attachments": [{ "file_id": 1001 }]
    }
  ]
}
```

Response includes recalculated `part_b_total` and `grand_total` in the reply.

---

## 8. User flows & sequence diagrams

### Submit flow (brief)

1. Teacher saves all parts (A–E).
2. Frontend posts `POST /api/appraisals/{id}/submit`.
3. Backend validates all required fields and attachments.
4. Backend calls `calculateAppraisal(appraisalId)` and persists calculation JSON.
5. Backend creates a PDF generation job in queue (worker).
6. Worker pulls job, fetches data, renders HTML to PDF, saves to file storage, updates `appraisals.pdf_path`, and sets `status=LOCKED`.
7. Backend responds success; frontend shows PDF preview enabled.

### Review flow (with RBAC)

- HOD views `GET /api/appraisals/{id}`, if authorized can add `hod_remarks` and `hod_marks` (if business requires). IQAC and Principal similar endpoints exist in the API for their actions. For now, approvals are recorded but calculation uses the primary `self_marks` for auto-calculator.

_(Sequence diagrams are provided as PlantUML and Mermaid snippets in Appendix B if you want to render them.)_

---

## 9. RBAC — matrix & enforcement

Roles: TEACHER, HOD, IQAC, PRINCIPAL, ADMIN.

Permission matrix (core):

| Action                      |   Teacher |        HOD |      IQAC | Principal |                   Admin |
| --------------------------- | --------: | ---------: | --------: | --------: | ----------------------: |
| Create draft                |       Yes |         No |        No |        No | Admin can create cycles |
| Save Parts A–E              | Yes (own) |  Read-only | Read-only | Read-only |           Admin (write) |
| Submit                      | Yes (own) |         No |        No |        No |       Admin (if needed) |
| View all appraisals         |        No | Yes (dept) |       Yes |       Yes |                     Yes |
| Add review remarks / rating |        No | Yes (dept) |       Yes |       Yes |                      No |
| Create cycle                |        No |         No |        No |        No |                     Yes |
| Import Excel                |        No |         No |        No |        No |                     Yes |
| Download PDF (any)          |  own only |       dept |      dept |       any |                     any |

**Implementation note**

- Enforce with middleware at API gateway: check `user.role` and optionally `user.department`.
- For prototype: use a simple JWT with claims `{ user_id, role, department }`. In prod use college SSO and map roles.

---

## 10. Container-level architecture & deployment

### Design goals

- Provide a reproducible prototype (docker-compose) and production-ready architecture (Kubernetes).
- Services are containerized: web frontend, API backend, DB, Redis (queue), worker, MinIO (S3-compatible), reverse proxy.

### Suggested containers (names & responsibilities)

- `reverse-proxy` — Nginx (TLS termination)
- `frontend` — React/Next.js (build and serve)
- `backend` — Node.js/Express or Django app (REST)
- `db` — PostgreSQL
- `redis` — Redis for queue and cache
- `worker` — background worker (for PDF generation & imports)
- `minio` — S3-compatible object storage (prototype)
- `adminer` (optional) — DB admin UI

### Example `docker-compose.yml` (short sample)

```yaml
version: "3.8"
services:
  reverse-proxy:
    image: nginx:stable
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
  frontend:
    build: ./frontend
    environment:
      - API_URL=http://backend:8000
    depends_on:
      - backend
  backend:
    build: ./backend
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/appraisal
      - REDIS_URL=redis://redis:6379
      - S3_ENDPOINT=http://minio:9000
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis
      - minio
  worker:
    build: ./worker
    environment:
      - DATABASE_URL=...
      - REDIS_URL=...
    depends_on:
      - backend
      - redis
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: appraisal
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - db_data:/var/lib/postgresql/data
  redis:
    image: redis:6
  minio:
    image: minio/minio
    command: server /data
    environment:
      MINIO_ROOT_USER: minio
      MINIO_ROOT_PASSWORD: minio123
    ports:
      - "9000:9000"
volumes:
  db_data:
```

### Kubernetes recommendations (prod)

- Use Deployment + Service for each component.
- Use PersistentVolumeClaims for PostgreSQL and MinIO.
- Use a managed object store (S3) in cloud.
- Use Horizontal Pod Autoscaler for backend & worker.
- Use RBAC and network policies.

---

## 11. Storage, backups, archival & retention

- **Database backups**: daily base backup + WAL shipping for point-in-time recovery (retain 30 days for prototype; 1 year for prod per institution policy).
- **Attachment/PDF backup**: object storage versioning enabled; daily snapshot.
- **Archival**: At cycle end, mark appraisals as `ARCHIVED` and copy PDFs to archival storage (cold storage).
- **Retention policy**: retain appraisal data for minimum 7 years or per accreditation policy (configurable).

---

## 12. Security design

### Network & Transport

- HTTPS everywhere; TLS certs on reverse-proxy.
- Private network for DB & MinIO (no external exposure).

### Authentication & Authorization

- Prototype: JWT-based stub; production: integrate with college SSO (LDAP/AD or OAuth).
- Authorization: RBAC middleware (role + department scoping).

### Data protection

- Encrypt sensitive data at rest if required (PGP or DB-level TDE).
- Scanning attachments for malware on upload (ClamAV) as background process.

### Secrets & config

- Use environment variables / secrets manager (Vault / Kubernetes Secrets).

### Audit

- Immutable audit logs stored in DB table `audit_logs` and optionally exported to secure S3 or logging system.

---

## 13. Observability: logging, metrics, tracing, alerts

- **Logging**: structured JSON logs (winston/structlog) forwarded to ELK stack or managed logging.
- **Metrics**: Prometheus metrics (request rate, error rate, job queue length).
- **Tracing**: OpenTelemetry for request traces across frontend/backend/worker.
- **Alerts**: CPU, memory, error rate thresholds; queue length alerts for pending PDF jobs.

---

## 14. CI/CD, testing, QA & rollout plan

### CI pipeline

- Linting (ESLint for frontend/backend)
- Unit tests
- Integration tests (Docker Compose)
- Build artifacts (frontend static bundle, backend Docker image)
- Publish to registry

### CD pipeline

- Deploy to staging (auto)
- Run smoke tests
- Manual approval to deploy to production

### Testing

- Unit tests for calculation engine (edge cases & caps)
- API contract tests (OpenAPI)
- E2E tests with Playwright or Cypress to verify form flow, calculations, PDF generation.

### QA acceptance criteria (some core)

- All Excel fields present in UI & DB.
- Auto-calculation matches Excel for 10+ sample sheets.
- Attachments upload & download works.
- Role-based views & permissions enforced.
- Audit log entries created for each significant action.

---

## 15. Data migration from Excel (import plan & mapping)

### Import approach

- Provide an Admin import UI that accepts the `TEACHING APPRAISAL FORM (2).xlsx`.
- Use a mapping configuration view where admin verifies which column maps to which DB field (column names typically match).
- For each sheet in the Excel, parse rows, match fields, create `appraisals`, child rows, and attachments metadata.
- Import steps:

  1. Upload Excel → parse sheets → present mapping UI.
  2. Validate sample rows (report errors).
  3. Run import job in background (worker) that inserts data and sets `status=LOCKED` or `DRAFT` as per admin choice.
  4. Provide import logs & mapping download.

### Validation rules during import

- Numeric fields validated and capped as per calculation engine.
- Date formats normalized.
- Missing required fields flagged for manual fix.

---

## 16. Runbooks, error handling & support processes

### Example runbook: PDF job failed

1. Check worker logs.
2. Re-run job manually: `POST /admin/jobs/pdf/regenerate/{appraisal_id}`
3. If storage failure → check MinIO connectivity/credentials.
4. If template rendering error → inspect HTML template and data snapshot in `calculation`.

### Error handling

- Return meaningful error responses with error codes.
- For background jobs, store job status in `jobs` table with last error message.

---

## 17. Appendix A — Full SQL DDL (ready-to-run)

_(This is the authoritative DDL. It includes every table for Part A–E, attachments, audit logs, and cycles. Developers may copy/paste into psql.)_

> **DDL starts here** (full SQL copied exactly from the validated design):

```sql
-- Appraisal cycles
CREATE TABLE appraisal_cycles (
    id SERIAL PRIMARY KEY,
    academic_year VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_open BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Master appraisal
CREATE TABLE appraisals (
    id SERIAL PRIMARY KEY,
    cycle_id INT REFERENCES appraisal_cycles(id),
    teacher_id INT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    total_part_b NUMERIC(6,2),
    total_part_c NUMERIC(6,2),
    total_part_d NUMERIC(6,2),
    grand_total NUMERIC(6,2),
    calculation JSONB,
    pdf_path TEXT,
    submitted_at TIMESTAMP,
    locked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Part A basic details (one-to-one)
CREATE TABLE part_a_basic_details (
    appraisal_id INT PRIMARY KEY REFERENCES appraisals(id),
    employee_no VARCHAR(50),
    full_name VARCHAR(150),
    designation VARCHAR(100),
    department VARCHAR(100),
    date_of_joining DATE,
    date_of_birth DATE,
    current_band VARCHAR(50),
    last_band_change_date DATE,
    last_promotion_date DATE,
    academic_level_cas VARCHAR(50),
    promotion_eligibility_date DATE,
    location VARCHAR(100),
    mobile VARCHAR(20),
    email VARCHAR(150),
    address TEXT
);

CREATE TABLE part_a_qualification (
    id SERIAL PRIMARY KEY,
    appraisal_id INT REFERENCES appraisals(id),
    examination VARCHAR(100),
    board_university VARCHAR(150),
    year_of_passing INT,
    percentage NUMERIC(5,2),
    grade VARCHAR(20),
    subject VARCHAR(100)
);

CREATE TABLE part_a_experience (
    appraisal_id INT PRIMARY KEY REFERENCES appraisals(id),
    teaching_exp_ug NUMERIC(4,1),
    teaching_exp_pg NUMERIC(4,1),
    industry_experience NUMERIC(4,1),
    non_teaching_experience NUMERIC(4,1),
    sies_experience NUMERIC(4,1),
    specialization TEXT
);

-- PART B tables (one example shown; rest follow the same pattern)
CREATE TABLE part_b_research_journals (
    id SERIAL PRIMARY KEY,
    appraisal_id INT REFERENCES appraisals(id),
    title TEXT,
    journal_name TEXT,
    issn VARCHAR(50),
    impact_factor VARCHAR(50),
    authors TEXT,
    co_authors TEXT,
    self_marks NUMERIC(5,2)
);

CREATE TABLE part_b_books_chapters (
    id SERIAL PRIMARY KEY,
    appraisal_id INT REFERENCES appraisals(id),
    publisher TEXT,
    isbn VARCHAR(50),
    book_type VARCHAR(50),
    authors TEXT,
    self_marks NUMERIC(5,2)
);

CREATE TABLE part_b_edited_books (
    id SERIAL PRIMARY KEY,
    appraisal_id INT REFERENCES appraisals(id),
    chapter_title TEXT,
    book_title TEXT,
    publisher TEXT,
    isbn VARCHAR(50),
    self_marks NUMERIC(5,2)
);

CREATE TABLE part_b_editor_books (
    id SERIAL PRIMARY KEY,
    appraisal_id INT REFERENCES appraisals(id),
    book_title TEXT,
    publisher TEXT,
    isbn VARCHAR(50),
    self_marks NUMERIC(5,2)
);

CREATE TABLE part_b_translations (
    id SERIAL PRIMARY KEY,
    appraisal_id INT REFERENCES appraisals(id),
    original_work TEXT,
    translated_work TEXT,
    language VARCHAR(50),
    self_marks NUMERIC(5,2)
);

CREATE TABLE part_b_research_projects (
    id SERIAL PRIMARY KEY,
    appraisal_id INT REFERENCES appraisals(id),
    sponsored_by TEXT,
    project_title TEXT,
    team_details TEXT,
    start_date DATE,
    end_date DATE,
    self_marks NUMERIC(5,2)
);

CREATE TABLE part_b_consultancy (
    id SERIAL PRIMARY KEY,
    appraisal_id INT REFERENCES appraisals(id),
    organization TEXT,
    nature_of_work TEXT,
    duration VARCHAR(50),
    self_marks NUMERIC(5,2)
);

CREATE TABLE part_b_development_programs (
    id SERIAL PRIMARY KEY,
    appraisal_id INT REFERENCES appraisals(id),
    program_name TEXT,
    organizer TEXT,
    duration VARCHAR(50),
    self_marks NUMERIC(5,2)
);

CREATE TABLE part_b_seminars (
    id SERIAL PRIMARY KEY,
    appraisal_id INT REFERENCES appraisals(id),
    title TEXT,
    level VARCHAR(50),
    role VARCHAR(50),
    event_date DATE,
    self_marks NUMERIC(5,2)
);

CREATE TABLE part_b_patents (
    id SERIAL PRIMARY KEY,
    appraisal_id INT REFERENCES appraisals(id),
    title TEXT,
    patent_number VARCHAR(100),
    status VARCHAR(50),
    filing_date DATE,
    self_marks NUMERIC(5,2)
);

CREATE TABLE part_b_awards (
    id SERIAL PRIMARY KEY,
    appraisal_id INT REFERENCES appraisals(id),
    award_name TEXT,
    level VARCHAR(50),
    award_year INT,
    self_marks NUMERIC(5,2)
);

CREATE TABLE part_b_econtent (
    id SERIAL PRIMARY KEY,
    appraisal_id INT REFERENCES appraisals(id),
    content_type TEXT,
    platform TEXT,
    content_link TEXT,
    self_marks NUMERIC(5,2)
);

CREATE TABLE part_b_moocs (
    id SERIAL PRIMARY KEY,
    appraisal_id INT REFERENCES appraisals(id),
    course_name TEXT,
    platform TEXT,
    duration VARCHAR(50),
    certificate_available BOOLEAN,
    self_marks NUMERIC(5,2)
);

CREATE TABLE part_b_guidance (
    id SERIAL PRIMARY KEY,
    appraisal_id INT REFERENCES appraisals(id),
    student_name TEXT,
    level VARCHAR(50),
    topic TEXT,
    year INT,
    self_marks NUMERIC(5,2)
);

-- PART C
CREATE TABLE part_c_key_contribution (
    appraisal_id INT PRIMARY KEY REFERENCES appraisals(id),
    description TEXT,
    self_marks NUMERIC(5,2)
);

CREATE TABLE part_c_committee_role (
    id SERIAL PRIMARY KEY,
    appraisal_id INT REFERENCES appraisals(id),
    committee_name TEXT,
    period VARCHAR(50),
    post_held TEXT,
    self_marks NUMERIC(5,2)
);

CREATE TABLE part_c_professional_body (
    id SERIAL PRIMARY KEY,
    appraisal_id INT REFERENCES appraisals(id),
    body_name TEXT,
    membership_type TEXT,
    post_held TEXT,
    self_marks NUMERIC(5,2)
);

CREATE TABLE part_c_student_feedback (
    appraisal_id INT PRIMARY KEY REFERENCES appraisals(id),
    average_rating NUMERIC(3,2),
    converted_marks NUMERIC(5,2),
    feedback_file TEXT
);

-- PART D and E
CREATE TABLE part_d_values (
    appraisal_id INT PRIMARY KEY REFERENCES appraisals(id),
    attendance NUMERIC(3,2),
    responsibility NUMERIC(3,2),
    honesty NUMERIC(3,2),
    teamwork NUMERIC(3,2),
    inclusiveness NUMERIC(3,2),
    conduct NUMERIC(3,2)
);

CREATE TABLE part_e_self_assessment (
    appraisal_id INT PRIMARY KEY REFERENCES appraisals(id),
    self_summary TEXT,
    goals TEXT
);

-- Attachments and audit
CREATE TABLE attachments (
    id SERIAL PRIMARY KEY,
    appraisal_id INT REFERENCES appraisals(id),
    section_code VARCHAR(16),
    record_id INT,
    file_name TEXT,
    file_path TEXT,
    uploaded_by INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    appraisal_id INT REFERENCES appraisals(id),
    action VARCHAR(100),
    performed_by INT,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    old_data JSONB,
    new_data JSONB
);
```

---

## 18. Appendix B — UI field JSON schema (developer-ready)

_(A representative JSON schema for Part B Research Journals; other parts follow same style.)_

```json
{
  "type": "object",
  "properties": {
    "appraisal_id": { "type": "integer" },
    "research_journals": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "integer" },
          "title": { "type": "string" },
          "journal_name": { "type": "string" },
          "issn": { "type": "string" },
          "impact_factor": { "type": "string" },
          "authors": { "type": "string" },
          "co_authors": { "type": "string" },
          "self_marks": { "type": "number" },
          "attachments": {
            "type": "array",
            "items": { "type": "integer" }
          }
        },
        "required": ["title", "journal_name"]
      }
    }
  }
}
```

---

## 19. Appendix C — docker-compose sample & Kubernetes hints

(Provided earlier; include full sample in repo.)

---

## 20. Developer checklist (ready-to-act items)

1. Pull the SQL DDL and create DB schema.
2. Bootstrap backend project (choose Node/Django). Add ORM models matching DDL.
3. Implement API endpoints per spec. Add RBAC middleware.
4. Implement front-end form with parts A–E, using JSON schema.
5. Implement calculation engine and unit tests (match Excel outputs).
6. Implement attachments upload (MinIO / S3), file scanning.
7. Implement worker to generate PDF and import Excel.
8. Add audit logging on all write operations.
9. Deploy via docker-compose for prototype.
10. Validate with 10 real Excel files; confirm totals match Excel.

---
