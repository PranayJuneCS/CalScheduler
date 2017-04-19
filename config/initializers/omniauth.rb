OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2, ENV["google_app_id"], ENV["google_app_secret"], 
    { scope: 'userinfo.email, userinfo.profile, calendar',
      client_options: {ssl: {ca_file: Rails.root.join("cacert.pem").to_s}},
      skip_jwt: true,
      prompt: 'select_account'
    }
end