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
		transportation: (properties) => {
			return trafficStyle(properties, false)
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

	function hashCode(str) {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash);
		}
		return hash;
	}

	function intToRGB(i){
		var c = (i & 0x00FFFFFF).toString(16).toUpperCase();
		return "00000".substring(0, 6 - c.length) + c;
	}

	function colorGenerator() {
		let dict = {};
		console.log(dict);
		return (string) => {
			if (['motorway'].indexOf(string) > -1) {
				dict[string] = '#E892A2';
				return dict[string];
			}
			if (['trunk'].indexOf(string) > -1) {
				dict[string] = '#F9B29C';
				return dict[string];
			}
			if (['primary'].indexOf(string) > -1) {
				dict[string] = '#FCD6A4';
				return dict[string];
			}
			if (['secondary'].indexOf(string) > -1) {
				dict[string] = '#FBFFA7';
				return dict[string];
			}
			if (['rail'].indexOf(string) > -1) {
				dict[string] = '#000000';
				return dict[string];
			}
			if (['transit'].indexOf(string) > -1) {
				dict[string] = '#FF5F83';
				return dict[string];
			}
			if (['minor', 'tertiary', 'service'].indexOf(string) > -1) {
				dict[string] = '#FFFFFF';
				return dict[string];
			}
			if (dict[string] != null) {
				return dict[string];
			}
			dict[string] = '#' + intToRGB(hashCode(string));
			return dict[string];
		}
	}

	function getDashArray(properties) {
		if (['rail', 'transit'].indexOf(properties.class) > -1)
			return [12, 12];
		if (['path', 'track'].indexOf(properties.class) > -1)
			return [5, 5];
		return [];
	}

	function getWeight(properties) {
		if (['path', 'track'].indexOf(properties.class) > -1)
			return 0.1;
		if (["motorway", "trunk", "primary", "secondary"].indexOf(properties.class) > -1)
			return 3.5;
		return 2;
	}

	const cg = colorGenerator();

	function trafficStyle(properties) {
		return {
			weight: getWeight(properties),
			fillColor: cg(properties.class),
			color: cg(properties.class),
			fillOpacity: 1,
			opacity: 1,
			dashArray: getDashArray(properties)
		}
	}

	const openmaptilesVectorTileOptions = {
		getFeatureId: function (e, coords) {
			// console.log(e.properties.class, e.properties.name);
			if (e.properties.name && ['city', 'town', 'village', 'railway', 'suburb', 'neighbourhood', 'lake'].indexOf(e.properties.class) > -1) {
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
					html: '<span class="labelName" style="font-weight:bold;">' + e.properties.name + '</span>',
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
				map.setView(new L.LatLng(3.1641, 101.6883), 14);
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
