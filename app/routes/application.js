import Ember from 'ember';
import {inject} from '@ember/service';

export default Ember.Route.extend({
  orbitConfiguration: inject(),

  beforeModel () {
    return this.get('orbitConfiguration').configure();
  }

});
