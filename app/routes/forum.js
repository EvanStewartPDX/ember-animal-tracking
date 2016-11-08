import Ember from 'ember';

export default Ember.Route.extend({
  model() {
  return Ember.RSVP.hash({
    posts: this.store.findAll('post'),
    replies: this.store.findAll('reply')
  });
},
  actions: {
    savePost(params) {
      var newPost = this.store.createRecord('post', params);
      newPost.save();
      this.transitionTo('forum');
    }
  }
});
