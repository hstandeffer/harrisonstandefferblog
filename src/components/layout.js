import React from "react"
import { Link } from "gatsby"

import { scale } from "../utils/typography"
import DarkModeToggle from "./Toggle/DarkModeToggle"

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
          <p className="nav-link">
            <Link to={`/posts`}>{`All Posts`}</Link>
          </p>
          <DarkModeToggle />
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
