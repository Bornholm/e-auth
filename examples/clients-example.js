module.exports = [
  // See http://openid.net/specs/openid-connect-registration-1_0.html#ClientMetadata
  {
    client_id: 'e-auth-debug',
    redirect_uris: [ 'http://localhost:3333/debug/cb' ],
    client_secret: 'AbsolutlyNotSecret',
    post_logout_redirect_uris: [ 'http://localhost:3333/debug/logout/cb' ],
  },
  {
    client_id: 'e-users',
    redirect_uris: [ 'http://localhost:3000/auth/openid/callback' ],
    client_secret: 'NotSoSecret',
    post_logout_redirect_uris: [ 'http://localhost:3000/' ],
  },
];
