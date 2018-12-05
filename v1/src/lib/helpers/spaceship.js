export default class Spaceship {
  static comparor(a, b) {
    /*eslint eqeqeq: ["error", "smart"]*/
    if ((a === null || b === null) || (typeof a != typeof b)) {
      return null;
    }
    if (typeof a === 'string') {
      return (a).localeCompare(b);
    } else {
      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
      }
      return 0;
    }
  }

  static operator(a, b, keys) {
    if(!keys) return this.comparor(a, b)
    else {
      for(let k = 0; k < keys.length; k++) {
        let val = this.comparor(a[keys[k]], b[keys[k]])
        if(val !== 0) return val;
      }
      return 0;
    }
  }
}
