
# Web Session Counter

What do you do if your boss comes up to you and asks *"So how many
times must a person come to our app before they give us $500?"*

As an engineer you might not care, but this is the stuff that keeps
your CEO and growth lead and head of product up at night. A business
owner that can answer that 👆 question reliably is god amongst men.

You can use this repo :)

## How to use

```
$ npm install --save web-session-counter
```

```javascript

import WebSessionCounter from 'web-session-counter';

// Do this on user activity
WebSessionCounter.update();

// To get the total count of sessions
const count = WebSessionCounter.count;

```

`.update()` is called automatically every time you import
WebSessionCounter. I recommend calling `.update()`, if you have a
single page app that doesn't perform a lot of refreshes. Calling
`.update` frequently, ensures your code will correctly detect every 30
minute period of inactivity.

## What is a session

We use the [same definition as Google Analytics](https://support.google.com/analytics/answer/2731565?hl=en). The tl;dr is that a new session starts after every:

- 30 minutes of inactivity
- midnight
- `utm_campaign` query change


Enjoy.
