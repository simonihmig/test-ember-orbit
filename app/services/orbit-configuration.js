/* eslint-disable no-console, max-statements */

import Orbit from '@orbit/data';
import Service, {inject} from '@ember/service';
import {get} from '@ember/object';
import {getOwner} from '@ember/application';
import Config from 'test-ember-orbit/config/environment';

export default Service.extend({
	// Inject all of the ember-orbit services
	store: inject(),
	dataCoordinator: inject(),

	mode: null,
	bucket: null,

	addSource (name) {
		const owner = getOwner(this),
			source = owner.lookup(`data-source:${name}`),
			coordinator = get(this, 'dataCoordinator');

		coordinator.addSource(source);
	},

	addStrategy (name) {
		const owner = getOwner(this),
			strategy = owner.lookup(`data-strategy:${name}`),
			coordinator = get(this, 'dataCoordinator');

		coordinator.addStrategy(strategy);
	},

	configure (mode) {
		console.log('[orbit-configuration]', 'mode', mode);

		const coordinator = get(this, 'dataCoordinator');

		return this.clearActiveConfiguration()
			.then(() => {
        this.addStrategy('event-logging');
				this.addStrategy('log-truncation');

				// Configure a remote source and related strategies
				this.addSource('remote');
        this.addStrategy('remote-store-sync-pessimistic');
				this.addStrategy('store-remote-query-pessimistic');
				this.addStrategy('store-remote-update-pessimistic');

				return coordinator.activate();
			}).then(() => {
				console.log('[orbit-configuration]', 'sources', coordinator.sourceNames);
				console.log('[orbit-configuration]', 'strategies', coordinator.strategyNames);
			});
	},

	clearActiveConfiguration () {
		const coordinator = get(this, 'dataCoordinator'),
			wasActive = Boolean(coordinator.activated);

		return coordinator.deactivate()
			.then(() => {
			// Reset the backup source (if it exists and was active).
			// This ensures the new configuration starts with a fresh state.
				let backup = coordinator.getSource('backup');

				if (wasActive && backup) {
					return backup.reset();
				}
				return Orbit.Promise.resolve();
			})
			.then(() => {
			// Clear all strategies
				coordinator.strategyNames.forEach((name) => {
					return coordinator.removeStrategy(name);
				});

				// Reset and remove sources (other than the store)
				coordinator.sources.forEach((source) => {
					source.transformLog.clear();
					source.requestQueue.clear();
					source.syncQueue.clear();

					if (source.name === 'store') {
					// Keep the store around, but reset its cache
						source.cache.reset();
					} else {
						coordinator.removeSource(source.name);
					}
				});
			});
	}
});
