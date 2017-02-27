class AddIndexUniqueTrueToCcnCourses < ActiveRecord::Migration[5.0]
  def change
    add_index :courses, :ccn, :unique => true
  end
end
