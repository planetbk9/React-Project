'use strict';

require('greenlock-express').create({
  version: 'draft-12',
  server: 'https://acme-v02.api.letsencrypt.org/directory',
  email: 'planetbk9@gmail.com',
  agreeTos: true,
  approvedDomains: ['kevin9.iptime.org'],
  configDir: '~/.config/acme/',
  communityMember: true,
  app: require('./app.js')
}).listen(80, 443);
