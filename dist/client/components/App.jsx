import { createBrowserHistory } from 'history';
import * as React from 'react';
import * as ReactDOM from 'react-dom/server';
import * as slugify from 'slug';
import { createReducer } from '../utils/redux';
import Sandbox, { HASH_PREFIX as SANDBOX_HASH_PREFIX, } from './Sandbox';
import TableOfContents from './TableOfContents';
const { useState, useCallback, useEffect, useRef, useMemo } = React;
const AppReducer = createReducer({
    SET_SANDBOX_OPEN_STATE: (state, action) => {
        return {
            ...state,
            sandboxOpen: action.payload,
        };
    },
});
export const AppContext = React.createContext({});
export const history = createBrowserHistory();
const reduceSandboxOpenState = (state) => {
    const { hash } = history.location;
    if (hash.startsWith(`#${SANDBOX_HASH_PREFIX}`)) {
        const id = hash.substr(SANDBOX_HASH_PREFIX.length + 1);
        return {
            ...state,
            sandboxOpen: true,
            sandboxItemId: id,
        };
    }
    return state;
};
const App = ({ className, pages }) => {
    const categories = useMemo(() => {
        const arr = [];
        pages.forEach(page => {
            if (arr.indexOf(page.meta.category) === -1) {
                arr.push(page.meta.category);
            }
            const sandboxRoutes = [];
            const context = {
                registerToSandBox: (title, children, sourceCode) => {
                    const id = slugify(title, { lower: true });
                    sandboxRoutes.push({ id, title, children, sourceCode });
                    return id;
                },
            };
            ReactDOM.renderToString(<AppContext.Provider value={context}>
          <page.module.default />
        </AppContext.Provider>);
            page.sandboxRoutes = sandboxRoutes;
        });
        return arr;
    }, [pages.length]);
    const [state, setState] = useState(() => ({
        loading: false,
        showLoadingIndicator: false,
        sandboxOpen: false,
        currentPage: pages.find(pageItem => history.location.pathname === pageItem.url),
    }));
    const updatePage = useCallback(async () => {
        const page = pages.find(pageItem => history.location.pathname === pageItem.url);
        if (page) {
            setState(oldState => ({
                ...oldState,
                currentPage: page,
            }));
        }
    }, []);
    const onLinkClick = useCallback((event) => {
        // @ts-ignore
        if (event.metaKey) {
            return;
        }
        event.preventDefault();
        const anchor = event.target;
        const path = `${anchor.pathname || '/'}${anchor.hash}`;
        history.push(path);
    }, [true]);
    useEffect(() => {
        const updateSandboxState = () => setState(reduceSandboxOpenState);
        // Listen for changes to the current location.
        const unlisten = history.listen(() => {
            updateSandboxState();
            updatePage();
        });
        updateSandboxState();
        return unlisten;
    }, [true]);
    const contextValue = useMemo(() => ({
        openSandBox: id => {
            history.push(`${history.location.pathname}#${SANDBOX_HASH_PREFIX}${id}`);
            setState(oldState => ({
                ...oldState,
                sandboxOpen: true,
            }));
        },
        registerToSandBox: title => {
            return slugify(title, { lower: true });
        },
    }), [setState]);
    const handleSandBoxOpenStateChange = (newSandBoxOpenState) => {
        setState(oldState => ({
            ...oldState,
            sandboxOpen: newSandBoxOpenState,
        }));
        if (!newSandBoxOpenState) {
            history.push(history.location.pathname);
        }
    };
    const { currentPage, loading, showLoadingIndicator } = state;
    const tableOfContents = useMemo(() => currentPage && currentPage.module.tableOfContents
        ? currentPage.module.tableOfContents()
        : [], [currentPage]);
    return (<div className={className}>
      <div className="Doky__Nav">
        <a href="/" className="Doky__NavItem" onClick={onLinkClick}>
          <img src="data:image/png;base64,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" alt="" className="Doky__Brand"/>
        </a>
        <a href="/" className="Doky__NavItem">
          <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation">
            <path d="M16.436 15.085l3.94 4.01a1 1 0 0 1-1.425 1.402l-3.938-4.006a7.5 7.5 0 1 1 1.423-1.406zM10.5 16a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z" fillRule="evenodd"/>
          </svg>
        </a>
      </div>
      <div className="Doky__Sidebar">
        {categories.map(category => (<div key={category || ''} className="Doky__SidebarNavGroup">
            <h3 className="Doky__SidebarNavTitle">{category || 'Others'}</h3>
            {pages.map(page => page.meta.category === category && (<React.Fragment key={page.id}>
                    <a key={page.id} href={page.url} onClick={onLinkClick} className={`Doky__SidebarNavItem${currentPage && page.id === currentPage.id
        ? ' Doky__SidebarNavItem--active'
        : ''}`}>
                      {page.meta.title}
                      {page.sandboxRoutes.length && (<span className="DokySidebarNavItem__Badge">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-package">
                            <path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"/>
                            <polyline points="2.32 6.16 12 11 21.68 6.16"/>
                            <line x1="12" y1="22.76" x2="12" y2="11"/>
                            <line x1="7" y1="3.5" x2="17" y2="8.5"/>
                          </svg>
                        </span>)}
                    </a>
                    {currentPage &&
        page.id === currentPage.id &&
        page.sandboxRoutes.map(sandboxRoute => (<a key={sandboxRoute.id} href={`${page.url}#${SANDBOX_HASH_PREFIX}${sandboxRoute.id}`} onClick={onLinkClick} className={`Doky__SidebarNavSandboxItem`}>
                          {sandboxRoute.title}
                        </a>))}
                  </React.Fragment>))}
          </div>))}
      </div>
      <Sandbox pages={pages} open={state.sandboxOpen} activeRouteId={state.sandboxItemId} onOpenStateChange={handleSandBoxOpenStateChange} currentPage={state.currentPage}/>
      <div className="Doky__Body">
        <div className="Doky__Container">
          <div className="DokyContainerSidebar">
            <div className="DokyContainerSidebar__inner">
              <a href={`#${SANDBOX_HASH_PREFIX}`} className="DokyContainerSidebar__button btn btn-primary btn--block mb-4 ta-left">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-package">
                  <path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"/>
                  <polyline points="2.32 6.16 12 11 21.68 6.16"/>
                  <line x1="12" y1="22.76" x2="12" y2="11"/>
                  <line x1="7" y1="3.5" x2="17" y2="8.5"/>
                </svg>
                Open Sandbox
              </a>
              {tableOfContents.length > 0 && (<TableOfContents value={tableOfContents}/>)}
            </div>
          </div>
          {!loading && currentPage && !showLoadingIndicator && (<>
              <div className="DokyHeader">
                <h1 className="DokyHeader__title">{currentPage.meta.title}</h1>
                <p className="DokyHeader__description">
                  {currentPage.meta.description}
                </p>
                <span className="DokyHeader__legend">Feb 14 . 11 min read</span>
              </div>
              {currentPage.module.default && (<AppContext.Provider value={contextValue}>
                  <currentPage.module.default />
                </AppContext.Provider>)}
            </>)}
          {!loading && !currentPage && history.location.pathname === '/' && (<>
              <h1>Pagina inicial</h1>
            </>)}

          {showLoadingIndicator && (<>
              <span className="Docz__placeholder Docz__placeholderTitle"/>
              <span className="Docz__placeholder Docz__placeholderSubtitle mb-4"/>
              <span className="Docz__placeholder Docz__placeholderText"/>
              <span className="Docz__placeholder Docz__placeholderText"/>
              <span className="Docz__placeholder Docz__placeholderText"/>
              <span className="Docz__placeholder Docz__placeholderText"/>
              <span className="Docz__placeholder Docz__placeholderText w-50 mb-4"/>
              <span className="Docz__placeholder Docz__placeholderCode mb-4"/>
              <span className="Docz__placeholder Docz__placeholderText"/>
              <span className="Docz__placeholder Docz__placeholderText"/>
              <span className="Docz__placeholder Docz__placeholderText"/>
              <span className="Docz__placeholder Docz__placeholderText"/>
              <span className="Docz__placeholder Docz__placeholderText w-50 mb-4"/>
            </>)}
        </div>
      </div>
    </div>);
};
App.displayName = 'App';
export default App;
//# sourceMappingURL=App.jsx.map