var records = [
    { id: 1, uid: "A1234567K", username: 'Kevin', password: 'nm2112', displayName: 'Kevin', emails: [ { value: 'example@gmail.com' } ] }
    , { id: 2, uid: "A1234567KP", username: 'Prashanth', password: 'nm2112', displayName: 'Prashanth', emails: [ { value: 'example@gmail.com' } ] }
];

exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}
