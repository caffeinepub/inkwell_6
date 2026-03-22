# Story Reviews – Banned List Management

## Current State
The app has commenter accounts (V6). Admin can delete public comments. There is no ban/unban system implemented yet -- the admin panel does not have a list of banned users or controls to ban/unban commenters.

## Requested Changes (Diff)

### Add
- A `bannedUsers` state (persisted in localStorage) storing a set/array of banned usernames.
- Admin panel section: "Banned Users" -- shows the current banned list with an unban button next to each name.
- On each public/private comment, admin sees a "Ban" button next to the commenter's name (if not already banned).
- Banned users can still log in but cannot post comments (public or private); they see a message that they are banned.
- Admin can also add a username to the ban list manually (text input + "Ban" button) in the admin panel.

### Modify
- Comment submission logic: check if commenterUser is in bannedUsers before allowing post.
- Admin panel UI: add a new "Banned Users" section.

### Remove
- Nothing removed.

## Implementation Plan
1. Add `bannedUsers` state (string array) with localStorage persistence.
2. Add ban/unban helper functions.
3. In public and private comment submission handlers, block banned users.
4. On each comment rendered (admin view), show a Ban button if commenter is not banned.
5. In admin panel, add Banned Users section: list banned users with Unban buttons + manual add-by-username input.
