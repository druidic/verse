# Verse

Verse is a browser application framework inspired by Elm, Redux,
and Redux-Saga. It is designed to allow extremely rapid, iterative
development at all scales of complexity, from tiny hobby projects to
production-ready apps.

Its design is inspired by Richard Gabriel's
famous saying ["Verse is Better"](https://en.wikipedia.org/wiki/Worse_is_better)—Verse
eliminates unnecessary features in favor of extreme simplicity.
It's so simple that you
could probably rewrite it yourself from scratch if you had to. And
that's good, because it means there's no magic or mystery: Verse works
the way you'd expect, and if you're surprised by something it does
you can read the code to figure out why it did that.

### Things Verse Makes Easier

- unit testing without mocks or boilerplate
- making precise runtime type assertions to cover integration points your tests don't check
- hot reloading of app code
- *extremely* fast feedback loops thanks to the aforementioned
- text- and canvas-based UIs
- simulating "threads" of imperative code using generators, a la [redux-saga](https://github.com/redux-saga/redux-saga).
- functional programming: it's got a library that works a lot like
  [lodash](https://lodash.com/docs),
  but with automatic currying

### Things Verse Makes Harder

(in decreasing order of delta-difficulty)

- DOM-based UIs are impossible without some hacking of the
  framework. Verse *really* wants you to just use plain text
  and canvas. In part, this is because getting HTML/CSS UIs
  to look *just right* can be a huge time-sink. Verse
  encourages you to spend that time on actual functionality instead.
- You can't install NPM packages unless you get or make
  a UMD build. "Install" here really means "copy-paste into your
  source code".
- Upgrading any packages you "install" is a similarly manual process:
  delete the old version, paste in the new one.
- There's a bit of added friction to working with Git or any
  other VCS. This is because
  the Grove IDE makes checkins a bit more annoying—you have
  to export your source code from the web browser to get it
  onto your filesystem.

### Things That Might Get Better In Future Versions

- HTTP support
- support for React components?

### TODO

- Better reporting for type errors

## Why?

Existing JavaScript UI frameworks and development practices do not adequately
promote fast feedback loops during development. This is unfortunate, as
experience has demonstrated that fast, accurate feedback during development is
*the* key factor that enables us to rapidly create useful, reliable software.
Moreover, modern JavaScript runtimes are so fast that they *should* accommodate
extremely fast feedback loops. An application's tests can compile and run in milliseconds,
and it is now realistic to imagine a development workflow where [all our tests
run on every keystroke](https://benchristel.github.io/ji).

The reason such fast feedback loops are not common in our industry
is, simply put, that the typical web project has too much code, and too much tooling
wrapped around that code, for the tests to load and run within the requisite time
limit. A modern React/Redux app is typically laden with a mountain of dependencies,
task runners, transpilers, and test frameworks. Sometimes a static type system is thrown in
for good measure. These tools are, on the face of it, useful enough. Each one eases
some pang felt by previous generations of JavaScript developers, and the aggregate
result is that all the old headaches have been cured. Unfortunately, these tools
have created headaches of their own: the new state of the art incorporates
agonizingly slow compilation, dependency hell, and unreliable features
(hot-swapping, anyone? Source maps?)

As an example of how bad this can get: a React/Redux project that I worked on in 2017
had unit tests that took 5 seconds to run—not stellar, but passable. However,
transpiling and `webpack`ing those tests (they ran in a browser with Karma) took
*two minutes*. As [Gary Bernhardt aptly put it](https://www.youtube.com/watch?v=RAxiiRPHS9k&t=931s),
with that kind of wait time, the thing called TDD just doesn't exist anymore. It's
impossible to lean on your feedback loop with any efficacy when it takes two minutes
to get that feedback. A two-minute feedback loop means that if you refactor at all,
you'll refactor in big chunks and break things and then give up and revert everything.
It means you'll look for something else to do in those two minutes and get distracted
by email, so now your feedback loop is really five minutes. It means that when you
finally get your test results, you won't even remember whether
the tests were supposed to pass or not (you always
make your tests fail at least once so you can be sure they're working, right?)

The latest "solutions" to the problems facing modern JavaScript development have consisted
of incremental *additions* of tools and libraries. They have thus completely failed to
address the root cause of the problem, which is that there is too much poorly-understood,
unreliable code in the stack already. The very best we can hope for is that these additional
layers of tooling will allow us to realize the promise of the layers that came before—at
the cost of increased test and build times. That's not an exchange I'm eager to make.

## How?

**Verse speeds up the development feedback loop and ensures that application code is fast and
reliable**. It does this by largely ignoring the existing "best practices" (some would say "fads")
of JavaScript development and building its own, much simpler, tooling stack from scratch.
It does take advantage of choice *concepts* drawn from other languages and libraries, such as
**immutability, pure functions, runtime type checking, thread-style concurrency using generators, and
hot-swapping**. Its design is chosen specifically to enable programmers to leverage
these concepts to their fullest effect.

To dodge the `webpack` step, It's recommended that you write
Verse code in Druidic's browser-based editor, the [Grove](https://druidic.github.io/grove-ii/).
Tests also run in the browser, and are fast enough that they can be re-run on every editor keystroke.
The Verse application architecture, which is based on Redux, allows fine-grained, fast tests
that don't require mocks or other complications to handle asynchronous or side-effecting code.
And text-based UIs written in Verse can easily be integration-tested, since the expected
output is just a string.

NPM dependency hell is also not an issue, because your code won't have any dependencies. Verse provides
everything you need to get started, including a type system, HTTP utilities, and an autocurrying
functional-toolbelt library. If you find yourself really needing more, any UMD package
can simply be copy-pasted into your code.
