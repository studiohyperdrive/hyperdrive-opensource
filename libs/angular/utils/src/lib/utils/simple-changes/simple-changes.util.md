# simpleChangeHasChanged

Checks whether or not a simpleChange has changed

## How to use

```typescript
import { simpleChangeHasChanged } from "@ngx/utils";

// ...

public ngOnChanges(changes: SimpleChanges): void {
    if (simpleChangeHasChanged(changes.layoutType)) {
       // Do something
    }
}
```
