import * as React from 'react';
const TableOfContentsItem = ({ item, depth = 0, activeItemId, }) => (<React.Fragment key={item.id}>
    <div className={`DokyTableOfContentsItem${activeItemId === item.id ? ' DokyTableOfContentsItem--active' : ''}${depth > 0 ? ` DokyTableOfContentsItem--Child` : ''}`}>
      <a href={`#${item.id}`}>{item.title}</a>
    </div>
    {item.children.map(childItem => (<TableOfContentsItem key={childItem.id} item={childItem} depth={depth + 1} activeItemId={activeItemId}/>))}
  </React.Fragment>);
TableOfContentsItem.displayName = 'TableOfContentsItem';
export default TableOfContentsItem;
//# sourceMappingURL=TableOfContentsItem.jsx.map