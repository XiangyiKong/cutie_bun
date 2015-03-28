define (['views/index', 'views/register', 'views/login', 'views/forgotpassword'],
      function(IndexView, RegisterView, LoginView, ForgotPasswordView) {
  var SocialRouter = backbone.Router.extend(
