# Code Style & Conventions

## Naming Conventions
- **PascalCase**: Classes, methods, properties, constants
- **camelCase**: Local variables, parameters
- **UPPER_CASE**: Constants
- **PascalCase**: Namespaces (e.g., `IMG.Project.Commons`)
- **PascalCase**: File names matching class names

## File Organization
- One class per file
- File name matches class name exactly
- Use folder structure: `Service/DomainService/`

## Class Structure

### Basic Class Structure
```csharp
public class ExampleClass
{
    public int Id { get; set; }

    public string Name { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedDate { get; set; }
}
```

## Constructor Injection
- Use primary constructor syntax with parameter validation
- Always validate dependencies with `?? throw new ArgumentNullException(nameof(dependency))`
- Store dependencies in private readonly fields

## Error Handling
- Use `Result<T>` pattern for all operations
- Return `Result<T>.Success(data)` for successful operations
- Return `Result<T>.Failure(error)` for failed operations
- Use `Error.Create(ErrorType.Type, message)` for creating errors
- Log errors with appropriate log levels

## Logging
- Use structured logging with `ILogger<T>`
- Log at appropriate levels: Debug, Information, Warning, Error
- Include context in log messages
- Use `_logger.LogInformation("Operation completed for {EntityId}", entityId);`

## Code Comments
- Use XML documentation for public APIs
- Comment complex business logic
- Use `/// <summary>` for method documentation
- Include parameter and return value documentation

## Formatting Rules
- **Blank lines between properties**: Always add a blank line between class properties
- **No trailing whitespaces**: Remove all trailing whitespaces from lines
- **Consistent indentation**: Use 4 spaces for indentation
- **Line endings**: Use CRLF for Windows compatibility

### Example of Proper Property Formatting
```csharp
public class ExampleEntity
{
    public int Id { get; set; }

    public string Name { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedDate { get; set; }
}
```

## Error Messages
- Use resource files for error messages
- Use `ErrorMessages` class for centralized error messages
- Provide meaningful error messages to users
- Log detailed error information for debugging
