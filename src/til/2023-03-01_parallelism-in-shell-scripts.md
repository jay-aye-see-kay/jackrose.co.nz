---
published: 2023-10-18
---

# Parallelism in shell scripts

For better or worse I write a lot of TypeScript, both at work and otherwise. A common pattern in TypeScript to run things in parallel is. This is especially useful when waiting on multiple network requests.

```typescript
await Promise.all([
  fetch("https://example.com/bar"),
  fetch("https://example.com/foo"),
]);
```

I recently learnt that `bash`/`sh` has reasonable support for running things in parallel too

```sh
# start some slow tasks and put them in the background
curl https://example.com/bar &
curl https://example.com/foo &

# wait for all background tasks to finish
wait
```
