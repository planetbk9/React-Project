module.exports = (app, Time) => {
  app.get('/', (req, res) => {
    console.log('rounter connected to root!');
  });

  app.get('/api/times', (req, res) => {
    Time.find((err, times) => {
      if(err) return res.status(500).send({error: 'Find failure'});
      res.json(times);
    });
  });

  app.get('/api/times/:date', (req, res) => {
    Time.findById(req.params.date, (err, data) => {
      if(err) return res.status(500).send({error: 'Find failure'});
      res.json(data);
    });
  });

  app.post('/api/time', (req, res) => {
    var time = new Time();
    time._id = req.body._id;
    time.date = Date(req.body.date),
    time.time = req.body.time;

    time.save((err, data) => {
      if(err) {
        console.error(err);
        res.json({result: 0});
        return;
      }
      res.json(data);
    });
  });

  app.put('/api/update/:date', (req, res) => {
    console.log('update call');
    Time.findByIdAndUpdate(req.params.date, {time: req.body.time}, { new: true }, (err, data) => {
      if(err) {
        console.error(err);
        res.json({result: 0});
        return;
      }
      console.log(data);
      res.json({result: 1});
    });
  });
}