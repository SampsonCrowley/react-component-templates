export default (min) => Math
  .max(
    +((document && document.documentElement && document.documentElement.clientHeight) || min || 0),
    (window.innerHeight || min || 0)
  )
