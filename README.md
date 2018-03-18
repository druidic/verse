# Verse

Verse is a comprehensive browser application framework inspired by Elm, Redux,
and the Redux-Saga middleware. Its design pushes the UI toward text-based
interfaces in favor of HTML and CSS. We anticipate that this will produce more
reliable and testable application designs. Verse also provides an ergonomic
Canvas API for applications like games that require richer graphical interfaces.

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
task runners, transpilers, and test frameworks. Sometimes a type system is thrown in
for good measure. These tools are, on the face of it, useful enough. Each one eases
some pang felt by previous generations of JavaScript developers, and the aggregate
result is that all the old headaches have been cured. Unfortunately, these tools
have created headaches of their own: agonizingly slow compilation, unreliable features
(hot-swapping, anyone?), and dependency hell are the new state of the art. As
an example of how bad this can get: a React/Redux project that I worked on in 2017
had unit tests that took 5 seconds to run—not stellar, but passable. However,
transpiling and `webpack`ing those tests (they ran in a browser with Karma) took
upwards of a minute. As [Gary Bernhardt aptly put it](https://www.youtube.com/watch?v=RAxiiRPHS9k&t=931s),
with that kind of wait time, the thing called TDD just doesn't exist anymore. It's
impossible to lean on your feedback loop with any efficacy when it takes a *minute*
to get that feedback.

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

To dodge the `webpack` step, Verse code is written entirely in a browser-based editor called the Grove.
Tests also run in the browser, and are fast enough that they can be re-run on every editor keystroke.
The Verse application architecture, which is based on Redux, allows fine-grained, fast tests
that don't require mocks or other complications to handle asynchronous or side-effecting code.

NPM dependency hell is also not an issue, because your code won't have any dependencies. Verse provides
everything you might need, including a type system, HTTP utilities, and an autocurrying
functional-toolbelt library.

If all of this sounds dauntingly complex, don't worry. Verse is implemented in just a few hundred
straightforward, thoroughly-tested lines of JavaScript, so you can easily read the source if you're
confused about something. It's the kind of framework you could write yourself, but you can be glad
you don't have to.
