require 'set'

class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :current_user

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
    unless @current_user.nil?
      @current_courses = @current_user.courses
      @departments = Department.all
    end
    
  end
end
