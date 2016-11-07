import Ember from 'ember';

export default Ember.Service.extend({
  currentUser: null,
  username: "",
  password: "",

  login(foundUser) {
    this.set('username', foundUser.get('username'));
    this.set('password', foundUser.get('password'));
    this.set('currentUser', foundUser);
    console.log(this.get('currentUser').get('username'));
  },
});
