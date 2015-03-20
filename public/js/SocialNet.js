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
