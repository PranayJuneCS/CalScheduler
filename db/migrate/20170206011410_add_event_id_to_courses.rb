class AddEventIdToCourses < ActiveRecord::Migration[5.0]
  def change
    add_column :courses, :event_id, :string
  end
end
