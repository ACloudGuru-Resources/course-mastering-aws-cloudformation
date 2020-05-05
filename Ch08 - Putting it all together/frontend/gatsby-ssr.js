/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// You can delete this file if you're not using it
const React = require('react')
const gitInfo = require('git-repo-info')()

exports.onRenderBody = ({ setBodyAttributes }) => {
  setBodyAttributes({
    'data-version': gitInfo.abbreviatedSha,
  })
}
