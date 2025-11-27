# Contributing to pay-by-transfer

First off, thank you for considering contributing to pay-by-transfer! It's people like you that make this project such a great tool for African businesses.

## 🌟 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the [existing issues](https://github.com/o-bernardofoegbu/pay-by-transfer/issues) to see if the problem has already been reported.

**When creating a bug report, include:**

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior** vs what actually happened
- **Code sample** or test case
- **Screenshots** if applicable
- **Environment details** (Node version, OS, npm version)

### Suggesting Features

Feature requests are welcome! Please:

1. Check if the feature has already been suggested
2. Provide a clear use case
3. Explain why this feature would be useful to most users
4. Consider if it fits the project's scope and philosophy

### Pull Requests

**Good pull requests** - patches, improvements, new features - are fantastic!

**Before submitting a PR:**

1. Fork the repo and create your branch from `main`
2. If you've added code, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Write a clear commit message

## 🔧 Development Process

### Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/pay-by-transfer.git
cd pay-by-transfer

# Install dependencies
npm install

# Create a branch
git checkout -b feature/my-new-feature

# Make your changes and test
npm test

# Commit your changes
git commit -m "Add some feature"

# Push to your fork
git push origin feature/my-new-feature
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- tests/unit/PayByTransfer.test.js

# Run with coverage
npm run test:coverage
```

### Code Style

We use ESLint and Prettier to maintain consistent code style:

```bash
# Check linting
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code
npm run format
```

**Code Style Guidelines:**

- Use descriptive variable names
- Write JSDoc comments for functions
- Keep functions small and focused
- Follow existing patterns in the codebase
- Write tests for new functionality

## 📝 Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```
feat(provider): add Flutterwave provider support

- Implement FlutterwaveProvider class
- Add webhook normalization
- Include tests

Closes #123
```

```
fix(matcher): improve reference matching accuracy

Fixed false positives in payment matching when amounts
are identical but references differ.

Fixes #456
```

## 🎯 What to Work On

### Good First Issues

Look for issues labeled [`good first issue`](https://github.com/o-bernardofoegbu/pay-by-transfer/labels/good%20first%20issue) - these are beginner-friendly and well-documented.

### Help Wanted

Issues labeled [`help wanted`](https://github.com/o-bernardofoegbu/pay-by-transfer/labels/help%20wanted) need community assistance.

### Priority Areas

We especially welcome contributions in:

- **New Providers** - Add support for more payment providers
- **Documentation** - Improve guides, add examples
- **Tests** - Increase test coverage
- **Bug Fixes** - Fix reported issues
- **Performance** - Optimize existing code

## 🧪 Testing Guidelines

### Writing Tests

All new features must include tests. We use Jest.

```javascript
// tests/unit/providers/manual.test.js
describe("ManualProvider", () => {
  test("should create payment session", async () => {
    const provider = new ManualProvider({
      account: {
        number: "1234567890",
        name: "TEST",
        bank: "GTBank",
      },
    });

    const session = await provider.createSession({
      amount: 5000,
      reference: "TEST_001",
    });

    expect(session.accountNumber).toBe("1234567890");
    expect(session.reference).toBe("TEST_001");
  });
});
```

### Test Coverage

- Aim for **80%+ coverage** on new code
- Test happy paths AND error cases
- Test edge cases (empty values, large numbers, etc.)
- Mock external API calls

## 📚 Documentation Guidelines

### Code Documentation

Use JSDoc for functions:

```javascript
/**
 * Create a payment session
 * @param {Object} options - Payment options
 * @param {number} options.amount - Amount in kobo
 * @param {string} options.reference - Unique payment reference
 * @returns {Promise<Object>} Session details
 * @throws {ValidationError} If validation fails
 */
async create(options) {
  // ...
}
```

### README Updates

If your PR changes functionality:

1. Update the main README.md
2. Update relevant example files
3. Add/update JSDoc comments
4. Consider adding a new example

## 🚀 Adding a New Provider

To add a new payment provider:

1. Create `src/providers/provider-name.js`
2. Extend `BaseProvider`
3. Implement all required methods:
   - `createSession(options)`
   - `verify(reference)`
   - `normalizeWebhook(webhookData)`
   - `verifyWebhookSignature(signature, payload)`
4. Add tests in `tests/unit/providers/provider-name.test.js`
5. Update `src/providers/index.js`
6. Add example in `examples/with-provider-name.js`
7. Update documentation

**Example:**

```javascript
const BaseProvider = require("./base");

class NewProvider extends BaseProvider {
  constructor(config) {
    super(config);
    this.name = "newprovider";
    // Initialize API client
  }

  async createSession(options) {
    // Implement session creation
  }

  async verify(reference) {
    // Implement verification
  }

  normalizeWebhook(webhookData) {
    // Normalize webhook format
  }

  verifyWebhookSignature(signature, payload) {
    // Verify webhook signature
  }
}

module.exports = NewProvider;
```

## 🤔 Questions?

- **General questions:** [GitHub Discussions](https://github.com/o-bernardofoegbu/pay-by-transfer/discussions)
- **Bug reports:** [GitHub Issues](https://github.com/o-bernardofoegbu/pay-by-transfer/issues)
- **Real-time chat:** [Discord](https://discord.gg/paybytransfer)
- **Email:** support@pay-by-transfer.com

## 📜 Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🏆 Contributors

Thank you to all our contributors! Your efforts make this project better for everyone.

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- This section is auto-generated, don't edit manually -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.
