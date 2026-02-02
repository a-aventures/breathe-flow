# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Supabase authentication with magic link support
- Password-based authentication as fallback
- Protected routes requiring sign-in
- Sign-out functionality in settings
- Email validation on sign-in form
- Password length validation (minimum 6 characters)
- Loading states during authentication
- Session persistence across app launches

### Changed
- Breathing visualization now uses independent color transitions for foreground and background
- Background color changes when transitioning to exhale (hidden at full fill)
- Foreground color changes when transitioning to inhale (hidden at empty)
- Colors cycle through complementary pairs for smoother visual experience

### Security
- Input validation for email and password fields
- Environment variable validation on startup
- Proper error handling for auth failures
