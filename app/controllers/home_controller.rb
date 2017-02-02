class HomeController < ApplicationController
  def show
    render component: 'Home', props: { current_user: @current_user,
                                       courses: @current_courses }
  end

  def add
    render component: 'Select', props: { current_user: @current_user,
                                         courses: @current_courses }
  end

  def add_class
    new_course = Course.new(code: params[:code],
                            title: params[:title],
                            day: params[:day],
                            time: params[:time],
                            user_id: @current_user.id)
    unless new_course.nil?
      new_course.save!
      head :ok
    else
      head 500
    end
  end
end
