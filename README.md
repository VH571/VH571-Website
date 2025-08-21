
## API Route Handlers

| Route            | Methods                   | Description                           |
|------------------|---------------------------|---------------------------------------|
| `/project`       | GET, POST                 | Get default project / create new      |
| `/project/[id]`  | GET, PUT, DELETE          | Get / update / delete specific project|
| `/projects`      | GET                       | Get all projects                      |
| `/resume`        | GET, POST                 | Get default resume / create new       |
| `/resume/[id]`   | GET, PUT, DELETE          | Get / update / delete specific resume |
| `/resumes`       | GET                       | Get all resumes                       |

## Database Schema

### Resume

| Field              | Type             | Required | Description |
|--------------------|------------------|----------|-------------|
| `_id`              | string           | ✅       | Unique identifier |
| `name`             | string           | ✅       | Person’s full name |
| `title`            | string           | ✅       | Professional title |
| `headshot`         | ImageURL object  | ✅       | Profile image (url, alt?, width?, height?) |
| `email`            | string           | ✅       | Contact email |
| `githubUrl`        | string           | ❌       | GitHub profile link |
| `linkedinUrl`      | string           | ❌       | LinkedIn profile link |
| `website`          | string           | ❌       | Personal/portfolio site |
| `summary`          | string           | ❌       | Professional summary |
| `education`        | [Education]      | ❌       | List of schools, degrees, dates |
| `extracurriculars` | [Extracurricular]| ❌       | Clubs, orgs, activities |
| `technicalSkills`  | Object           | ❌       | Languages, frameworks, databases, tools, other |
| `projects`         | [ObjectId]       | ❌       | References to Project collection |
| `experience`       | [Experience]     | ❌       | Work experience details |
| `volunteerWork`    | [VolunteerWork]  | ❌       | Volunteer roles and orgs |
| `certifications`   | [Certification]  | ❌       | Certifications and credentials |
| `awards`           | [Award]          | ❌       | Awards and honors |
| `isDefault`        | boolean          | ❌       | Default resume flag (default: false) |
| `timestamps`       | object           | ✅       | `createdAt`, `updatedAt` |

### Project

| Field          | Type             | Required | Description |
|----------------|------------------|----------|-------------|
| `_id`          | string           | ✅       | Unique identifier |
| `name`         | string           | ✅       | Project name |
| `role`         | string           | ✅       | Role in project |
| `tech`         | [string]         | ✅       | Tech stack used |
| `description`  | string           | ❌       | Short project description |
| `achievements` | [string]         | ❌       | Key accomplishments |
| `links`        | [Link]           | ❌       | Related URLs |
| `screenshots`  | [ImageURL]       | ✅       | Screenshots of project |
| `timestamps`   | object           | ✅       | `createdAt`, `updatedAt` |
