# Paquetes compartidos

Esta carpeta contiene librerías reutilizables por las aplicaciones del monorepo.

Crear un paquete aquí solo cuando exista código que deba ser consumido por dos o más aplicaciones, por ejemplo:

- Tipos, DTOs y contratos de API.
- Esquemas y validaciones.
- Utilidades y constantes de dominio.
- Componentes o configuración compartida.

Ejemplo de estructura:

```text
packages/
  shared/
    package.json
    src/
      index.ts
```

Los paquetes se incluyen automáticamente como workspaces mediante la regla `packages/*` de `pnpm-workspace.yaml`.
