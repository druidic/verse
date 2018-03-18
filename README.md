# Verse

Verse is a comprehensive browser application framework inspired by Elm, Redux,
and the Redux-Saga middleware. Its design pushes the UI toward text-based
interfaces in favor of HTML and CSS. We anticipate that this will produce more
reliable and testable application designs. Verse also provides an ergonomic
Canvas API for applications like games that require richer graphical interfaces.

## Why

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
*transpiling* and `webpack`ing those tests (they ran in a browser with Karma) took
upwards of a minute. As [Gary Bernhardt aptly put it](https://www.youtube.com/watch?v=RAxiiRPHS9k&t=706s),
with that kind of wait time, the thing called TDD just doesn't exist anymore. It's
impossible to lean on your feedback loop with any efficacy when it takes a *minute*
to get that feedback.

Most likely, the shortcomings in our tools are solvable with a little know-how, but the tools
themselves are either so poorly documented or so endlessly configurable that no one
seems to be able to use them well. It's hard to fault developers for this; why devote
your time to learning a particular tool when everyone will soon abandon it for whatever
new shiny thing emerges from next year's crop of NPM packages?

This endless tail-chasing has produced a wave of ennui so widespread it has a name:
[JavaScript Fatigue](https://medium.com/@ericclemmons/javascript-fatigue-48d4011b6fc4).
Personally, I think the name is unfortunate because it frames JavaScript as the culprit
for all the problems, and it's not. JavaScript is more or less the same, simple,
[occasionally bizarre](https://www.destroyallsoftware.com/talks/wat) language it always
has been. JavaScript runtimes have actually gotten *better*: performance has
improved dramatically, and browser vendors have finally standardized their
APIs to the point where we can forego most of the vendor-specific hacks for which
the language was once notorious. JavaScript is not the problem, *the development
environment is*.

I contend that the world has changed: the bogeys that once plagued JavaScript development
are no more, and we are too busy warding them off with offerings of burnt meat and NPM packages
to notice that they are gone. The software development landscape has been steadily
improving around us, so that what once seemed the best path is now merely an adequate one.
If we return to first principles and reinvent our tools and practices, I think we
will discover that the previously unimaginable is now possible.
