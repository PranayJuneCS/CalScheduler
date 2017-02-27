require 'net/http'

class HomeController < ApplicationController

  def show
    render component: 'Home', props: { current_user: @current_user,
                                       courses: @current_courses }
  end

  def add
    render component: 'Select', props: { courses: @current_courses }
  end

  def search
    render component: 'Search', props: { departments: @departments }
  end

  def choose
    render component: 'Choose'
  end

  def ccn
    render component: 'CCN'
  end

  def ccn_search
    uri = URI.parse("https://apis.berkeley.edu/uat/sis/v1/classes/sections/#{params[:ccn]}?term-id=2172")
    req = Net::HTTP::Get.new(uri)

    req["Accept"] = 'application/json'
    req["app_id"] = ENV['calnet_app_id']
    req["app_key"] = ENV['calnet_app_secret']

    response = Net::HTTP.start(uri.hostname, uri.port, :use_ssl => uri.scheme == 'https') {|http|
      http.request(req)
    }
    resp_body = JSON.parse(response.body)["apiResponse"]
    if resp_body["httpStatus"]["code"] == "404"
      render json: {code: "404", message: "No Class Corresponds with this CCN. Try Again."}
    elsif resp_body["httpStatus"]["code"] == "200"
      ccn = params[:ccn]
      section = resp_body["response"]["classSections"][0]
      number = helpers.parse_number(section)
      component = helpers.parse_component(section)
      meetsDays = helpers.parse_meetings(section)
      startTime, endTime = helpers.parse_timing(section)
      location = helpers.parse_location(section)
      instructor = helpers.parse_instructor(section)
      subject_area = helpers.parse_subject_area(section)
      catalog_number = helpers.parse_catalog_number(section)
      course_title = helpers.parse_course_title(section)
      render json: {code: "200",
                    course: {
                      ccn: ccn,
                      number: number,
                      component: component,
                      meetsDays: meetsDays,
                      startTime: startTime,
                      endTime: endTime,
                      location: location,
                      instructor: instructor,
                      subject_area: subject_area,
                      catalog_number: catalog_number,
                      title: course_title
                    }
                   }
    else
      render json: {code: "400", message: "An Error Occurred with the Search. Try Again."}
    end
  end

  def classes_from_dept
    uri = URI.parse("https://apis.berkeley.edu/sis/v1/classes/sections?term-id=2172&subject-area-code=#{params[:short]}&include-secondary=false&status-code=A&page-number=1&page-size=200&component-code=LEC")
    req = Net::HTTP::Get.new(uri)

    req["Accept"] = 'application/json'
    req["app_id"] = ENV['calnet_app_id']
    req["app_key"] = ENV['calnet_app_secret']

    response = Net::HTTP.start(uri.hostname, uri.port, :use_ssl => uri.scheme == 'https') {|http|
      http.request(req)
    }
    resp_body = JSON.parse(response.body)["apiResponse"]
    if resp_body["httpStatus"]["code"] == "404"
      uri = URI.parse("https://apis.berkeley.edu/sis/v1/classes/sections?term-id=2172&subject-area-code=#{params[:short]}&include-secondary=false&status-code=A&page-number=1&page-size=200")
      req = Net::HTTP::Get.new(uri)

      req["Accept"] = 'application/json'
      req["app_id"] = ENV['calnet_app_id']
      req["app_key"] = ENV['calnet_app_secret']

      response = Net::HTTP.start(uri.hostname, uri.port, :use_ssl => uri.scheme == 'https') {|http|
        http.request(req)
      }
      resp_body = JSON.parse(response.body)["apiResponse"]      
    end
    lectureSections = resp_body["response"]["classSections"]
    render json: {classes: lectureSections}
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

  def sync_classes
    cal = Google::Calendar.new(:client_id => ENV["google_app_id"],
                         :client_secret => ENV["google_app_secret"],
                         :calendar      => @current_user.email,
                         :redirect_url  => request.url + "auth/google_oauth2/callback",
                         :refresh_token => @current_user.oauth_token
                         )

    unsynced_classes = @current_user.courses.where(synced: false)
    unsynced_classes.each do |course|
      course.sync_with_google(cal)
    end

    render json: @current_courses
  end

  def delete_class
    cal = Google::Calendar.new(:client_id => ENV["google_app_id"],
                         :client_secret => ENV["google_app_secret"],
                         :calendar      => @current_user.email,
                         :redirect_url  => request.url + "auth/google_oauth2/callback",
                         :refresh_token => @current_user.oauth_token
                         )

    course = Course.find_by_code(params[:code])
    event_arr = cal.find_event_by_id(course.event_id)
    if event_arr.present? and event_arr.size == 1
      event = event_arr[0]
      cal.delete_event(event)
    end
    course.destroy

    render json: @current_courses
  end
end
