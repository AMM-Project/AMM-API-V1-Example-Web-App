const express = require('express')
const router = express.Router()
const request = require('request');
bodyParser = require('body-parser');
const config = require('../config.json')

const AMMhost = config.AMMhost

router.get('/', async (req, res)=>{
    const accessToken = req.app.get('token')
    console.log('token ' + accessToken)
    var options = {
        url: AMMhost +'/api/v1/systems/' + req.query.nid + '/data?ids=ReportIdleTime,GPS Location-latitude,GPS Location-longitude',
        method: 'GET',
        json: true,
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
      var callback = (error, response, body) => {
        var bb = {
                  'GPS Location-longitude': [ { value: '', timestamp: '' } ],
                  ReportIdleTime: [ { value: '', timestamp: '' } ],
                  'GPS Location-latitude': [ { value: '', timestamp: '' } ]
                }
        if(body){
          bb = JSON.parse(JSON.stringify(body))
        }
        console.log(bb)
        console.log(response.statusCode);
        res.send(bb)  
    }
      
      await request(options, callback);
})

var getOptions = (accessToken, nid , dataid)=>{
     var options = {
    url: AMMhost +'/api/v1/systems/data/raw?targetid=' + nid + '&dataid=' + dataid,
    method: 'GET',
    json: true,
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
  return options
}

router.get('/history', async (req, res)=>{
    const accessToken = req.app.get('token')
    console.log('token ' + accessToken)
    var dataids = ['GPS Location-longitude', 'GPS Location-latitude']
      var options = dataids.map( dataid =>{
        return getOptions(accessToken, req.query.nid, dataid)
      })
      var timer;
      var lat;
      var lang; 
      var callback = (error, response, body) => {
        if(body){
          var bb = JSON.parse(JSON.stringify(body))
          lang = bb[req.query.nid] 
        }else{
          lang={'GPS Location-longitude':[]}
        }
        if(!lat){
          timer = setTimeout(async function(){  await request(options[1], (error, response, body)=>{
            if(body){
              lat = JSON.parse(JSON.stringify(body))[req.query.nid]
              console.log(JSON.stringify(lat))
            }else{
              lat = {'GPS Location-latitude':[]}
            }
            var result = JSON.stringify({lat: lat, lang: lang})
            res.send(result)
          }, 3000);
          })
        }else{
          clearTimeout(timer)
        }
        
      }
      clearTimeout(timer) 

    await request(options[0], callback);
})



module.exports = router
