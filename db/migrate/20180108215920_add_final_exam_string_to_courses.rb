class AddFinalExamStringToCourses < ActiveRecord::Migration[5.0]
  def change
    add_column :courses, :final_exam_string, :string
  end
end
