---
name: android-arquitectura-limpia
description: Arquitectura limpia en Android con MVVM, casos de uso, repositorios, inyección con Hilt y módulos por capas. Úsela cuando construya una app Android ordenada. (Android Clean Architecture, MVVM, repository, Hilt)
---

## Module Structure

```
app/
├── di/                         # Hilt modules
├── navigation/
data/
├── remote/
│   ├── api/                    # Retrofit interfaces
│   ├── dto/                    # Network models
│   └── mapper/                 # DTO → Entity mappers
├── local/
│   ├── dao/                    # Room DAOs
│   ├── entity/                 # DB entities
│   └── mapper/
├── repository/                 # Repository implementations
domain/
├── model/                      # Domain models
├── repository/                 # Repository interfaces
├── usecase/                    # Use cases
feature/
├── login/
│   ├── LoginScreen.kt
│   ├── LoginViewModel.kt
│   └── LoginUiState.kt
├── dashboard/
└── settings/
```

## Domain Layer

### Model

```kotlin
data class User(
    val id: String,
    val email: String,
    val name: String,
    val avatarUrl: String?,
)
```

### Repository Interface

```kotlin
interface UserRepository {
    suspend fun getById(id: String): Result<User>
    suspend fun search(query: String, page: Int): Result<PagedResult<User>>
    suspend fun save(user: User): Result<User>
}
```

### Use Case

```kotlin
class GetUserUseCase @Inject constructor(
    private val repository: UserRepository,
) {
    suspend operator fun invoke(id: String): Result<User> =
        repository.getById(id)
}

class SearchUsersUseCase @Inject constructor(
    private val repository: UserRepository,
) {
    suspend operator fun invoke(query: String, page: Int = 1): Result<PagedResult<User>> {
        if (query.isBlank()) return Result.failure(ValidationException("Query cannot be empty"))
        return repository.search(query.trim(), page)
    }
}
```

## Data Layer

### API (Retrofit)

```kotlin
interface UserApi {
    @GET("users/{id}")
    suspend fun getUser(@Path("id") id: String): UserDto

    @GET("users")
    suspend fun searchUsers(
        @Query("q") query: String,
        @Query("page") page: Int,
        @Query("per_page") perPage: Int = 20,
    ): PagedResponse<UserDto>
}

@Serializable
data class UserDto(
    @SerialName("id") val id: String,
    @SerialName("email") val email: String,
    @SerialName("name") val name: String,
    @SerialName("avatar_url") val avatarUrl: String? = null,
)

fun UserDto.toDomain() = User(id = id, email = email, name = name, avatarUrl = avatarUrl)
```

### Repository Implementation

```kotlin
class UserRepositoryImpl @Inject constructor(
    private val api: UserApi,
    private val dao: UserDao,
) : UserRepository {

    override suspend fun getById(id: String): Result<User> = runCatching {
        // Cache-first strategy
        dao.getById(id)?.toDomain() ?: api.getUser(id).also {
            dao.insert(it.toEntity())
        }.toDomain()
    }

    override suspend fun search(query: String, page: Int): Result<PagedResult<User>> = runCatching {
        val response = api.searchUsers(query, page)
        response.items.map { it.toDomain() }.let {
            PagedResult(items = it, total = response.total, page = page)
        }
    }
}
```

## DI with Hilt

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object DataModule {
    @Provides
    fun provideUserApi(retrofit: Retrofit): UserApi =
        retrofit.create(UserApi::class.java)
}

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {
    @Binds
    abstract fun bindUserRepository(impl: UserRepositoryImpl): UserRepository
}

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit =
        Retrofit.Builder()
            .baseUrl("https://api.example.com/v1/")
            .client(okHttpClient)
            .addConverterFactory(Json.asConverterFactory("application/json".toMediaType()))
            .build()
}
```

## Presentation Layer (MVVM)

```kotlin
@HiltViewModel
class UserDetailViewModel @Inject constructor(
    savedStateHandle: SavedStateHandle,
    private val getUserUseCase: GetUserUseCase,
) : ViewModel() {

    private val userId: String = savedStateHandle["userId"]!!
    private val _uiState = MutableStateFlow<UserDetailUiState>(UserDetailUiState.Loading)
    val uiState: StateFlow<UserDetailUiState> = _uiState.asStateFlow()

    init { loadUser() }

    fun loadUser() {
        viewModelScope.launch {
            _uiState.value = UserDetailUiState.Loading
            getUserUseCase(userId)
                .onSuccess { _uiState.value = UserDetailUiState.Success(it) }
                .onFailure { _uiState.value = UserDetailUiState.Error(it.message ?: "Unknown error") }
        }
    }
}

sealed interface UserDetailUiState {
    data object Loading : UserDetailUiState
    data class Success(val user: User) : UserDetailUiState
    data class Error(val message: String) : UserDetailUiState
}
```

## Rules

- Domain layer has ZERO Android dependencies (pure Kotlin).
- Use cases = single responsibility. One public method.
- Repository interface in domain, implementation in data.
- `Result<T>` for error propagation. No exceptions in use cases.
- `sealed interface` for UI state (Loading/Success/Error).
- Hilt for DI. Constructor injection preferred over field injection.
- Mappers: DTO ↔ Entity ↔ Domain. No layer leaking.
- Cache strategy in repository, not in ViewModel.

## Referencias oficiales y repositorios famosos

Esta sección amplía sin modificar la arquitectura existente. Úsela para validar capas, DI y persistencia.

### Documentación oficial

- Guía de arquitectura Android: https://developer.android.com/topic/architecture — capas UI, dominio y datos.
- Hilt: https://developer.android.com/training/dependency-injection/hilt-android — módulos, componentes y scopes.
- Room: https://developer.android.com/training/data-storage/room — DAOs, entidades y migraciones.
- Retrofit: https://square.github.io/retrofit/ — clientes HTTP declarativos para `UserApi`.
- Kotlinx Serialization: https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/basic-serialization.md — DTO con `@Serializable`.
- ViewModel: https://developer.android.com/topic/libraries/architecture/viewmodel — `viewModelScope` y `SavedStateHandle`.
- DataStore: https://developer.android.com/topic/libraries/architecture/datastore — preferencias y caché ligera.

### Repositorios famosos y listas curadas

- Android Architecture Blueprints: https://github.com/android/architecture-samples — MVVM y capas oficiales.
- Now in Android: https://github.com/android/nowinandroid — app moderna de referencia con Hilt y modularización.
- Awesome Android: https://github.com/JStumpp/awesome-android — librerías y herramientas curadas.
- Hilt: https://github.com/google/dagger — implementación y ejemplos de DI.
- Room: https://developer.android.com/training/data-storage/room — referencia y codelabs oficiales.

### Guías de profundización sugeridas

- Revise la guía de arquitectura antes de agregar dependencia Android en dominio.
- Consulte Hilt para decidir entre `@Provides` y `@Binds` según caso.
- Valide estrategia cache-first en repositorio con pruebas de DAO falso y API falsa.
- Verifique mappers DTO, Entity y Dominio sin fugas entre capas.
- Mida con inspector de base de datos y profiling de red antes de optimizar caché.

### Checklist de verificación

- [ ] Se consultó `developer.android.com/topic/architecture` para la estructura de capas.
- [ ] El módulo dominio no importa clases Android.
- [ ] Cada caso de uso expone un solo método público `invoke`.
- [ ] La interfaz del repositorio reside en dominio y la implementación en datos.
- [ ] Los errores se propagan con `Result` sin excepciones en casos de uso.
- [ ] El estado UI utiliza `sealed interface` con Loading, Success y Error.
- [ ] La DI utiliza Hilt con inyección por constructor.
- [ ] La estrategia de caché reside en el repositorio, no en el ViewModel.
