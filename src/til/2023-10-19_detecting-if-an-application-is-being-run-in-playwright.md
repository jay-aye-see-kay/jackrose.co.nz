# Detecting if an application is being run in playwright (or other automation tools)

In general you shouldn't design your web application to detect and behave differently in a test as it reduces the value of a passing test.

But occasionally it's a reasonable approach. In today's case we had an internal dev-tool that popped up in staging environments, that would occasionally get selected in tests causing them to fail. The long term fix is not to run e2e tests against a staging environment, and we're working on it - but for now I wanted to detect if playwright was running the application and disable the dev-tool causing issues.

While researching this I learned about [navigator.webdriver](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/webdriver) a boolean property set when the browser is being automated. This is easy to use and semantically clear, perfect. In theory this should also work with other browser automation and e2e testing tools, but I haven't verified this.

So the fix is:

```typescript
const isPlaywright = navigator.webdriver;
```

---

There is one notable problem with this approach, it doesn't work on Firefox. [There's a bug open](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/webdriver) about the issue, hopefully it's fixed soon.

In the mean time you can also work around this by adding a script to all tested pages ensuring that `navigator.webdriver` always returns true.

```typescript
test.beforeEach(async ({ page }) => {
  await page
    .context()
    .addInitScript(
      "Object.defineProperty(navigator, 'webdriver', { get: () => true })"
    );
});
```
