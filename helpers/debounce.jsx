export default function debounce(func, delay = 300){
  let timeout;
  return () => {
    if(timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(arguments), delay)
  }
}
