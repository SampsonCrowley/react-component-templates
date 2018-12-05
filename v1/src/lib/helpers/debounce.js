export default function debounce(func, delay = 300){
  let timeout;
  return function() {
    if(timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, arguments), delay)
  }
}
