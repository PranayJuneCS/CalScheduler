require 'date'

class Course < ApplicationRecord
  SPECIAL_FINALS = {
    'ECON': ['1', '100B'],
    'CHEM': ['1A', '1B', '3A', '3B', '4A', '4B'],
    'ENGLISH': ['1A', '1B', 'R1A', 'R1B']
  }.freeze

  LANGUAGES = {
    'ARABIC': ['1B', '20B', '100B'],
    'ARMENI': ['1B', '101B'],
    'BANGLA': ['1B'],
    'BOSCRSR': ['27B', '117B'],
    'BURMESE': ['1B'],
    'CHINESE': ['1X', '10X', '1B', '100XB', '10A', '1A', '10B', '100B'],
    'CUNEIF': ['100B', '102B', '200B'],
    'CZECH': ['26B', '116B'],
    'DANISH': ['1B'],
    'DUTCH': ['1', '2'],
    'EGYPT': ['100B'],
    'FILIPN': ['100B', '101B', '1B'],
    'FINNISH': ['1B'],
    'FRENCH': ['14', '1', '2', '3', '4'],
    'GERMAN': ['102A', '101', '1', '2', '3', '4'],
    'GREEK': ['2'],
    'HEBREW': ['1B', '100B', '106B', '20B'],
    'HINURD': ['2B', '1B', '103B', '100B'],
    'HUNGARI': ['1B'],
    'ITALIAN': ['4', '3', '2', '1'],
    'JAPAN': ['100X', '1B', '7B', '1A', '100B', '10B'],
    'KHMER': ['100B', '1B', '101B'],
    'KOREAN': ['100BX', '100B', '1B', '1A', '1BX', '10BX', '10B'],
    'LATIN': ['1', '2'],
    'MALAYI': ['100B', '1B'],
    'NORWEGN': ['1B'],
    'PERSIAN': ['20B', '1B', '100B'],
    'POLISH': ['25B', '115B'],
    'PUNJABI': ['1B', '100B'],
    'RUSSIAN': ['1', '2', '3', '4', '6A'],
    'SANSKR': ['101A', '100B'],
    'SPANISH': ['21', '3', '4', '22', '1', '2'],
    'SWEDISH': ['1B'],
    'TAMIL': ['1B', '101B'],
    'TELEGU': ['1B'],
    'THAI': ['100B', '1B'],
    'TIBETAN': ['1B'],
    'TURKISH': ['1B', '100B'],
    'VIETNMS': ['100B', '101B', '1B']
  }.freeze

  SPECIAL_FINAL_TIMES = {
    'ECON': [7, 3],
    'CHEM': [9, 1],
    'online': [10, 2],
    'lang': [10, 2],
    'ENGLISH': [11, 3],
    'weekend': [10, 4]
  }.freeze

  FINAL_TIMES_DICT = {
    'MoWeFr': {
      '08:00': [7, 1],
      '09:00': [7, 4],
      '09:30': [7, 4],
      '13:00': [8, 1],
      '14:00': [8, 2],
      '10:00': [8, 3],
      '11:00': [8, 4],
      '12:00': [9, 3],
      '12:30': [9, 3],
      '15:00': [9, 4],
      '15:30': [9, 4],
      '16:00': [11, 1],
      '16:30': [11, 1],
      '17:00': [11, 3]
    },
    'TuTh': {
      '14:00': [7, 2],
      '09:00': [9, 2],
      '09:30': [9, 2],
      '11:00': [10, 1],
      '12:00': [10, 3],
      '12:30': [10, 3],
      '13:00': [10, 3],
      '08:00': [10, 4],
      '17:00': [11, 2],
      '10:00': [11, 3],
      '15:00': [11, 4],
      '15:30': [11, 4],
      '16:00': [11, 4]
    }
  }.freeze

  FINAL_DAY_ABBREV = {
    'Mo': 'MoWeFr',
    'We': 'MoWeFr',
    'Fr': 'MoWeFr',
    'MoWe': 'MoWeFr',
    'MoFr': 'MoWeFr',
    'WeFr': 'MoWeFr',
    'MoTh': 'MoWeFr',
    'WeTh': 'MoWeFr',
    'MoWeFr': 'MoWeFr',
    'TuWeFr': 'MoWeFr',
    'TuWeTh': 'MoWeFr',
    'MoTuWeTh': 'MoWeFr',
    'MoWeThFr': 'MoWeFr',
    'MoTuThFr': 'MoWeFr',
    'MoTuWeThFr': 'MoWeFr',
    'MoTuWeThFrSa': 'MoWeFr',
    'Tu': 'TuTh',
    'Th': 'TuTh',
    'TuTh': 'TuTh',
    'TuThSa': 'TuTh'
  }.freeze

  belongs_to :user

  def get_final_exam_string
    final_time_info = get_final_time
    day = case final_time_info[0]
    when 7
      'Mon 5/7, '
    when 8
      'Tue 5/8, '
    when 9
      'Wed 5/9, '
    when 10
      'Thu 5/10, '
    when 11
      'Fri 5/11, '
    else
      puts 'oi, '
    end
    time = case final_time_info[1]
    when 1
      '8am-11am'
    when 2
      '11:30am-2:30pm'
    when 3
      '3-6pm'
    when 4
      '7-10pm'
    else
      puts 'oi'
    end
    'Final Exam: ' + day + time
  end

  def sync_with_google(cal)
    title_string = self.parse_title
    start_time, end_time = self.time_range(false)
    byday = self.parse_day

    if self.has_final_exam
      final_time_info = get_final_time
      final_day = final_time_info[0]
      start = case final_time_info[1]
      when 1
        [8, 0]
      when 2
        [11, 30]
      when 3
        [15, 0]
      when 4
        [19, 0]
      else
        puts 'oi'
      end
      final_start_time = Time.new(2018, 5, final_day, start[0], start[1], 0)

      final_exam_event = cal.create_event do |e|
        e.title = title_string + ' Final'
        e.start_time = final_start_time
        e.end_time = final_start_time + 3.hours
        e.location = 'TBD'
      end

      self.final_event_id = final_exam_event.id
    end

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

    self.event_id_1 = event_1.id
    self.event_id_2 = event_2.id
    self.synced = true
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
    semester_start_day = dst ? Date.new(2018, 3, 10) : Date.new(2018, 1, 15)
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

  def get_final_time
    time = self.start_time[0..4]
    final_time = nil
    if Course::SPECIAL_FINALS.key? self.dept.intern
      if Course::SPECIAL_FINALS[self.dept.intern].include? self.code
        final_time = Course::SPECIAL_FINAL_TIMES[self.dept.intern]
      end
    elsif Course::LANGUAGES.key? self.dept.intern
      if Course::LANGUAGES[self.dept.intern].include? self.code
        final_time = Course::SPECIAL_FINAL_TIMES[:lang]
      end
    elsif self.code[0] == 'W'
      final_time = Course::SPECIAL_FINAL_TIMES[:online]
    elsif self.day == 'Su' or self.day == 'Sa'
      final_time = Course::SPECIAL_FINAL_TIMES[:weekend]
    end
    if final_time.nil?
      index_day = Course::FINAL_DAY_ABBREV[self.day.intern]
      final_times = Course::FINAL_TIMES_DICT[index_day.intern]
      if final_times.key? time.intern
        final_time = final_times[time.intern]
      else
        hour = time[0..1].to_i
        if hour >= 17
          final_time = final_times['17:00'.intern]
        else
          puts 'Non Valid Final Time'
          puts dept
          puts code
          puts time
          puts day
        end
      end
    end

    final_time
  end

end
