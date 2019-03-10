module.exports = (app, Time, User) => {
  app.get('/api/getUserAllData/:user', (req, res) => {
    Time.findOne({user: req.params.user}, (err, data) => {
      if(err) return res.status(500).send({error: 'Find failure'});
      res.json(data);
    });
  });

  app.get('/api/getData/:user/:_id', (req, res) => {
    Time.findOne({user: req.params.user}, (err, data) => {
      if(err) return res.status(500).send({error: 'Find failure'});
      if(!req.params._id || !data || !data.userItems) {
        console.error('id or data.userItems missing.');
        res.json({result: 0, message: 'id or data.userItems missing'});
        return;
      }

      const _id = req.params._id;
      if(data._id == _id) {
        res.json(data);
        return;
      }
      data.userItems.some(userItem => {
        if(userItem._id == _id) {
          res.json(userItem);
          return true;
        }
        if(!userItem.dateItems) return false;
        userItem.dateItems.some(dateItem => {
          if(!dateItem) return false;
          if(dateItem._id == _id) {
            res.json(dateItem);
            return true;
          }
        });
      });
      return;
    });
  });

  app.get('/api/checkUser/:user', (req, res) => {
    User.findOne({id: req.params.user}, (err, data) => {
      if(err) return res.status(500).send({error: 'Find failure'});
      if(data) {
        res.json(data.id);
        return;
      } else {
        res.json(null);
        return;
      }
    });
  });

  app.get('/api/login/:user/:password', (req, res) => {
    User.findOne({id: req.params.user}, (err, data) => {
      if(err) return res.status(500).send({error: 'Find failure'});
      if(data && data.password === req.params.password) {
        res.json(data.id);
        return;
      } else if(data) {
        res.json({result: 0, message: '비밀번호가 틀렸습니다.'});
        return;
      } else {
        res.json({result: 0, message: '존재하지 않는 아이디입니다.'});
        return;
      }
    });
  });

  app.post('/api/addUser', (req, res) => {
    if(!req.body.id || !req.body.password) {
      console.error('id, password missing.');
      res.json({result: 0, message: 'user, password missing'});
      return;
    }

    let user = new User();
    user.id = req.body.id;
    user.password = req.body.password;
    
    user.save((err, data) => {
      if(err) {
        console.error(err);
        res.json({result: 0, message: 'data save error'});
        return;
      }
      res.json(data.id);
    });
  });

  app.put('/api/updateUserInfo/:id/:password', (req, res) => {
    User.findOne({id: req.params.id}, (err, data) => {
      if(err) return res.status(500).send({error: 'Find failure'});
      if(!req.params.id || !req.params.password) {
        console.error('id, password missing.');
        res.json({result: 0, message: 'user, password missing'});
        return;
      }

      data.password = req.params.password;
      data.save((err, data) => {
        if(err) {
          console.error(err);
          res.json({result: 0, message: 'data save error'});
          return;
        }
        res.json({result: 1, data: data.id});
      });
    });
  });

  // date가 있으면 dateItems에 dateItem 추가, 없으면 userItems에 userItem 추가, user가 없으면 user 추가
  // body: { date: String, dateItems: [] }
  app.put('/api/addData/:user', (req, res) => {
    Time.findOne({user: req.params.user}, (err, data) => {
      if(err) return res.status(500).send({error: 'Find failure'});
      if(!req.body) {
        console.error('req.body missing');
        res.json({result: 0, message: 'req.body missing'});
        return;
      }
      const user = req.params.user;
      const userItem = req.body;
      const date = userItem.date;
      const dateItems = userItem.dateItems;

      // user 없을 경우, user 생성
      if(!data) {
        const time = new Time();
        time.user = user;
        time.userItems = [userItem];

        time.save((err, data) => {
          res.json(data);
        });
        return;
      }
      
      // user가 있을 경우, userItems에 추가
      let existDate = false;
      if(!data.userItems) {
        console.error('No data.userItems');
        res.json({result: 0, message: 'No data.userItems'});
        return;
      }
      data.userItems = data.userItems.map(userItem => {
        // user에 date가 있을 경우, dateItems에 추가
        if(userItem.date === date) {
          existDate = true;
          if(!userItem.dateItems) {
            console.error('No userItem.dateItems');
            res.json({result: 0, message: 'No userItem.dateItems'});
          }
          userItem.dateItems = userItem.dateItems.concat(dateItems);
          data.save((err, data) => {
            res.json(userItem);
          });
        }
        return userItem;
      });
      // date가 없을 경우, userItems에 새로운 userItem 추가
      if(!existDate) {
        console.log(userItem);
        data.userItems = data.userItems.concat(userItem);
        data.userItems.sort((a, b) => {
          return new Date(a.date) <= new Date(b.date) ? -1 : 1;
        });
        data.save((err, data) => {
          let ret;
          data.userItems.some(item => {
            if(item.date === userItem.date) {
              ret = item;
              return true;
            }
          });
          res.json(ret);
        });
      }
    });
  });

  // body: {subject: String, time: Number }
  app.put('/api/updateDateItem/:user/:_id', (req, res) => {
    Time.findOne({user: req.params.user}, (err, data) => {
      if(!req.params._id || !req.body) {
        console.error('_id or req.body missing.');
        res.json({result: 0, message: '_id or req.body missing'});
        return;
      }
      const _id = req.params._id;
      const newItem = req.body;

      if(err) {
        console.error(err);
        res.json({result: 0});
        return;
      }

      if(!data.userItems) {
        console.error('No data.userItems');
        res.json({result: 0, message: 'No data.userItems'});
        return;
      }
      let ret;
      let found = false;
      data.userItems.some(userItem => {
        if(!userItem.dateItems) return false;
        userItem.dateItems.some(dateItem => {
          if(!dateItem) return false;
          if(String(dateItem._id) === _id) {
            Object.keys(newItem).forEach(key => {
              dateItem[key] = newItem[key];
            });
            dateItem.updated = Date.now();
            ret = dateItem;
            return found = true;
          }
        });
        if(found) return true;
      });
      
      if(!found) {
        res.json({result: 0, message: 'dateItem not found _id : ' + _id});
        return;
      } else {
        data.save((err, data) => {
          res.json(ret);
        });
      }
    });
  });

  app.delete('/api/deleteUserItem/:user/:_id', (req, res) => {
    Time.findOne({user: req.params.user}, (err, data) => {
      if(!req.params._id || !data || !data.userItems) {
        console.error('id or data.userItems missing.');
        res.json({result: 0, message: 'id or data.userItems missing'});
        return;
      }
      const _id = req.params._id;
      let userItems = data.userItems;
      let ret;

      data.userItems = userItems.filter(userItem => {
        if(String(userItem['_id']) === String(_id)) {
          ret = userItem;
          return false;
        }
        return true;
      });

      data.save((err, data) => {
        res.json(ret); 
      });
    });
  });

  app.delete('/api/deleteItem/:user/:_id', (req, res) => {
    Time.findOne({user: req.params.user}, (err, data) => {
      if(!req.params._id || !data || !data.userItems) {
        console.error('id or data.userItems missing.');
        res.json({result: 0, message: 'id or data.userItems missing'});
        return;
      }

      const _id = req.params._id;
      let userItems = data.userItems;
      let ret;
      let found = false;

      data.userItems = userItems.filter(userItem => {
        if(!userItem.dateItems) return false;
        const dateItems = userItem.dateItems.filter(dateItem => {
          if(!dateItem) return false;
          if(String(dateItem._id) === String(_id)) {
            ret = dateItem;
            return false;
          }
          return true;
        });
        if(dateItems.length === 0) return false;
        userItem.dateItems = dateItems;
        return true;
      });

      data.save((err, data) => {
        res.json(ret); 
      });
    });
  });
}