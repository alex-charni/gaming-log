# Infrastructure Layer

The **Infrastructure Layer** provides concrete implementations for the ports defined in the **Domain** or **Application** layers. This is where the application interacts with external systems such as HTTP APIs, databases, or storage services.

### Contents

- **HTTP / API Adapters**: Classes that implement repositories using HttpClient or external services (e.g., `GamesHttpRepository`).
- **Persistence / Storage**: Database or local storage adapters.
- **Mappers**: Functions or classes to convert between DTOs, API responses, and domain entities.
- **Configuration / DI Providers**: Centralized dependency injection setup connecting ports to adapters.

### Guidelines

- Can depend on Angular, RxJS, or any external libraries.
- Implements the interfaces (ports) defined in domain/application.
- Should not contain UI logic.
