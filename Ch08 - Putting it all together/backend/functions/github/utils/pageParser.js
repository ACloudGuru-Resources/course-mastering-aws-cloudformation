(function(window) {
  var octopage = {};
  octopage.parser = parser;

  /**
   * @param  {String} linkStr String from API's response in 'Link' field
   * @return {Object}
   */
  function parser(linkStr) {
    return linkStr
      .split(',')
      .map(function(rel) {
        return rel.split(';').map(function(curr, idx) {
          if (idx === 0) return /[^_]page=(\d+)/.exec(curr)[1];
          if (idx === 1) return /rel="(.+)"/.exec(curr)[1];
        });
      })
      .reduce(function(obj, curr, i) {
        obj[curr[1]] = curr[0];
        return obj;
      }, {});
  }

  // Node.js / io.js
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = octopage;
  }
  // AMD / RequireJS
  else if (typeof define !== 'undefined' && define.amd) {
    define([], function() {
      return octopage;
    });
  }
  // browser side
  else {
    window.octopage = octopage;
  }
})(this);
