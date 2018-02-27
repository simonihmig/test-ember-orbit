import Object from '@ember/object';
import JSONAPISource, {JSONAPISerializer} from '@orbit/jsonapi';
import Orbit from '@orbit/data';
import fetch from 'fetch';

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
    Orbit.fetch = fetch.bind(fetch);
		injections.SerializerClass = MySerializer;
		injections.name = 'remote';

		return new MyJSONAPISource(injections);
	}
});
