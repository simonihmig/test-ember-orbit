import Ember from 'ember';
import {inject} from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Ember.Controller.extend({
  storeService: inject('store'),
  patients: readOnly('model'),

  actions: {
    createPatient () {
      return this.get('storeService').addRecord({type: 'patient', name: `name+${Date.now()}`});
    }
  }
});
