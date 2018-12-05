export default class Objected {
  static deepClone(obj) {
    if(typeof obj !== 'object') return obj
    if(obj instanceof Array) return [...obj.map((v) => this.deepClone(v))]

    const {...newObj} = obj
    for(let k in newObj) {
      if(obj.hasOwnProperty(k) && Object.isObject(obj[k])) newObj[k] = this.deepClone(obj[k])
    }
    return newObj
  }

  static existingOnly(prev, next) {
    let changed = false, changes = {}
    for(let k in next) {
      if(prev.hasOwnProperty(k)) {
        if(Object.isPureObject(next[k]) && Object.isPureObject(prev[k])){
          const result = this.existingOnly(prev[k] || {}, next[k])
          if(result.changed) {
            changed = true
            changes[k] = {...(prev[k] || {}), ...result.changes}
          }
        } else if(next[k] !== prev[k]) {
          changed = true
          changes[k] = next[k] || ''
        }
      }
    }
    return {
      changed,
      changes
    }
  }

  static filterKeys(obj = {}, keys = []){
    if(Array.isArray(obj)) return obj.filter((v) => !keys.includes(v))

    const filteredProps = {}
    for(let k in obj) {
      if(!keys.includes(k) && obj.hasOwnProperty(k)) filteredProps[k] = obj[k]
    }
    return filteredProps
  }

  static setValue(obj, k, v) {
    let o = obj || {}
    const keys = k.split('.')
    k = keys.pop()

    if(keys.length) {
      for(let i = 0; i < keys.length; i++) {
        o = o[keys[i]] || {}
      }
    }
    o[k] = v

    return obj
  }

  static getValue(obj, k, v) {
    let o = obj || {}
    const keys = k.split('.')
    k = keys.pop()

    if(keys.length) {
      for(let i = 0; i < keys.length; i++) {
        o = o[keys[i]] || {}
      }
    }

    return o[k] || v
  }
}
