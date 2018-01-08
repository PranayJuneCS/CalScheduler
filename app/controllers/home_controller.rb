require 'net/http'

class HomeController < ApplicationController

  def show
    user = nil
    if !@current_user.nil?
      user = @current_user.client_friendly_version
    end
    render component: 'Home', props: { current_user: user,
                                       courses: @current_courses }
  end

  def ccn
    render component: 'CCN', props: { current_user: @current_user.client_friendly_version,
                                      ccns: @current_user.current_ccns }
  end

  def course
    render component: 'CourseID', props: { departments: @departments,
                                           current_user: @current_user.client_friendly_version,
                                           ccns: @current_user.current_ccns }
  end

  def specific_course
    dept = Department.where(short: params[:dept].upcase)
    if dept.any?
      code = dept[0].codes.where(code: params[:code].upcase)
      if code.any?
        all_codes = dept[0].codes.map { |code_obj| code_obj["code"] }
        render component: 'SpecificCourse', props: { dept: params[:dept].upcase,
                                                     code: params[:code].upcase,
                                                     all_codes: all_codes,
                                                     current_user: @current_user.client_friendly_version,
                                                     ccns: @current_user.current_ccns
                                                   } and return
      end
    end
    render json: {message: "Invalid Course!"}
  end

  def my_schedule
    render json: {courses: @current_user.courses}
  end

  def all_courses
    if not @current_user.validate_request(params[:token])
      render json: {code: "404", message: "Invalid Request."} and return
    end
    uri = URI.parse("https://apis.berkeley.edu/sis/v1/classes/sections?term-id=2182&subject-area-code=#{params[:dept]}&catalog-number=#{params[:code]}&include-secondary=true&status-code=A")
    req = Net::HTTP::Get.new(uri)

    req["Accept"] = 'application/json'
    req["app_id"] = ENV['calnet_app_id']
    req["app_key"] = ENV['calnet_app_secret']

    response = Net::HTTP.start(uri.hostname, uri.port, :use_ssl => uri.scheme == 'https') {|http|
      http.request(req)
    }
    resp_body = JSON.parse(response.body)["apiResponse"]
    if resp_body["httpStatus"]["code"] != "200"
      render json: {code: "404", message: resp_body["httpStatus"]["description"]}
    else
      sections = resp_body["response"]["classSections"]
      lecs = []
      discs = []
      labs = []
      sems = []
      recs = []
      others = []
      sections.each do |section|
        case section["component"]["code"]
        when "LEC"
          lecs << section
        when "DIS"
          discs << section
        when "LAB"
          labs << section
        when "SEM"
          sems << section
        when "REC"
          recs << section
        else
          others << section
        end
      end
      render json: {code: "200",
                    sections: {
                      LEC: lecs,
                      DIS: discs,
                      LAB: labs,
                      SEM: sems,
                      REC: recs,
                      OTHER: others
                    },
                    title: sections[0]["class"]["course"]["title"]
                   }
    end
  end

  def codes_from_dept
    if not @current_user.validate_request(params[:token])
      render json: {code: "404", message: "Invalid Request."} and return
    end
    department = Department.where(short: params[:short])
    unless (department.any? or department.length == 1)
      render json: {code: "404", message: "Invalid Department."}
    else
      code_arr = department[0].codes.map { |code_obj| code_obj["code"] }
      render json: {code: "200", codes: code_arr}
    end
  end

  def ccn_search
    if not @current_user.validate_request(params[:token])
      render json: {code: "404", message: "Invalid Request."} and return
    end
    uri = URI.parse("https://apis.berkeley.edu/sis/v1/classes/sections/#{params[:ccn]}?term-id=2182")
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
      course_primary = helpers.parse_primary(section)
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
                      title: course_title,
                      primary: course_primary
                    }
                   }
    else
      render json: {code: "400", message: "An Error Occurred with the Search. Try Again."}
    end
  end

  def add_class
    if not @current_user.validate_request(params[:token])
      render json: {code: "404", message: "Invalid Request."} and return
    end

    final_exam_status = false
    if params[:primary] == "true"
      uri = URI.parse("https://apis.berkeley.edu/sis/v1/classes?term-id=2182&subject-area-code=#{params[:dept]}&catalog-number=#{params[:code]}")
      req = Net::HTTP::Get.new(uri)

      req["Accept"] = 'application/json'
      req["app_id"] = ENV['calnet_app_id']
      req["app_key"] = ENV['calnet_app_secret']

      response = Net::HTTP.start(uri.hostname, uri.port, :use_ssl => uri.scheme == 'https') {|http|
        http.request(req)
      }
      resp_body = JSON.parse(response.body)["apiResponse"]
      if resp_body["httpStatus"]["code"] != "200"
        head 500 and return
      end
      section = resp_body["response"]["classes"][0]
      final_exam_status = helpers.parse_final_exam(section)
    end
    new_course = Course.new(title: params[:title],
                            day: params[:day],
                            ccn: params[:ccn],
                            component: params[:component],
                            start_time: params[:start_time],
                            end_time: params[:end_time],
                            location: params[:location],
                            instructor: params[:instructor],
                            dept: params[:dept],
                            code: params[:code],
                            number: params[:number],
                            primary: params[:primary] == "true",
                            has_final_exam: final_exam_status,
                            user_id: @current_user.id)
    if final_exam_status
      new_course.final_exam_string = new_course.get_final_exam_string
    end
    unless new_course.nil?
      new_course.save!
      @current_courses = @current_user.courses
      head :ok
    else
      head 500
    end
  end

  def sync_classes
    if not @current_user.validate_request(params[:token])
      render json: {code: "404", message: "Invalid Request."} and return
    end
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
    if not @current_user.validate_request(params[:token])
      render json: {code: "404", message: "Invalid Request."} and return
    end
    cal = Google::Calendar.new(:client_id => ENV["google_app_id"],
                         :client_secret => ENV["google_app_secret"],
                         :calendar      => @current_user.email,
                         :redirect_url  => request.url + "auth/google_oauth2/callback",
                         :refresh_token => @current_user.oauth_token
                         )

    course = Course.find_by_ccn(params[:ccn])

    event_arr_1 = cal.find_event_by_id(course.event_id_1)
    if event_arr_1.present? and event_arr_1.size == 1
      event = event_arr_1[0]
      cal.delete_event(event)
    end

    event_arr_2 = cal.find_event_by_id(course.event_id_2)
    if event_arr_2.present? and event_arr_2.size == 1
      event = event_arr_2[0]
      cal.delete_event(event)
    end

    if course.has_final_exam
      final_event = cal.find_event_by_id(course.final_event_id)
      if final_event.present? and final_event.size == 1
        event = final_event[0]
        cal.delete_event(event)
      end
    end

    course.destroy

    render json: @current_courses
  end
end
