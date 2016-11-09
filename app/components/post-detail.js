import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    delete(post) {
      this.sendAction('delete', post);
    },
    update(post, params) {
      this.sendAction('update', post, params);
      console.log(params.content);
    },
    saveReply(params) {
      this.sendAction('saveReply', params);
    },
    deleteReply(reply) {
      this.sendAction('deleteReply', reply);
    }
  }
});
