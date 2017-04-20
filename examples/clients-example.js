module.exports = [
  // See http://openid.net/specs/openid-connect-registration-1_0.html#ClientMetadata
  {
    client_id: 'e-auth-debug',
    redirect_uris: [ 'http://localhost:3333/debug/cb' ],
    client_secret: 'AbsolutlyNotSecret',
  },
];
