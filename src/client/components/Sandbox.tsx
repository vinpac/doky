import * as React from 'react'
import Frame from 'react-frame-component'
import Inspector from 'react-inspector'
import { ACTION_OVERRIDE, createReducer } from '../utils/redux'
import { history, Page, SandboxRoute } from './App'
import { getPreviewHead } from './Preview'

interface Log {
  name?: string
  message: string
}

enum InspectorView {
  Console,
  Source,
}

const { useReducer, useCallback, useMemo, useRef, useEffect } = React

interface ActionAddLog {
  type: 'ADD_LOG'
  payload: Log
}

const SandBoxReducer = createReducer<SandBoxState, ActionAddLog>({
  ADD_LOG: (state, action: ActionAddLog) => ({
    ...state,
    logs: [...state.logs, action.payload],
  }),
})

interface SandBoxState {
  logs: Log[]
  inspectorView: InspectorView
}

interface SandboxProps {
  readonly className?: string
  readonly open?: boolean
  readonly activeRouteId?: string
  readonly pages: Page[]
  readonly currentPage?: Page
  readonly onOpenStateChange?: (open: boolean) => any
}

export const HASH_PREFIX = 'sandbox/'

const Sandbox: React.SFC<SandboxProps> = ({
  className,
  open,
  onOpenStateChange,
  activeRouteId,
  pages,
  currentPage,
}) => {
  const [state, dispatch] = useReducer(SandBoxReducer, {
    logs: [],
    inspectorView: InspectorView.Console,
  })
  const scrollNodeRef = useRef<HTMLDivElement | null>(null)
  const handleBackdropClick = useCallback(() => {
    if (onOpenStateChange) {
      onOpenStateChange(false)
    }
  }, [onOpenStateChange])
  const activeItem: SandboxRoute | undefined = useMemo(() => {
    if (!currentPage) {
      return undefined
    }

    return activeRouteId
      ? currentPage.sandboxRoutes.find(item => item.id === activeRouteId)
      : currentPage.sandboxRoutes[0]
  }, [activeRouteId, currentPage && currentPage.sandboxRoutes])

  const handleSelectChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { value } = event.target
      const page = pages.find(p => p.id === value)

      if (page) {
        history.push(`${page.url}#${HASH_PREFIX}`)
      }
    },
    [],
  )
  const log = useMemo(() => {
    const fn = (message: string, name?: string) => {
      dispatch({
        type: 'ADD_LOG',
        payload: {
          name,
          message,
        },
      })
    }

    fn.as = (name: string) => (message: string) => {
      dispatch({
        type: 'ADD_LOG',
        payload: {
          name,
          message,
        },
      })
    }

    return fn
  }, [dispatch])
  useEffect(() => {
    if (scrollNodeRef.current) {
      scrollNodeRef.current.scrollTop = scrollNodeRef.current.scrollHeight
    }
  }, [state.logs.length])
  useEffect(() => {
    dispatch({
      type: ACTION_OVERRIDE,
      payload: {
        logs: [],
      },
    })
  }, [activeRouteId])

  const renderedChildren = activeItem
    ? typeof activeItem.children === 'function'
      ? activeItem.children({ log })
      : activeItem.children
    : null

  return (
    <div
      className={`DokyModal${open ? ' DokyModal--Open' : ''}${
        className ? ` ${className}` : ''
      }`}
    >
      <div className="Doky__ModalContainer">
        <div className="Doky__ModalCard DokySandbox__ModalCard">
          <div className="Doky__Sandbox">
            <div className="DokySandboxSidebar">
              <div className="DokySandboxSidebarHeader">
                <h4 className="DokySandboxSidebarHeader__Title">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="#ece4ff"
                    stroke="#403294"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-package"
                  >
                    <path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z" />
                    <polyline points="2.32 6.16 12 11 21.68 6.16" />
                    <line x1="12" y1="22.76" x2="12" y2="11" />
                    <line x1="7" y1="3.5" x2="17" y2="8.5" />
                  </svg>
                  <select
                    name=""
                    className="input DokySandboxSibebarHeader__Select"
                    value={currentPage ? currentPage.id : ''}
                    onChange={handleSelectChange}
                  >
                    {pages.map(page => (
                      <option key={page.id} value={page.id}>
                        {page.meta.title}
                      </option>
                    ))}
                  </select>
                </h4>
              </div>
              <div className="DokySandboxSidebar__Body">
                {currentPage &&
                  currentPage.sandboxRoutes.map((route, i) => (
                    <a
                      key={route.id}
                      href={`#${HASH_PREFIX}${route.id}`}
                      className={`DokySandboxSidebar__Item${
                        (activeRouteId
                        ? route.id === activeRouteId
                        : i === 0)
                          ? ' DokySandboxSidebar__Item--Active'
                          : ''
                      }`}
                    >
                      {route.title}
                    </a>
                  ))}
              </div>
            </div>
            <div className="DokySandboxBody">
              <div className="DokySandboxHeader">
                {activeItem && (
                  <h4 className="DokySandboxHeader__Title">
                    {activeItem.title}
                  </h4>
                )}
              </div>
              <div className="DokySandboxPreview">
                <Frame
                  className="DokySandboxPreview__Frame"
                  head={getPreviewHead()}
                  scrolling="no"
                >
                  <div>
                    {renderedChildren}
                    <style>{`
                  .frame-root {
                    padding: 8px;
                  }
                `}</style>
                  </div>
                </Frame>
              </div>
              <div className="DokySandboxInspector">
                <div className="DokySandboxInspector__Header">
                  <button
                    className={`DokySandboxInspector__Tab${
                      state.inspectorView === InspectorView.Console
                        ? ' DokySandboxInspector__Tab--Active'
                        : ''
                    }`}
                    onClick={() =>
                      dispatch({
                        type: ACTION_OVERRIDE,
                        payload: {
                          inspectorView: InspectorView.Console,
                        },
                      })
                    }
                  >
                    CONSOLE
                  </button>
                  <button
                    className={`DokySandboxInspector__Tab${
                      state.inspectorView === InspectorView.Source
                        ? ' DokySandboxInspector__Tab--Active'
                        : ''
                    }`}
                    onClick={() =>
                      dispatch({
                        type: ACTION_OVERRIDE,
                        payload: {
                          inspectorView: InspectorView.Source,
                        },
                      })
                    }
                  >
                    SOURCE
                  </button>
                </div>
                <div className="DokySandboxInspector__Body">
                  <div
                    ref={scrollNodeRef}
                    className="DokySandboxInspector__Scroll"
                  >
                    {state.inspectorView === InspectorView.Console &&
                      state.logs.map((logItem, i) => (
                        <ul
                          key={i}
                          className={`DokySandboxInspector__LogItem${
                            i % 2 ? ' DokySandboxInspector__LogItem--2' : ''
                          }`}
                        >
                          <Inspector
                            name={logItem.name}
                            data={logItem.message}
                          />
                        </ul>
                      ))}
                    {state.inspectorView === InspectorView.Source &&
                      activeItem &&
                      activeItem.sourceCode && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: activeItem.sourceCode,
                          }}
                        />
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="DokyModal__Backdrop" onClick={handleBackdropClick} />
    </div>
  )
}

Sandbox.displayName = 'Sandbox'

export default Sandbox
