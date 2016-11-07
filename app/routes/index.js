import Ember from 'ember';

export default Ember.Route.extend({
  userAuthentication: Ember.inject.service(),
  model() {
    return this.store.findAll('user');
  },

  actions: {
    login(params) {
      this.store.query('user', {
        orderBy: 'username',
        equalTo: params.username
      }). then (function(foundUser) {
        if(foundUser.get('length')===0) {
          alert("Credential do not match existing user.");
        }
        else if(foundUser.get('firstObject').get('password') !== params.password) {
          alert("Password did not match username provided");
        }
        else {
          alert("You have successfully logged in!");
          params.user.login(foundUser.get('firstObject'));
        }
      }, function(error) {
        console.log(error);
      });
    }
  }
});
