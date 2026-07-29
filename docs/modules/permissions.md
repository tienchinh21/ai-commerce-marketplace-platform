# Permissions

Phase 1 dùng permission-based auth theo resource/action.

## Tables

```txt
users
permissions
user_permissions
```

## Permission Examples

```txt
product:read
product:write
review:read
review:moderate
seller:read
seller:write
buyer:read
source:read
source:write
source:sync
ai:search
ai:review:analyze
ai:analyst:chat
```

## Admin Usage

Admin FE dùng permission để:

- render menu;
- ẩn/hiện button;
- guard route;
- chặn action trước khi gọi API.

Core-service vẫn là nơi enforce permission chính. FE permission chỉ để UX tốt hơn, không thay thế backend authorization.

AI Platform verify JWT hoặc service token trước khi chạy AI action.

