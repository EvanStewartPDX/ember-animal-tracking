import Ember from 'ember';

export default Ember.Component.extend({
  signupFormOpen: false,

  actions: {
    showSingupForm() {
      this.set('signupFormOpen', true);
    },
    hideSignupForm() {
      this.set('signupFormOpen', false);
    }
  }
});
