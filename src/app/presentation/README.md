# Presentation Layer

The **Presentation Layer** contains the user interface and view logic. It depends on the **Application Layer** to perform business operations but does not contain business logic itself.

### Contents

- **Components**: Reusable UI components (e.g., `GameCard`, `YearCard`).
- **Pages / Containers**: Higher-level components that orchestrate components to build screens.
- **View Models**: Optional classes or signals that represent UI state derived from application data.

### Guidelines

- Should consume **Use Cases** to perform actions or retrieve data.
- Should not directly access HTTP services or repositories.
- All reactive state can be implemented using Angular Signals or RxJS.
- Responsible for rendering, user interaction, and handling events.
