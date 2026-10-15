---
name: iniciacion-fuzzing
description: >
  Metodología de fuzzing para pillar vulnerabilidades con AFL++, libFuzzer, ffuf avanzado,
  mutación de parámetros y fuzzing de protocolos. Úsalo cuando busques fallas que el scanner no ve.
  (fuzzing, AFL++, ffuf, input mutation, coverage-guided)
---

# Introduccion a fuzzing

Metodologia sistematica de fuzzing para descubrir vulnerabilidades que los
escaneres estaticos no detectan. Utilice esta skill solo con autorizacion
explicita y sobre objetivos propios o contratados. Respete alcance, ventana
de prueba y reglas del programa.

## Cuando usar

- Despues de un escaneo inicial (nuclei/nikto), para profundizar.
- Cuando existen parametros sospechosos (ID, archivo, ruta, query, body).
- Binarios o librerias que procesan entradas externas.
- API con parametros POST/GET complejos.
- Protocolos personalizados o formatos de archivo propietarios.

## Referencias oficiales

- OWASP Fuzzing: https://owasp.org/www-community/Fuzzing
- OWASP WSTG - Pruebas de fuzzing: https://owasp.org/www-project-web-security-testing-guide/
- OWASP Top 10 API: https://owasp.org/API-Security/editions/2023/en/0x11-t10/
- AFL++ docs: https://aflplus.plus/docs/
- libFuzzer docs: https://llvm.org/docs/LibFuzzer.html
- ffuf docs: https://github.com/ffuf/ffuf#usage
- Analisis asistido con Claude (triaje de fallas): https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview

## Repositorios pertinentes

- AFL++: https://github.com/AFLplusplus/AFLplusplus
- ffuf: https://github.com/ffuf/ffuf
- SecLists: https://github.com/danielmiessler/SecLists
- boofuzz: https://github.com/jtpereyda/boofuzz
- honggfuzz: https://github.com/google/honggfuzz
- schemathesis: https://github.com/schemathesis/schemathesis

## Ejemplo minimo probado

Harness minimo en C para AFL++ y libFuzzer. Compila con `clang`
y se valida con `clang -fsyntax-only`. No requiere objetivo real.

```c
// objetivo.c - ejemplo minimo para practicar fuzzing
#include <stddef.h>
#include <stdint.h>
#include <string.h>

int procesar(const uint8_t *datos, size_t largo) {
    if (largo >= 4 && memcmp(datos, "FUZZ", 4) == 0) {
        if (largo >= 8 && datos[4] == ':' && datos[5] == '/') {
            return 1;  // Ruta interesante para cobertura
        }
    }
    return 0;
}

#ifdef LIBFUZZER
int LLVMFuzzerTestOneInput(const uint8_t *datos, size_t largo) {
    procesar(datos, largo);
    return 0;
}
#else
#include <stdio.h>
int main(void) {
    uint8_t buf[4096];
    size_t n = fread(buf, 1, sizeof(buf), stdin);
    printf("%d\n", procesar(buf, n));
    return 0;
}
#endif
```

```bash
# Validacion sintactica sin instrumentar
clang -fsyntax-only objetivo.c
# Compilacion libFuzzer (requiere clang)
clang -fsanitize=fuzzer,address -DLIBFUZZER -o fuzz_target objetivo.c
# Compilacion AFL++ (requiere afl-cc instalado)
# afl-cc -o objetivo_afl objetivo.c
```

## Fuzzing web — ffuf avanzado

> Solo utilice estos comandos con autorizacion escrita y dentro del alcance
> acordado. Detenga la prueba si detecta impacto en produccion.

### Descubrimiento de parametros

```bash
# Discover GET parameters
ffuf -u 'http://target.com/page?FUZZ=test' \
  -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-medium-words.txt \
  -fc 404 -mc all

# Discover POST parameters
ffuf -u 'http://target.com/api/endpoint' \
  -X POST -d 'FUZZ=test' \
  -w /usr/share/wordlists/seclists/Discovery/Web-Content/raft-medium-words.txt \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -fc 404 -mc all

# JSON parameter discovery
ffuf -u 'http://target.com/api/graphql' \
  -X POST -d '{"FUZZ":"test"}' \
  -w params.txt -H 'Content-Type: application/json' \
  -fr 'error'
```

### Fuzzing de path traversal

```bash
# LFI parameter fuzzing
ffuf -u 'http://target.com/download?file=FUZZ' \
  -w /usr/share/wordlists/seclists/Fuzzing/LFI/LFI-Jhaddix.txt \
  -fw 0 -fc 404

# Path traversal depth escalation
for depth in $(seq 1 10); do
  prefix=$(printf '../%.0s' $(seq 1 $depth))
  ffuf -u "http://target.com/file?path=${prefix}FUZZ" \
    -w /usr/share/wordlists/seclists/Fuzzing/LFI/LFI-gracefulsecurity-linux.txt \
    -mr 'root:.*:0:0:'
done
```

### Fuzzing de SQLi (mas alla de sqlmap)

```bash
# Boolean-based blind detection
ffuf -u 'http://target.com/item?id=FUZZ' \
  -w /usr/share/wordlists/seclists/Fuzzing/SQLi/quick-SQLi.txt \
  -mr 'syntax error|mysql_fetch|ORA-|PostgreSQL|SQLite' \
  -fc 404

# Time-based blind detection
ffuf -u 'http://target.com/item?id=FUZZ' \
  -w sql-time-payloads.txt \
  -t 1 -timeout 10
```

### Fuzzing de SSTI

```bash
ffuf -u 'http://target.com/template?name=FUZZ' \
  -w /usr/share/wordlists/seclists/Fuzzing/ssti.txt \
  -mr '49|7777777'
```

## Fuzzing de API — esquemas OpenAPI/GraphQL

```bash
# GraphQL introspection → fuzz
# Extract schema, generate mutant queries
graphql-fuzz --endpoint http://target.com/graphql --schema schema.json

# REST API fuzzing with OpenAPI spec
# Mutate each parameter with malicious payloads
cat openapi.json | jq '.paths | keys[]' | while read path; do
  ffuf -u "http://target.com${path}?FUZZ=../../etc/passwd" \
    -w /usr/share/wordlists/seclists/Discovery/Web-Content/api-params.txt
done
```

## Fuzzing de binarios — AFL++

### Configuracion rapida

```bash
# Install
brew install afl-fuzz  # macOS
# or
apt install afl++

# Compile with instrumentation
afl-cc -o target_fuzz target.c

# Create initial corpus
mkdir corpus_in corpus_out
echo "valid_input" > corpus_in/seed1

# Fuzz
afl-fuzz -i corpus_in -o corpus_out -- ./target_fuzz @@
```

### Fuzzing asistido por diccionario

```bash
# Create token dictionary for the format
afl-fuzz -i corpus_in -o corpus_out -x tokens.dict -- ./target_fuzz @@
```

### Modo persistente (mas rapido)

```c
// In the target harness
__AFL_FUZZ_INIT();
while (__AFL_LOOP(10000)) {
  unsigned char *buf = __AFL_FUZZ_TESTCASE_BUF;
  size_t len = __AFL_FUZZ_TESTCASE_LEN;
  process_input(buf, len);
}
```

## Fuzzing con libFuzzer

```bash
# Compile target with -fsanitize=fuzzer,address
clang -fsanitize=fuzzer,address -o fuzz_target fuzz_target.c

# Run with corpus
./fuzz_target corpus/ -max_len=4096 -jobs=4
```

## Fuzzing de protocolos

### Fuzzing de protocolos de red

```bash
# Use boofuzz or spike for TCP/UDP protocols
python3 << 'PYEOF'
from boofuzz import *

session = Session(target=Target(connection=SocketConnection("192.168.1.100", 9999)))
s_initialize("fuzz_request")
s_string("GET")
s_delim(" ")
s_string("/index.html")
s_delim(" ")
s_string("HTTP/1.1")
session.connect(s_get("fuzz_request"))
session.fuzz()
PYEOF
```

### Fuzzing de DNS

```bash
# Mutate DNS queries to find parsing bugs
dns_fuzz --server 10.0.0.53 --domain lab.local --type ALL
```

## Flujo de trabajo de fuzzing

```
1. Identify Input Surface
   ├── HTTP parameters (query, body, headers, cookies)
   ├── File formats (PDF, PNG, XML, JSON, YAML)
   ├── Protocols (custom TCP/UDP, RPC, gRPC)
   └── CLI arguments

2. Choose Fuzzer
   ├── HTTP params → ffuf / wfuzz
   ├── Files → AFL++ / libFuzzer / honggfuzz
   ├── APIs → schemathesis / graphql-fuzz
   └── Protocols → boofuzz / kitty

3. Create Corpus / Wordlist
   ├── Valid payloads + edge cases
   ├── Format dictionaries
   └── Guided mutations

4. Execute Fuzzing
   ├── 30 min minimum
   ├── Monitor crashes/timeouts
   └── Adjust based on coverage

5. Triaging
   ├── Minimize crashes: afl-tmin
   ├── Verify exploitability
   └── Document PoC
```

## Triaje de fallas

```bash
# Minimizar entrada que causa falla
afl-tmin -i crashing_input -o minimized_input -- ./target @@

# Analizar salida de ASAN
# Buscar: heap-buffer-overflow, stack-buffer-overflow, use-after-free

# Determinar explotabilidad
gdb ./target -ex "run < minimized_input" -ex "bt" -ex "info registers"
```

## Integracion con `cazador-vulnerabilidades`

- Fase 2.5 del ciclo central: despues de escanear, antes de explotar.
- Utilice ffuf avanzado para cada endpoint con parametros.
- Si encuentra un binario o libreria: AFL++ con diccionario.
- Documente fallas explotables en la cadena de explotacion.
- Toda entrada que cause falla es candidata a exploit.

## Comandos de referencia rapida

```bash
# Web fuzzing
ffuf -u '<url>' -w <wordlist> -mc all -fc 404 -o results.json

# Binary fuzzing
afl-fuzz -i corpus_in -o corpus_out -m none -- ./target @@

# API fuzzing
ffuf -u '<url>' -X POST -d '{"FUZZ":"test"}' -H 'Content-Type: application/json'

# Crash analysis
afl-tmin -i crash -o minimized -- ./target @@
gdb -batch -ex "run < minimized" -ex "bt" -- ./target
```
