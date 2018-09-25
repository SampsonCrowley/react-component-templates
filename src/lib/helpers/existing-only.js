export default function existingOnly(prev, next) {
  let changed = false, changes = {}
  for(let k in next) {
    if(prev.hasOwnProperty(k)) {
      if(next[k] && (typeof next[k] === "object") && !(next[k] instanceof Array)){
        const result = existingOnly(prev[k] || {}, next[k])
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
