import 'polyfills/is-object'

describe('Object - isObject', () => {
  const obj = {a: 1, b: 2},
        nil = null,
        num = 1,
        str = 'asdf',
        arr = [nil, void(0), num, str],
        cl = new Date()

  it('returns true for an object, array or class', () => {
    expect(Object.isObject(obj)).toBe(true)
    expect(Object.isObject(arr)).toBe(true)
    expect(Object.isObject(cl)).toBe(true)
  })

  it('returns false for an array in pure mode', () => {
    expect(Object.isObject(arr, true)).toBe(false)
    expect(Object.isObject(obj, true)).toBe(true)
    expect(Object.isObject(cl, true)).toBe(true)
  })

  it('returns false for an undefined, null, number or string', () => {
    for(let i = 0; i < arr.length; i++) expect(Object.isObject(arr[i])).toBe(false)
  })
})

describe('Object - isPureObject', () => {
  const obj = {a: 1, b: 2},
        nil = null,
        num = 1,
        str = 'asdf',
        arr = [nil, void(0), num, str],
        cl = new Date()

  it('returns true for an object', () => {
    expect(Object.isPureObject(obj)).toBe(true)
    expect(Object.isPureObject(cl)).toBe(true)
  })

  it('returns false for an array, undefined, null, number or string', () => {
    expect(Object.isPureObject(arr)).toBe(false)
    for(let i = 0; i < arr.length; i++) expect(Object.isPureObject(arr[i])).toBe(false)
  })

  describe('noClass mode', () => {
    it('returns true for basic object', () => {
      expect(Object.isPureObject(obj, true)).toBe(true)
    })

    it('returns false for a class object', () => {
      expect(Object.isPureObject(cl, true)).toBe(false)
    })
  })
})
