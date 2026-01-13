---
keyword: email
---

The email pattern is sourced from the [HTML spec](https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address).

```
/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
```

## How to use

```typescript
import { emailPattern } from '@studiohyperdrive/regex-common';

const isValidEmail = emailPattern.test('simple@example.com');
```
