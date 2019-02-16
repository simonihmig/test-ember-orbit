import {Model, attr, key } from 'ember-orbit';

export default Model.extend({
	remoteId: key(),
	name: attr('string')
});
