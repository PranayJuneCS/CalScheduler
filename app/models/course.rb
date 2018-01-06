require 'date'

class Course < ApplicationRecord
  belongs_to :user

  def sync_with_google(cal)
    title_string = self.parse_title
    start_time, end_time = self.time_range(false)
    byday = self.parse_day

    event_1 = cal.create_event do |e|
      e.title = title_string
      e.start_time = start_time
      e.end_time = end_time
      e.location = self.location
      e.recurrence = {
            freq: 'weekly',
            until: Time.new(2018, 3, 9, 23, 59, 59),
            byday: byday}
    end

    second_start_time, second_end_time = self.time_range(true)

    event_2 = cal.create_event do |e|
      e.title = title_string
      e.start_time = second_start_time
      e.end_time = second_end_time
      e.location = self.location
      e.recurrence = {
            freq: 'weekly',
            until: Time.new(2018, 5, 4, 23, 59, 59),
            byday: byday}
    end

    self.synced = true
    self.event_id_1 = event_1.id
    self.event_id_2 = event_2.id
    self.save!
  end

  def date_of_next(day, dst)
    real_day = case day
    when 'Mo'
      'monday'
    when 'Tu'
      'tuesday'
    when 'We'
      'wednesday'
    when 'Th'
      'thursday'
    when 'Fr'
      'friday'
    else
      'monday'
    end
    semester_start_day = dst ? Date.new(2018, 3, 10) : Date.new(2018, 1, 16)
    Chronic.parse("next #{real_day}", now: semester_start_day)
  end

  def parse_title
    self.dept + ' ' + self.code + ' ' + self.component
  end

  def time_range(dst)
    next_date = self.day.scan(/../).map { |day| date_of_next(day, dst) }.min
    my_start_time = self.start_time.split(':')
    my_end_time = self.end_time.split(':')
    start_range = Time.new(next_date.year, next_date.month, next_date.day, my_start_time[0].to_i, my_start_time[1].to_i, 0)
    end_range = Time.new(next_date.year, next_date.month, next_date.day, my_end_time[0].to_i, my_end_time[1].to_i, 0)
    [start_range, end_range]
  end

  def parse_day
    day_arr = self.day.scan(/../).map { |day| day.downcase }
    day_arr.join(',')
  end

end
