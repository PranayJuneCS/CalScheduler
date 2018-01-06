# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

require 'set'

a = "AEROSPC,Aerospace Studies,AFRICAM,African American Studies,AHMA,Anc Hist & Medit Archae,AMERSTD,American Studies,ANTHRO,Anthropology,ARABIC,Arabic,ARCH,Architecture,ARESEC,Ag & Resource Econ & Pol,ARMENI,Armenian,ART,Art Practice,ASAMST,Asian American Studies,ASIANST,Asian Studies,AST,Applied Science & Tech,ASTRON,Astronomy,BANGLA,Bengali,BIOENG,Bioengineering,BIOLOGY,Biology,BIOPHY,Biophysics,BOSCRSR,Bosnian/Croatian/Serbian,BUDDSTD,Buddhist Studies,BURMESE,Burmese,CATALAN,Catalan,CELTIC,Celtic Studies,CHEM,Chemistry,CHICANO,Chicano Studies,CHINESE,Chinese,CHMENG,Chemical Engineering,CIVENG,Civil & Environmental Eng,CLASSIC,Classics,CMPBIO,Computational Biology,COGSCI,Cognitive Science,COLWRIT,College Writing Programs,COMLIT,Comparative Literature,COMPBIO,Comparative Biochemistry,COMPSCI,Computer Science,CRITTH,Critical Theory,CUNEIF,Cuneiform,CYPLAN,City & Regional Planning,CZECH,Czech,DANISH,Danish,DATASCI,Data Science,DEMOG,Demography,DESINV,Design Innovation,DEVENG,Development Engineering,DEVP,Development Practice,DEVSTD,Development Studies,DUTCH,Dutch,EALANG,East Asian Languages,EAPITAL,Italian Education Abroad Program,ECON,Economics,EDUC,Education,EECS,Electrical Eng & Computer Sci,EGYPT,Egyptian,ELENG,Electrical Engineering,ENERES,Energy and Resources,ENGIN,Engineering,ENGLISH,English,ENVDES,Environmental Design,ENVECON,Environ Econ & Policy,EPS,Earth & Planetary Science,ESPM,Env Sci Policy & Mgmt,ETHSTD,Ethnic Studies,EUST,European Studies,EWMBA,Evening & Weekend MBA,FILIPN,Filipino,FILM,Film,FINNISH,Finnish,FOLKLOR,Folklore,FRENCH,French,GEOG,Geography,GERMAN,German,GLOBAL,Global Studies,GMS,Global Metro Studies,GPP,Global Poverty & Practice,GREEK,Greek,GSPDP,Grad Professional Dev Pgm,GWS,Gender & Womens Studies,HEBREW,Hebrew,HINURD,Hindi-Urdu,HISTART,History of Art,HISTORY,History,HMEDSCI,Health & Medical Sciences,HUNGARI,Hungarian,IAS,International & Area Stds,ICELAND,Icelandic,INDENG,Industrial Eng & Ops Rsch,INFO,Information,INTEGBI,Integrative Biology,ISF,Interdisciplinary Studies,ITALIAN,Italian Studies,JAPAN,Japanese,JEWISH,Jewish Studies,JOURN,Journalism,KHMER,Khmer,KOREAN,Korean,LANPRO,Language Proficiency Pgm,LATAMST,Latin American Studies,LATIN,Latin,LAW,Law,LDARCH,Landscape Arch & Env Plan,LEGALST,Legal Studies,LGBT,LGBT Studies,LINGUIS,Linguistics,LS,Letters & Science,MALAYI,Malay/Indonesian,MATH,Mathematics,MATSCI,Materials Science & Eng,MBA,Business Admin-MBA,MCELLBI,Molecular & Cell Biology,MECENG,Mechanical Engineering,MEDIAST,Media Studies,MEDST,Medieval Studies,MESTU,Middle Eastern Studies,MFE,Financial Engineering,MILAFF,Military Affairs,MILSCI,Military Science,MONGOLN,Mongolian,MUSIC,Music,NATAMST,Native American Studies,NATRES,Natural Resources,NAVSCI,Naval Science,NESTUD,Near Eastern Studies,NEUROSC,Neuroscience,NORWEGN,Norwegian,NSE,Nanoscale Science & Eng,NUCENG,Nuclear Engineering,NUSCTX,Nutritional Science & Tox,NWMEDIA,New Media,OPTOM,Optometry,PACS,Peace & Conflict Studies,PBHLTH,Public Health,PERSIAN,Persian,PHDBA,Business Admin-PhD,PHILOS,Philosophy,PHYSED,Physical Education,PHYSICS,Physics,PLANTBI,Plant & Microbial Biology,POLECON,Political Economy,POLISH,Polish,POLSCI,Political Science,PORTUG,Portuguese,PSEUDO,Pseudocourse,PSYCH,Psychology,PUBAFF,Public Affairs,PUBPOL,Public Policy,PUNJABI,Punjabi,RELIGST,Religious Studies,RHETOR,Rhetoric,RUSSIAN,Russian,SANSKR,Sanskrit,SASIAN,South Asian,SCANDIN,Scandinavian,SCMATHE,Science & Math Education,SEASIAN,Southeast Asian,SEMITIC,Semitics,SLAVIC,Slavic Languages & Lit,SOCIOL,Sociology,SOCWEL,Social Welfare,SPANISH,Spanish,SSEASN,South & SE Asian Studies,STAT,Statistics,STS,Science & Tech Studies,STUDIES,Advanced Doctoral Studies,SWEDISH,Swedish,TAMIL,Tamil,TELUGU,Telugu,THAI,Thai,THEATER,Theater Dance & Perf Stds,TIBETAN,Tibetan,TURKISH,Turkish,UGBA,Business Admin-Undergrad,UGIS,UGIS-UG Interdisc Studies,VIETNMS,Vietnamese,VISSCI,Vision Science,VISSTD,Visual Studies,XMBA,Executive MBA,YIDDISH,Yiddish"
short = nil
a.split(",").each_with_index do |val, index|
  if (index % 2).even?
    short = val
  else
    long = val
    Department.create(short: short, long: long)
  end
end

Department.all.each do |dept|
  course_set = Set.new
  (1..2).each do |page_num|
    uri = URI.parse("https://apis.berkeley.edu/sis/v1/classes/sections?term-id=2182&subject-area-code=#{dept.short}&include-secondary=false&page-number=#{page_num}&page-size=400")
    req = Net::HTTP::Get.new(uri)

    req["Accept"] = 'application/json'
    req["app_id"] = ENV['calnet_app_id']
    req["app_key"] = ENV['calnet_app_secret']

    response = Net::HTTP.start(uri.hostname, uri.port, :use_ssl => uri.scheme == 'https') {|http|
      http.request(req)
    }
    resp_body = JSON.parse(response.body)["apiResponse"]
    if resp_body["httpStatus"]["code"] == "200"
      class_sections = resp_body["response"]["classSections"]
      class_sections.each do |class_section|
        course_set.add(class_section["class"]["course"]["catalogNumber"]["formatted"])
      end
    end
  end
  puts dept.short
  puts course_set.size
  course_set.to_a.each do |course_code|
    code = Code.new(code: course_code, department_id: dept.id)
    code.save!
  end
  
end
