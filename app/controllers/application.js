import Ember from 'ember';
import {inject} from '@ember/service';

export default Ember.Controller.extend({
  storeService: inject('store'),
  records: [],

  actions: {
    createPatient () {
      return this.get('storeService').addRecord({type: 'patient', name: `name+${Date.now()}`})
        .then((record) => {
          this.get('records').pushObject(record);
        })
    }
  }
});
