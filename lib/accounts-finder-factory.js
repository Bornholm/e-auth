
module.exports = function(db) {
  return function findAccountById(accountId) {
    console.log(accountId);
    return Promise.reject();
  };
};
