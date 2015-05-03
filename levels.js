window.Levels = [
	[
		// the order of the entities in this array is the order they are drawn, with newer entities covering previous entities
		{
			x: 800,
			y: 50,
			width: 1200,
			height: 100,
			color: "#777777",
			collisionType: "environment"
		},
		{
			x: 1200,
			y: 150,
			width: 50,
			height: 100,
			color: "#000000",
			collisionType: "actor",
			gravity: false,
			door: true,
			doorDestination: 1
		},
		{
			x: 300,
			y: 250,
			dx: 0,
			dy: 0,
			width: 50,
			height: 50,
			color: "#FF7777",
			collisionType: "actor",
			gravity: true,
			player: true,
			wraps: true
		},
		{
			x: 900,
			y: 450,
			dx: 0,
			dy: 0,
			width: 25,
			height: 25,
			color: "#7777FF",
			collisionType: "actor",
			gravity: true,
			camera: true,
			grabbable: true
		}
	],
	[
		{
			x: 800,
			y: 350,
			width: 1200,
			height: 100,
			color: "#777777",
			collisionType: "environment"
		},
		{
			x: 1200,
			y: 450,
			width: 50,
			height: 100,
			color: "#000000",
			collisionType: "actor",
			gravity: false,
			door: true,
			doorDestination: 0
		},
		{
			x: 400,
			y: 450,
			width: 50,
			height: 100,
			color: "#000000",
			collisionType: "actor",
			gravity: false,
			door: true,
			doorDestination: 2
		},
		{
			x: 300,
			y: 550,
			dx: 0,
			dy: 0,
			width: 50,
			height: 50,
			color: "#FF7777",
			collisionType: "actor",
			gravity: true,
			player: true,
			wraps: true
		},
		{
			x: 900,
			y: 750,
			dx: 0,
			dy: 0,
			width: 25,
			height: 25,
			color: "#7777FF",
			collisionType: "actor",
			gravity: true,
			camera: true,
			grabbable: true
		}
	]
];