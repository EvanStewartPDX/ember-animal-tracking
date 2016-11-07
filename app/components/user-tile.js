import Ember from 'ember';

export default Ember.Component.extend({
  userAuthentication: Ember.inject.service(),
  // userDisplay: Ember.computed('user.username', 'user.avatar', function() {
  //   return this.get('user.username' + '-' + this.get('user.avatar');
  // }),


});
