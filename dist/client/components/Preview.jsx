import * as React from 'react';
import Frame from 'react-frame-component';
import { AppContext } from './App';
import { PreviewCodeProviderContext } from './PreviewCodeProvider';
let previewHeadHtml = null;
export function setPreviewHead(str) {
    previewHeadHtml = str;
}
export function getPreviewHead() {
    return previewHeadHtml;
}
const { useState, useRef, useCallback, useMemo, useEffect, useContext } = React;
const Preview = ({ children, className, title, sandBoxOnly, }) => {
    let slug;
    const { registerToSandBox, openSandBox } = useContext(AppContext);
    const sourceCode = useContext(PreviewCodeProviderContext);
    const iframeRef = useRef(null);
    const [state, setState] = useState({
        height: 'auto',
        unseenLogsCount: 0,
    });
    const updateHeight = useCallback(() => {
        if (iframeRef.current) {
            setState({
                ...state,
                height: iframeRef.current.node.contentWindow.document.body.scrollHeight,
            });
        }
    }, [state.height]);
    const log = useMemo(() => {
        const fn = () => {
            setState({
                ...state,
                // If viewing console set unseenLogsCount to 0
                unseenLogsCount: state.unseenLogsCount + 1,
            });
        };
        fn.as = () => () => setState({
            ...state,
            unseenLogsCount: state.unseenLogsCount + 1,
        });
        return fn;
    }, [state]);
    useMemo(() => {
        if (registerToSandBox) {
            const [newSlug, unregisterFromSandBox] = registerToSandBox(title || 'Default', children, sourceCode);
            slug = newSlug;
            return () => {
                console.log('unregisterFromSandBox');
                unregisterFromSandBox();
            };
        }
    }, [true]);
    const handleClick = useCallback(() => {
        if (openSandBox && slug) {
            openSandBox(slug);
        }
    }, [openSandBox]);
    const renderedChildren = typeof children === 'function' ? children({ log }) : children;
    if (sandBoxOnly) {
        return null;
    }
    return (<div className={`Doky__Preview${state.height !== 'auto' ? ' Doky__Preview--ready' : ''}${className ? ` ${className}` : ''}`} onClick={handleClick}>
      <div className="Doky__PreviewHeader">
        <h4 className="Doky_PreviewTitle">{title}</h4>
        <div className="mr-auto"/>
        <button type="button" name="Console" className="Doky__PreviewButton mr-2">
          {state.unseenLogsCount > 0 && (<span className="Doky__PreviewButtonUnseen">
              {state.unseenLogsCount > 99 ? '99+' : state.unseenLogsCount}
            </span>)}
          <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation">
            <g fillRule="evenodd">
              <path d="M7 9.306C7 6.376 9.238 4 12 4c2.761 0 4.999 2.376 4.999 5.306v6.388C16.999 18.624 14.761 21 12 21c-2.762 0-5-2.376-5-5.306V9.306zm1.999 6.388c0 1.758 1.344 3.183 3.001 3.183 1.657 0 3-1.425 3-3.183V9.306c0-1.758-1.343-3.183-3-3.183S8.999 7.548 8.999 9.306v6.388z"/>
              <path d="M4 12.397a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2H4zm13 0a1 1 0 0 0 0 1.999h3.001a1 1 0 1 0 0-1.999H17zM7.673 15.74L3.65 17.22a1.003 1.003 0 0 0-.59 1.281.986.986 0 0 0 1.267.597l4.021-1.48a1.002 1.002 0 0 0-.338-1.939.978.978 0 0 0-.338.06zM3.062 8.272a.977.977 0 0 0 .606 1.262l3.97 1.4c.527.187 1.11-.076 1.3-.587a.977.977 0 0 0-.606-1.263l-3.97-1.4a1.042 1.042 0 0 0-.347-.06c-.414 0-.805.248-.953.648zm16.536-.532l-3.916 1.368c-.54.189-.82.763-.622 1.282.197.519.795.786 1.335.597l3.916-1.368c.54-.189.82-.763.622-1.281a1.041 1.041 0 0 0-.979-.658c-.117 0-.238.019-.356.06zm-4.538 8.62a1.031 1.031 0 0 0 .622 1.323l3.916 1.413a1.044 1.044 0 0 0 1.335-.617 1.031 1.031 0 0 0-.622-1.324l-3.916-1.414a1.043 1.043 0 0 0-1.335.618z"/>
              <path d="M8.715 9.397a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-6zM8.83 3.33a1 1 0 0 0-.366 1.366l.75 1.3a1 1 0 1 0 1.732-1l-.75-1.3a.998.998 0 0 0-1.367-.366zm5.13.385l-.745 1.289a1.003 1.003 0 1 0 1.739 1.005l.742-1.29a1.006 1.006 0 0 0-.866-1.508 1 1 0 0 0-.87.504z"/>
            </g>
          </svg>
        </button>
        <button type="button" name="Code" className="Doky__PreviewButton">
          <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation">
            <path d="M14.155 4.055a1 1 0 0 0-1.271.62l-4.83 14.046a1 1 0 0 0 1.891.65l4.83-14.045a1 1 0 0 0-.62-1.271m-6.138 8.21l-2.58-2.501L8.236 7.05a.999.999 0 1 0-1.392-1.436l-3.54 3.432a1 1 0 0 0 0 1.436l3.32 3.219a1 1 0 1 0 1.393-1.436m12.219 1.568l-3.32-3.22a.999.999 0 1 0-1.393 1.437l2.58 2.5-2.799 2.715a.999.999 0 1 0 1.392 1.436l3.54-3.432a1 1 0 0 0 0-1.436" fillRule="evenodd"/>
          </svg>
        </button>
      </div>
      <Frame ref={iframeRef} className="Doky__PreviewFrame" head={previewHeadHtml} scrolling="no" style={{ height: `${state.height}px` }} onLoad={updateHeight}>
        <div>
          {renderedChildren}
          <style>{`
          .frame-root {
            padding: 8px;
          }
        `}</style>
        </div>
      </Frame>
    </div>);
};
Preview.displayName = 'Preview';
export default React.memo(Preview);
//# sourceMappingURL=Preview.jsx.map