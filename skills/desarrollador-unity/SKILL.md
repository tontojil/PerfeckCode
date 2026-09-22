---
name: desarrollador-unity
description: "Desarrollo de juegos en Unity 6 LTS con URP/HDRP, C#, optimización, addressables y buenas prácticas. (Unity, URP, C#)"
---

## Project Structure

```
Assets/
├── Scripts/
│   ├── Core/              # GameManager, Singleton, Events
│   ├── Player/            # Player controller, input
│   ├── Enemies/           # AI, state machines
│   ├── UI/                # Screens, HUD, popups
│   ├── Audio/
│   ├── Data/              # ScriptableObjects, configs
│   └── Utilities/         # Extensions, helpers
├── Prefabs/
├── ScriptableObjects/
├── Addressables/
│   ├── Characters/
│   ├── Environments/
│   └── UI/
├── Scenes/
├── Materials/
├── Textures/
├── Models/
└── Audio/
```

## Architecture Patterns

### State Machine

```csharp
public interface IState
{
    void Enter();
    void Update();
    void Exit();
}

public class StateMachine
{
    private IState _currentState;

    public void ChangeState(IState newState)
    {
        _currentState?.Exit();
        _currentState = newState;
        _currentState.Enter();
    }

    public void Update() => _currentState?.Update();
}

// Usage
public class EnemyPatrolState : IState { ... }
public class EnemyChaseState : IState { ... }
public class EnemyAttackState : IState { ... }
```

### ScriptableObject Config

```csharp
[CreateAssetMenu(fileName = "EnemyConfig", menuName = "Config/Enemy")]
public class EnemyConfig : ScriptableObject
{
    public float moveSpeed = 3f;
    public float detectionRange = 10f;
    public float attackRange = 2f;
    public float attackCooldown = 1.5f;
    public int maxHealth = 100;
    public GameObject prefab;
}

// Reference in inspector or load via Addressables
public class Enemy : MonoBehaviour
{
    [SerializeField] private EnemyConfig _config;

    private void Start()
    {
        _health = _config.maxHealth;
        _navMeshAgent.speed = _config.moveSpeed;
    }
}
```

### Observer Pattern (Events)

```csharp
public static class GameEvents
{
    public static event Action<int> OnScoreChanged;
    public static event Action OnPlayerDied;
    public static event Action<Enemy> OnEnemyKilled;

    public static void ScoreChanged(int score) => OnScoreChanged?.Invoke(score);
    public static void PlayerDied() => OnPlayerDied?.Invoke();
    public static void EnemyKilled(Enemy enemy) => OnEnemyKilled?.Invoke(enemy);
}

// Subscriber
public class UIManager : MonoBehaviour
{
    [SerializeField] private TMP_Text _scoreText;

    private void OnEnable() => GameEvents.OnScoreChanged += UpdateScore;
    private void OnDisable() => GameEvents.OnScoreChanged -= UpdateScore;

    private void UpdateScore(int score) => _scoreText.text = score.ToString();
}
```

### Object Pooling

```csharp
public class ObjectPool : MonoBehaviour
{
    [SerializeField] private GameObject _prefab;
    [SerializeField] private int _initialSize = 10;

    private readonly Queue<GameObject> _pool = new();

    private void Start()
    {
        for (int i = 0; i < _initialSize; i++)
        {
            var obj = Instantiate(_prefab, transform);
            obj.SetActive(false);
            _pool.Enqueue(obj);
        }
    }

    public GameObject Get(Vector3 position, Quaternion rotation)
    {
        var obj = _pool.Count > 0 ? _pool.Dequeue() : Instantiate(_prefab, transform);
        obj.transform.SetPositionAndRotation(position, rotation);
        obj.SetActive(true);
        return obj;
    }

    public void Return(GameObject obj)
    {
        obj.SetActive(false);
        _pool.Enqueue(obj);
    }
}
```

## Input System (New)

```csharp
public class PlayerInput : MonoBehaviour
{
    private InputActions _actions;

    public Vector2 Move { get; private set; }
    public bool JumpPressed { get; private set; }

    private void Awake()
    {
        _actions = new InputActions();
    }

    private void OnEnable()
    {
        _actions.Enable();
        _actions.Player.Move.performed += ctx => Move = ctx.ReadValue<Vector2>();
        _actions.Player.Move.canceled += _ => Move = Vector2.zero;
        _actions.Player.Jump.performed += _ => JumpPressed = true;
    }

    private void LateUpdate() => JumpPressed = false;
}
```

## Addressables

```csharp
// Load single asset
var handle = Addressables.LoadAssetAsync<GameObject>("Enemy_Prefab");
await handle.Task;
var prefab = handle.Result;

// Instantiate
var instance = Instantiate(prefab, position, rotation);

// Load scene
await Addressables.LoadSceneAsync("GameScene", LoadSceneMode.Additive).Task;

// Cleanup
Addressables.Release(handle);
```

## Performance Tips

- Object pooling for frequently instantiated objects (bullets, enemies).
- `Object.Instantiate` is expensive. Pool instead.
- Profile with the Profiler + Frame Debugger.
- Use `Canvas.willRenderCanvases` sparingly — mark UI elements dirty only when changed.
- `SpriteAtlas` for 2D batching.
- LOD groups for 3D models.
- `Texture2D.Compress` for mobile.
- Avoid `GetComponent` in Update. Cache in Awake.
- `struct` over `class` for small data (no GC pressure).
- `Span<T>` and `MemoryMarshal` for array operations.

## Rules

- ScriptableObject for configuration data. Hard-coded = debt.
- Event-driven architecture. No direct references between systems.
- Object pooling for anything spawned frequently.
- New Input System over legacy.
- Profile before optimizing. The Profiler doesn't lie.
- Addressables for asset management in production.
- Separate logic from MonoBehaviour when possible (testability).
- Cache component references in Awake, not per-frame.

## Referencias oficiales y repositorios famosos

Esta sección amplía sin modificar los patrones existentes. Úsela para validar Unity 6 LTS, render y Addressables.

### Documentación oficial

- Unity Manual 6 LTS: https://docs.unity3d.com/Manual/index.html — referencia base del motor y flujos.
- Scripting API: https://docs.unity3d.com/ScriptReference/ — `MonoBehaviour`, `ScriptableObject` y ciclo de vida.
- Input System: https://docs.unity3d.com/Packages/com.unity.inputsystem@1.0/manual/index.html — acciones, bindings y dispositivos.
- Addressables: https://docs.unity3d.com/Packages/com.unity.addressables@2.0/manual/index.html — carga, escenas y liberación.
- URP: https://docs.unity3d.com/Packages/com.unity.render-pipelines.universal@17.0/manual/index.html — configuración para móvil y sobremesa.
- Profiler: https://docs.unity3d.com/Manual/Profiler.html — CPU, GPU, memoria y Frame Debugger.
- Best Practices: https://unity.com/resources — guías de rendimiento y arquitectura de Unity.

### Repositorios famosos y listas curadas

- Awesome Unity: https://github.com/RyanNielson/awesome-unity — frameworks, herramientas y patrones curados.
- Unity Examples: https://github.com/Unity-Technologies/UnityCsReference — referencia C# del motor.
- FPS Sample: https://github.com/Unity-Technologies/FPSSample — multijugador y rendimiento de referencia.
- Input System Samples: https://github.com/Unity-Technologies/InputSystem — ejemplos de acciones y UI.
- Addressables Sample: https://github.com/Unity-Technologies/Addressables-Sample — carga remota y grupos.

### Guías de profundización sugeridas

- Revise el Manual LTS correspondiente a la versión exacta instalada antes de usar API nueva.
- Consulte Input System para migrar controles legacy a `InputActions` con mapas por contexto.
- Valide Addressables con perfiles local y remoto antes de publicar contenido descargable.
- Verifique pooling con pruebas de spawn masivo y medición de GC en Profiler.
- Mida con Profiler, Memory Profiler y Frame Debugger antes de optimizar draw calls.

### Checklist de verificación

- [ ] Se consultó `docs.unity3d.com` para la versión 6 LTS instalada.
- [ ] La configuración utiliza `ScriptableObject` y no valores hardcodeados.
- [ ] Los sistemas se comunican por eventos sin referencias directas innecesarias.
- [ ] Todo objeto instanciado con frecuencia utiliza object pooling.
- [ ] Se utiliza New Input System con `InputActions` habilitado por contexto.
- [ ] La gestión de assets en producción utiliza Addressables con `Release` explícito.
- [ ] Las referencias a componentes se cachean en `Awake`.
- [ ] El Profiler valida CPU, memoria y GC antes de declarar optimización completa.
