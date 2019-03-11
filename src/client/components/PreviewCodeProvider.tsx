import * as React from 'react'

interface PreviewCodeProviderProps {
  readonly value: string
  readonly children?: React.ReactNode
}

export const PreviewCodeProviderContext = React.createContext('')

const PreviewCodeProvider: React.SFC<PreviewCodeProviderProps> = ({
  value,
  children,
}) => (
  <PreviewCodeProviderContext.Provider value={value}>
    {children}
  </PreviewCodeProviderContext.Provider>
)

PreviewCodeProvider.displayName = 'PreviewCodeProvider'

export default PreviewCodeProvider
