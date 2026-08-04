# Cambio

> Juego de cartas multijugador para web y dispositivos móviles.

## 📖 Descripción

Cambio es un juego de cartas multijugador diseñado para partidas privadas entre amigos. El proyecto está desarrollado como un **monorepo**, compartiendo la lógica del juego entre la aplicación web, la aplicación móvil y el servidor.

La filosofía del proyecto es mantener una arquitectura limpia que permita evolucionar fácilmente hacia funcionalidades futuras como reconexión de partidas, estadísticas o cuentas de usuario.

---

# Objetivos

- Permitir salas privadas de **2 a 5 jugadores** mediante un código de sala.
- Ofrecer una interfaz independiente para **Web** y **Mobile**, adaptada a cada plataforma.
- Centralizar toda la lógica del juego en el servidor (**Authoritative Server**) para evitar estados inconsistentes.
- Compartir reglas del juego, tipos y contratos entre todas las aplicaciones.
- Mantener costos de infraestructura bajos utilizando opciones de despliegue gratuitas o de bajo costo.
- Construir una base sólida que facilite la incorporación de nuevas funcionalidades.

---

# Fuera del alcance

Por el momento el proyecto **no contempla**:

- Matchmaking público.
- Soporte para miles de partidas simultáneas.
- Sistema anti-trampas avanzado.
- Persistencia de partidas mediante base de datos.

---

# Arquitectura

El proyecto utiliza una arquitectura **Monorepo**.

Esto permite compartir:

- Tipos
- Reglas del juego
- Configuración
- Dependencias
- Utilidades

entre las distintas aplicaciones sin duplicar código.

## Tecnologías del monorepo

### pnpm Workspaces

Se utiliza para organizar el monorepo y permitir que todos los proyectos puedan consumir paquetes locales como si fueran dependencias publicadas en npm.

### Turborepo

Se utiliza para orquestar todas las tareas del monorepo:

- build
- dev
- lint
- test

Además aprovecha caché incremental para evitar trabajo innecesario y acelerar el desarrollo.

### pnpm

Administrador de paquetes elegido para todo el proyecto.

---

# Estructura del proyecto

```text
apps/
├── web/              React + Vite
├── mobile/           React Native + Expo
└── server/           NestJS

packages/
├── game-core/        Reglas puras del juego
├── contracts/        Tipos, eventos y DTOs compartidos
└── config/           Configuraciones compartidas
```

---

# Arquitectura del servidor

## Authoritative Server

El servidor será el único responsable del estado del juego.

Los clientes nunca modificarán directamente la partida.

Cada acción seguirá el siguiente flujo:

```text
Jugador
    │
    ▼
Envía movimiento
    │
    ▼
Servidor valida
    │
    ├── Inválido → Rechaza
    │
    └── Válido
          │
          ▼
Actualiza estado
          │
          ▼
Envía nuevo estado
          │
          ▼
Todos los clientes sincronizan
```

Este enfoque evita:

- Estados inconsistentes
- Desincronización entre jugadores
- Conflictos cuando varios usuarios actúan al mismo tiempo

## Tecnologías

- NestJS
- Socket.IO

Las partidas se almacenarán **únicamente en memoria**.

No se utilizará base de datos inicialmente debido a que las partidas son temporales y desaparecen cuando finalizan.

---

# Aplicación Web

La versión web estará desarrollada con:

- React
- Vite
- TypeScript

La principal complejidad será mantener sincronizada la interfaz con el estado enviado por el servidor.

## Estado global

Se utilizará **Zustand** para almacenar información relevante de la partida.

Por ejemplo:

- jugador actual
- cartas visibles
- cartas propias
- estado de conexión
- temporizadores

## Animaciones

Se utilizará **Motion**.

Una regla importante del proyecto será:

> Ninguna animación que modifique el estado visual del juego deberá ejecutarse antes de que el servidor confirme la acción.

Esto garantiza que la interfaz siempre represente el estado real de la partida.

---

# Aplicación Mobile

La versión móvil estará desarrollada con:

- React Native
- Expo
- Expo Router

Al compartir gran parte del código con la versión web, se reduce considerablemente el esfuerzo de mantenimiento mientras se mantiene una experiencia nativa tanto en Android como en iOS.

## Expo

Expo será el entorno principal de desarrollo y compilación de la aplicación.

Además de simplificar el proceso de desarrollo, proporciona acceso sencillo a numerosas APIs del dispositivo.

## Consideraciones sobre iOS

Debido a las políticas más restrictivas de Apple respecto a aplicaciones distribuidas fuera de la App Store, es probable que la instalación directa de versiones de desarrollo sea más limitada que en Android.

## Animaciones

La experiencia móvil requiere animaciones más fluidas y gestos nativos.

Se utilizarán:

- React Native Reanimated
- React Native Gesture Handler

---

# Paquetes compartidos

## game-core

Contiene toda la lógica pura del juego.

Ejemplos:

- validación de movimientos
- orden de turnos
- reglas
- efectos de cartas
- cálculo de estados

Este paquete no dependerá de React, React Native ni NestJS.

---

## contracts

Contendrá todos los contratos compartidos entre cliente y servidor.

Por ejemplo:

- DTOs
- Eventos de Socket.IO
- Tipos
- Interfaces

Esto evita duplicación y garantiza que todos los proyectos hablen el mismo lenguaje.

---

## config

Configuraciones reutilizables para todo el monorepo.

Ejemplos:

- ESLint
- TypeScript
- Prettier
- Configuración compartida

---

# Escalabilidad futura

La arquitectura está preparada para incorporar posteriormente funcionalidades como:

- Reconexión de partidas.
- Persistencia mediante base de datos.
- Estadísticas de jugadores.
- Historial de partidas.
- Sistema de cuentas.
- Ranking.
- Matchmaking público.

Sin necesidad de rehacer la arquitectura principal.

---

# Filosofía del proyecto

Este proyecto prioriza:

- Compartir código entre plataformas.
- Mantener una única fuente de verdad del estado del juego.
- Reducir la duplicación de lógica.
- Facilitar el mantenimiento.
- Permitir crecer de forma incremental sin aumentar innecesariamente la complejidad.