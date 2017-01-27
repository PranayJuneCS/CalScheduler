class HomeController < ApplicationController
  def show
  	render component: 'Home'
  end
end
