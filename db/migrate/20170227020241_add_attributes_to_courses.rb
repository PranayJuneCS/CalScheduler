class AddAttributesToCourses < ActiveRecord::Migration[5.0]
  def change
    add_column :courses, :ccn, :string
    add_column :courses, :component, :string
    add_column :courses, :start_time, :string
    add_column :courses, :end_time, :string
    add_column :courses, :location, :string
    add_column :courses, :instructor, :string
    add_column :courses, :dept, :string
    add_column :courses, :code, :string
  end
end
