document.addEventListener('DOMContentLoaded', () => {

	const map = new L.Map('map', {
		zoomControl: true,
		dragging: true,
		keyboard: true,
	}).fitWorld();

	const scale = L.control.scale({
		position: "topleft",
		metric: true,
		imperial: false,
	}).addTo(map);

	const collisionLayer = L.LayerGroup.collision({margin:5});
	collisionLayer.addTo(map);

	const vectorTileStyling = {
		water: {
			fill: true,
			weight: 1,
			fillColor: '#005BD1',
			color: '#005BD1',
			fillOpacity: 1,
			opacity: 1,
		},
		waterway: {
			weight: 1,
			fillColor: '#005BD1',
			color: '#005BD1',
			fillOpacity: 1,
			opacity: 1
		},
		admin: {
			weight: 1,
			fillColor: 'red',
			color: 'red',
			fillOpacity: 1,
			opacity: 1
		},
		landcover: {
			fill: true,
			weight: 1,
			fillColor: '#53e033',
			color: '#53e033',
			fillOpacity: 0.2,
			opacity: 0.4,
		},
		landuse: {
			fill: true,
			weight: 1,
			fillColor: '#e5b404',
			color: '#e5b404',
			fillOpacity: 0.2,
			opacity: 0.4
		},
		park: {
			fill: true,
			weight: 1,
			fillColor: '#236C06',
			color: '#236C06',
			fillOpacity: 0.2,
			opacity: 0.4
		},
		boundary: {
			color: 'transparent',
		},
		aeroway: {
			weight: 1,
			fillColor: '#51aeb5',
			color: '#51aeb5',
			fillOpacity: 0.2,
			opacity: 0.4
		},
		road: {
			weight: 1,
			fillColor: 'black',
			color: 'black',
			fillOpacity: 1,
			opacity: 1
		},
		transit: {
			weight:1,
			fillColor: 'black',
			color: 'black',
			fillOpacity: 1,
			opacity: 1
		},
		building: {
			fill: true,
			weight: 1,
			fillColor: '#BCBCBC',
			color: '#BCBCBC',
			fillOpacity: 1,
			opacity: 1
		},
		water_name: {
			color: 'transparent',
		},
		transportation: {
			weight: 1,
			fillColor: 'white',
			color: 'white',
			fillOpacity: 1,
			opacity: 1,
		},
		transportation_name: (properties) => {
			return trafficStyle(properties, false)
		},
		place: {
			color: 'transparent',
		},
		housenumber: {
			color: 'transparent',
		},
		poi: {
			color: 'transparent',
		},
		point: {
			color: 'transparent',
		},
		mountain_peak: {
			color: 'transparent',
		},
		country_name: {
			color: 'transparent',
		},
		marine_name: {
			color: 'transparent',
		},
		state_name: {
			color: 'transparent',
		},
		place_name: {
			color: 'transparent',
		},
		waterway_name: {
			color: 'transparent',
		},
		poi_name: {
			color: 'transparent',
		},
		road_name: {
			color: 'transparent',
		},
		housenum_name: {
			color: 'transparent',
		},
		aerodrome_label: {
			color: 'transparent',
		},
	};

	function trafficStyle(properties) {
		console.log(properties);
		return {
			weight: 2,
			fillColor: '#E892A2',
			color: '#E892A2',
			fillOpacity: 1,
			opacity: 1
		}
	}

	const openmaptilesVectorTileOptions = {
		getFeatureId: function (e, coords) {
			// console.log(e.properties.class, e.properties.name);
			if (e.properties.name && ['city', 'town', 'village', 'railway', 'suburb', 'toll_booth', 'police', 'neighbourhood', 'lake'].indexOf(e.properties.class) > -1) {
				const coordinates = e.toGeoJSON(coords.x, coords.y, coords.z).geometry.coordinates;
				let latLng = {};
				if (typeof coordinates[0] === 'object') {
					if (typeof coordinates[0][0] === 'object') {
						latLng = { lat: coordinates[0][0][1], lng: coordinates[0][0][0] };
					} else {
						latLng = { lat: coordinates[0][1], lng: coordinates[0][0] };
					}
				} else {
					latLng = { lat: coordinates[1], lng: coordinates[0] };
				}
				const marker = L.marker(latLng, {
				  icon: L.divIcon({
					html: '<span class="labelName">' + e.properties.name + '</span>',
					iconAnchor: [0, 0],
					iconSize: [0, 0]
				  }),
				});
				collisionLayer.addLayer(marker);
			}
		},
		rendererFactory: L.canvas.tile,
		vectorTileLayerStyles: vectorTileStyling,
		maxZoom: 14
	};

	map.on('zoomstart', function() {});

	map.on('zoomend', function() {});

	map.on('ready', function() {});

	fetch('/maps/malaysia-singapore-brunei.mbtiles')
	.then(response => {
		return response.arrayBuffer();
	}).then(buffer => {

		const offlineLayer = L.vectorGrid.protobuf(buffer, openmaptilesVectorTileOptions);
		L.control.layers({
			Offline: offlineLayer,
		}, {}, {collapsed: false}).addTo(map);

		offlineLayer.on('databaseloaded', (ev) => {
			setTimeout(() => {
				map.setView(new L.LatLng(3.1390, 101.6869), 14);
				document.getElementsByClassName('leaflet-control-layers-selector')[0].click();
			}, 500);
		});

		offlineLayer.on('databaseerror', (ev) => {
			console.info(ev);
		});

	}).catch(err => {
		console.log(err);
	});
});
