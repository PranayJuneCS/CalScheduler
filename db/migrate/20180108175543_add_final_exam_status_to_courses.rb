class AddFinalExamStatusToCourses < ActiveRecord::Migration[5.0]
  def change
    add_column :courses, :has_final_exam, :boolean, :default => false
  end
end
