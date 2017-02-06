class Course < ApplicationRecord
  belongs_to :user

  def sync_with_google(cal)
    title_string = self.parse_title
    start_time = self.time_start
    end_time = self.time_end

    event = cal.create_event do |e|
      e.title = title_string
      e.start_time = start_time
      e.end_time = end_time
      e.location = 'UC Berkeley'
      e.recurrence = {
            freq: 'weekly',
            until: Time.new(2017, 4, 28, 23, 59, 59, "-08:00"),
            byday: self.day}
    end

    self.synced = true
    self.event_id = event.id
    self.save!
  end

  def parse_title
    self.code.to_s + ': ' + self.title
  end

  def time_start
    self.time.split('-')[0] + ":00 -0800"
  end

  def time_end
    self.time.split('-')[1] + ":00 -0800"
  end
end
