import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.findRecord('post', params.post_id);
  },
  actions: {
    delete(post){
      post.destroyRecord();
      this.transitionTo('forum');
    }
  }
});
