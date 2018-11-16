export default class RouteParser {

  constructor(links = {}, index = 0) {
    this.routes = links
    this.current = this.routes.root
    this.routeCache = {}
    this.pathIndex = +(index || 0)
  }

  async setPath(location){
    const fullPath = location.pathname.slice(1, location.pathname.length),
          path = fullPath.split("/")[this.pathIndex]

    this.title = null
    this.description = null

    const root = this.routes.root

    try {
      this.current = this.routes[path] || (
        (
          !path || (
            root.regex &&
            new RegExp(root.regex).test(path)
          )
        ) ? root : this.routes.fourOhFour
      )
    } catch(e) {
      this.current = root
    }



    if(this.current.alias) this.current = this.routes[this.current.to] || this.routes.root

    if(this.current.cache && this.routeCache[fullPath]) {
      console.log('cached')
      this.title = this.routeCache[fullPath]
    } else if(this.current.resource) {
      try {
        const regex = new RegExp(this.current.path + (this.current.regex || "/(.*?)(\\/|\\?|$)")),
              matches = location.pathname.match(regex);

        if(matches) {
          let id = matches[this.current.match_idx || (this.current.path ? 1 : 0)];
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
          this.description = this.current.description.replace(/%RESOURCE%/, id)

          if(this.current.cache) this.routeCache[fullPath] = this.title
        } else {
          this.title = this.current.index_title || this.current.title.replace(/%RESOURCE%/, 'Index')
          this.description = this.current.index_description || this.current.description.replace(/%RESOURCE%/, 'Index')
        }

      } catch (e) {
        console.log(e)
        this.title = this.current.title.replace(/%RESOURCE%/, 'Not Found')
        this.description = this.current.description.replace(/%RESOURCE%/, 'Not Found')
      }
    }

    this.title = this.title || this.current.title
    this.description = this.description || this.current.description

    this.setDocumentTitle()

    return {
      title: this.title,
      subtitle: this.description,
    }
  }

  setDocumentTitle(){
    document && (document.title = this.title)
  }

}
