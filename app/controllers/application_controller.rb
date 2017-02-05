class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :current_user

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
    unless @current_user.nil?
      cal = Google::Calendar.new(:client_id => ENV["google_app_id"],
                           :client_secret => ENV["google_app_secret"],
                           :calendar      => @current_user.email,
                           :redirect_url  => request.url + "auth/google_oauth2/callback",
                           :refresh_token => @current_user.oauth_token
                           )
      event = cal.create_event do |e|
        e.title = 'A Cool Event'
        e.start_time = Time.now
        e.end_time = Time.now + (60 * 60) # seconds * min
      end

      puts event
      @current_courses = @current_user.courses
    end
  end
end
