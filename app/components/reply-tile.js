import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    deleteReply(reply) {
      this.sendAction('deleteReply', reply);
    }
  }
});
