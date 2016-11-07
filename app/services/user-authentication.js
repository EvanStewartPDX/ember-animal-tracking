import Ember from 'ember';

export default Ember.Service.extend({
  currentUser: "",

  setUser(user) {
    this.set('currentUser', user);
  }
});
