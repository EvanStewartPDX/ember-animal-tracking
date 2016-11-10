import Ember from 'ember';

export default Ember.Route.extend({
  userAuthentication: Ember.inject.service(),
  model() {
    return this.store.findAll('user');
  },

  actions: {
    login(params) {
      var route=this;
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
          // alert("You have successfully logged in!");
          params.user.login(foundUser.get('firstObject'));
          // route.replaceWith('map');
        }
      }, function(error) {
        console.log(error);
      });
    },

    saveUser(params) {
      var newUser = this.store.createRecord('user', params);
      newUser.save();
      this.transitionTo('index');
      alert('Congratulations, you have successfully signed up with WILDLIFE TRACKER! Now log in with your credentials.');
    }
  }
});
