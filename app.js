document.addEventListener('DOMContentLoaded', () => {

	const map = new L.Map('map', {
		zoomControl: false,
		// dragging: false,
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
			fillColor: '#06cccc',
			color: '#06cccc',
			fillOpacity: 0.2,
			opacity: 0.4,
		},
		admin: {
			weight: 1,
			fillColor: 'pink',
			color: 'pink',
			fillOpacity: 0.2,
			opacity: 0.4
		},
		waterway: {
			weight: 1,
			fillColor: '#2375e0',
			color: '#2375e0',
			fillOpacity: 0.2,
			opacity: 0.4
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
			weight: 1,
			fillColor: '#9C42A6',
			color: '#9C42A6',
			fillOpacity: 0.2,
			opacity: 0.4
		},
		aeroway: {
			weight: 1,
			fillColor: '#51aeb5',
			color: '#51aeb5',
			fillOpacity: 0.2,
			opacity: 0.4
		},
		transportation: {
			weight: 0.5,
			fillColor: 'black',
			color: 'black',
			fillOpacity: 0.2,
			opacity: 0.4,
			dashArray: [4, 4]
		},
		building: {
			fill: true,
			weight: 1,
			fillColor: '#2b2b2b',
			color: '#2b2b2b',
			fillOpacity: 0.2,
			opacity: 0.4
		},
		water_name: {
			weight: 1,
			fillColor: '#022c5b',
			color: '#022c5b',
			fillOpacity: 0.2,
			opacity: 0.4
		},
		transportation_name: {
			weight: 1,
			fillColor: '#bc6b38',
			color: '#bc6b38',
			fillOpacity: 0.2,
			opacity: 0.4
		},
		place: {
			weight: 1,
			fillColor: '#f20e93',
			color: '#f20e93',
			fillOpacity: 0.2,
			opacity: 0.4
		},
		housenumber: {
			weight: 1,
			fillColor: '#ef4c8b',
			color: '#ef4c8b',
			fillOpacity: 0.2,
			opacity: 0.4
		},
		poi: {
			weight: 1,
			fillColor: 'transparent',
			color: 'transparent',
			fillOpacity: 0.2,
			opacity: 0.4
		},
		point: {
			color: 'transparent',
		},

		country_name: [],
		marine_name: [],
		state_name: [],
		place_name: [],
		waterway_name: [],
		poi_name: [],
		road_name: [],
		housenum_name: [],
	};

	const openmaptilesVectorTileOptions = {
		getFeatureId: function (e, coords) {
			if (e.properties.name && ['city', 'primary', 'minor', 'river', 'town', 'village', 'railway', 'suburb', 'town_hall', 'toll_booth', 'police', 'neighbourhood', 'lake', 'basin', 'poi'].indexOf(e.properties.class) > -1) {
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
					// iconAnchor: [5, 10],
					iconSize: [6, 6]
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
