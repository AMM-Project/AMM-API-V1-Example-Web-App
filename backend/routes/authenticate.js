const express = require('express')
const ClientOAuth2 = require('client-oauth2')
const router = express.Router()
const request = require('request');
const config = require('../config.json')

//eng details
const AMMhost = config.AMMhost
const clientId = config.clientId
const clientSecret = config.clientSecret
var acessT=''
var User = ''
var refreshToken = ''


var ammAuth = new ClientOAuth2({
  clientId: clientId,
  clientSecret: clientSecret,
  accessTokenUri: AMMhost + '/api/oauth/token',
  authorizationUri: AMMhost + '/api/oauth/authorize',
  redirectUri: 'http://localhost:5000/authenticate/callback'
})



router.get('/', function (req, res) {
  var uri = ammAuth.code.getUri()
  res.redirect(uri)
})

router.get('/callback', function (req, res) {
  ammAuth.code.getToken(req.originalUrl)
    .then(function (user) {
      User = user
      acessT=user.data.access_token
      res.app.set('token', acessT)
      refreshToken=user.data.refresh_token
      res.redirect('/authenticate/success')
    })
})

router.get('/success', (req, res)=>{
  console.log('acess token ' + acessT)

  var header = {
    "Content-Type": "text/event-stream",
    "Cache-Control":"no-cache",
    "Access-Control-Allow-Origin": "*"
  }
  res.writeHead(200, header)

  let interval = setInterval(() =>{
    res.write("data:"+acessT)
    res.write('\n\n')
    if(acessT.localeCompare('') !== 0){
      clearInterval(interval)
    }
  }, 100)

  req.on('close', ()=>{   
    console.log('Access Granted')
    clearInterval(interval)
    res.app.set('token', acessT)
    res.end()
  })

})

router.get('/refresh', async (req, res)=>{
  User.refresh().then(function (updatedUser) {
    console.log(updatedUser.accessToken)
    res.app.set('token', updatedUser.accessToken)
    res.send(updatedUser.accessToken)
  })
})

router.get('/revoke', async (req, res)=>{
  const accessToken = req.app.get('token')
    console.log('token ' + accessToken)
    var options = {
        url: AMMhost +'/api/oauth/expire?access_token=' + accessToken,
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      var callback = (error, response, body) => {
        console.log(response.statusCode)
        res.app.set('token','')
        acessT = ''
        res.send(response.statusCode)  
    }
      
      await request(options, callback);
})

 module.exports=router; 

   