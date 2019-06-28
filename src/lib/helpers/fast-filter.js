import {
  AllSubstringsIndexStrategy,
  Search,
  UnorderedSearchIndex
} from 'js-search'

export default function createFilterOptions ({
  indexes,
  indexStrategy,
  labelKey = 'label',
  options = [],
  sanitizer,
  searchIndex,
  tokenizer,
  valueKey = 'value'
}) {
  const search = new Search(valueKey)
  search.searchIndex = searchIndex || new UnorderedSearchIndex()
  search.indexStrategy = indexStrategy || new AllSubstringsIndexStrategy()

  if (sanitizer) {
    search.sanitizer = sanitizer
  }

  if (tokenizer) {
    search.tokenizer = tokenizer
  }

  if (indexes) {
    indexes.forEach((index) => {
      search.addIndex(index)
    })
  } else {
    search.addIndex(labelKey)
  }

  search.addDocuments(options)

  let _filter = ''
  let _filtered = options
  let _mapKeys = {}

  const mapKeys = () => {
    _mapKeys = {}
    _filtered.map((v) => _mapKeys[v[valueKey]] = true)
  }

  const onFilter = (filter) => {
    if(_filter !== filter) {
      _filtered = filter
        ? search.search(filter)
        : options
      mapKeys()
    }
  }

  return (option, filter) => {
    if(!filter) return true

    onFilter(filter)

    return _mapKeys[option[valueKey]]
  }
}
