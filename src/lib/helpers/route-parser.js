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
    this.image = null
    this.id = null
    this.emptyFetch = false

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
      this.title = this.routeCache[fullPath].title
      this.description = this.routeCache[fullPath].description
      this.image = this.routeCache[fullPath].image
      this.id = this.routeCache[fullPath].id
    } else if(this.current.resource) {
      try {
        const regex = new RegExp(this.current.path + (this.current.regex || "/(.*?)(\\/|\\?|$)")),
              matches = location.pathname.match(regex);

        if(matches) {
          let description, image, id = matches[this.current.match_idx || (this.current.path ? 1 : 0)]
          if(this.current.api && id){
            if((`${id}`.toLowerCase() === 'new')) {
              id = 'New'
            } else {
              const result = await fetch(this.current.api + id),
                    resource = await result.json()
              id = resource[this.current.method || 'title']
              description = !!this.current.direct_description && resource[this.current.description_method || 'description']
              image = !!this.current.direct_image && resource[this.current.image_method || 'image']
            }
          }
          this.id = id || 'Index'
          this.title = this.current.title.replace(/%RESOURCE%/, this.id)
          this.description = description || ((this.emptyFetch = true) && (this.current.description || '').replace(/%RESOURCE%/, this.id))
          this.image = image || (this.current.image || '').replace(/%RESOURCE%/, this.id)

          if(this.current.cache && this.title) this.routeCache[fullPath] = {
            title: this.title,
            description: this.description,
            image: this.image,
            id: this.id,
          }
        } else {
          this.title = this.current.index_title || this.current.title.replace(/%RESOURCE%/, 'Index')
          this.description = this.current.index_description || this.current.description.replace(/%RESOURCE%/, 'Index')
          this.image = this.current.index_image || this.current.image.replace(/%RESOURCE%/, 'index')
          this.id = 'Index'
        }

      } catch (e) {
        console.log(e)
        this.title = (this.current.title || '').replace(/%RESOURCE%/, 'Not Found')
        this.description = (this.current.description || '').replace(/%RESOURCE%/, 'Not Found')
        this.image = (this.current.image || '').replace(/%RESOURCE%/, 'index')
      }
    }

    this.id = this.id || ''
    this.title = this.title || this.current.title
    this.description = this.description || this.current.description
    this.image = this.image || this.current.image

    this.setDocumentTitle()

    return {
      currentRoute: this.current,
      description: this.description,
      emptyFetch: !!this.emptyFetch,
      id: this.id,
      title: this.title,
      image: this.image
    }
  }

  setDocumentTitle(){
    document && (document.title = this.title)
  }

}
