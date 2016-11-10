import Ember from 'ember';

export function userDisplay(params) {
  var userAuthentication = Ember.inject.service();
  var user = params[0];

  if (userAuthentication.currentUser) {
     return Ember.String.htmlSafe('<div class="username"> {{userAuthentication.username}}</div> <img class="tileimg" src={{userAuthentication.avatar}}>');
  }
}

export default Ember.Helper.helper(userDisplay);
