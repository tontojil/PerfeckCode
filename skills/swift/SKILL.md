---
name: swift
description: "Desarrollo de apps para iOS y macOS con Swift, SwiftUI, SwiftData, async/await y Actores. (Swift, SwiftUI, iOS)"
---

## SwiftUI Architecture

### State Management

```swift
// Observable (Swift Observation, iOS 17+)
@Observable
final class UserViewModel {
    var users: [User] = []
    var isLoading = false
    var error: String?

    private let service: UserService

    init(service: UserService = .shared) {
        self.service = service
    }

    @MainActor
    func loadUsers() async {
        isLoading = true
        defer { isLoading = false }

        do {
            users = try await service.fetchUsers()
        } catch {
            self.error = error.localizedDescription
        }
    }
}

// View
struct UserListView: View {
    @State private var viewModel = UserViewModel()

    var body: some View {
        Group {
            if viewModel.isLoading {
                ProgressView()
            } else if let error = viewModel.error {
                ErrorView(message: error, onRetry: { Task { await viewModel.loadUsers() } })
            } else {
                List(viewModel.users) { user in
                    UserRow(user: user)
                }
            }
        }
        .task { await viewModel.loadUsers() }
    }
}
```

### Navigation (iOS 18+)

```swift
@Observable
final class AppRouter {
    var path = NavigationPath()
    var selectedTab: Tab = .users

    enum Tab { case users, settings }

    func push(_ route: Route) { path.append(route) }
    func pop() { path.removeLast() }
    func popToRoot() { path.removeLast(path.count) }
}

enum Route: Hashable {
    case userDetail(id: String)
    case userEdit(id: String)
    case settings
}

struct AppView: View {
    @State private var router = AppRouter()

    var body: some View {
        TabView(selection: Binding(
            get: { router.selectedTab },
            set: { router.selectedTab = $0 }
        )) {
            NavigationStack(path: $router.path) {
                UserListView()
                    .navigationDestination(for: Route.self) { route in
                        switch route {
                        case .userDetail(let id): UserDetailView(userId: id)
                        case .userEdit(let id): UserEditView(userId: id)
                        case .settings: SettingsView()
                        }
                    }
            }
            .tabItem { Label("Users", systemImage: "person.2") }
            .tag(AppRouter.Tab.users)
        }
        .environment(router)
    }
}
```

### SwiftData

```swift
@Model
final class User {
    #Unique<([String])>([\.email])

    var name: String
    var email: String
    var createdAt: Date = .now

    @Relationship(deleteRule: .cascade, inverse: \Post.author)
    var posts: [Post] = []

    init(name: String, email: String) {
        self.name = name
        self.email = email
    }
}

// Query
struct UserListView: View {
    @Query(sort: \User.createdAt, order: .reverse)
    private var users: [User]

    @Environment(\.modelContext) private var context

    var body: some View {
        List(users) { user in
            VStack(alignment: .leading) {
                Text(user.name).font(.headline)
                Text(user.email).font(.subheadline).foregroundStyle(.secondary)
            }
        }
    }
}
```

### Networking with async/await

```swift
actor APIClient {
    static let shared = APIClient()

    private let baseURL = URL(string: "https://api.example.com/v1")!

    func request<T: Decodable>(_ endpoint: String) async throws -> T {
        let url = baseURL.appendingPathComponent(endpoint)
        let (data, response) = try await URLSession.shared.data(from: url)

        guard let http = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }
        guard (200...299).contains(http.statusCode) else {
            throw APIError.httpError(http.statusCode)
        }

        return try JSONDecoder().decode(T.self, from: data)
    }
}

// Usage
let users: [UserDTO] = try await APIClient.shared.request("users")
```

### Concurrency Patterns

```swift
// Task Group — parallel fetching
func loadDashboard() async throws -> Dashboard {
    try await withThrowingTaskGroup(of: (any Sendable).self) { group in
        group.addTask { try await fetchUsers() as [User] }
        group.addTask { try await fetchStats() as Stats }
        group.addTask { try await fetchNotifications() as [Notification] }

        var users: [User]?
        var stats: Stats?
        var notifications: [Notification]?

        for try await result in group {
            switch result {
            case let u as [User]: users = u
            case let s as Stats: stats = s
            case let n as [Notification]: notifications = n
            default: break
            }
        }

        return Dashboard(
            users: users ?? [],
            stats: stats ?? Stats(),
            notifications: notifications ?? []
        )
    }
}
```

## Preview

```swift
#Preview {
    NavigationStack {
        UserListView()
            .modelContainer(for: User.self, inMemory: true)
    }
}
```

## Rules

- `@Observable` (Swift Observation) over `ObservableObject`.
- `@State` for view-owned state, `@Environment` for shared.
- `actor` for shared mutable state (thread safety).
- `async/await` over completion handlers.
- SwiftData over Core Data for new projects.
- NavigationSplitView for iPad/macOS, NavigationStack for iPhone.
- `#Preview` macros for all views.
- `Sendable` conformance for types crossing concurrency boundaries.

## Referencias oficiales y repositorios famosos

Esta sección amplía sin modificar los patrones existentes. Úsela para validar SwiftUI, concurrencia y SwiftData.

### Documentación oficial

- Lenguaje Swift: https://docs.swift.org/swift-book/ — referencia base del lenguaje y concurrencia.
- SwiftUI: https://developer.apple.com/documentation/swiftui — vistas, estado y navegación.
- Observation: https://developer.apple.com/documentation/observation — `@Observable` y seguimiento de estado.
- SwiftData: https://developer.apple.com/documentation/swiftdata — modelos, `@Query` y relaciones.
- Concurrencia: https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/ — `async`, `await` y actores.
- NavigationStack: https://developer.apple.com/documentation/swiftui/navigationstack — destinos y `NavigationPath`.
- Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines — patrones iOS y macOS.

### Repositorios famosos y listas curadas

- Awesome Swift: https://github.com/matteocrippa/awesome-swift — librerías y recursos curados.
- Swift: https://github.com/swiftlang/swift — compilador y evolución del lenguaje.
- SwiftUI Examples: https://github.com/jordansinger/SwiftUI-Kit — componentes y patrones visuales.
- Alamofire: https://github.com/Alamofire/Alamofire — red para casos donde `URLSession` no basta.
- swift-snapshot-testing: https://github.com/pointfreeco/swift-snapshot-testing — snapshots de vistas.

### Guías de profundización sugeridas

- Revise Observation antes de elegir entre `@State`, `@Environment` y modelo compartido.
- Consulte SwiftData para definir `deleteRule` e inversos antes de modelar relaciones.
- Valide concurrencia con `actor` para estado mutable compartido y `Sendable` en bordes.
- Verifique navegación con `NavigationPath` centralizado en `AppRouter`.
- Mida con Instruments y `XCTest` de performance antes de optimizar listas grandes.

### Checklist de verificación

- [ ] Se consultó `developer.apple.com/documentation/swiftui` para el API utilizado.
- [ ] Se utiliza `@Observable` en lugar de `ObservableObject` en código nuevo.
- [ ] El estado de vista utiliza `@State` y el compartido utiliza `@Environment`.
- [ ] El estado mutable compartido reside en `actor` con conformidad `Sendable`.
- [ ] Toda red utiliza `async` y `await` sin completion handlers nuevos.
- [ ] La persistencia nueva utiliza SwiftData con relaciones e inversos definidos.
- [ ] Cada vista principal incluye `#Preview` con contenedor en memoria cuando usa datos.
- [ ] `NavigationStack` se utiliza en iPhone y `NavigationSplitView` en iPad y macOS cuando corresponde.
