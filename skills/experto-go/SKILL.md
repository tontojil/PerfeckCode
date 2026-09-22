---
name: experto-go
description: Patrones Go de concurrencia con goroutines y channels, servicios gRPC, microservicios y buenas practicas de produccion. (Go, goroutines, gRPC, microservices)
---

## Cuando usar

Usa esta skill para microservicios en Go, concurrencia con goroutines/channels y gRPC.
Cubre worker pools, fan-out/fan-in, rate limiter, context, HTTP server y errores.
Para REST/OpenAPI, Docker/K8s o CI/CD usa `diseno-api`, `experto-docker` o `patrones-despliegue`.
No uses esta skill fuera del stack Go.

## Project Structure

```
service/
├── cmd/
│   └── server/
│       └── main.go           # Entry point
├── internal/
│   ├── handler/              # HTTP/gRPC handlers
│   ├── service/              # Business logic
│   ├── repository/           # Data access
│   ├── model/                # Domain models
│   └── config/               # Configuration
├── pkg/                      # Public reusable packages
├── api/
│   └── proto/                # Protobuf definitions
├── migrations/
├── go.mod
└── go.sum
```

## Concurrency Patterns

### Worker Pool

```go
func processItems(ctx context.Context, items []Item) error {
    const maxWorkers = 10

    g, ctx := errgroup.WithContext(ctx)
    itemsCh := make(chan Item)

    // Producer
    g.Go(func() error {
        defer close(itemsCh)
        for _, item := range items {
            select {
            case <-ctx.Done():
                return ctx.Err()
            case itemsCh <- item:
            }
        }
        return nil
    })

    // Workers
    for i := 0; i < maxWorkers; i++ {
        g.Go(func() error {
            for item := range itemsCh {
                if err := process(ctx, item); err != nil {
                    return err
                }
            }
            return nil
        })
    }

    return g.Wait()
}
```

### Fan-Out/Fan-In

```go
func fanOutFanIn(ctx context.Context, input <-chan Data, workers int) <-chan Result {
    results := make(chan Result)
    var wg sync.WaitGroup

    for i := 0; i < workers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for data := range input {
                select {
                case <-ctx.Done():
                    return
                case results <- transform(data):
                }
            }
        }()
    }

    go func() {
        wg.Wait()
        close(results)
    }()

    return results
}
```

### Rate Limiter

```go
type RateLimiter struct {
    ticker *time.Ticker
    tokens chan struct{}
}

func NewRateLimiter(rps int) *RateLimiter {
    rl := &RateLimiter{
        ticker: time.NewTicker(time.Second / time.Duration(rps)),
        tokens: make(chan struct{}, rps),
    }
    go func() {
        for range rl.ticker.C {
            select {
            case rl.tokens <- struct{}{}:
            default:
            }
        }
    }()
    return rl
}

func (rl *RateLimiter) Wait(ctx context.Context) error {
    select {
    case <-ctx.Done():
        return ctx.Err()
    case <-rl.tokens:
        return nil
    }
}
```

### Context Propagation

```go
func (s *Service) HandleRequest(ctx context.Context, req *Request) (*Response, error) {
    ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
    defer cancel()

    // Propagate trace ID
    ctx = context.WithValue(ctx, traceKey{}, req.TraceID)

    result, err := s.repo.Get(ctx, req.ID)
    if err != nil {
        return nil, fmt.Errorf("get %s: %w", req.ID, err)
    }

    return &Response{Data: result}, nil
}
```

## gRPC

### Proto Definition

```protobuf
syntax = "proto3";
package users.v1;

service UserService {
    rpc GetUser(GetUserRequest) returns (GetUserResponse);
    rpc ListUsers(ListUsersRequest) returns (stream ListUsersResponse);
    rpc CreateUser(CreateUserRequest) returns (CreateUserResponse);
}

message GetUserRequest {
    string id = 1;
}

message GetUserResponse {
    User user = 1;
}

message User {
    string id = 1;
    string email = 2;
    string name = 3;
}
```

### Server Implementation

```go
type UserServer struct {
    pb.UnimplementedUserServiceServer
    service *UserService
}

func (s *UserServer) GetUser(ctx context.Context, req *pb.GetUserRequest) (*pb.GetUserResponse, error) {
    user, err := s.service.GetByID(ctx, req.Id)
    if err != nil {
        if errors.Is(err, ErrNotFound) {
            return nil, status.Errorf(codes.NotFound, "user %s not found", req.Id)
        }
        return nil, status.Errorf(codes.Internal, "failed to get user")
    }

    return &pb.GetUserResponse{
        User: &pb.User{
            Id:    user.ID,
            Email: user.Email,
            Name:  user.Name,
        },
    }, nil
}
```

### Client with Retry

```go
func NewGRPCClient(addr string) (pb.UserServiceClient, error) {
    conn, err := grpc.NewClient(addr,
        grpc.WithTransportCredentials(insecure.NewCredentials()),
        grpc.WithDefaultServiceConfig(`{
            "methodConfig": [{
                "name": [{"service": "users.v1.UserService"}],
                "retryPolicy": {
                    "maxAttempts": 3,
                    "initialBackoff": "0.1s",
                    "maxBackoff": "1s",
                    "backoffMultiplier": 2,
                    "retryableStatusCodes": ["UNAVAILABLE", "DEADLINE_EXCEEDED"]
                }
            }]
        }`),
    )
    if err != nil {
        return nil, fmt.Errorf("dial: %w", err)
    }
    return pb.NewUserServiceClient(conn), nil
}
```

## HTTP Server

```go
func NewServer(handler *Handler) *http.Server {
    mux := http.NewServeMux()
    mux.HandleFunc("GET /api/v1/users/{id}", handler.GetUser)
    mux.HandleFunc("POST /api/v1/users", handler.CreateUser)

    return &http.Server{
        Addr:         ":8080",
        Handler:      middleware.Chain(mux,
            middleware.RequestID(),
            middleware.Logger(),
            middleware.Recover(),
            middleware.CORS(allowedOrigins),
        ),
        ReadTimeout:  5 * time.Second,
        WriteTimeout: 10 * time.Second,
        IdleTimeout:  120 * time.Second,
    }
}
```

## Error Handling

```go
// Sentinel errors
var (
    ErrNotFound   = errors.New("not found")
    ErrConflict   = errors.New("conflict")
    ErrValidation = errors.New("validation error")
)

// Wrap with context
if err != nil {
    return fmt.Errorf("service.CreateUser: %w", err)
}

// Check with errors.Is / errors.As
if errors.Is(err, ErrNotFound) { ... }
```

## Rules

- `errgroup` for concurrent goroutine management.
- Always propagate `context.Context` as first parameter.
- `close(ch)` in producer, never in consumer.
- `fmt.Errorf("function: %w", err)` for error wrapping.
- Sentinel errors with `errors.Is`/`errors.As`.
- `sync.WaitGroup` or `errgroup` — never bare goroutines in production.
- Buffer channels to decouple producer/consumer.
- Timeouts on every external call via context.
- Interfaces defined by consumers, not producers.

## Salida esperada

Estructura `service/` con `cmd/server/main.go`, `internal/handler|service|repository|model|config`, `pkg/`, `api/proto/`.
Checklist: timeouts en todo llamado externo via `context.WithTimeout`, `context` como primer parametro, errores con `%w` y `errors.Is/As`.

## Referencias oficiales y repositorios famosos

Esta sección amplía sin modificar los patrones existentes. Úsela para profundizar y validar decisiones con fuentes oficiales.

### Documentación oficial

- Documentación principal de Go: https://go.dev/doc/ — inicio recomendado para sintaxis, tour y referencias del lenguaje.
- Concurrencia efectiva en Go: https://go.dev/doc/effective_go#concurrency — goroutines, channels y buenas prácticas de diseño.
- Paquete `context`: https://pkg.go.dev/context — propagación de cancelación, deadlines y valores.
- Paquete `sync` y `errgroup`: https://pkg.go.dev/sync y https://pkg.go.dev/golang.org/x/sync/errgroup — sincronización y manejo de goroutines con errores.
- gRPC en Go: https://grpc.io/docs/languages/go/ — instalación, quickstart y ejemplos de cliente y servidor.
- Módulos Go: https://go.dev/doc/modules/gomod-ref — gestión de dependencias con `go.mod` y `go.sum`.
- Diagnóstico y profiling: https://go.dev/doc/diagnostics — `pprof`, `trace`, `race detector` y optimización.

### Repositorios famosos y listas curadas

- Awesome Go: https://github.com/avelino/awesome-go — catálogo curado de frameworks, librerías y herramientas.
- Go estándar de proyecto: https://github.com/golang-standards/project-layout — estructura `cmd/`, `internal/`, `pkg/` compatible con esta skill.
- Ejemplos oficiales: https://github.com/golang/example — ejemplos mantenidos por el equipo de Go.
- gRPC ejemplos Go: https://github.com/grpc/grpc-go/tree/master/examples — servidor, cliente, streaming y retry.
- Go wiki: https://github.com/golang/go/wiki — patrones de la comunidad revisados por mantenedores.

### Guías de profundización sugeridas

- Revise `Effective Go` antes de definir interfaces públicas en `pkg/`.
- Consulte `Go Concurrency Patterns` de las charlas oficiales para `fan-out` y `fan-in`.
- Valide políticas de retry gRPC con la documentación de `service config` y códigos `codes.Unavailable`.
- Verifique timeouts con `context.WithTimeout` en cada llamada externa y pruebe con `go test -race`.
- Mida con `go vet`, `staticcheck` y `golangci-lint` antes de declarar el servicio listo para producción.

### Checklist de verificación

- [ ] Se consultó `go.dev/doc/` para la versión de Go declarada en `go.mod`.
- [ ] Todo llamado externo tiene `context` como primer parámetro y timeout explícito.
- [ ] Los errores se envuelven con `%w` y se verifican con `errors.Is` o `errors.As`.
- [ ] No existen goroutines desnudas: se utiliza `errgroup` o `sync.WaitGroup`.
- [ ] Los channels se cierran en el productor y nunca en el consumidor.
- [ ] El servidor HTTP define `ReadTimeout`, `WriteTimeout` e `IdleTimeout`.
- [ ] El cliente gRPC define política de reintento solo para códigos idempotentes.
- [ ] `go vet ./...` y `go test -race ./...` finalizan sin errores.
