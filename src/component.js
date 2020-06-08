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
    console.log(req.query.component);

    var querystr = req.query.component;
    if(querystr == "ALL")
    {
        client.query(
            q.Map(
             q.Paginate(
                 q.Match(q.Index('all_counters')),
                 {size:3000}
             ),
             q.Lambda("ref", q.Get(q.Var('ref')))
           )
          
        )
        .then(result => {
          console.log(result);
          var jsonContent = result.data;
          var data_array = [];
          for(var key in jsonContent)
          {
            data_array.push(jsonContent[key]["data"]);
          }	
          console.log(data_array);
          res.status(200).json(data_array);
          return;           
        })
        .catch(error => {
            console.log(error.message);
        }) 
    }
    else
    {
        client.query(
          q.Map(
            q.Paginate(
                q.Match(q.Index('counters_by_component'), querystr.toUpperCase()),
                {size:3000}
            ),
            q.Lambda("ref", q.Get(q.Var('ref')))
          )
        
        )
        .then(result => {
          console.log(result);
          var jsonContent = result.data;
          var data_array = [];
          for(var key in jsonContent)
          {
            data_array.push(jsonContent[key]["data"]);
          }	
          console.log(data_array);
          res.status(200).json(data_array);
          return;           
        })
        .catch(error => {
            console.log(error.message);
        }) 
    }
              
});

app.use('/.netlify/functions/component', router);
module.exports.handler = serverless(app);
