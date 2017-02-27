module HomeHelper
  
  def parse_number(section)
    section["number"]
  end

  def parse_component(section)
    section["component"]["code"]
  end

  def parse_meetings(section)
    meetings = section["meetings"]
    if meetings.nil?
      return "TBD"
    end
    meetings = meetings[0]
    meetings["meetsDays"]
  end

  def parse_timing(section)
    meetings = section["meetings"]
    if meetings.nil?
      return "TBD"
    end
    meetings = meetings[0]
    [meetings["startTime"], meetings["endTime"]]
  end

  def parse_location(section)
    meetings = section["meetings"]
    if meetings.nil?
      return "TBD"
    end
    meetings = meetings[0]
    location = meetings["location"]
    if location.nil?
      return "TBD"
    end
    location["description"]
  end

  def parse_instructor(section)
    meetings = section["meetings"]
    if meetings.nil?
      return "TBD"
    end
    meetings = meetings[0]
    instructors = meetings["assignedInstructors"]
    if instructors.nil?
      return "TBD"
    end
    instructor = instructors[0]["instructor"]
    if instructor.nil?
      return "TBD"
    end
    names = instructor["names"]
    if names.nil?
      return "TBD"
    end
    names[0]["formattedName"]
  end

  def parse_subject_area(section)
    section["class"]["course"]["subjectArea"]["code"]
  end

  def parse_catalog_number(section)
    section["class"]["course"]["catalogNumber"]["formatted"]
  end

  def parse_course_title(section)
    section["class"]["course"]["title"]
  end
end
