# Project Overview

## Project

This is a C# .NET solution using Clean Architecture with Entity Framework Core, and comprehensive testing. The project follows domain-driven design principles with clear separation of concerns across multiple layers.

## Architecture & Patterns

### Clean Architecture Layers
- **Services**: Business logic, domain services, external services, and implementations
- **DataAccess**: Data access (connection to database, DbContext)
- **Entities**: Entity related to database objects
- **Interfaces**: Files related to Service to expose features

### Service Pattern
- Generic repositories for common CRUD operations
- Always use async/await for database operations

## Project Organization

```
COMMONS/
├── Services/     # Business logic, domain services and  external services
├── Dtos/          # Shared DTOs, interfaces, entities
├── Entities/          # Entities
├── Interfaces/          # Interfaces
├── DataAccess/  # Data access
```

## Feature Organization

```
COMMONS/
├── Services/
│   ├── UserService/
├── Entities/
│   ├── User/
└── Interfaces/
    ├── IUser/
    Dtos/
    ├── UserDto/
```
