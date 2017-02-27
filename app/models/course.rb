require 'date'

class Course < ApplicationRecord
  belongs_to :user

  def sync_with_google(cal)
    title_string = self.parse_title
    start_time, end_time = self.time_range
    byday = self.parse_day

    event = cal.create_event do |e|
      e.title = title_string
      e.start_time = start_time
      e.end_time = end_time
      e.location = self.location
      e.recurrence = {
            freq: 'weekly',
            until: Time.new(2017, 4, 28, 23, 59, 59, "-08:00"),
            byday: byday}
    end

    self.synced = true
    self.event_id = event.id
    self.save!
  end

  def date_of_next(day)
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
    date  = Date.parse(real_day)
    delta = date >= Date.today ? 0 : 7
    date + delta
  end

  def parse_title
    self.dept + ' ' + self.code + ' ' + self.component
  end

  def time_range
    next_date = self.day.scan(/../).map { |day| date_of_next(day) }.min
    my_start_time = self.start_time.split(':')
    my_end_time = self.end_time.split(':')
    start_range = Time.new(next_date.year, next_date.month, next_date.day, my_start_time[0].to_i, my_start_time[1].to_i, 0, "-08:00")
    end_range = Time.new(next_date.year, next_date.month, next_date.day, my_end_time[0].to_i, my_end_time[1].to_i, 0, "-08:00")
    [start_range, end_range]
  end

  def parse_day
    day_arr = self.day.scan(/../).map { |day| day.downcase }
    day_arr.join(',')
  end

  def current_ccns
  end

end
