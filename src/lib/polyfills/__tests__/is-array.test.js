import 'polyfills/is-array'

describe('Array - isArray', () => {
  const obj = {a: 1, b: 2},
        nil = null,
        num = 1,
        str = 'asdf',
        arr = [obj, nil, num, str];

  it('returns false for an object', () => {
    expect(Array.isArray(obj)).toBe(false)
  })
})
