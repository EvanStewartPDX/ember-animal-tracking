import Ember from 'ember';

export default Ember.Component.extend({
  loginFormOpen: false,
  userAuthentication: Ember.inject.service(),
  actions: {
    login() {
      var params = {
        username: this.get('username'),
        password: this.get('password'),
        // avatar: this.get('avatar'),
        user: this.get('userAuthentication')
      };
      this.sendAction('login', params);
      this.set('loginFormOpen', false);
    },
    showLoginForm() {
      this.set('loginFormOpen', true);
    },
    hideLoginForm() {
      this.set('loginFormOpen', false);
    }
  }
});
