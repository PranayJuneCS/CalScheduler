class RemoveTimeFromCourses < ActiveRecord::Migration[5.0]
  def change
    remove_column :courses, :time
  end
end
