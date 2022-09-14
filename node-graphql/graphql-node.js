const https = require('https');
const express = require('express');
const app = express();
const port = 3000

var query = `
query ($id: Int, $page: Int, $perPage: Int, $search: String) {
  Page (page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media (id: $id, search: $search) {
      id
      title {
        romaji
      }
      description
    }
  }
}
`;

var variables = {
  search: "Fate",
  page: 1,
  perPage: 10
};

const data = JSON.stringify({
  query: query,
  variables: variables
});

const options = {
  hostname: 'graphql.anilist.co',
  path: '',
  port: 443,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};


app.get('/data', (req, apiRes) => {
  const graphReq = https.request(options, (graphRes) => {
    let data = '';
    graphRes.on('data', (d) => {
      data += d;
    });
    graphRes.on('end', () => {
      apiRes.send(data);
    });
  });

  graphReq.on('error', (error) => {
    console.error(error);
  });

  graphReq.write(data);
  graphReq.end();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})