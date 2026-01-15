# Application Layer

The **Application Layer** orchestrates use cases and business operations. It depends on the **Domain Layer** but remains framework-agnostic. This layer coordinates entities and repositories to fulfill application workflows.

### Contents

- **Use Cases**: Classes that implement a specific business action, e.g., `GetGamesByYearUseCase`. They call domain entities and repositories to execute operations.
- **DTOs**: Data Transfer Objects used to define inputs and outputs of use cases.
- **Ports**: Secondary ports may also be declared here if needed to abstract infrastructure dependencies.

### Guidelines

- Should not contain Angular-specific code (no services, HttpClient, etc.).
- Receives dependencies via constructor injection (ports/interfaces).
- Can be tested independently of Angular.
