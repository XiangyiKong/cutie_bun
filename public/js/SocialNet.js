// Define the paths to all of the dependencies
// Initialize and launch the user interface
define(['views/index'], function(indexView) {
  var initialize = function() {
    indexView.render();
  }
  return {
    initialize: initialize
  };
});

define(['router'], function(router)) {
  var initialize = function() {
    // Responsible for booting up the router, which will control what appears in the web browser
    checkLogin(runApplication);
  };
  
  var checkLogin = function(callback) {
    // AJAX request to the Express server
    // If the user is allowed to access the deeper content within the application
    $.ajax("/account/authenticated", {
      method: "GET",
      success: function() {
        return callback(true);
      },
      error: function(data) {
        return callback(false);
      }
    });
  }
};
