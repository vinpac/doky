import * as React from 'react'
import TableOfContentsItem from './TableOfContentsItem'

const { useEffect, useState, useMemo } = React
export interface TableOfContentItem {
  id: string
  level: number
  title: string
  children: TableOfContentItem[]
}
export type TableOfContentsType = TableOfContentItem[]

interface TableOfContentsProps {
  readonly className?: string
  readonly value: TableOfContentsType
}

const TableOfContents: React.SFC<TableOfContentsProps> = ({
  className,
  value,
}) => {
  const ids = useMemo(() => {
    const arr: string[] = []

    const crawl = item => {
      arr.push(item.id)

      if (item.children) {
        item.children.forEach(crawl)
      }
    }

    value.forEach(crawl)

    return arr
  }, [value])
  const [activeItemId, setActiveItemId] = useState<undefined | string>(
    undefined,
  )
  useEffect(() => {
    const updateActiveItemId = () => {
      const top = window.pageYOffset

      if (top + window.innerHeight >= document.body.scrollHeight) {
        setActiveItemId(ids[ids.length - 1])
        return
      }

      let activeId: string | undefined
      ids.forEach(id => {
        const element = document.getElementById(id)

        if (element) {
          if (element.offsetTop <= top) {
            activeId = id
          }
        }
      })

      setActiveItemId(activeId)
    }

    updateActiveItemId()
    window.addEventListener('scroll', updateActiveItemId)

    return () => {
      window.removeEventListener('scroll', updateActiveItemId)
    }
  }, [value])

  return (
    <div className={`DokyTableOfContents${className ? ` ${className}` : ''}`}>
      <h4 className="DokyTableOfContents__Title">TABLE OF CONTENTS</h4>
      {value.map(item => (
        <TableOfContentsItem
          key={item.id}
          item={item}
          activeItemId={activeItemId}
        />
      ))}
    </div>
  )
}

TableOfContents.displayName = 'TableOfContents'

export default TableOfContents
