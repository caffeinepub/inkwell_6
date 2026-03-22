# Story Reviews V4 - Public Comments

## Current State
V3 has private comments only: users submit with a name, admin sees all and can reply privately. No public discussion between readers exists.

## Requested Changes (Diff)

### Add
- Public comments section on each story: any visitor can leave a comment with a display name and message, visible to all readers
- Public comments tab/toggle in the comments modal (alongside private comments)
- Comment count on story cards should reflect both public and private comments

### Modify
- Comments modal: add tabs to switch between "Public" and "Private" sections
- Admin can see and delete public comments

### Remove
- Nothing removed

## Implementation Plan
1. Add PublicComment type with id, authorName, message, timestamp
2. Add publicComments state: Record<storyId, PublicComment[]>
3. Update comments modal with tab switcher (Public / Private)
4. Public tab: show all public comments + form to add one (name + message)
5. Admin: can delete any public comment
6. Update comment count badge on story cards to include public comments
