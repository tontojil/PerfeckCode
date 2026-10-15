---
name: patrones-pruebas-python
description: "Ordena tests en Python con pytest, fixtures, mocks, parametrize y flujo TDD. (pytest, fixtures, mocking)"
---

## Test Structure

```
tests/
├── conftest.py           # Shared fixtures
├── unit/
│   ├── test_services/
│   │   ├── test_user_service.py
│   │   └── test_payment_service.py
│   └── test_models/
│       └── test_user.py
├── integration/
│   ├── test_api/
│   │   ├── test_users_api.py
│   │   └── test_auth_api.py
│   └── test_repositories/
│       └── test_user_repo.py
└── e2e/
    └── test_checkout.py
```

## Fixtures

### conftest.py

```python
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.database import get_db, engine
from app.models import Base

@pytest.fixture(autouse=True)
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c

@pytest.fixture
async def authenticated_client(client: AsyncClient, db_session):
    user = await create_test_user(db_session)
    token = create_test_token(user.id)
    client.headers["Authorization"] = f"Bearer {token}"
    client._test_user = user
    yield client

@pytest.fixture
def mock_email_service(mocker):
    return mocker.patch("app.services.email.EmailService.send", return_value=None)
```

## Parametrize

```python
@pytest.mark.parametrize("email,expected_valid", [
    ("user@example.com", True),
    ("invalid-email", False),
    ("", False),
    ("a@b.c", True),
    ("user+tag@example.com", True),
])
async def test_email_validation(email: str, expected_valid: bool):
    result = validate_email(email)
    assert result.is_valid == expected_valid

@pytest.mark.parametrize("amount,discount,expected", [
    (100, 0, 100),
    (100, 0.1, 90),
    (100, 0.5, 50),
    (0, 0.1, 0),
])
def test_price_calculation(amount: float, discount: float, expected: float):
    assert calculate_price(amount, discount) == expected
```

## Mocking

### Service Mock

```python
async def test_send_welcome_email(mocker, user_service):
    mock_send = mocker.patch("app.services.email.EmailService.send")

    user = await user_service.register(UserCreate(
        email="test@example.com",
        name="Test",
        password="password123",
    ))

    mock_send.assert_called_once()
    call_args = mock_send.call_args
    assert call_args[1]["recipient"] == user.email
    assert "welcome" in call_args[1]["subject"].lower()
```

### Database Mock

```python
async def test_get_user_not_found(mock_db):
    mock_db.fetchone.return_value = None
    repo = UserRepository(mock_db)

    result = await repo.get_by_id(999)

    assert result is None
    mock_db.fetchone.assert_called_once()
```

### Time Mock

```python
from freezegun import freeze_time

@freeze_time("2025-01-15 10:00:00")
def test_subscription_expiration():
    sub = Subscription(created_at=datetime.utcnow())
    assert sub.is_expired is False

    with freeze_time("2025-02-15 10:00:00"):
        assert sub.is_expired is True
```

## TDD Pattern

```python
# RED: Write failing test first
async def test_create_user_with_duplicate_email_raises_conflict(client, db_session):
    await create_test_user(db_session, email="test@example.com")

    response = await client.post("/api/users", json={
        "email": "test@example.com",
        "name": "Duplicate",
        "password": "password123",
    })

    assert response.status_code == 409

# GREEN: Minimum code to pass
# REFACTOR: Clean up while tests pass
```

## Async Testing

```python
@pytest.mark.asyncio
async def test_concurrent_requests(client):
    import asyncio
    tasks = [client.get("/api/health") for _ in range(10)]
    responses = await asyncio.gather(*tasks)
    assert all(r.status_code == 200 for r in responses)
```

## Custom Markers

```python
# pytest.ini or pyproject.toml
[tool.pytest.ini_options]
markers = [
    "slow: marks tests as slow",
    "integration: marks integration tests",
    "e2e: marks end-to-end tests",
]

# Usage
@pytest.mark.slow
@pytest.mark.integration
async def test_full_import():
    await import_large_dataset()
```

## Coverage

```bash
pytest --cov=app --cov-report=term-missing --cov-fail-under=80
```

## Ejemplo completo con fixtures, mock, parametrize y salida

```python
# test_descuento.py
import pytest
from unittest.mock import Mock

def calcular_descuento(precio: float, porcentaje: float) -> float:
    if precio < 0:
        raise ValueError("El precio no puede ser negativo")
    return precio * (1 - porcentaje)

class Notificador:
    def enviar(self, destino: str, mensaje: str) -> None:
        ...

def comprar(precio: float, porcentaje: float, notificador: Notificador) -> float:
    total = calcular_descuento(precio, porcentaje)
    notificador.enviar("cliente@example.com", f"Total: {total}")
    return total

@pytest.fixture
def notificador_mock() -> Mock:
    return Mock(spec=Notificador)

@pytest.mark.parametrize("precio,porcentaje,esperado", [
    (100, 0.0, 100),
    (100, 0.1, 90),
    (200, 0.5, 100),
    (0, 0.2, 0),
])
def test_calcular_descuento(precio: float, porcentaje: float, esperado: float):
    assert calcular_descuento(precio, porcentaje) == esperado

def test_comprar_notifica_al_cliente(notificador_mock: Mock):
    total = comprar(100, 0.1, notificador_mock)
    assert total == 90
    notificador_mock.enviar.assert_called_once_with(
        "cliente@example.com", "Total: 90"
    )

def test_precio_negativo_lanza_error():
    with pytest.raises(ValueError, match="no puede ser negativo"):
        calcular_descuento(-10, 0.1)
```

Salida esperada al ejecutar `pytest test_descuento.py -v`:

```text
============================= test session starts ==============================
collected 6 items

test_descuento.py::test_calcular_descuento[100-0.0-100] PASSED            [ 16%]
test_descuento.py::test_calcular_descuento[100-0.1-90] PASSED             [ 33%]
test_descuento.py::test_calcular_descuento[200-0.5-100] PASSED            [ 50%]
test_descuento.py::test_calcular_descuento[0-0.2-0] PASSED                [ 66%]
test_descuento.py::test_comprar_notifica_al_cliente PASSED                [ 83%]
test_descuento.py::test_precio_negativo_lanza_error PASSED                [100%]

============================== 6 passed in 0.12s ===============================
```

## Referencias oficiales y repositorios famosos

- Documentación de pytest: https://docs.pytest.org/ — referencia base de fixtures, marcas, parametrize y configuración.
- Cómo usar fixtures: https://docs.pytest.org/en/stable/how-to/fixtures.html — alcance, `conftest.py` y `autouse`.
- `parametrize`: https://docs.pytest.org/en/stable/how-to/parametrize.html — pruebas basadas en datos.
- `unittest.mock`: https://docs.python.org/3/library/unittest.mock.html — `Mock`, `patch` y aserciones.
- Repositorio de pytest: https://github.com/pytest-dev/pytest — código fuente y registro de cambios.
- Plugin `pytest-mock`: https://github.com/pytest-dev/pytest-mock — fixture `mocker` para parches.

## Rules

- One assertion per test concept. Group related assertions in same test.
- `conftest.py` for shared fixtures. No fixtures in test files that are shared.
- `mocker.patch` for external dependencies only. Never mock what you own.
- `@pytest.mark.parametrize` for data-driven tests.
- TDD: RED (failing test) → GREEN (minimal pass) → REFACTOR.
- Test names describe behavior: `test_<scenario>_<expected_outcome>`.
- Arrange-Act-Assert pattern.
- `autouse=True` only for cross-cutting concerns (DB setup, cleanup).
- Integration tests with real DB, not mocks.
