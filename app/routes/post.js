import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.findRecord('post', params.post_id);
  },
  actions: {
    delete(post){
      post.destroyRecord();
      this.transitionTo('forum');
    },
    update(post, params) {
      Object.keys(params).forEach(function(key) {
        if(params[key]!==undefined) {
          post.set(key,params[key]);
        }
      });
      post.save();
      this.transitionTo('forum');
    },
    saveReply(params) {
      var newReply = this.store.createRecord('reply', params);
      var post = params.post;
      post.get('replies').addObject(newReply);
      newReply.save().then(function() {
        return post.save();
      });
      this.transitionTo('post', post);
    },
    deleteReply(reply) {
      reply.destroyRecord();
      // this.transitionTo('post', post);
    }
  }
});
