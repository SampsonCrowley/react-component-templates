import './is-array';

if (!Object.isPureObject) {
  Object.isArray = Array.isArray;

  Object.isObject = function(arg, pure = false) {
    return !!(arg && (typeof arg === 'object') && !(pure && Object.isArray(arg)))
  };

  Object.isPureObject = function(arg) {
    return Object.isObject(arg, true)
  };
}
