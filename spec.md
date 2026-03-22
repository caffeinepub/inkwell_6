# Story Reviews - Version 6

## Current State
The platform has admin login (password: 3275), guest browsing, public comments (commenter enters a name manually), and private comments. There is no account system for regular commenters.

## Requested Changes (Diff)

### Add
- Commenter account registration: username + password signup
- Commenter login: sign in with username + password to access commenting
- When signed in as a commenter, their username is used automatically for public and private comments (no need to type name)
- Sign out button for logged-in commenters
- A "Sign In to Comment" prompt shown to guests when they try to comment

### Modify
- Public comment form: if commenter is logged in, auto-fill their name; if not, show sign-in prompt
- Private comment form: same as above
- Header: show logged-in commenter's username and sign-out button

### Remove
- Manual name entry for comments when a commenter is logged in

## Implementation Plan
1. Add commenter accounts to the backend (register, login, getCommenterByUsername)
2. Store commenter session in frontend state (username, isLoggedIn)
3. Add Sign Up / Sign In modal for commenters
4. Show commenter username in header when logged in + sign out button
5. Auto-populate commenter name in public and private comment forms when signed in
6. Show "Please sign in to comment" message to guests trying to comment
