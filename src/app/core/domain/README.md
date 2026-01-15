# Domain Layer

The **Domain Layer** contains the core business logic of the application. It is completely independent of Angular or any other framework, ensuring that business rules are isolated and reusable.

### Contents

- **Entities**: Objects that represent core business concepts, such as `User`, `Game`, etc. They contain state and behavior.
- **Value Objects**: Immutable objects that encapsulate simple values with domain-specific rules (e.g., `Email`, `DateRange`).
- **Repositories (Ports)**: Interfaces that define the operations required by the domain to persist or retrieve data. These are abstractions without implementation.
- **Errors / Exceptions**: Domain-specific errors used to enforce business rules.

### Guidelines

- Must not depend on Angular, RxJS, or HTTP.
- Should only contain business logic.
- Interactions with external systems are done via **Ports**, implemented in the infrastructure layer.
