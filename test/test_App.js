describe('App', () => {
  it('takes a "global" object and looks for functions with conventional names', () => {
    let global = {
      getStateType() {
        return isString
      },
      reducer(state, action) {
        return 'state: ' + action
      },
      *init(tell) {
        tell('foo')
        yield startDisplay(state => state)
      },
      view: jasmine.createSpyObj('view', ['screen'])
    }

    let app = App(global)

    expect(global.view.screen).toHaveBeenCalledWith('state: foo')
  })

  it('runs tests before starting', () => {
    let global = {
      test_Foo() {
        _expect(1, isExactly, 2)
      },
      viewTestResults: jasmine.createSpy('viewTestResults'),
      view() {}
    }
    let app = App(global)
    expect(global.viewTestResults).toHaveBeenCalledWith({
      failures: [jasmine.anything()],
      totalTestsRun: 1
    })
  })

  it('stops the program, canceling any timers', () => {
    jasmine.clock().install()
    let timer = jasmine.createSpy('timer')
    let global = {
      getStateType() {
        return isString
      },
      reducer(state, action) {
        return 'state: ' + action
      },
      *init(tell) {
        yield startTimer(1, timer)
        yield wait(100)
      },
      view: jasmine.createSpy('view')
    }

    let app = App(global)
    app.stop()
    jasmine.clock().tick(1001)
    expect(timer).not.toHaveBeenCalled()
    jasmine.clock().uninstall()
  })

  it('errors if view is not defined', () => {
    let global = {
      getStateType() {},
      reducer(state, action) {},
      *init(tell) {}
    }
    expect(() => App(global)).toThrow('You must define a view() function at the top level')
  })

  it('allows the program to read and update the state', () => {
    let global = {
      getStateType() { return isNumber },
      reducer(state, action) { return (state + 1) * 2 },
      *init(tell) {
        let n = tell()
        yield log(n)
        n = tell()
        yield log(n)
      },
      view: jasmine.createSpyObj('view', ['log'])
    }

    App(global)
    expect(global.view.log).toHaveBeenCalledWith(2)
    expect(global.view.log).toHaveBeenCalledWith(6)
  })

  it('defaults getStateType and init', () => {
    let global = {
      view: jasmine.createSpyObj('view', ['log'])
    }
    expect(() => App(global)).not.toThrow()
    global.init = function*() { yield log('hi') }
    App(global)
    expect(global.view.log).toHaveBeenCalledWith('hi')
  })
})
