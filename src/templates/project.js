import React from "react"
import { graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"

const ProjectTemplate = ({ data, location }) => {
  const project = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={project.frontmatter.title}
        description={project.frontmatter.description || project.excerpt}
      />
      <article>
        <header>
          <h1
            style={{
              marginTop: rhythm(1),
              marginBottom: 0,
              borderBottom: `3px solid black`,
              paddingBottom: rhythm(0.25)
            }}
          >
            {project.frontmatter.title}
          </h1>
          <p
            style={{
              ...scale(0 / 5),
              display: `block`,
              marginBottom: rhythm(0.25),
              marginTop: rhythm(0.5),
              fontWeight: 700
            }}
          >
            {project.frontmatter.description}
          </p>
          <p
            style={{
              ...scale(0 / 5),
              display: `block`,
              marginBottom: rhythm(1),
              fontStyle: `italic`
            }}
          >
            {project.frontmatter.programming}
          </p>
        </header>
        <section dangerouslySetInnerHTML={{ __html: project.html }} />
        <hr
          style={{
            marginBottom: rhythm(2),
          }}
        />
        <footer className="footer">
          <Bio />
        </footer>
      </article>
    </Layout>
  )
}

export default ProjectTemplate

export const pageQuery = graphql`
  query ProjectBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        programming
      }
    }
  }
`