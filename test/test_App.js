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
      },
      view: jasmine.createSpy('view')
    }

    let app = App(global)

    expect(global.view).toHaveBeenCalledWith('state: foo')
  })

  it('runs tests before starting', () => {
    let global = {
      test_Foo() {
        _expect(1, isExactly, 2)
      },
      viewTestResults: jasmine.createSpy('viewTestResults')
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
})
