import React from 'react'
import PropTypes from 'prop-types'
import Layout from "../components/layout"
import SEO from "../components/seo"

import { Link, graphql } from 'gatsby'

const Tags = ({ pageContext, data }) => {
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark
  const tagHeader = `${totalCount} post${
    totalCount === 1 ? '' : 's'
  } tagged: ${tag}`

  const siteTitle = data.site.siteMetadata.title
  
  return (
    <Layout title={siteTitle}>
    <SEO
      title={`Posts tagged: ${tag}`}
    />
      <div>
        <h2 className="subheading">{tagHeader}</h2>
        <div>
          {edges.map(({ node }) => {
            const { title } = node.frontmatter
            return (
              <div style={{ marginBottom: `1.75rem` }} key={node.fields.slug}>
                <h3 className="post-heading">
                  <Link className="post-link" to={node.fields.slug}>
                    {title}
                  </Link>
                </h3>
                <small className="date">{node.frontmatter.date}</small>
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}

Tags.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
            }),
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
            }),
          }),
        }).isRequired
      ),
    }),
  }),
}

export default Tags

export const pageQuery = graphql`
  query($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
          }
        }
      }
    }
  }
`