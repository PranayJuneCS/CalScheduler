class HomeController < ApplicationController
  def show
    render component: 'Home', props: { current_user: @current_user }
  end
end
