## Project Structure

### Basic Monolithic Application Structure

```
│ .env # Environment credentials
│ src/
│├── app.module.ts
│├── app.controller.ts
│├── app.service.ts
│├── modules
││ ├── module/  # A module that manages a specific domain
││ │   ├── controllers/ # Responsible for handling incoming requests and returning responses to the client.
││ │   │   └── module.controller.ts
││ │   ├── dtos/ DTO is an object that defines strictness as to how data will be sent over the network
││ │   ├── decorators/ # Custom decorators attaches properties to the request object
││ │   ├── constants/ # Any business logic class constants
││ │   ├── helpers/ # Assist service files to implement business logic
││ │   ├── entites/ # We have entities which are models with entity decorators in your app that represent database tables
││ │   │   ├── module.entity.ts
││ │   ├── repositories/ # Where data is stored ie connects and manipulates database
││ │   │   └── module.repository.ts
││ │   ├── services/ # Where business logic is written
││ │   │   └── module.service.ts
││ │   └── module.module.ts
││ └── shared/   # A shared module with shared business logic in services and providers
││     └── acl/  #  Implement various access rules
││     └── configs/ #  Where environment variables are centrally available
││     └── dtos/ #  Contains shared dtos.
││     └── errors/ #  Contains shared errors
││     └── filters/ #  Handle exceptions which are not handled by your application code
││     └── logger/ #  Contains logger module
││     └── middlewares/ #  Contains function that have access to the request and the response objects
├── migrations/  # Database migration files
├── docs/  # Api documentations and readme files
└── test/ # E2E tests
```
