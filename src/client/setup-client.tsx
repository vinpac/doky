import * as ReactDOM from 'react-dom'
import * as slugify from 'slug'
import App from './components/App'

export default pages => {
  ReactDOM.render(
    <App
      pages={pages.map(page => ({
        ...page,
        url: `/${
          page.meta.category
            ? `${slugify(page.meta.category, { lower: true })}/`
            : ''
        }${page.meta.slug}`,
      }))}
    />,
    document.getElementById('root'),
  )
}
