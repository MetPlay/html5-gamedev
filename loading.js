
reengine.load(function($) {
	engine.config = {
        	debug : true,
                assets : {
                	/* <drvo> */
                                drvo1 : {
                                        path : "assets/drvo.png",
                                        type : $.asset_types.IMAGE
                                },
                                drvo_idle : {
                                        frames : [ "drvo1" ],
                                        type : $.asset_types.ANIMATION,
                                        repeat : engine.constants.repeat_types.LOOP
                                },
                                drvo : {
                                        paths : {
                                                idle : "drvo_idle"
                                        },
                                        type : $.asset_types.SPRITE
                                },
                        /* </drvo> */
                        /* <damir> */
                                // slike i prva animacija
                                damir1 : { path : "assets/damir1.png", type : $.asset_types.IMAGE },
                                damir2 : { path : "assets/damir2.png", type : $.asset_types.IMAGE },  
                                damir3 : { path : "assets/damir3.png", type : $.asset_types.IMAGE },  
                                damir4 : { path : "assets/damir4.png", type : $.asset_types.IMAGE },  
                                damir_idle : {
                                        frames : [ "damir1", "damir2", "damir3", "damir4" ],
                                        type : $.asset_types.ANIMATION,
                                        repeat : engine.constants.repeat_types.LOOP,
                                },

                                // slike i druga animacija
                                damir11 : { path : "assets/damir11.png", type : $.asset_types.IMAGE },
                                damir22 : { path : "assets/damir22.png", type : $.asset_types.IMAGE },
                                damir33 : { path : "assets/damir33.png", type : $.asset_types.IMAGE },
                                damir44 : { path : "assets/damir44.png", type : $.asset_types.IMAGE },
                                damir_attack : { 
                                        frames : [ "damir11", "damir22", "damir33", "damir44" ],
                                        type : $.asset_types.ANIMATION,
                                        repeat : engine.constants.repeat_types.STOP_AT_END,
                                        speed: 0.1
                                },

                                // sprite
                                damir : {
                                        paths : {
                                                idle : "damir_idle",
                                                attack : "damir_attack"
                                        },
                                        type : $.asset_types.SPRITE
                                }
                        /* </damir> */
                } 
	};
});
