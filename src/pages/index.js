import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const BlogIndex = ({ data, location }) => {
  const posts = data.allMarkdownRemark.edges

  return (
    <Layout location={location}>
      <SEO title="Modern JavaScript/React Tips" />
      <h2 className="subheading">Recent Posts</h2>
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
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
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