import Ember from 'ember';

export default Ember.Component.extend({
  userAuthentication: Ember.inject.service(),
  signupFormOpen: false,

  actions: {
    showSingupForm() {
      this.set('signupFormOpen', true);
    },
    hideSignupForm() {
      this.set('signupFormOpen', false);
    },
    saveUser() {
      var params = {
        username: this.get('newUsername'),
        password: this.get('newPassword'),
        avatar: this.get('newAvatar'),
        user: null
      };

      this.sendAction('saveUser', params);
      this.set('signupFormOpen', false);
    }
  }
});
