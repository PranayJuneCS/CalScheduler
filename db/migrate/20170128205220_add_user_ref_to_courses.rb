class AddUserRefToCourses < ActiveRecord::Migration[5.0]
  def change
    add_reference :courses, :user, foreign_key: true
  end
end
