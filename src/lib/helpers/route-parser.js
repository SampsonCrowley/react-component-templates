export default class RouteParser {

  constructor(links = {}) {
    this.routes = links
    this.current = this.routes.root
    this.routeCache = {}
  }

  async setPath(location){
    const fullPath = location.pathname.slice(1, location.pathname.length),
          path = fullPath.split("/")[0]

    this.title = null

    this.current = this.routes[path] || (!path ? this.routes.root : this.routes.fourOhFour)

    if(this.current.alias) this.current = this.routes[this.current.to] || this.routes.root

    if(this.current.cache && this.routeCache[fullPath]) {
      this.title = this.routeCache[fullPath]
    } else if(this.current.resource) {
      try {
        const regex = new RegExp(path + "/(.*?)(\\/|\\?|$)"),
              matches = location.pathname.match(regex);

        let id = (matches ? matches[1] : null);

        // console.log(regex, id, location.pathname.match(regex))

        if(this.current.api && id){
          if((`${id}`.toLowerCase() === 'new')) {
            id = 'New'
          } else {
            const result = await fetch(this.current.api + id),
                  resource = await result.json()
            id = resource[this.current.method || 'title']
          }
        }
        id = id || 'Index'
        this.title = this.current.title.replace(/%RESOURCE%/, id)

        if(this.current.cache) this.routeCache[fullPath] = this.title
      } catch (e) {
        this.title = this.current.title.replace(/%RESOURCE%/, 'Not Found')
      }
    }

    this.title = this.title || this.current.title

    this.setDocumentTitle()

    return {
      title: this.title,
      subtitle: this.current.description,
    }
  }

  setDocumentTitle(){
    document && (document.title = this.title)
  }

}
