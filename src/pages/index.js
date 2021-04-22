import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"

const BlogIndex = ({ data, location }) => {
  const posts = data.latest.edges

  return (
    <Layout location={location}>
      <SEO title="Modern Full Stack JavaScript/React Tips" />
      <h2 className="subheading">Latest Posts</h2>
      {posts.map(({ node }) => {
        const title = node.frontmatter.title || node.fields.slug
        const tags = node.frontmatter.tags
        return (
          <article key={node.fields.slug}>
            <header>
              <h3 className="post-heading">
                <Link className="post-link" to={node.fields.slug}>
                  {title}
                </Link>
              </h3>
              <div className="flex">
                <small className="date">{node.frontmatter.date}</small>
                {tags ? tags.map((tag) => (
                  <Link className="tags" key={tag}  to={`/tags/${tag}`}>{tag}</Link>
                )) : null}
              </div>
            </header>
            <section>
              <p
                dangerouslySetInnerHTML={{
                  __html: node.frontmatter.excerpt || node.frontmatter.description || node.excerpt,
                }}
              />
            </section>
          </article>
        )
      })}
      <div style={{ marginTop: rhythm(2) }}>
        <h2 className="subheading">Projects</h2>
        <h3 className="post-heading">
          <Link className="post-link" to="/squigcoffee">
            Squig Coffee
          </Link>
        </h3>
        <p>An easy way to discover new high-quality coffee.</p>
      </div>
      <hr
        style={{
          marginBottom: rhythm(2),
        }}
      />
      <Bio />
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    latest: allMarkdownRemark(
      limit: 4
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { template: { eq: "post" } } }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            excerpt
            tags
          }
        }
      }
    }
  }
`