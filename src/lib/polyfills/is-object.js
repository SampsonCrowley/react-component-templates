import './is-array';

if (!Object.isPureObject) {
  Object.isArray = Array.isArray;

  Object.isObject = function(arg, pure = false) {
    return !!(arg && (typeof arg === 'object') && !(pure && Object.isArray(arg)))
  };

  Object.isPureObject = function(arg, noClass = false) {
    return Object.isObject(arg, true) && !(noClass && Object.isClass(arg))
  };

  Object.isClass = function(arg) {
    return /object (?!Array|Object)[A-Za-z]+/.test(Object.prototype.toString.call(arg))
  }
}
