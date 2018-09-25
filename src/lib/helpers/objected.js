export default class Objected {
  static deepClone(obj) {
    if(typeof obj !== 'object') return obj
    if(obj instanceof Array) return [...obj.map((v) => Objected.deepClone(v))]

    const {...newObj} = obj
    for(let k in newObj) {
      if(obj.hasOwnProperty(k) && Object.isObject(obj[k])) newObj[k] = Objected.deepClone(obj[k])
    }
    return newObj
  }

  static existingOnly(prev, next) {
    let changed = false, changes = {}
    for(let k in next) {
      if(prev.hasOwnProperty(k)) {
        if(next[k] && (typeof next[k] === "object") && !(next[k] instanceof Array)){
          const result = Objected.existingOnly(prev[k] || {}, next[k])
          if(result.changed) {
            changed = true
            changes[k] = {...(prev[k] || {}), ...result.changes}
          }
        } else if(!prev[k] && (next[k] !== prev[k])) {
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
}
