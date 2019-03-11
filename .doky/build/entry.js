
    import React from 'react'
      import { setPreviewHead } from '/Users/murdock/lab/blog/preview'
      
      import setupClient from '/Users/murdock/lab/blog/dist/client/setup-client'

      
        import * as page0 from '/Users/murdock/lab/blog/docs/Build a theme.mdx'
        
        import * as page1 from '/Users/murdock/lab/blog/test/fixtures/Basic.mdx'
        
        import * as page2 from '/Users/murdock/lab/blog/test/fixtures/Button.mdx'
        

      setPreviewHead(
        <React.Fragment>
          <link href="/base.css" rel="stylesheet" />
<link href="/index.css" rel="stylesheet" />

        </React.Fragment>
      )

      setupClient([
        {
            id: "docs/Build a theme.mdx",
            meta: {"title":"Build a theme","slug":"build-a-theme","category":"How to"},
            filepath: "/docs/Build a theme.mdx",
            module: page0,
          },{
            id: "test/fixtures/Basic.mdx",
            meta: {"title":"Directory structure","slug":"directory-structure","description":"Understand the directory structure","category":"Components"},
            filepath: "/test/fixtures/Basic.mdx",
            module: page1,
          },{
            id: "test/fixtures/Button.mdx",
            meta: {"title":"Button","slug":"button","description":"The Button Component"},
            filepath: "/test/fixtures/Button.mdx",
            module: page2,
          }
      ])
    