import React, { PureComponent, Component, Children } from 'react';
import { FixedSizeList as List } from "react-window";

const height = 35;
const outerElementType = React.forwardRef((props, ref) => (
   <div ref={ref} tabIndex={-1} {...props} />
));

class ListItem extends PureComponent {
  render() {
    const { data: { data = [], itemRef }, style, index } = this.props
    const innerRef = (el) => itemRef(index, el)
    return <div ref={innerRef} style={style}>{data[index]}</div>
  }
}

export default class MenuList extends Component {
  constructor(props) {
    super(props)
    const { options, children, getValue, maxHeight } = props,
          [value] = getValue(),
          childArray = Children.toArray(children),
          totalHeight = (childArray.length || 1) * height,
          listHeight = Math.min(totalHeight, maxHeight),
          overscan = listHeight === totalHeight ? 0 : parseInt(listHeight / (0.0 + height) / 2)

    let childIndex = options.indexOf(value)
    if(childIndex === -1) childIndex = childArray.findIndex((el) => el.props.isFocused)
    if(childIndex === -1) childIndex = 0
    const itemOffset = childIndex * height;
    let initialOffset = 0
    if(itemOffset && totalHeight > listHeight) {
      initialOffset = itemOffset
    }

    this.state = { value, childArray, totalHeight, initialOffset, listHeight, overscan }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown)
  }

  get focusIndex() {
    return this.state.childArray.findIndex((el) => el.props.isFocused)
  }

  get itemsPerPage() {
    return Math.floor(this.state.listHeight / height)
  }

  isScrolling = (ev) =>
    ev.key === "ArrowUp"
    || ev.key === "ArrowDown"
    || ev.which === 38
    || ev.which === 40

  isPaging = (ev) =>
    this.isPageUp(ev)
    || ev.key === "PageDown"
    || ev.which === 34

  isPageUp = (ev) => ev.key === "PageUp" || ev.which === 33

  onKeyDown = (ev) => {
    if(this.isScrolling(ev)) {
      setTimeout(this.scrollIntoFocus)
    } else if(this.isPaging(ev)) {
      this.goToPage(ev)
    }
  }

  getOffset = (scrollOffset) => {
    const maxOffset = Math.max(0, this.state.totalHeight - this.state.listHeight),
          minOffset = 0

    return Math.min(maxOffset, Math.max(minOffset, scrollOffset))
  }

  goToPage = (ev) => {
    const scrollOffset = (this.list ? this.list.state : {}).scrollOffset
    if(this.isPageUp(ev)) {
      this.scrollTo(this.list ? scrollOffset - this.state.listHeight : 0)
    } else {
      this.scrollTo(this.list ? scrollOffset + this.state.listHeight : 0)
    }
  }

  scrollIntoFocus = () => {
    const idx = this.focusIndex
    this.scrollToItem(idx)
  }

  onScroll = (opts) => {
    this.setState(opts, this.onScrollUpdate)
  }

  onScrollUpdate = () => {
    const { scrollOffset } = this.state,
          idx = Math.max(0, this.focusIndex),
          itemOffset = idx * height,
          topOffset = itemOffset + height,
          bottomOffset = itemOffset - this.state.listHeight
    if(scrollOffset > topOffset || scrollOffset < bottomOffset) {
      if(scrollOffset > topOffset) {
        const current = Math.ceil(scrollOffset / (height + 0.0))
        this.itemIndexes[current] && this.fireEvent(this.itemIndexes[current], "mouseover")
      } else {
        const current = Math.floor(scrollOffset / (height + 0.0))
        this.itemIndexes[current] && this.fireEvent(this.itemIndexes[current], "mouseover")
      }
    }
  }

  fireEvent(el, eventName) {
    if(el.fireEvent) {
      el.fireEvent('on' + eventName);
    } else {
      var evObj = new Event("mousemove", { bubbles: true });
      el.dispatchEvent(evObj);
    }
  }

  scrollTo = (offset, ...args) =>
    this.list
    && this.list.scrollTo(this.getOffset(offset),...args)

  scrollToItem = (idx,...args) =>
    this.list
    && this.list.scrollToItem(Math.max(idx, 0),...args)

  componentDidUpdate({ children: oldChildren, maxHeight: oldMaxHeight }){
    const { children, getValue, maxHeight } = this.props,
          [value] = getValue(),
          changes = {}
    let changed = false
    if(oldChildren !== children) {
      changed = true
      changes.childArray = Children.toArray(children)
      const totalHeight = (changes.childArray.length || 1) * height;
      if(totalHeight !== this.state.totalHeight || oldMaxHeight !== maxHeight) {
        changes.totalHeight = totalHeight
        const listHeight = Math.min(totalHeight, maxHeight)
        if(listHeight !== this.state.listHeight) {
          changes.listHeight = listHeight
          const overscan = listHeight === totalHeight ? 1 : Math.min(2, Math.max(parseInt((totalHeight - listHeight) / (0.0 + height) / 2), 1))
          if(overscan !== this.state.overscan) changes.overscan = overscan
        }
      }
    }
    if(value !== this.state.value) {
      changed = true
      changes.value = value
    }
    if(changed) this.setState(changes)
  }

  listRef = (el) => this.list = el
  outerRef = (el) => this.outer = el
  innerRef = (el) => this.inner = el
  itemRef = (i, el) => this.itemIndexes[i] = el

  get itemIndexes() {
    this._itemIndexes = this._itemIndexes || {}
    return this._itemIndexes
  }

  render() {
    const { childArray: data = [], listHeight, overscan, initialOffset } = this.state,
          itemRef = this.itemRef

    return (
      <List
        ref={this.listRef}
        outerRef={this.outerRef}
        innerRef={this.innerRef}
        outerElementType={outerElementType}
        height={listHeight}
        itemCount={data.length}
        itemSize={height}
        itemData={{ data, itemRef }}
        initialScrollOffset={initialOffset}
        overscanCount={overscan}
        onScroll={this.onScroll}
      >
        {ListItem}
      </List>
    );
  }
}
