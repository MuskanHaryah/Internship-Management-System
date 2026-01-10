# Testing Documentation

## Overview
This document describes the testing infrastructure set up for the Internship Management System.

## Backend Testing

### Test Framework
- **Jest**: JavaScript testing framework
- **Supertest**: HTTP assertion library for API endpoint testing
- **@shelf/jest-mongodb**: MongoDB memory server for isolated test database

### Test Configuration
- **Config File**: `jest.config.js`
- **Test Environment**: Node.js
- **Test Timeout**: 10000ms
- **Coverage**: Enabled for controllers, models, routes, middleware, and utils

### Running Tests
```bash
cd backend
npm test              # Run all tests with coverage
npm run test:watch    # Run tests in watch mode
```

### Test Files
1. **auth.test.js** - Authentication API tests
   - User registration (success, duplicate email, validation)
   - User login (success, wrong password, wrong email, missing credentials)

2. **task.test.js** - Task management API tests
   - Create task (authorized/unauthorized)
   - Get all tasks
   - Get task by ID
   - Update task
   - Delete task

3. **feedback.test.js** - Feedback system API tests
   - Create feedback
   - Get all feedback
   - Filter feedback by intern
   - Update feedback
   - Delete feedback

### Test Setup
- Separate test database: `mongodb://localhost:27017/internship-test`
- Environment variables in `.env.test`
- Setup file: `tests/setup.js` loads test environment
- Database cleanup between tests for isolation

## Frontend Testing

### Test Framework
- **Vitest**: Vite-native test runner
- **@testing-library/react**: React component testing utilities
- **@testing-library/jest-dom**: Custom DOM element matchers
- **@testing-library/user-event**: User interaction simulation
- **jsdom**: Headless browser environment

### Test Configuration
- **Config File**: `vite.config.js` (test section)
- **Test Environment**: jsdom (browser simulation)
- **Globals**: Enabled (describe, it, expect available globally)
- **Coverage**: v8 provider with text/json/html reporters

### Running Tests
```bash
cd frontend
npm test              # Run all tests with coverage
npm run test:watch    # Run tests in watch mode
```

### Test Files
1. **Button.test.jsx** - Button component tests
   - Renders with children
   - Handles click events
   - Applies variant classes
   - Disabled state
   - Loading state
   - Custom className

2. **Card.test.jsx** - Card component tests
   - Renders children
   - Custom className
   - Default styles
   - Hover effects

3. **Input.test.jsx** - Input component tests
   - Renders with label
   - Handles input changes
   - Shows error messages
   - Error styles
   - Textarea variant
   - Disabled state
   - Required indicator

4. **Modal.test.jsx** - Modal component tests
   - Conditional rendering based on isOpen
   - Close button functionality
   - Children content
   - Title display

### Test Setup
- Setup file: `src/tests/setup.js`
- Mock localStorage
- Automatic cleanup after each test
- DOM matchers from jest-dom

## Test Coverage

### Current Coverage
Run `npm test` in backend or frontend directory to see coverage reports.

Coverage reports are generated in:
- Backend: `backend/coverage/`
- Frontend: `frontend/coverage/`

### Coverage Goals
- Controllers: Aim for 80%+
- Models: Aim for 90%+
- Routes: Aim for 100%
- Middleware: Aim for 80%+
- Components: Aim for 70%+

## Testing Best Practices

### Backend
1. **Isolation**: Each test should be independent
2. **Cleanup**: Clear database after each test
3. **Setup**: Use beforeEach for common setup
4. **Assertions**: Test both success and error cases
5. **Authentication**: Use valid tokens from login endpoint

### Frontend
1. **User-Centric**: Test from user perspective
2. **Accessibility**: Use semantic queries (getByRole, getByLabelText)
3. **Interactions**: Simulate real user events
4. **Async**: Wait for async operations to complete
5. **Cleanup**: Automatic cleanup after each test

## Common Test Patterns

### Backend API Test Pattern
```javascript
describe('API Endpoint', () => {
  let authToken;
  
  beforeEach(async () => {
    // Setup: Create user and get auth token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    authToken = res.body.token;
  });
  
  afterEach(async () => {
    // Cleanup: Clear database
    await Model.deleteMany({});
  });
  
  it('should do something', async () => {
    const res = await request(app)
      .post('/api/endpoint')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ data: 'value' });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
```

### Frontend Component Test Pattern
```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Component', () => {
  it('should handle user interaction', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Component onClick={handleClick} />);
    
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Debugging Tests

### Backend
- Use `console.log(res.body)` to inspect API responses
- Check `res.statusCode` for unexpected status codes
- Verify database state with direct queries
- Ensure JWT_SECRET is set in test environment

### Frontend
- Use `screen.debug()` to see rendered HTML
- Check `screen.logTestingPlaygroundURL()` for query suggestions
- Verify component props are passed correctly
- Ensure mocks are properly configured

## Continuous Integration

### Running Tests in CI
```yaml
# Example GitHub Actions workflow
- name: Run Backend Tests
  run: |
    cd backend
    npm install
    npm test

- name: Run Frontend Tests
  run: |
    cd frontend
    npm install
    npm test
```

## Future Improvements

1. **Integration Tests**: Test full user workflows
2. **E2E Tests**: Use Playwright or Cypress
3. **Performance Tests**: Load testing with Artillery
4. **Visual Regression**: Screenshot comparison tests
5. **Code Quality**: ESLint + Prettier integration
6. **Pre-commit Hooks**: Run tests before commits

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest Documentation](https://github.com/visionmedia/supertest)

## Notes

- Tests are configured but some may need debugging for authentication
- Database connection strings are in `.env.test`
- Coverage reports help identify untested code
- Tests should run in CI/CD pipeline before deployment
