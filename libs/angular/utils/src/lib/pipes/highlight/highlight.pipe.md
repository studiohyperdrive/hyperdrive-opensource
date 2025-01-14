# HighlightPipe

The HighlightPipe will select a piece of text and wrap it in a new element.

By default it will:
* search for matches regardless of accents
* search for matches case-insensitive
* try to replace the entire piece of text
* highlight every match if multiple matches can be found
* use the `<mark>` element
* put `class="mark-highlight"` on to the element

This configuration can be overwritten with a config object:

| Property   | Type                | Default | Options                                                                                                                                     |
| ---------- |---------------------|---------|---------------------------------------------------------------------------------------------------------------------------------------------|
| normalized | `boolean`           | `true`  | <p>When `true`, see *normalizeStringPage* for the behaviour.</p>When `false`, the values will be searched within the provided string as is. |
| caseInsensitive | `boolean`           | `true`  | <p>When `true`, ignore lower and uppercase.</p>When `false`, search case specific.                                                          |
| splitTextToHighlight | `boolean`           | `false` | <p>When `true`, split this value on space and search for the parts</p>When `false`, use the entire string as is.                            |
| someOrEveryMatch | `"some" \| "every"` | `true`  | <p>When `"some"`, Only highlight the first found match.</p>When `"every"`, highlight every match.                                           |
| tag | `string`            | `"mark"`  | The element you want to use to wrap the highlight. If no element is provided, it will fallback to `<mark>`                                  |
| highlightClass | `string`           | `"mark-highlight"`  | the class put on the element for more specific styling if needed. If no class is provided, it will fallback to `"mark-highlight"`                                                                          |

## How to use

```angular2html
<p>
  {{ value | highlight: 'text to highlight' }}
</p>
```

If the provided value is `In this p there is a text to highlight.` it will result in the following structure:

```html
<p>In this p there is a <mark class="mark-highlight">text to highlight</mark>.</p>
```

To use a different wrapping element, do the following:

```angular2html
<p>
  {{ value | highlight: 'text to highlight' : { tag: "strong", highlightClass: ""} }}
</p>
```

Will result in:

```html
<p>In this p there is a <strong>text to highlight</strong>.</p>
```
