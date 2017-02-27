class RemoveUniqueIndexOnCoursesCcn < ActiveRecord::Migration[5.0]
  def change
    remove_index :courses, name: 'index_courses_on_ccn'
  end
end
