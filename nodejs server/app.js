const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);

// Setting Redis Repository
var client = require('redis').createClient(process.env.REDIS_URL);
client.hmset('city:santiago', {
    'latitude': '33.4488897',
    'altitude': '-70.6692655'
});
client.hmset('city:zurich', {
    'latitude': '47.3774337',
    'altitude': '8.4666749'
});
client.hmset('city:auckland', {
    'latitude': '-36.3988014',
    'altitude': '174.3516362'
});
client.hmset('city:sidney', {
    'latitude': '-33.847927',
    'altitude': '150.651779'
});
client.hmset('city:london', {
    'latitude': '-51.528308',
    'altitude': '-0.3817822'
});
client.hmset('city:georgia', {
    'latitude': '32.6581496',
    'altitude': '-85.4224594'
});

const server = http.createServer(app);

const io = socketIo(server);

const getApiAndEmit = async socket => {
  try {
    const cl = await axios.get(
      "https://api.darksky.net/forecast/fa6f4b91d744420fe9b536ec6e4d55fd/"+client.hmget('city:santiago', 'latitude')+","+client.hmget('city:santiago', 'altitude')+"?units=si"
    ); 
    const zu = await axios.get(
      "https://api.darksky.net/forecast/fa6f4b91d744420fe9b536ec6e4d55fd/"+client.hmget('city:zurich', 'latitude')+","+client.hmget('city:santiago', 'altitude')+"?units=si"
    );
    const ak = await axios.get(
      "https://api.darksky.net/forecast/fa6f4b91d744420fe9b536ec6e4d55fd/"+client.hmget('city:auckland', 'latitude')+","+client.hmget('city:santiago', 'altitude')+"?units=si"
    );
    const si = await axios.get(
      "https://api.darksky.net/forecast/fa6f4b91d744420fe9b536ec6e4d55fd/"+client.hmget('city:sidney', 'latitude')+","+client.hmget('city:santiago', 'altitude')+"?units=si"
    );
    const lo = await axios.get(
      "https://api.darksky.net/forecast/fa6f4b91d744420fe9b536ec6e4d55fd/"+client.hmget('city:london', 'latitude')+","+client.hmget('city:santiago', 'altitude')+"?units=si"
    );
    const ge = await axios.get(
      "https://api.darksky.net/forecast/fa6f4b91d744420fe9b536ec6e4d55fd/"+client.hmget('city:georgia', 'latitude')+","+client.hmget('city:santiago', 'altitude')+"?units=si"
    ); 
    //Chile
     var measuredTime = new Date(null);
     measuredTime.setSeconds(cl.data.currently.time); 
     var offset = parseInt(cl.data.offset,10);
     var local_time = new Date((measuredTime * 1) + (offset *60*60*1000)); 
     var TimeCL = local_time.toISOString().substr(11, 5);

    // Zurich
     var measuredTime = new Date(null);
     measuredTime.setSeconds(zu.data.currently.time); 
     var offset = parseInt(zu.data.offset,10);
     var local_time = new Date((measuredTime * 1) + (offset *60*60*1000)); 
     var TimeZU = local_time.toISOString().substr(11, 5);

    // //Auckland
     var measuredTime = new Date(null);
     measuredTime.setSeconds(ak.data.currently.time); 
     var offset = parseInt(ak.data.offset,10);
     var local_time = new Date((measuredTime * 1) + (offset *60*60*1000)); 
     var TimeAK = local_time.toISOString().substr(11, 5);

    // //Sidney
     var measuredTime = new Date(null);
     measuredTime.setSeconds(si.data.currently.time); 
     var offset = parseInt(si.data.offset,10);
     var local_time = new Date((measuredTime * 1) + (offset *60*60*1000)); 
     var TimeSI = local_time.toISOString().substr(11, 5);

    // //London
     var measuredTime = new Date(null);
     measuredTime.setSeconds(lo.data.currently.time); 
     var offset = parseInt(lo.data.offset,10);
     var local_time = new Date((measuredTime * 1) + (offset *60*60*1000)); 
     var TimeLO= local_time.toISOString().substr(11, 5);

    // //Georgia
     var measuredTime = new Date(null);
     measuredTime.setSeconds(ge.data.currently.time); 
     var offset = parseInt(ge.data.offset,10);
     var local_time = new Date((measuredTime * 1) + (offset *60*60*1000)); 
     var TimeGE = local_time.toISOString().substr(11, 5);

    var chile = {temperature: cl.data.currently.temperature, time: TimeCL};
    var zurich = {temperature: zu.data.currently.temperature, time: TimeZU};
    var auckland = {temperature: ak.data.currently.temperature, time: TimeAK};
    var sidney = {temperature: si.data.currently.temperature, time: TimeSI};
    var london = {temperature: lo.data.currently.temperature, time: TimeLO};
    var georgia = {temperature: ge.data.currently.temperature, time: TimeGE};
    res = [];
    res.push(chile, zurich, auckland, sidney, london, georgia);
    socket.emit("FromAPI", res);
  } catch (error) {
     console.log(`Error: ${error.code}`);
  }
};

let interval;

io.on("connection", socket => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 10000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

 server.listen(port, () => console.log(`Listening on port ${port}`));
 