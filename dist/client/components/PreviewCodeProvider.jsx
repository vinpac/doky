import * as React from 'react';
export const PreviewCodeProviderContext = React.createContext('');
const PreviewCodeProvider = ({ value, children, }) => (<PreviewCodeProviderContext.Provider value={value}>
    {children}
  </PreviewCodeProviderContext.Provider>);
PreviewCodeProvider.displayName = 'PreviewCodeProvider';
export default PreviewCodeProvider;
//# sourceMappingURL=PreviewCodeProvider.jsx.map