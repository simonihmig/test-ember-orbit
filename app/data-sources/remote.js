import Object from '@ember/object';
import JSONAPISource, {JSONAPISerializer} from '@orbit/jsonapi';
import Orbit from '@orbit/data';
import Config from 'test-ember-orbit/config/environment';

class MySerializer extends JSONAPISerializer {
  resourceKey (/*type*/) {
		return 'remoteId';
	}
}


class MyJSONAPISource extends JSONAPISource {
	responseHasContent (/*response*/) {
		// this is because responseHasContent checks jsonapi compliant Content-type header
		// and is not compatible with mirage shorthand responses headers
		return true;
	}
}

export default Object.create({
	create (injections = {}) {
    Orbit.fetch = window.fetch.bind(window);
		injections.SerializerClass = MySerializer;
    injections.namespace = 'api';
		injections.name = 'remote';

		return new MyJSONAPISource(injections);
	}
});
