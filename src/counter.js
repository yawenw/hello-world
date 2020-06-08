const faunadb = require('faunadb');
const q = faunadb.query
var fs = require('fs')
var key = 'fnADsx934OACEr9n60IvBmNEzLAjNrFWhTjU2PZb';
var client = new faunadb.Client({ secret: key });


const express = require('express');
const serverless = require('serverless-http');
const app = express();
var router = express.Router();


router.get('/', (req, res) => {
    console.log(req.query.counter);

    var querystr = req.query.counter;
    let findCountersByName = client.query(
         q.Map(
          q.Paginate(
            q.Filter(
              q.Match(q.Index('counters_by_name')),
              q.Lambda(
                ['name', 'ref'],
                q.GT(
                  q.FindStr(
                    q.LowerCase(q.Var('name')),
                    querystr.toLowerCase()
                  ),
                  -1
                )
              )
            ),
            {size:3000}
          ),
          q.Lambda(['name', 'ref'], q.Get(q.Var('ref')))
        )
       
      ) 
      
      findCountersByName
        .then(result => {
          console.log(result);
          var jsonContent = result.data;
          var data_array = [];
          for(var key in jsonContent)
          {
            data_array.push(jsonContent[key]["data"])
          }	
          console.log(data_array);
          res.status(200).json(data_array);
          return;         

        })
        .catch(error => {
            console.log(error.message);

        })
});

app.use('/.netlify/functions/counter', router);
module.exports.handler = serverless(app);
