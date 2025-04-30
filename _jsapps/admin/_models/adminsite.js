/**
 *	
 */
define([
],
function(
) {
	return Cargo.o.model.site.extend({
		
		fetch : function(options) {
			
			// NOTE: the force_admin_fetch happens on login and is set on login success
			
			if ( options && options.force_admin_fetch !== true && $("script[data-set='Site']").html() ) {
				this.set( $.parseJSON( $("script[data-set='Site']").html() ), options );

			} else {
				Backbone.Model.prototype.fetch.apply(this, arguments);    
			}
		},

		parse : function (response) {
			return response;
		},

		url	: function() {
			var c 	 = Cargo.API.Config; // shorthand
			var path = c.api_path + "/" + c.Version + "/adminsite/" + c.cargo_url;
			return path;
		}		
		
	});

});
