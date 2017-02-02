class HomeController < ApplicationController
  def show
    render component: 'Home', props: { current_user: @current_user,
                                       courses: @current_courses }
  end

  def add
    render component: 'Select', props: { current_user: @current_user }
  end
end
