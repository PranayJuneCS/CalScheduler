# @departments.each do |dept|
#   course_set = Set.new
#   (1..2).each do |page_num|
#     uri = URI.parse("https://apis.berkeley.edu/sis/v1/classes/sections?term-id=2172&subject-area-code=#{dept.short}&include-secondary=false&page-number=#{page_num}&page-size=400")
#     req = Net::HTTP::Get.new(uri)

#     req["Accept"] = 'application/json'
#     req["app_id"] = ENV['calnet_app_id']
#     req["app_key"] = ENV['calnet_app_secret']

#     response = Net::HTTP.start(uri.hostname, uri.port, :use_ssl => uri.scheme == 'https') {|http|
#       http.request(req)
#     }
#     resp_body = JSON.parse(response.body)["apiResponse"]
#     if resp_body["httpStatus"]["code"] == "200"
#       class_sections = resp_body["response"]["classSections"]
#       class_sections.each do |class_section|
#         course_set.add(class_section["class"]["course"]["catalogNumber"]["formatted"])
#       end
#     end
#   end
#   puts dept
#   puts course_set
#   course_set.to_a.each do |course_code|
#     code = Code.new(code: course_code, department_id: dept.id)
#     code.save!
#   end
  
# end