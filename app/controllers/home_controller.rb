class HomeController < ApplicationController
  def show
    render component: 'Home', props: { current_user: @current_user,
                                       courses: @current_courses }
  end

  def add
    render component: 'Select', props: { courses: @current_courses }
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

  def sync_class
    cal = Google::Calendar.new(:client_id => ENV["google_app_id"],
                         :client_secret => ENV["google_app_secret"],
                         :calendar      => @current_user.email,
                         :redirect_url  => request.url + "auth/google_oauth2/callback",
                         :refresh_token => @current_user.oauth_token
                         )
    title_string = params[:code].to_s + ': ' + params[:title]
    start_time = params[:time].split('-')[0] + ":00 -0800"
    end_time = params[:time].split('-')[1] + ":00 -0800"

    event = cal.create_event do |e|
      e.title = title_string
      e.start_time = start_time
      e.end_time = end_time
      e.location = 'UC Berkeley'
      e.recurrence = {
            freq: 'weekly',
            until: Time.new(2017, 4, 28, 23, 59, 59, "-08:00"),
            byday: params[:day]}
    end

    course = Course.find_by_code(params[:code])
    course.synced = true
    course.event_id = event.id
    course.save!

    render json: @current_courses
  end

  def unsync_class
    cal = Google::Calendar.new(:client_id => ENV["google_app_id"],
                         :client_secret => ENV["google_app_secret"],
                         :calendar      => @current_user.email,
                         :redirect_url  => request.url + "auth/google_oauth2/callback",
                         :refresh_token => @current_user.oauth_token
                         )

    course = Course.find_by_code(params[:code])
    event_arr = cal.find_event_by_id(course.event_id)
    if event_arr.size == 1
      event = event_arr[0]
      cal.delete_event(event)
    end
    course.synced = false
    course.event_id = nil
    course.save!

    render json: @current_courses
  end
end
