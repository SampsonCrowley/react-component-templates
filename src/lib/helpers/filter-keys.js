export default function filterKeys(obj = {}, keys = []){
  if(Array.isArray(obj)) return obj.filter((v) => !keys.includes(v))

  const filteredProps = {}
  for(let k in obj) {
    if(!keys.includes(k) && obj.hasOwnProperty(k)) filteredProps[k] = obj[k]
  }
  return filteredProps
}
