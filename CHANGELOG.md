# Changelog

All important changes to AnishMart are documented here.

## [1.1.0] - 2026-10-05

### Added
- FAQ shopping chatbot
- Chatbot user interface
- Versioned health endpoint `/api/v1/health`
- GitHub Actions CI
- Automated chatbot tests

### Security
- Production database credentials moved to environment variables
- Hardcoded admin credential handling replaced with environment variables
- Vulnerable development dependency removed
- Local SQL backup files excluded from Git

## [1.0.0] - 2026-10-04

### Added
- Buyer registration and login
- Seller registration and dashboard
- Admin dashboard
- Product management
- Search, sorting and dynamic categories
- Cart and wishlist
- COD checkout
- Saved delivery address
- Order history and order status
- Reviews and ratings
- PWA support
- Railway deployment
- Railway MySQL database

### Deployment
- Live application: https://anishmart-production.up.railway.app