export default function deepClone(obj) {
  if(typeof obj !== 'object') return obj
  if(obj instanceof Array) return [...obj.map((v) => deepClone(v))]
  
  const {...newObj} = obj
  for(let k in newObj) {
    if(obj.hasOwnProperty(k) && obj[k] && (typeof obj[k] === 'object')) newObj[k] = deepClone(obj[k])
  }
  return newObj
}
