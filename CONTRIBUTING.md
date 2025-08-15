# CONTRIBUTING.md

# Contributing to Real Estate Analytics Platform

First off, thank you for considering contributing to the Real Estate Analytics Platform! It's people like you that make this platform a great tool for the real estate community.

##  Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

##  How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps which reproduce the problem** in as many details as possible.
- **Provide specific examples to demonstrate the steps**.
- **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
- **Explain which behavior you expected to see instead and why.**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
- **Provide specific examples to demonstrate the steps**.
- **Describe the current behavior** and **explain which behavior you expected to see instead**.
- **Explain why this enhancement would be useful** to most users.

### Pull Requests

Please follow these steps to have your contribution considered by the maintainers:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add or update tests as needed
5. Ensure all tests pass
6. Update documentation if needed
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

##  Development Setup

### Prerequisites

- Python 3.11+
- Docker & Docker Compose
- PostgreSQL (for production)
- Redis (for caching and tasks)
- Node.js (for frontend tooling)

### Local Development Setup

1. **Clone your fork**
```bash
git clone https://github.com/your-username/real-estate-analytics-platform.git
cd real-estate-analytics-platform
```

2. **Set up environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

4. **Install dependencies**
```bash
pip install -r requirements-dev.txt
```

5. **Set up pre-commit hooks**
```bash
pre-commit install
```

6. **Initialize database**
```bash
python run.py init-db
python run.py seed-db
```

7. **Run the application**
```bash
python run.py
```

### Using Docker (Alternative)

```bash
docker-compose -f docker-compose.dev.yml up -d
```

##  Testing

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test types
pytest tests/unit/          # Unit tests
pytest tests/integration/   # Integration tests
pytest tests/e2e/          # End-to-end tests
```

### Writing Tests

- Write tests for all new features and bug fixes
- Maintain test coverage above 90%
- Use descriptive test names that explain what is being tested
- Follow the AAA pattern (Arrange, Act, Assert)

Example test structure:
```python
def test_property_valuation_with_valid_data():
    # Arrange
    property_data = create_test_property()
    service = PropertyService()
    
    # Act
    result = service.get_valuation(property_data.id)
    
    # Assert
    assert result is not None
    assert result['estimated_value'] > 0
    assert 0 <= result['confidence_score'] <= 1
```

##  Style Guide

### Python Code Style

We follow PEP 8 with some modifications:

- **Line Length**: 120 characters maximum
- **Imports**: Use isort for import sorting
- **Formatting**: Use Black for code formatting
- **Type Hints**: Use type hints for function signatures
- **Docstrings**: Use Google-style docstrings

Example:
```python
def calculate_property_value(
    property_data: PropertyData,
    market_conditions: MarketData,
    use_ai: bool = True
) -> ValuationResult:
    """Calculate the estimated value of a property.
    
    Args:
        property_data: The property information
        market_conditions: Current market data
        use_ai: Whether to use AI-based valuation
        
    Returns:
        ValuationResult containing estimated value and confidence
        
    Raises:
        ValidationError: If property data is invalid
    """
    # Implementation here
    pass
```

### JavaScript Code Style

- Use ES6+ features
- Use const/let instead of var
- Use meaningful variable names
- Add JSDoc comments for functions

### CSS Style

- Use meaningful class names
- Follow BEM methodology where applicable
- Use CSS custom properties for theming
- Keep specificity low

##  Architecture Guidelines

### Backend Structure

- **Models**: SQLAlchemy models in `app/models/`
- **Services**: Business logic in `app/services/`
- **APIs**: REST endpoints in `app/api/`
- **Repositories**: Data access layer in `app/data/repositories/`

### Frontend Structure

- Keep JavaScript modular and organized
- Use modern ES6+ features
- Implement progressive enhancement
- Ensure mobile responsiveness

### Database

- Use migrations for schema changes
- Add proper indexes for query performance
- Use foreign keys and constraints
- Document schema changes

##  Adding Dependencies

### Python Dependencies

1. Add to `requirements.txt` (production) or `requirements-dev.txt` (development)
2. Update the dependency in `setup.py` if it's a core dependency
3. Run `pip install -r requirements-dev.txt` to install
4. Update documentation if the dependency adds new functionality

### JavaScript Dependencies

1. Add to `package.json` if using npm for frontend tooling
2. Include the library in `app/static/lib/` if adding manually
3. Update documentation for any new features

##  Configuration

### Environment Variables

- Add new variables to `.env.example`
- Document the purpose and format in `config/base.py`
- Provide sensible defaults where possible
- Never commit actual values to version control

### Feature Flags

- Use the existing feature flag system in configuration
- Document new flags in the README
- Provide migration path for deprecated flags

##  Documentation

### Code Documentation

- Write clear docstrings for all public methods
- Include type hints where possible
- Add inline comments for complex logic
- Update API documentation for endpoint changes

### User Documentation

- Update README.md for significant changes
- Add examples to demonstrate new features
- Update deployment documentation if needed
- Create troubleshooting guides for common issues

## ðŸ” Review Process

### What We Look For

- **Functionality**: Does it work as intended?
- **Tests**: Are there appropriate tests with good coverage?
- **Code Quality**: Is the code clean and well-structured?
- **Documentation**: Is the change properly documented?
- **Performance**: Does it maintain or improve performance?
- **Security**: Are there any security implications?

### Review Timeline

- Initial review within 2-3 business days
- Follow-up reviews within 1 business day
- Final approval within 1 week for standard PRs

##  Contribution Areas

We especially welcome contributions in these areas:

### High Priority
- **ML Model Improvements**: Better valuation algorithms
- **Data Source Integrations**: New real estate data APIs
- **Performance Optimization**: Database query optimization
- **Security Enhancements**: Additional security features

### Medium Priority
- **UI/UX Improvements**: Better user interface design
- **Mobile Experience**: Enhanced mobile responsiveness
- **Testing**: Additional test coverage
- **Documentation**: User guides and tutorials

### Low Priority
- **Code Refactoring**: Improving code organization
- **Developer Tools**: Better development experience
- **Monitoring**: Additional metrics and alerts

##  Getting Help

If you need help contributing:

- Check the [documentation](docs/)
- Search existing [GitHub Issues](https://github.com/your-username/real-estate-analytics-platform/issues)
- Join our [GitHub Discussions](https://github.com/your-username/real-estate-analytics-platform/discussions)
- Reach out to maintainers via email

##  Recognition

Contributors are recognized in several ways:

- Listed in the contributors section of README.md
- Mentioned in release notes for significant contributions
- Invited to join the core contributor team for sustained contributions

Thank you for contributing to the Real Estate Analytics Platform! ðŸš€
