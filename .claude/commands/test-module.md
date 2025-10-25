# Test Module Generator

Generate comprehensive tests for a module following project testing standards.

## Instructions

Create unit tests, integration tests, and e2e tests for a specified module.

### Steps:

1. **Ask for module name:**
   - Which module to test? (e.g., "user", "product")

2. **Analyze existing code:**
   - Read all use cases in `application/use-cases/`
   - Read repository implementation in `infrastructure/persistence/`
   - Read controllers in `presentation/controllers/`

3. **Create Unit Tests for Use Cases:**
   For each use case, create `{use-case}.spec.ts`:
   - Test happy path
   - Test error cases
   - Mock dependencies (repositories, services)
   - Test validation logic
   - Aim for 100% coverage of business logic

4. **Create Integration Tests for Repository:**
   Create `typeorm-{entity}.repository.spec.ts`:
   - Test CRUD operations
   - Test custom queries
   - Use in-memory database or test container
   - Test relationships (if any)

5. **Create E2E Tests:**
   Create `test/{module}.e2e-spec.ts`:
   - Test complete HTTP flows
   - Test authentication/authorization
   - Test error responses
   - Test edge cases

6. **Follow testing conventions:**
   - Use descriptive test names: `should return user when valid id is provided`
   - Group related tests with `describe` blocks
   - Use `beforeEach` for common setup
   - Clean up after tests
   - Use test factories for creating test data

## Example Test Structure

```typescript
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase
  let repository: jest.Mocked<IUserRepository>

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findByEmail: jest.fn(),
    } as any

    useCase = new CreateUserUseCase(repository)
  })

  describe('execute', () => {
    it('should create user when valid data is provided', async () => {
      // Arrange
      const dto = { email: 'test@example.com', password: '123456' }
      repository.findByEmail.mockResolvedValue(null)
      repository.save.mockResolvedValue(mockUser)

      // Act
      const result = await useCase.execute(dto)

      // Assert
      expect(result).toEqual(mockUser)
      expect(repository.save).toHaveBeenCalledWith(expect.any(User))
    })

    it('should throw error when email already exists', async () => {
      // Arrange
      repository.findByEmail.mockResolvedValue(existingUser)

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(UserAlreadyExistsException)
    })
  })
})
```

## After Creating Tests

1. Run tests: `npm run test`
2. Check coverage: `npm run test:cov`
3. Ensure coverage >80%
4. Fix any failing tests
