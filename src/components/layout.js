import React from "react"
import { Link } from "gatsby"

import { scale } from "../utils/typography"

const Layout = ({ children }) => {
  let header = (
    <div className="container">
      <div className="flex-space-between">
        <div>
          <h1 className="brand" style={{ ...scale(1.15) }}>
            <Link className="post-link" to={`/`}>{`HS`}</Link>
          </h1>
        </div>
        <div className="flex-space-between">
          <h3 className="nav-link">
            <Link to={`/posts`}>{`All Posts`}</Link>
          </h3>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <nav className="navbar">{header}</nav>
      <div className="container main">
        <main>{children}</main>
      </div>
    </>
  )
}

export default Layout
