exports.handler = (event, context, callback) => {
  console.log('Received event {}', JSON.stringify(event, 3));
  var posts = {
    '1': {
      id: '1',
      title: 'First book',
      author: 'Author1',
      url: 'https://amazon.com/',
      content:
        'SAMPLE TEXT AUTHOR 1 SAMPLE TEXT AUTHOR 1 SAMPLE TEXT AUTHOR 1 SAMPLE TEXT AUTHOR 1 SAMPLE TEXT AUTHOR 1 SAMPLE TEXT AUTHOR 1',
      ups: '100',
      downs: '10',
    },
    '2': {
      id: '2',
      title: 'Second book',
      author: 'Author2',
      url: 'https://amazon.com',
      content: 'SAMPLE TEXT AUTHOR 2 SAMPLE TEXT AUTHOR 2 SAMPLE TEXT',
      ups: '100',
      downs: '10',
    },
    '3': {
      id: '3',
      title: 'Third book',
      author: 'Author3',
      url: null,
      content: null,
      ups: null,
      downs: null,
    },
    '4': {
      id: '4',
      title: 'Fourth book',
      author: 'Author4',
      url: 'https://www.amazon.com/',
      content:
        'SAMPLE TEXT AUTHOR 4 SAMPLE TEXT AUTHOR 4 SAMPLE TEXT AUTHOR 4 SAMPLE TEXT AUTHOR 4 SAMPLE TEXT AUTHOR 4 SAMPLE TEXT AUTHOR 4 SAMPLE TEXT AUTHOR 4 SAMPLE TEXT AUTHOR 4',
      ups: '1000',
      downs: '0',
    },
    '5': {
      id: '5',
      title: 'Fifth book',
      author: 'Author5',
      url: 'https://www.amazon.com/',
      content:
        'SAMPLE TEXT AUTHOR 5 SAMPLE TEXT AUTHOR 5 SAMPLE TEXT AUTHOR 5 SAMPLE TEXT AUTHOR 5 SAMPLE TEXT',
      ups: '50',
      downs: '0',
    },
  };

  var relatedPosts = {
    '1': [posts['4']],
    '2': [posts['3'], posts['5']],
    '3': [posts['2'], posts['1']],
    '4': [posts['2'], posts['1']],
    '5': [],
  };

  console.log('Got an Invoke Request.');
  switch (event.field) {
    case 'getPost':
      var id = event.arguments.id;
      callback(null, posts[id]);
      break;
    case 'allPosts':
      var values = [];
      for (var d in posts) {
        values.push(posts[d]);
      }
      callback(null, values);
      break;
    case 'addPost':
      // return the arguments back
      callback(null, event.arguments);
      break;
    case 'addPostErrorWithData':
      var id = event.arguments.id;
      var result = posts[id];
      // attached additional error information to the post
      result.errorMessage = 'Error with the mutation, data has changed';
      result.errorType = 'MUTATION_ERROR';
      callback(null, result);
      break;
    case 'relatedPosts':
      var id = event.source.id;
      callback(null, relatedPosts[id]);
      break;
    default:
      callback('Unknown field, unable to resolve' + event.field, null);
      break;
  }
};
