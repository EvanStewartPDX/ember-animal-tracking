import DS from 'ember-data';

export default DS.Model.extend({
  username: DS.attr(),
  password: DS.attr(),
  avatar: DS.attr(),
  model: DS.attr(),
});
