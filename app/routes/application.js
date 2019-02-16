import Ember from 'ember';
import {inject} from '@ember/service';

export default Ember.Route.extend({
  orbitConfiguration: inject(),

  beforeModel () {
    return this.get('orbitConfiguration').configure();
  },

  model() {
    return this.store.liveQuery(q => q.findRecords('patient'));
  }

});
