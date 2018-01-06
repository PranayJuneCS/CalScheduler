class AddTwoEventIDsToCourses < ActiveRecord::Migration[5.0]
  def change
    add_column :courses, :event_id_2, :string
    rename_column :courses, :event_id, :event_id_1
  end
end
