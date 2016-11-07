import Ember from 'ember';

export default Ember.Service.extend({
  currentUser: null,
  username: "",
  password: "",
  avatar: "",

  login(foundUser) {
    this.set('username', foundUser.get('username'));
    this.set('password', foundUser.get('password'));
    this.set('avatar', foundUser.get('avatar'));
    this.set('currentUser', foundUser);
    console.log(this.get('currentUser').get('username'));
  },
});
