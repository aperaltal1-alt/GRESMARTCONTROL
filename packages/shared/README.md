# Shared Package

Tipos, constantes y enums compartidos entre `apps/api` y `apps/web`.

## Contenido planificado

- `types/` — Interfaces TypeScript (Producto, GRE, Alerta, etc.)
- `constants/` — Roles, estados, tipos de movimiento
- `enums/` — Enumeraciones compartidas

## Uso

```typescript
import { Rol, GreEstado } from '@gre-smart/shared';
```
