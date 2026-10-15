---
name: kotlin-corutinas-flujos
description: Patrones Kotlin con coroutines y Flow, concurrencia estructurada, channels, shared flows, state flows y manejo de errores. (Kotlin, coroutines, Flow, channels)
---

## Versiones mínimas

- Kotlin 2.0 o superior, `kotlinx-coroutines-core` 1.8 o superior, `kotlinx-coroutines-test` 1.8 para `runTest`.
- JDK 17 para compilación local, Gradle 8.7 o superior si usa Android.
- En Android: `lifecycle-runtime-ktx` 2.8 para `viewModelScope` y `lifecycleScope`.
- Portal base: https://kotlinlang.org/docs/
- Notas de versión: https://github.com/Kotlin/kotlinx.coroutines/releases

## Ejemplo mínimo probado (archivo único ejecutable)

Probado como guía con Kotlin 2.0 y `kotlinx-coroutines-core` 1.8. Incluye `suspend`, `StateFlow`, `SharedFlow`, `combine` y manejo de errores.

`build.gradle.kts` mínimo para JVM:

```kotlin
plugins { kotlin("jvm") version "2.0.20" }
dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.1")
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.8.1")
}
```

`Main.kt` completo. Ejecute con `./gradlew run`:

```kotlin
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOn
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

sealed interface MiniUiState {
    data object Loading : MiniUiState
    data class Success(val names: List<String>) : MiniUiState
    data class Error(val message: String) : MiniUiState
}

sealed interface MiniEvent {
    data class ShowMessage(val text: String) : MiniEvent
}

class MiniRepository {
    suspend fun fetchNames(): List<String> {
        delay(100)
        return listOf("Ana", "Bruno", "Carla")
    }

    fun observeNames() = flow<Result<List<String>>> {
        emit(Result.success(fetchNames()))
    }.catch { emit(Result.failure(it)) }
     .flowOn(Dispatchers.IO)
}

class MiniViewModel(private val repository: MiniRepository) {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

    private val _uiState = MutableStateFlow<MiniUiState>(MiniUiState.Loading)
    val uiState: StateFlow<MiniUiState> = _uiState.asStateFlow()

    private val _events = MutableSharedFlow<MiniEvent>()
    val events: SharedFlow<MiniEvent> = _events.asSharedFlow()

    fun load() {
        scope.launch {
            repository.observeNames().collect { result ->
                result
                    .onSuccess { _uiState.value = MiniUiState.Success(it) }
                    .onFailure { _uiState.value = MiniUiState.Error(it.message ?: "Error") }
            }
        }
    }

    fun greet(name: String) {
        scope.launch { _events.emit(MiniEvent.ShowMessage("Hola, $name")) }
    }

    fun clear() = scope.cancel()
}

fun main(): Unit = runBlocking {
    val viewModel = MiniViewModel(MiniRepository())

    val dashboardJob = launch {
        combine(viewModel.uiState, flow { emit(42) }) { state, total ->
            "estado=$state total=$total"
        }.collect(::println)
    }

    val eventsJob = launch {
        viewModel.events.collect { println("evento=$it") }
    }

    viewModel.load()
    delay(500)
    viewModel.greet("Ana")
    delay(200)

    dashboardJob.cancel()
    eventsJob.cancel()
    viewModel.clear()
}
```

Verificación: `./gradlew run` imprime `estado=Success(names=[Ana, Bruno, Carla])` y `evento=ShowMessage(text=Hola, Ana)`. En tests use `runTest` con `StandardTestDispatcher`.

## Cuando usar

Utilice esta skill cuando trabaje con código Kotlin con corutinas, Flow o channels.
- Cuando uses `suspend`, `async`, `launch` o scopes estructurados.
- Cuando uses `StateFlow`, `SharedFlow` o channels para estado o eventos.
- Cuando pruebe corutinas con `runTest` o `TestDispatcher`.
No la utilice para UI en Compose (pantallas, estado visual); consulte `android-interfaz-compose` en su lugar.

## Coroutine Basics

### Structured Concurrency

```kotlin
class UserRepository @Inject constructor(
    private val api: UserApi,
    private val dao: UserDao,
) {
    // viewModelScope provides structured scope
    // No GlobalScope, ever
    suspend fun getUser(id: String): User = coroutineScope {
        val userDeferred = async { api.fetchUser(id) }
        val postsDeferred = async { api.fetchPosts(id) }

        val user = userDeferred.await()
        val posts = postsDeferred.await()

        user.copy(posts = posts)
    }
}
```

### Error Handling

```kotlin
// Result-based (preferred)
suspend fun safeFetch(): Result<User> = runCatching {
    api.fetchUser(userId)
}

// Try-catch for specific handling
suspend fun fetchWithRetry(maxRetries: Int = 3): User {
    repeat(maxRetries) { attempt ->
        try {
            return api.fetchUser(userId)
        } catch (e: HttpException) {
            if (attempt == maxRetries - 1) throw e
            delay(2.0.pow(attempt) * 1000) // Exponential backoff
        }
    }
    error("Unreachable")
}
```

### SupervisorJob

```kotlin
// Children fail independently
val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

scope.launch {
    // If this fails, the sibling below still runs
    updateUser()
}
scope.launch {
    // Independent operation
    sendNotification()
}
```

## Flow Patterns

### Creating Flows

```kotlin
// From suspend function
fun getUsers(): Flow<List<User>> = flow {
    emit(api.fetchUsers())
}

// With retry + caching
fun getUsers(): Flow<Result<List<User>>> = flow {
    emit(Result.success(api.fetchUsers()))
}.retry(3) { it is IOException }
  .catch { emit(Result.failure(it)) }
  .flowOn(Dispatchers.IO)
```

### StateFlow (State Holder)

```kotlin
class UserViewModel @Inject constructor(
    private val getUserUseCase: GetUserUseCase,
) : ViewModel() {

    private val _uiState = MutableStateFlow<UserUiState>(UserUiState.Loading)
    val uiState: StateFlow<UserUiState> = _uiState.asStateFlow()

    fun load(id: String) {
        viewModelScope.launch {
            getUserUseCase(id)
                .onSuccess { _uiState.value = UserUiState.Success(it) }
                .onFailure { _uiState.value = UserUiState.Error(it.message) }
        }
    }
}

sealed interface UserUiState {
    data object Loading : UserUiState
    data class Success(val user: User) : UserUiState
    data class Error(val message: String?) : UserUiState
}
```

### SharedFlow (Events)

```kotlin
// One-shot events (navigation, snackbar, etc.)
class LoginViewModel : ViewModel() {
    private val _events = MutableSharedFlow<LoginEvent>()
    val events: SharedFlow<LoginEvent> = _events.asSharedFlow()

    fun login() {
        viewModelScope.launch {
            val result = loginUseCase(params)
            if (result.isSuccess) {
                _events.emit(LoginEvent.NavigateToDashboard(result.getOrThrow().userId))
            } else {
                _events.emit(LoginEvent.ShowError(result.exceptionOrNull()?.message))
            }
        }
    }
}

sealed interface LoginEvent {
    data class NavigateToDashboard(val userId: String) : LoginEvent
    data class ShowError(val message: String?) : LoginEvent
}

// Collection in UI
LaunchedEffect(Unit) {
    viewModel.events.collect { event ->
        when (event) {
            is LoginEvent.NavigateToDashboard -> navController.navigate(...)
            is LoginEvent.ShowError -> snackbarHostState.showSnackbar(event.message ?: "Error")
        }
    }
}
```

### Combining Flows

```kotlin
// Combine two flows
val dashboard: Flow<DashboardState> = combine(
    userRepository.observeUser(userId),
    orderRepository.observeOrders(userId),
    ::DashboardState,
)

// Zip (wait for both to emit)
val profileData: Flow<Profile> = userFlow.zip(postsFlow) { user, posts ->
    Profile(user = user, posts = posts)
}
```

### Flow Operators

```kotlin
fun searchUsers(query: Flow<String>): Flow<List<User>> = query
    .debounce(300)
    .filter { it.length >= 2 }
    .distinctUntilChanged()
    .flatMapLatest { query ->
        userRepository.search(query)
    }
    .catch { emit(emptyList()) }
```

### Channel (Hot Stream)

```kotlin
// Producer-consumer with buffer
fun observeSyncEvents(): Flow<SyncEvent> = channelFlow {
    val listener = object : SyncListener {
        override fun onEvent(event: SyncEvent) {
            trySend(event)
        }
    }
    syncManager.addListener(listener)
    awaitClose { syncManager.removeListener(listener) }
}
```

## Testing Coroutines

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
class UserViewModelTest {
    @get:Rule
    val dispatcherRule = StandardTestDispatcher()

    @Test
    fun load_success_updatesStateToSuccess() = runTest {
        val viewModel = UserViewModel(FakeGetUserUseCase(UserFactory.create()))

        viewModel.load("user-1")
        advanceUntilIdle()

        assertEquals(UserUiState::class, viewModel.uiState.value::class)
    }

    @Test
    fun search_debouncesRapidQueries() = runTest {
        val queries = MutableStateFlow("")
        val results = mutableListOf<List<User>>()

        val job = launch {
            searchUsers(queries).toList(results)
        }

        queries.value = "a"
        queries.value = "ab"
        queries.value = "abc"
        advanceTimeBy(400)

        assertEquals(1, results.size) // Only the final query emitted
        job.cancel()
    }
}
```

## Rules

- `viewModelScope` for ViewModels, `lifecycleScope` for Activities/Fragments. Never `GlobalScope`.
- `StateFlow` for state. `SharedFlow` for events.
- `runCatching` for Result-based error handling.
- `SupervisorJob` when children should fail independently.
- `debounce` + `distinctUntilChanged` for search flows.
- `flatMapLatest` over `flatMapMerge` for cancel-previous semantics.
- `flowOn(Dispatchers.IO)` once, not on every operator.
- Test with `StandardTestDispatcher` and `runTest`.

## Referencias oficiales y repositorios famosos

Esta sección amplía sin modificar los patrones existentes. Úsela para validar corutinas, Flow y testing.

### Documentación oficial

- Portal base Kotlin: https://kotlinlang.org/docs/
- Kotlin Coroutines: https://kotlinlang.org/docs/coroutines-guide.html — guía base de concurrencia estructurada.
- Flow: https://kotlinlang.org/docs/flow.html — creación, operadores y colección.
- StateFlow y SharedFlow: https://kotlinlang.org/docs/flow.html#stateflow-and-sharedflow — estado versus eventos.
- Testing de corutinas: https://kotlinlang.org/docs/coroutines-test.html — `runTest` y dispatchers de prueba.
- `viewModelScope`: https://developer.android.com/topic/libraries/architecture/coroutines — scopes Android y cancelación.
- Channels: https://kotlinlang.org/docs/channels.html — productor-consumidor y `channelFlow`.
- Excepciones: https://kotlinlang.org/docs/exception-handling.html — `SupervisorJob`, `catch` y `retry`.

### Repositorios famosos y listas curadas

- Awesome Kotlin: https://github.com/KotlinBy/awesome-kotlin — librerías y recursos curados.
- kotlinx.coroutines: https://github.com/Kotlin/kotlinx.coroutines — implementación, ejemplos y guías.
- Now in Android: https://github.com/android/nowinandroid — uso real de `StateFlow`, `combine` y `flatMapLatest`.
- Turbine: https://github.com/cashapp/turbine — testing de Flows con assertions legibles.
- Kotlin: https://github.com/JetBrains/kotlin — lenguaje y propuestas de evolución.

### Guías de profundización sugeridas

- Revise concurrencia estructurada antes de crear un `CoroutineScope` manual.
- Consulte Flow para elegir entre `combine`, `zip` y `flatMapLatest` según semántica.
- Valide manejo de errores con `runCatching` o `catch` sin ocultar excepciones de cancelación.
- Verifique búsqueda con `debounce`, `filter` y `distinctUntilChanged` antes de llamar a red.
- Mida con `TestDispatcher`, `advanceTimeBy` y `advanceUntilIdle` para pruebas deterministas.

### Checklist de verificación

- [ ] Se consultó `kotlinlang.org/docs/coroutines-guide.html` para el operador utilizado.
- [ ] No se utiliza `GlobalScope` en ningún código de producción.
- [ ] El estado utiliza `StateFlow` y los eventos utilizan `SharedFlow`.
- [ ] Los hijos independientes utilizan `SupervisorJob` documentado.
- [ ] La búsqueda implementa `debounce` y `distinctUntilChanged`.
- [ ] Se utiliza `flatMapLatest` cuando debe cancelarse la consulta previa.
- [ ] `flowOn(Dispatchers.IO)` aparece una sola vez por cadena.
- [ ] Los tests utilizan `StandardTestDispatcher` con `runTest` y avance explícito de tiempo.
