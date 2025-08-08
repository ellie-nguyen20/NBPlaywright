# Team Module Test Structure

## Overview
This directory contains comprehensive tests for the Team Management module, organized by features and roles.

## Directory Structure

```
tests/team/
├── README.md                           # This file
├── team-management.spec.ts             # Main feature-based tests
├── config/
│   └── team-role-config.ts            # Role configuration and permissions
├── common/
│   └── team-common-features.spec.ts   # Common features for all roles
├── owner/
│   └── owner-team-management.spec.ts   # Owner-specific tests
├── member/
│   └── member-team-management.spec.ts  # Member-specific tests
└── admin/
    └── admin-team-management.spec.ts   # Admin-specific tests
```

## Test Organization

### 1. Feature-Based Testing (`team-management.spec.ts`)
- **Team Creation Feature**: Tests for creating teams
- **Team Member Management Feature**: Tests for inviting, canceling, and removing members
- **Team Ownership Feature**: Tests for transferring ownership and deleting teams
- **Role-Based Access Control**: Tests for different role permissions
- **Team UI Validation**: Tests for UI elements and responsive design

### 2. Role-Based Testing
- **Owner Tests** (`owner/owner-team-management.spec.ts`): Tests all owner permissions
- **Member Tests** (`member/member-team-management.spec.ts`): Tests limited member permissions
- **Admin Tests** (`admin/admin-team-management.spec.ts`): Tests all admin permissions
- **Common Tests** (`common/team-common-features.spec.ts`): Tests shared functionality

### 3. Configuration (`config/team-role-config.ts`)
- Defines role permissions and UI elements
- Provides helper functions for role validation
- Centralizes role-based test logic

## Role Permissions

### Owner Role (ID: 0)
**Permissions:**
- ✅ Create teams
- ✅ Invite members
- ✅ Remove members
- ✅ Transfer ownership
- ✅ Delete team
- ✅ Cancel invitations
- ✅ View team settings
- ❌ Leave team

**UI Elements:**
- ✅ Invite member button
- ✅ Team settings tab
- ✅ Delete team button
- ✅ Manage button
- ✅ Delete button

### Member Role (ID: 1)
**Permissions:**
- ❌ Create teams
- ❌ Invite members
- ❌ Remove members
- ❌ Transfer ownership
- ❌ Delete team
- ❌ Cancel invitations
- ❌ View team settings
- ✅ Leave team

**UI Elements:**
- ❌ Invite member button
- ❌ Team settings tab
- ❌ Delete team button
- ✅ Leave team button
- ✅ View button

### Admin Role (ID: 2)
**Permissions:**
- ✅ Create teams
- ✅ Invite members
- ✅ Remove members
- ✅ Transfer ownership
- ✅ Delete team
- ✅ Cancel invitations
- ✅ View team settings
- ❌ Leave team
- ✅ Manage all teams
- ✅ View analytics
- ✅ Bulk operations

**UI Elements:**
- ✅ Invite member button
- ✅ Team settings tab
- ✅ Delete team button
- ✅ Manage button
- ✅ Delete button
- ✅ Admin analytics tab
- ✅ Bulk operations button
- ✅ System settings tab

## Running Tests

### Run all team tests:
```bash
npx playwright test tests/team/
```

### Run specific role tests:
```bash
# Owner tests only
npx playwright test tests/team/owner/

# Member tests only
npx playwright test tests/team/member/

# Admin tests only
npx playwright test tests/team/admin/

# Common features only
npx playwright test tests/team/common/
```

### Run specific feature tests:
```bash
# Team creation tests
npx playwright test --grep "Team Creation"

# Member management tests
npx playwright test --grep "Member Management"

# Ownership tests
npx playwright test --grep "Ownership"
```

## Test Data Management

### Test Data Structure:
```typescript
const testData = {
  teamName: 'Test Team',
  teamDescription: 'Test Description',
  inviteEmail: 'test@gmail.com',
  memberEmail: 'member@gmail.com'
};
```

### Cleanup Strategy:
- Each test creates its own test data
- `test.afterEach()` cleans up created teams
- Uses API functions for reliable cleanup

## API Integration

### Used API Functions:
- `createTeam()`: Create new teams
- `inviteMemberToTeam()`: Invite members
- `deleteTeamByName()`: Clean up test data
- `getTeams()`: Get user's teams

### Benefits:
- Real API testing instead of mocking
- More reliable and realistic tests
- Better integration testing

## Best Practices

### 1. Test Organization:
- Group related tests using `test.describe()`
- Use descriptive test names
- Separate concerns (UI, API, permissions)

### 2. Data Management:
- Use consistent test data
- Clean up after each test
- Avoid test data conflicts

### 3. Role Testing:
- Test both positive and negative permissions
- Verify UI elements based on role
- Test edge cases for each role

### 4. Error Handling:
- Test network error scenarios
- Verify graceful degradation
- Test empty states

## Metrics and Reporting

### Test Coverage:
- Feature coverage: All team management features
- Role coverage: Owner, Member, and Admin roles
- UI coverage: All interactive elements
- API coverage: All team-related endpoints

### Performance Metrics:
- Test execution time
- API response times
- UI interaction reliability

### Quality Metrics:
- Test pass/fail rates
- Bug detection rate
- Regression prevention

## Future Enhancements

### Planned Features:
1. **Bulk Operations**: Test bulk member management
2. **Advanced Permissions**: Test complex permission scenarios
3. **Performance Tests**: Load testing for team operations
4. **Accessibility Tests**: Ensure UI accessibility compliance
5. **Analytics Integration**: Test admin analytics features

### Potential Improvements:
1. **Parallel Test Execution**: Optimize test execution time
2. **Visual Regression Tests**: Ensure UI consistency
3. **API Contract Tests**: Validate API responses
4. **Security Tests**: Test permission bypass scenarios