
## 
## API Route Handlers
├───project     (GET default projects and POST new project)
│   └───[id]    (GET specific project, PUT, and DELETE)
├───projects    (GET all projects)
├───resume      (GET default resume and POST new resume) 
│   └───[id]    (GET specific resume, PUT, and DELETE) 
└───resumes     (GET all projects)

## Database Schema
Resume
├── _id: string
├── name: string *
├── title: string *
├── headshot: ImageURL *
│     ├── url: string *
│     ├── alt?: string
│     ├── width?: number
│     └── height?: number
├── email: string *
├── githubUrl?: string
├── linkedinUrl?: string
├── website?: string
├── summary?: string
├── education?: [
│     └── Education
│         ├── institution: string *
│         ├── degree: string *
│         ├── fieldOfStudy: string *
│         ├── startDate: string *
│         ├── endDate?: string
│         └── location?: string
│ ]
├── extracurriculars?: [
│     └── Extracurricular
│         ├── company: string *
│         ├── role: string *
│         ├── description?: string
│         ├── startDate?: string
│         ├── endDate?: string
│         └── achievements?: [ string ]
│ ]
├── technicalSkills?: TechnicalSkills
│     ├── languages?: [ string ]
│     ├── frameworks?: [ string ]
│     ├── databases?: [ string ]
│     ├── tools?: [ string ]
│     └── other?: [ string ]
├── projects?: [ ObjectId (ref: Project) ]
├── experience?: [
│     └── Experience
│         ├── company: string *
│         ├── role: string *
│         ├── startDate: string *
│         ├── endDate?: string
│         ├── location?: string
│         ├── achievements: [ string ] *
│         ├── tech?: [ string ]
│         └── links?: [ Link ]
│ ]
├── volunteerWork?: [
│     └── VolunteerWork
│         ├── organization: string *
│         ├── role: string *
│         ├── startDate: string *
│         ├── endDate?: string
│         ├── location?: string
│         └── links?: [ Link ]
│ ]
├── certifications?: [
│     └── Certification
│         ├── name: string *
│         ├── issuer: string *
│         ├── issueDate: string *
│         ├── credentialId?: string
│         ├── credentialUrl?: string
│         ├── summary?: string
│         └── links?: [ Link ]
│ ]
├── awards?: [
│     └── Award
│         ├── title: string *
│         ├── organization?: string
│         ├── date: string *
│         ├── summary?: string
│         └── links?: [ Link ]
│ ]
├── isDefault: boolean (default: false)
└── timestamps: createdAt, updatedAt

Project
├── _id: string
├── name: string *
├── role: string *
├── tech: [ string ]
├── description?: string
├── achievements?: [ string ]
├── links?: [
│     └── Link
│         ├── label?: string
│         └── url: string *
│ ]
├── screenshots: [
│     └── ImageURL
│         ├── url: string *
│         ├── alt?: string
│         ├── width?: number
│         └── height?: number
│ ]
└── timestamps: createdAt, updatedAt

